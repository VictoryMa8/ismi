import type { DashboardResponse, LessonResponse, PendingCompletion } from './types'

const databaseName = 'ismi-offline'
const databaseVersion = 2
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
    const request = operation(transaction.objectStore(storeName))

    request.onerror = () => reject(request.error)
    transaction.oncomplete = () => { database.close(); resolve(request.result) }
    transaction.onabort = () => { database.close(); reject(transaction.error) }
    transaction.onerror = () => reject(transaction.error)
  })
}

type CachedRecording = { url: string; blob: Blob }

export async function cacheLesson(lesson: LessonResponse): Promise<void> {
  const recordings: CachedRecording[] = []
  for (const url of new Set(lesson.steps.map(step => step.prompt.audioUrl).filter((url): url is string => Boolean(url)))) {
    if (!/^\/api\/recordings\/[a-f0-9]{64}\.wav$/.test(url)) throw new Error('Unsupported recording URL.')
    const existing = await useStore<CachedRecording | undefined>(recordingStore, 'readonly', store => store.get(url))
    if (existing) continue
    const response = await fetch(url)
    if (!response.ok) throw new Error('Recording download failed.')
    const blob = await response.blob()
    if (blob.size > 10 * 1024 * 1024) throw new Error('Recording exceeds the download limit.')
    const digest = await crypto.subtle.digest('SHA-256', await blob.arrayBuffer())
    const hash = Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('')
    if (url !== `/api/recordings/${hash}.wav`) throw new Error('Recording integrity check failed.')
    recordings.push({ url, blob: new Blob([blob], { type: 'audio/wav' }) })
  }

  // A package becomes available only after every recording is downloaded and verified.
  // Failed updates leave the previous complete lesson version intact.
  const database = await openDatabase()
  await new Promise<void>((resolve, reject) => {
    const transaction = database.transaction([lessonStore, recordingStore], 'readwrite')
    for (const recording of recordings) transaction.objectStore(recordingStore).put(recording)
    transaction.objectStore(lessonStore).put(lesson)
    transaction.oncomplete = () => { database.close(); resolve() }
    transaction.onabort = () => { database.close(); reject(transaction.error) }
    transaction.onerror = () => reject(transaction.error)
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

export function getCachedLesson(lessonId: string): Promise<LessonResponse | undefined> {
  return useStore(lessonStore, 'readonly', store => store.get(lessonId))
}

export function getCachedLessonCount(): Promise<number> {
  return useStore(lessonStore, 'readonly', store => store.count())
}

export function cacheDashboard(dashboard: DashboardResponse): Promise<IDBValidKey> {
  const snapshot: Snapshot<DashboardResponse> = { key: 'dashboard', value: dashboard }
  return useStore(snapshotStore, 'readwrite', store => store.put(snapshot))
}

export async function getCachedDashboard(): Promise<DashboardResponse | undefined> {
  const snapshot = await useStore<Snapshot<DashboardResponse> | undefined>(
    snapshotStore,
    'readonly',
    store => store.get('dashboard'),
  )
  return snapshot?.value
}

export function queueCompletion(completion: PendingCompletion): Promise<IDBValidKey> {
  return useStore(completionStore, 'readwrite', store => store.put(completion))
}

export function getPendingCompletions(): Promise<PendingCompletion[]> {
  return useStore(completionStore, 'readonly', store => store.getAll())
}

export function removePendingCompletion(completionId: string): Promise<undefined> {
  return useStore(completionStore, 'readwrite', store => store.delete(completionId))
}
