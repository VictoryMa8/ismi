import { onBeforeUnmount, watch } from 'vue'

// All package mutations share one cross-tab lock. Fetches have a deadline so a
// lost connection cannot indefinitely block a removal or another transfer.
export async function downloadLock<T>(action: () => Promise<T>, transferKey?: string): Promise<T> {
  if (!navigator.locks) throw new Error('This browser cannot safely manage downloads. Try a current browser.')
  if (transferKey) return navigator.locks.request(`ismi-transfer:${transferKey}`, async () => {
    downloadsChanged()
    try { return await navigator.locks.request('ismi-downloads-v1', action) }
    finally { setTimeout(downloadsChanged, 0) }
  })
  return navigator.locks.request('ismi-downloads-v1', action)
}
export async function activeTransfers() {
  if (!navigator.locks) return new Set<string>()
  const state = await navigator.locks.query()
  return new Set([...(state.held ?? []), ...(state.pending ?? [])].flatMap(lock => lock.name?.startsWith('ismi-transfer:') ? [lock.name.slice('ismi-transfer:'.length)] : []))
}
export const downloadFetch = (url: string) => fetch(url, { credentials: 'include', cache: 'no-store', signal: AbortSignal.timeout(30_000) })

export async function pinDownloads(): Promise<() => void> {
  if (!navigator.locks) return () => {}
  return new Promise(resolve => {
    void navigator.locks.request('ismi-content-in-use', { mode: 'shared' }, () => new Promise<void>(release => resolve(release)))
  })
}
export function useDownloadPin(active: () => boolean) {
  let release: (() => void) | undefined, generation = 0
  const stop = watch(active, async value => {
    const token = ++generation
    release?.(); release = undefined
    if (!value) return
    const unpin = await pinDownloads()
    if (token !== generation) unpin(); else release = unpin
  }, { immediate: true, flush: 'sync' })
  onBeforeUnmount(() => { ++generation; stop(); release?.() })
}
export async function safeRemoval<T>(action: () => Promise<T>): Promise<T> {
  return navigator.locks.request('ismi-content-in-use', { ifAvailable: true }, lock => {
    if (!lock) throw new Error('Close open lessons or alphabet practice in all tabs, then remove this download.')
    return action()
  })
}
export function downloadsChanged() {
  window.dispatchEvent(new Event('ismi-downloads-changed'))
  if (typeof BroadcastChannel !== 'undefined') {
    const channel = new BroadcastChannel('ismi-downloads-v1'); channel.postMessage('changed'); channel.close()
  }
}
