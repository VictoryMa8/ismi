import { alphabetAudio, canonical, type AlphabetCatalog, type AlphabetPack, type AlphabetEvidence } from './alphabet'
import { downloadKey, setDownloadMeta, getDeviceSnapshot, saveDeviceSnapshot, updateDeviceSnapshot } from './offline'
import { downloadFetch, downloadLock, downloadsChanged, safeRemoval } from './downloadSafety'
import type { CourseId } from './courses'

const dbName = 'ismi-alphabet-v1'
function open(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const r = indexedDB.open(dbName, 1)
    r.onupgradeneeded = () => { r.result.createObjectStore('packs', { keyPath: 'courseId' }); r.result.createObjectStore('audio', { keyPath: 'url' }) }
    r.onsuccess = () => { r.result.onversionchange = () => r.result.close(); resolve(r.result) }
    r.onerror = () => reject(r.error)
  })
}
async function read<T>(store: string, key: string): Promise<T | undefined> {
  const db = await open()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store); const r = tx.objectStore(store).get(key)
    tx.oncomplete = () => { db.close(); resolve(r.result as T | undefined) }; tx.onabort = () => { db.close(); reject(tx.error) }
  })
}
export async function getAlphabetPack(course: CourseId) {
  const pack = await read<AlphabetPack>('packs', course)
  if (!pack || (await getDeviceSnapshot<{ available?: boolean }>(downloadKey('alphabet', course)))?.available === false) return undefined
  const { recordings } = await alphabetDownloads()
  if (alphabetAudio(pack).some(url => !recordings.some(r => r.url === url))) return undefined
  if (!await alphabetFontsSaved(pack)) return undefined
  return pack
}
export async function alphabetFontsSaved(pack: AlphabetPack) {
  if (!pack.fonts.length) return true
  const cache = await caches.open('ismi-alphabet-fonts-v1')
  for (const font of pack.fonts) {
    const response = await cache.match(font.url)
    if (!response || await digest(await response.arrayBuffer()) !== font.hash) return false
  }
  return true
}
async function digest(bytes: ArrayBuffer) { return [...new Uint8Array(await crypto.subtle.digest('SHA-256', bytes))].map(b => b.toString(16).padStart(2, '0')).join('') }
export async function verifyAlphabetPack(p: AlphabetPack) {
  if (!p || p.version < 1 || !Array.isArray(p.entries) || !Array.isArray(p.scriptEntries) || p.entries.length === 0) throw new Error('Invalid alphabet manifest.')
  if (await digest(new TextEncoder().encode(canonical({ ...p, contentHash: '' })).buffer) !== p.contentHash) throw new Error('Alphabet integrity check failed.')
}
export async function downloadAlphabet(p: AlphabetPack) {
  return downloadLock(async () => {
    const key = downloadKey('alphabet', p.courseId)
    try {
      await writeAlphabet(p)
      await setDownloadMeta(key, { savedAt: new Date().toISOString(), checkedAt: new Date().toISOString(), available: true, liveVersion: String(p.version), removed: false, error: undefined, title: p.title, notice: p.publicationNotice?.title, requiredAudio: alphabetAudio(p).length }).catch(() => { /* Package is committed; metadata can be recovered on refresh. */ })
      downloadsChanged()
    } catch (error) {
      await setDownloadMeta(key, { error: error instanceof Error ? error.message : 'Download failed. Try again.' }).catch(() => {})
      downloadsChanged(); throw error
    }
  }, downloadKey('alphabet', p.courseId))
}
async function writeAlphabet(p: AlphabetPack) {
  await verifyAlphabetPack(p)
  const assets: { url: string; blob: Blob }[] = []
  for (const url of alphabetAudio(p)) {
    if (!/^\/api\/recordings\/[a-f0-9]{64}\.wav$/.test(url)) throw new Error('Invalid recording address.')
    const existing = await read<{ url: string; blob: Blob }>('audio', url)
    let blob = existing?.blob
    if (!blob) {
      const response = await downloadFetch(url)
      if (!response.ok) throw new Error('Recording download failed. Previous download retained.')
      blob = await response.blob()
    }
    if (blob.size > 10 * 1024 * 1024 || url !== `/api/recordings/${await digest(await blob.arrayBuffer())}.wav`) throw new Error('Recording integrity check failed. Previous download retained.')
    assets.push({ url, blob: new Blob([blob], { type: 'audio/wav' }) })
  }
  // Fonts are same-origin, precached by the app shell; explicitly verify their offline bytes too.
  const fontCache = await caches.open('ismi-alphabet-fonts-v1')
  for (const font of p.fonts) {
    if (font.url !== '/fonts/NotoSansKhmer.ttf') throw new Error('Unsupported font asset.')
    let response = await fontCache.match(font.url)
    if (!response) response = await downloadFetch(font.url)
    if (!response.ok || await digest(await response.clone().arrayBuffer()) !== font.hash) throw new Error('Font integrity check failed. Previous download retained.')
    await fontCache.put(font.url, response.clone())
  }
  if (navigator.onLine) {
    const response = await downloadFetch('/api/alphabet')
    if (!response.ok) throw new Error('Availability could not be checked. Previous download retained.')
    const catalog = await response.json() as AlphabetCatalog
    const live = catalog.courses.find(c => c.courseId === p.courseId)
    if (live?.packId !== p.id || live.contentHash !== p.contentHash || catalog.withdrawnIds.includes(p.id)) {
      await reconcileUnlocked(catalog)
      throw new Error('Publication changed during download. Refresh the alphabet.')
    }
  }
  const db = await open()
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(['packs', 'audio'], 'readwrite')
    tx.oncomplete = () => { db.close(); resolve() }; tx.onabort = () => { db.close(); reject(tx.error ?? new Error('Download could not be saved.')) }
    try { assets.forEach(a => tx.objectStore('audio').put(a)); tx.objectStore('packs').put(JSON.parse(JSON.stringify(p))) }
    catch (error) { tx.abort(); db.close(); reject(error) }
  })
}
export async function alphabetPlayback(url: string) { const a = await read<{ blob: Blob }>('audio', url); return a ? URL.createObjectURL(a.blob) : url }
export async function removeAlphabet(course: CourseId, manual = false) {
  return downloadLock(async () => {
    const remove = async () => {
      await setDownloadMeta(downloadKey('alphabet', course), manual ? { removed: true, error: undefined } : { available: false, checkedAt: new Date().toISOString(), error: undefined })
      await removeUnlocked(course)
    }
    if (manual) await safeRemoval(remove); else await remove()
    downloadsChanged()
  })
}
async function removeUnlocked(course: CourseId) {
  const db = await open()
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(['packs', 'audio'], 'readwrite'); const packs = tx.objectStore('packs'); packs.delete(course)
    // Garbage-collect only assets no longer referenced by any retained pack.
    const all = packs.getAll(); all.onsuccess = () => {
      const keep = new Set((all.result as AlphabetPack[]).flatMap(alphabetAudio)); const cursor = tx.objectStore('audio').openCursor()
      cursor.onsuccess = () => { const c = cursor.result; if (!c) return; if (!keep.has(c.key as string)) c.delete(); c.continue() }
    }
    tx.oncomplete = () => { db.close(); resolve() }; tx.onabort = () => { db.close(); reject(tx.error) }
  })
}
export async function alphabetDownloads(): Promise<{ packs: AlphabetPack[]; recordings: { url: string; blob: Blob }[] }> {
  const db = await open()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(['packs', 'audio'])
    const packs = tx.objectStore('packs').getAll(), audio = tx.objectStore('audio').getAll()
    tx.oncomplete = () => { db.close(); resolve({ packs: packs.result, recordings: audio.result }) }
    tx.onabort = () => { db.close(); reject(tx.error) }
  })
}
export async function reconcileAlphabet(catalog: AlphabetCatalog) {
  return downloadLock(async () => { await reconcileUnlocked(catalog); downloadsChanged() })
}
async function reconcileUnlocked(catalog: AlphabetCatalog) {
  // A successful complete catalog is authoritative. Missing/withdrawn packs lose offline access.
  const { packs } = await alphabetDownloads()
  for (const cached of packs) {
    const c = catalog.courses.find(course => course.courseId === cached.courseId)
    if (!c?.packId || cached.id !== c.packId || catalog.withdrawnIds.includes(cached.id)) {
      await setDownloadMeta(downloadKey('alphabet', cached.courseId), { available: false, checkedAt: new Date().toISOString(), error: undefined })
      await removeUnlocked(cached.courseId)
    }
  }
  await Promise.all(catalog.courses.map(c => setDownloadMeta(downloadKey('alphabet', c.courseId), { checkedAt: new Date().toISOString(), available: Boolean(c.packId && !catalog.withdrawnIds.includes(c.packId)), liveVersion: c.version === null ? undefined : String(c.version) })))
  await saveDeviceSnapshot('alphabet-catalog-v1', catalog)
}
export const cachedAlphabetCatalog = () => getDeviceSnapshot<AlphabetCatalog>('alphabet-catalog-v1')
export const alphabetHistory = (scope: string, course: CourseId) => getDeviceSnapshot<AlphabetEvidence[]>(`alphabet-evidence-v1:${scope}:${course}`)
export const saveAlphabetEvidence = (scope: string, item: AlphabetEvidence) => updateDeviceSnapshot<AlphabetEvidence[]>(`alphabet-evidence-v1:${scope}:${item.courseId}`, previous => [...(previous ?? []), item])
export const alphabetBrowseKey = (scope: string, course: CourseId) => `alphabet-browse-v1:${scope}:${course}`
