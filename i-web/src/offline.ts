import { downloadFetch, downloadLock, downloadsChanged, safeRemoval } from './downloadSafety'
import { readableLesson } from './courses'
import { nextReviewSchedule, type ReviewSchedule } from './reviewSchedule'
import { renameCharacterContent } from './characters'
import type { DashboardResponse, LessonResponse, PendingCompletion } from './types'

const databaseName = 'ismi-offline'
const databaseVersion = 3
const reviewStore = 'review-history'
const recordingStore = 'recordings'
const lessonStore = 'lessons'
const completionStore = 'pending-completions'
const snapshotStore = 'snapshots'

type Snapshot<T> = {
  key: string
  value: T
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(databaseName, databaseVersion)

    request.onupgradeneeded = event => {
      const database = request.result
      if (!database.objectStoreNames.contains(reviewStore)) {
        database.createObjectStore(reviewStore, { keyPath: 'key' })
      }
      if (!database.objectStoreNames.contains(recordingStore)) {
        database.createObjectStore(recordingStore, { keyPath: 'url' })
      }
      if (!database.objectStoreNames.contains(lessonStore)) {
        database.createObjectStore(lessonStore, { keyPath: 'id' })
      }
      if (event.oldVersion === 1) {
        // Version 1 stored audio URLs without their bytes; do not advertise these as complete packages.
        const cursor = request.transaction!.objectStore(lessonStore).openCursor()
        cursor.onsuccess = () => {
          const item = cursor.result
          if (!item) return
          if ((item.value as LessonResponse).steps.some(step => step.prompt.audioUrl)) item.delete()
          item.continue()
        }
      }
      if (!database.objectStoreNames.contains(completionStore)) {
        database.createObjectStore(completionStore, { keyPath: 'completionId' })
      }
      if (!database.objectStoreNames.contains(snapshotStore)) {
        database.createObjectStore(snapshotStore, { keyPath: 'key' })
      }
    }

    request.onsuccess = () => {
      request.result.onversionchange = () => request.result.close()
      resolve(request.result)
    }
    request.onerror = () => reject(request.error)
  })
}

async function useStore<T>(
  storeName: string,
  mode: IDBTransactionMode,
  operation: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  const database = await openDatabase()

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(storeName, mode)
    let request: IDBRequest<T>
    transaction.oncomplete = () => { database.close(); resolve(request.result) }
    transaction.onabort = () => { database.close(); reject(transaction.error ?? new Error('Storage operation could not finish.')) }
    transaction.onerror = () => reject(transaction.error)
    try { request = operation(transaction.objectStore(storeName)); request.onerror = () => reject(request.error) }
    catch (error) { transaction.abort(); database.close(); reject(error) }
  })
}

export type DownloadMeta = {
  savedAt?: string; checkedAt?: string; available?: boolean; liveVersion?: string
  error?: string; removed?: boolean; title?: string; notice?: string; requiredAudio?: number
}
export const downloadKey = (type: 'lesson' | 'alphabet', id: string) => `download-v1:${type}:${id}`
export const downloadMeta = (key: string) => getDeviceSnapshot<DownloadMeta>(key)
export const setDownloadMeta = (key: string, patch: Partial<DownloadMeta>) => updateDeviceSnapshot<DownloadMeta>(key, old => ({ ...old, ...patch }))
export function lessonAudio(lesson: LessonResponse): string[] {
  // Include introduction/teaching recordings as well as exercise prompts.
  const urls = new Set<string>()
  function visit(value: unknown) {
    if (!value || typeof value !== 'object') return
    for (const [key, child] of Object.entries(value)) {
      if (key === 'audioUrl' && typeof child === 'string' && child) urls.add(child)
      else visit(child)
    }
  }
  visit(lesson)
  return [...urls]
}
type CachedRecording = { url: string; blob: Blob }

export async function cacheLesson(lesson: LessonResponse, explicit = false): Promise<void> {
  return downloadLock(async () => {
    const key = downloadKey('lesson', lesson.id)
    const meta = await downloadMeta(key)
    if (!explicit && (meta?.removed || meta?.error)) return
    try { await writeLesson(lesson, key, meta); downloadsChanged() }
    catch (error) {
      await setDownloadMeta(key, { error: error instanceof Error ? error.message : 'Download failed. Try again.' }).catch(() => {})
      downloadsChanged(); throw error
    }
  }, downloadKey('lesson', lesson.id))
}
async function writeLesson(lesson: LessonResponse, key: string, meta?: DownloadMeta): Promise<void> {
  const recordings: CachedRecording[] = []
  for (const url of lessonAudio(lesson)) {
    if (!/^\/api\/recordings\/[a-f0-9]{64}\.wav$/.test(url)) throw new Error('Unsupported recording URL.')
    const existing = await useStore<CachedRecording | undefined>(recordingStore, 'readonly', store => store.get(url))
    const response = existing ? undefined : await downloadFetch(url)
    if (response && !response.ok) throw new Error('Recording download failed. Reconnect and retry.')
    const blob = existing?.blob ?? await response!.blob()
    if (blob.size > 10 * 1024 * 1024) throw new Error('Recording exceeds the download limit.')
    const digest = await crypto.subtle.digest('SHA-256', await blob.arrayBuffer())
    const hash = Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('')
    if (url !== `/api/recordings/${hash}.wav`) throw new Error('Recording integrity check failed.')
    recordings.push({ url, blob: new Blob([blob], { type: 'audio/wav' }) })
  }

  const published = await downloadFetch(`/api/lessons/${encodeURIComponent(lesson.id)}`)
  if ([403, 404, 410].includes(published.status)) {
    await setDownloadMeta(key, { available: false, checkedAt: new Date().toISOString() })
    await useStore(lessonStore, 'readwrite', store => store.delete(lesson.id))
    throw new Error('This lesson is no longer available.')
  }
  if (!published.ok) throw new Error('Availability could not be checked. Reconnect and retry.')
  if ((await published.json() as LessonResponse).version !== lesson.version) throw new Error('This lesson changed during download. Retry for the latest version.')

  // A package becomes available only after every recording is downloaded and verified.
  // Failed updates leave the previous complete lesson version intact.
  const database = await openDatabase()
  await new Promise<void>((resolve, reject) => {
    const transaction = database.transaction([lessonStore, recordingStore, snapshotStore], 'readwrite')
    transaction.oncomplete = () => { database.close(); resolve() }
    transaction.onabort = () => { database.close(); reject(transaction.error ?? new Error('Download could not be saved. Check browser storage and retry.')) }
    transaction.onerror = () => reject(transaction.error)
    try {
      const now = new Date().toISOString()
      transaction.objectStore(snapshotStore).put({ key, value: { ...meta, savedAt: now, checkedAt: now, available: true, liveVersion: lesson.version, removed: false, error: undefined } })
      for (const recording of recordings) transaction.objectStore(recordingStore).put(recording)
      transaction.objectStore(lessonStore).put(JSON.parse(JSON.stringify(lesson)))
    } catch (error) { transaction.abort(); database.close(); reject(error) }
  })
}

export async function recordingPlaybackUrl(url: string): Promise<string> {
  try {
    const cached = await useStore<CachedRecording | undefined>(recordingStore, 'readonly', store => store.get(url))
    if (cached) return URL.createObjectURL(cached.blob)
  } catch {
    // Online playback remains available when local storage is unavailable.
  }
  return url
}

export async function lessonDownloads(): Promise<{ lessons: LessonResponse[]; recordings: CachedRecording[] }> {
  const database = await openDatabase()
  return new Promise((resolve, reject) => {
    const tx = database.transaction([lessonStore, recordingStore])
    const lessons = tx.objectStore(lessonStore).getAll(), recordings = tx.objectStore(recordingStore).getAll()
    tx.oncomplete = () => { database.close(); resolve({ lessons: lessons.result, recordings: recordings.result }) }
    tx.onabort = () => { database.close(); reject(tx.error) }
  })
}
export async function getCachedLesson(lessonId: string): Promise<LessonResponse | undefined> {
  const { lessons, recordings } = await lessonDownloads()
  const lesson = lessons.find(item => item.id === lessonId)
  if (!lesson || (await downloadMeta(downloadKey('lesson', lessonId)))?.available === false) return undefined
  if (lessonAudio(lesson).some(url => !recordings.some(recording => recording.url === url))) return undefined
  return readableLesson(renameCharacterContent(lesson))
}
export async function removeCachedLesson(lessonId: string, manual = false): Promise<void> {
  return downloadLock(async () => {
    const remove = async () => {
      // Intent is durable before deletion; automatic caching cannot undo removal.
      await setDownloadMeta(downloadKey('lesson', lessonId), manual ? { removed: true, error: undefined } : { available: false, checkedAt: new Date().toISOString(), error: undefined })
      const database = await openDatabase()
      await new Promise<void>((resolve, reject) => {
        const tx = database.transaction([lessonStore, recordingStore], 'readwrite')
        const store = tx.objectStore(lessonStore); store.delete(lessonId)
        const all = store.getAll()
        all.onsuccess = () => {
          const keep = new Set((all.result as LessonResponse[]).flatMap(lessonAudio))
          const request = tx.objectStore(recordingStore).openCursor()
          request.onsuccess = () => { const cursor = request.result; if (!cursor) return; if (!keep.has(cursor.key as string)) cursor.delete(); cursor.continue() }
        }
        tx.oncomplete = () => { database.close(); resolve() }
        tx.onabort = () => { database.close(); reject(tx.error) }
      })
    }
    if (manual) await safeRemoval(remove); else await remove()
    downloadsChanged()
  })
}
export async function getCachedLessonCount(): Promise<number> {
  const { lessons, recordings } = await lessonDownloads()
  const metas = await Promise.all(lessons.map(lesson => downloadMeta(downloadKey('lesson', lesson.id))))
  return lessons.filter((lesson, i) => metas[i]?.available !== false && lessonAudio(lesson).every(url => recordings.some(recording => recording.url === url))).length
}

export function cacheDashboard(dashboard: DashboardResponse, scope = 'guest'): Promise<IDBValidKey> {
  const snapshot: Snapshot<DashboardResponse> = { key: `dashboard:${scope}`, value: JSON.parse(JSON.stringify(dashboard)) }
  return useStore(snapshotStore, 'readwrite', store => store.put(snapshot))
}

export async function getCachedDashboard(scope = 'guest'): Promise<DashboardResponse | undefined> {
  const snapshot = await useStore<Snapshot<DashboardResponse> | undefined>(
    snapshotStore,
    'readonly',
    store => store.get(`dashboard:${scope}`),
  )
  return snapshot?.value
}

export function queueCompletion(completion: PendingCompletion): Promise<IDBValidKey> {
  return useStore(completionStore, 'readwrite', store => store.put(completion))
}

export async function getPendingCompletions(scope = 'guest'): Promise<PendingCompletion[]> {
  return (await useStore<PendingCompletion[]>(completionStore, 'readonly', store => store.getAll()))
    .filter(completion => (completion.scope ?? 'guest') === scope)
}

export function removePendingCompletion(completionId: string): Promise<undefined> {
  return useStore(completionStore, 'readwrite', store => store.delete(completionId))
}

export function saveDeviceSnapshot<T>(key: string, value: T): Promise<IDBValidKey> {
  return useStore(snapshotStore, 'readwrite', store => store.put({ key, value: JSON.parse(JSON.stringify(value)) }))
}

export async function getDeviceSnapshot<T>(key: string): Promise<T | undefined> {
  return (await useStore<Snapshot<T> | undefined>(snapshotStore, 'readonly', store => store.get(key)))?.value
}

// Read/modify/write in one transaction so two tabs cannot overwrite one another's
// recall attempts or explicitly consented reports.
export async function updateDeviceSnapshot<T>(key: string, update: (value: T | undefined) => T): Promise<void> {
  const database = await openDatabase()
  await new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(snapshotStore, 'readwrite')
    const store = transaction.objectStore(snapshotStore)
    const request = store.get(key)
    request.onsuccess = () => {
      try { store.put({ key, value: JSON.parse(JSON.stringify(update(request.result?.value as T | undefined))) }) }
      catch { transaction.abort() }
    }
    transaction.oncomplete = () => { database.close(); resolve() }
    transaction.onabort = () => { database.close(); reject(transaction.error ?? new Error('Snapshot update failed.')) }
    transaction.onerror = () => { database.close(); reject(transaction.error) }
  })
}

export type ReviewHistory = {
  key: string
  scope: string
  lessonId: string
  version: string
  stepId: string
  practicedAt: string
  schedule?: ReviewSchedule
  needsReview: boolean
  answerId: string | null
  explanation: string
}

export async function getReviewHistory(scope: string): Promise<ReviewHistory[]> {
  return (await useStore<ReviewHistory[]>(reviewStore, 'readonly', store => store.getAll()))
    .filter(item => item.scope === scope).map(renameCharacterContent)
}

export async function saveReviewAttempt(
  scope: string, lesson: LessonResponse, stepId: string, answerId: string | null,
  isCorrect: boolean, explanation: string, firstAttempt: boolean, helped = false,
): Promise<void> {
  const key = JSON.stringify([scope, lesson.id, lesson.version, stepId])
  const database = await openDatabase()
  await new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(reviewStore, 'readwrite')
    const store = transaction.objectStore(reviewStore)
    const request = store.get(key)
    request.onsuccess = () => {
      const previous = request.result as ReviewHistory | undefined
      // A retry after seeing the model does not erase a mistake. A fresh first
      // answer can resolve it; this is practice history, not a mastery estimate.
      const now = Date.now()
      store.put({
        key, scope, lessonId: lesson.id, version: lesson.version, stepId,
        practicedAt: new Date(now).toISOString(),
        schedule: nextReviewSchedule(previous, isCorrect, firstAttempt, helped, now),
        needsReview: !isCorrect || (!firstAttempt && Boolean(previous?.needsReview)),
        answerId: isCorrect && !firstAttempt && previous?.needsReview ? previous.answerId : answerId,
        explanation: isCorrect && !firstAttempt && previous?.needsReview ? previous.explanation : explanation,
      } satisfies ReviewHistory)
    }
    transaction.oncomplete = () => { database.close(); resolve() }
    transaction.onabort = () => { database.close(); reject(transaction.error) }
    transaction.onerror = () => reject(transaction.error)
  })
}

// Preserve downloads from the previous unscoped dashboard format under its last
// recorded identity before auth refresh can switch the current account.
export async function migrateLegacyDashboard(): Promise<void> {
  const legacy = await useStore<Snapshot<DashboardResponse> | undefined>(snapshotStore, 'readonly', store => store.get('dashboard'))
  if (!legacy) return
  const previousScope = await getDeviceSnapshot<string>('review-scope')
  const scope = previousScope ?? (legacy.value.learner.displayName === 'Guest' ? 'guest' : undefined)
  if (!scope) return
  if (!await getCachedDashboard(scope)) await cacheDashboard(legacy.value, scope)
  await useStore(snapshotStore, 'readwrite', store => store.delete('dashboard'))
}
