import { reactive, ref } from 'vue'
import { getDeviceSnapshot, saveDeviceSnapshot } from './offline'

export type ReadingPreferences = { size: number; spacing: 'standard' | 'spacious'; help: 'shown' | 'tap' }
export const readingDefaults = (): ReadingPreferences => ({ size: 100, spacing: 'standard', help: 'shown' })
export function validReading(value: unknown): ReadingPreferences {
  const v = value as Partial<ReadingPreferences> | null
  return { size: [100, 125, 150, 200].includes(v?.size ?? 0) ? v!.size! : 100,
    spacing: v?.spacing === 'spacious' ? 'spacious' : 'standard', help: v?.help === 'tap' ? 'tap' : 'shown' }
}
const values = reactive<Record<string, ReadingPreferences>>({})
export const readingNotice = ref('')
export const readingReady = ref(false)
let identity = 'guest', generation = 0
let writes = Promise.resolve()
let channel: BroadcastChannel | undefined
const ids = ['levantine', 'msa', 'quranic', 'french', 'khmer']
const key = (scope: string, course: string) => `reading-comfort-v1:${scope}:${course}`
export function readingFor(course = 'levantine') { return values[course] ?? readingDefaults() }
export function readingStyle(course = 'levantine') {
  const preference = readingFor(course)
  return { zoom: preference.size / 100, ...(preference.spacing === 'spacious' ? { lineHeight: '2.2' } : {}) }
}
export async function loadReading(scope: string) {
  identity = scope
  const token = ++generation
  readingReady.value = false
  readingNotice.value = ''
  for (const id of ids) values[id] = readingDefaults()
  try {
    await writes
    const saved = await Promise.all(ids.map(id => getDeviceSnapshot<{ version: number; preferences: unknown }>(key(scope, id))))
    if (token !== generation) return
    ids.forEach((id, i) => { values[id] = saved[i]?.version === 1 ? validReading(saved[i]!.preferences) : readingDefaults() })
  } catch { if (token === generation) readingNotice.value = 'Device storage unavailable. Changes may not be saved.' }
  finally { if (token === generation) readingReady.value = true }
}
export function saveReading(course: string, next: ReadingPreferences) {
  if (!readingReady.value || !ids.includes(course)) return
  const preferences = validReading(next), scope = identity, token = generation
  values[course] = preferences
  readingNotice.value = 'Saving…'
  writes = writes.then(async () => {
    try {
      await saveDeviceSnapshot(key(scope, course), { version: 1, preferences })
      if (token === generation) readingNotice.value = 'Saved on this device.'
      channel?.postMessage({ scope, course })
    } catch { if (token === generation) readingNotice.value = 'Not saved. Your reading choices work until you leave; try again when device storage is available.' }
  })
}
export function listenReading() {
  if (typeof BroadcastChannel === 'undefined') return () => {}
  channel = new BroadcastChannel('ismi-reading-comfort-v1')
  channel.onmessage = async event => {
    const { scope, course } = event.data ?? {}
    if (scope !== identity || !ids.includes(course)) return
    const token = generation
    await writes
    try {
      const saved = await getDeviceSnapshot<{ version: number; preferences: unknown }>(key(scope, course))
      if (token === generation) values[course] = saved?.version === 1 ? validReading(saved.preferences) : readingDefaults()
    } catch { /* Keep usable in-memory preferences. */ }
  }
  return () => { channel?.close(); channel = undefined }
}
