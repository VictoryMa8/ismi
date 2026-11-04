import { ApiRequestError } from './api'
import { alphabetAudio, type AlphabetCatalog, type AlphabetPack } from './alphabet'
import { alphabetDownloads, alphabetFontsSaved, cachedAlphabetCatalog, downloadAlphabet, reconcileAlphabet, removeAlphabet, verifyAlphabetPack } from './alphabetOffline'
import { courses, type CourseId } from './courses'
import { activeTransfers, downloadFetch, downloadsChanged } from './downloadSafety'
import { cacheLesson, downloadKey, downloadMeta, getDeviceSnapshot, lessonAudio, lessonDownloads, removeCachedLesson, saveDeviceSnapshot, setDownloadMeta, type DownloadMeta } from './offline'
import type { DashboardResponse, LessonResponse } from './types'

type Listing = { id: string; course: CourseId; title: string; order: number; notice?: string }
export type DownloadRow = Listing & {
  key: string; type: 'lesson' | 'alphabet'; version?: string; complete: boolean
  textOnly: boolean; audioCount: number; meta: DownloadMeta; state: string
}
export type DownloadInventory = { rows: DownloadRow[]; bytes: number }
const listingKey = 'download-catalog-v1'
async function publicRequest<T>(url: string): Promise<T> {
  const response = await downloadFetch(url)
  if (!response.ok) throw new ApiRequestError(`Availability check failed (${response.status}). Reconnect and retry.`, response.status)
  return response.json() as Promise<T>
}
export async function refreshDownloadAvailability() {
  // These catalogs contain published content only. Never persist dashboard history
  // in the device-shared inventory or consult the private authoring endpoints.
  const results = await Promise.allSettled([
    (async () => {
      const dashboard = await publicRequest<DashboardResponse>('/api/dashboard')
      const listings: Listing[] = dashboard.dailyPlan.lessons.filter(l => courses.some(c => c.id === (l.trackId ?? 'levantine'))).map(l => ({
        id: l.id, course: (l.trackId ?? 'levantine') as CourseId, title: l.title, order: l.courseOrder, notice: l.publicationNotice?.label,
      }))
      const previous = await getDeviceSnapshot<Listing[]>(listingKey) ?? []
      const merged = new Map(previous.map(l => [l.id, l]))
      listings.forEach(l => merged.set(l.id, l))
      await saveDeviceSnapshot(listingKey, [...merged.values()])
      const now = new Date().toISOString()
      await Promise.all(listings.map(l => setDownloadMeta(downloadKey('lesson', l.id), { available: true, checkedAt: now })))
      const { lessons } = await lessonDownloads()
      // Check saved versions individually; a transient error never means withdrawn.
      let checkFailed = false
      for (let i = 0; i < lessons.length; i += 4) {
        const checks = await Promise.allSettled(lessons.slice(i, i + 4).map(async lesson => {
          const key = downloadKey('lesson', lesson.id)
          try {
            const live = await publicRequest<LessonResponse>(`/api/lessons/${encodeURIComponent(lesson.id)}`)
            await setDownloadMeta(key, { checkedAt: new Date().toISOString(), available: true, liveVersion: live.version })
          } catch (error) {
            if (error instanceof ApiRequestError && [403, 404, 410].includes(error.status)) await removeCachedLesson(lesson.id)
            else throw error
          }
        }))
        checkFailed ||= checks.some(result => result.status === 'rejected')
      }
      if (checkFailed) throw new Error('Some lesson availability checks failed.')
    })(),
    (async () => {
      const catalog = await publicRequest<AlphabetCatalog>('/api/alphabet')
      await reconcileAlphabet(catalog)
      const now = new Date().toISOString()
      await Promise.all(catalog.courses.map(async c => {
        if (!c.packId || catalog.withdrawnIds.includes(c.packId)) return
        const pack = await publicRequest<AlphabetPack>(`/api/alphabet/packs/${encodeURIComponent(c.packId)}`)
        await verifyAlphabetPack(pack)
        if (pack.courseId !== c.courseId || pack.id !== c.packId || pack.contentHash !== c.contentHash) throw new Error('Alphabet publication changed. Refresh availability.')
        await setDownloadMeta(downloadKey('alphabet', c.courseId), { available: true, checkedAt: now, liveVersion: String(pack.version), title: pack.title, notice: pack.publicationNotice?.title, requiredAudio: alphabetAudio(pack).length })
      }))
    })(),
  ])
  downloadsChanged()
  if (results.some(r => r.status === 'rejected')) throw new Error('Some availability checks could not finish. Saved versions are retained unless withdrawal is confirmed. Retry when connected.')
}
export async function downloadInventory(): Promise<DownloadInventory> {
  const [lessons, alphabet, listings, catalog] = await Promise.all([lessonDownloads(), alphabetDownloads(), getDeviceSnapshot<Listing[]>(listingKey), cachedAlphabetCatalog()])
  const transfers = await activeTransfers()
  const rows: DownloadRow[] = []
  let bytes = 0
  const recordings = new Map<string, number>()
  for (const asset of [...lessons.recordings, ...alphabet.recordings]) recordings.set(asset.url, asset.blob.size)
  // Count content JSON plus unique managed recordings. Shell/font/media caches
  // and browser bookkeeping are deliberately excluded from this estimate.
  const used = new Set<string>()
  const lessonListings = new Map((listings ?? []).map(l => [l.id, l]))
  for (const l of lessons.lessons) if (!lessonListings.has(l.id)) lessonListings.set(l.id, { id: l.id, course: l.trackId as CourseId, title: l.title, order: l.courseOrder, notice: l.publicationNotice?.label })
  async function add(listing: Listing, type: DownloadRow['type'], saved: LessonResponse | AlphabetPack | undefined, urls: string[], present: Set<string>) {
    const key = downloadKey(type, type === 'lesson' ? listing.id : listing.course)
    const meta = await downloadMeta(key) ?? {}
    if (type === 'alphabet') listing = { ...listing, title: meta.title ?? listing.title, notice: saved ? (saved as AlphabetPack).publicationNotice?.title : meta.notice }
    const complete = Boolean(saved && meta.available !== false && urls.every(url => present.has(url)) && (type !== 'alphabet' || await alphabetFontsSaved(saved as AlphabetPack)))
    const version = saved ? String(saved.version) : undefined
    const update = complete && meta.liveVersion !== undefined && meta.liveVersion !== version
    const state = transfers.has(key) ? 'Downloading' : meta.available === false ? 'Unavailable' : meta.error || (saved && !complete) ? 'Failed' : update ? 'Update available' : complete ? (urls.length ? 'Saved' : 'Saved · text only') : 'Not saved'
    rows.push({ ...listing, key, type, version, complete, textOnly: urls.length === 0, audioCount: urls.length, meta, state })
    if (saved) { bytes += new Blob([JSON.stringify(saved)]).size; urls.forEach(url => used.add(url)) }
  }
  for (const listing of lessonListings.values()) {
    const saved = lessons.lessons.find(l => l.id === listing.id)
    await add(listing, 'lesson', saved, saved ? lessonAudio(saved) : [], new Set(lessons.recordings.map(r => r.url)))
  }
  for (const course of courses) {
    const live = catalog?.courses.find(c => c.courseId === course.id), saved = alphabet.packs.find(p => p.courseId === course.id)
    if (!live?.packId && !saved) continue
    await add({ id: live?.packId ?? saved!.id, course: course.id, title: saved?.title ?? 'Alphabet', order: -1, notice: saved?.publicationNotice?.title }, 'alphabet', saved, saved ? alphabetAudio(saved) : [], new Set(alphabet.recordings.map(r => r.url)))
  }
  for (const url of used) bytes += recordings.get(url) ?? 0
  return { rows, bytes }
}
export async function transferDownload(row: DownloadRow) {
  try {
    if (row.type === 'lesson') {
      const lesson = await publicRequest<LessonResponse>(`/api/lessons/${encodeURIComponent(row.id)}`)
      if (lesson.id !== row.id || lesson.trackId !== row.course) throw new Error('The lesson response does not match this download. Refresh and retry.')
      await cacheLesson(lesson, true)
    } else {
      const catalog = await publicRequest<AlphabetCatalog>('/api/alphabet')
      await reconcileAlphabet(catalog)
      const live = catalog.courses.find(c => c.courseId === row.course)
      if (!live?.packId || catalog.withdrawnIds.includes(live.packId)) throw new ApiRequestError('This alphabet is no longer available.', 410)
      const pack = await publicRequest<AlphabetPack>(`/api/alphabet/packs/${encodeURIComponent(live.packId)}`)
      if (pack.courseId !== row.course || pack.id !== live.packId || pack.contentHash !== live.contentHash) throw new Error('The alphabet changed. Refresh and retry.')
      await downloadAlphabet(pack)
    }
  } catch (error) {
    if (error instanceof ApiRequestError && [403, 404, 410].includes(error.status)) {
      if (row.type === 'lesson') await removeCachedLesson(row.id); else await removeAlphabet(row.course)
    }
    await setDownloadMeta(row.key, { error: error instanceof Error ? error.message : 'Download failed. Reconnect and retry.' }).catch(() => {})
    downloadsChanged(); throw error
  }
}
export const removeDownload = (row: DownloadRow) => row.type === 'lesson' ? removeCachedLesson(row.id, true) : removeAlphabet(row.course, true)
export const downloadAction = (row: DownloadRow) => row.state === 'Failed' || row.meta.error ? 'Retry' : row.state === 'Update available' ? 'Update' : 'Download'
