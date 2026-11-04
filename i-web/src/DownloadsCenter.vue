<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { Download, RefreshCw, Trash2 } from '@lucide/vue'
import BackControl from './BackControl.vue'
import { courses } from './courses'
import { downloadAction, downloadInventory, refreshDownloadAvailability, removeDownload, transferDownload, type DownloadRow } from './downloads'
import { getPendingCompletions } from './offline'
import { loadStartedLesson } from './lessonSessions'

const props = defineProps<{ scope: string; retrySync: () => Promise<void> }>()
const rows = ref<DownloadRow[]>([]), bytes = ref<number | null>(null), pending = ref<number | null>(null)
const checking = ref(false), syncing = ref(false), loading = ref(true), status = ref(''), error = ref(''), online = ref(navigator.onLine)
const operations = ref(new Set<string>()), paused = ref(new Set<string>())
const storage = ref('Unavailable')
let revision = 0, channel: BroadcastChannel | undefined, mounted = true
const groups = computed(() => courses.map(course => ({ ...course, rows: rows.value.filter(row => row.course === course.id).sort((a, b) => a.order - b.order || a.title.localeCompare(b.title)) })))
function size(value: number) { return value < 1024 * 1024 ? `${(value / 1024).toFixed(1)} KB` : `${(value / 1024 / 1024).toFixed(1)} MB` }
function date(value?: string) { return value ? new Date(value).toLocaleString() : 'Unknown' }
async function load() {
  const token = ++revision, scope = props.scope
  try {
    const [inventory, completions, sessions] = await Promise.all([
      downloadInventory(), getPendingCompletions(scope), Promise.all(courses.map(c => loadStartedLesson(scope, c.id))),
    ])
    if (!mounted || token !== revision || scope !== props.scope) return
    rows.value = inventory.rows; bytes.value = inventory.bytes; pending.value = completions.length
    paused.value = new Set(sessions.flatMap(s => s ? [s.lessonId] : []))
    try {
      const estimate = await navigator.storage?.estimate?.()
      if (token !== revision || !mounted) return
      storage.value = estimate?.usage !== undefined && estimate.quota !== undefined ? `About ${size(estimate.usage)} of ${size(estimate.quota)} available to this site` : 'Unavailable'
    } catch { storage.value = 'Unavailable' }
  } catch {
    if (mounted && token === revision) { pending.value = null; error.value = 'Downloads could not be read. Check browser storage access and try Refresh availability.' }
  } finally { if (mounted && token === revision) loading.value = false }
}
async function refresh() {
  if (checking.value) return
  checking.value = true; error.value = ''; status.value = 'Checking availability…'
  try { await refreshDownloadAvailability(); if (mounted) status.value = 'Availability checked.' }
  catch (caught) { if (mounted) { error.value = caught instanceof Error ? caught.message : 'Could not check availability. Reconnect and retry.'; status.value = '' } }
  finally { if (mounted) { checking.value = false; await load() } }
}
async function act(row: DownloadRow, remove = false) {
  if (operations.value.has(row.key)) return
  operations.value = new Set([...operations.value, row.key]); error.value = ''
  status.value = `${row.title}: ${remove ? 'Removing…' : 'Downloading…'}`
  try {
    if (remove) await removeDownload(row); else await transferDownload(row)
    if (mounted) status.value = `${row.title}: ${remove ? 'download removed. Progress and saved positions are kept.' : 'saved for offline use.'}`
  } catch (caught) {
    if (mounted) { error.value = `${row.title}: ${caught instanceof Error ? caught.message : 'Could not finish. Try again.'}`; status.value = '' }
  } finally {
    if (mounted) {
      operations.value = new Set([...operations.value].filter(key => key !== row.key)); await load(); await nextTick()
      // Keep keyboard focus on this row when its action is replaced after success.
      const element = document.getElementById(`download-${row.key}`)
      if (element && (!document.activeElement || document.activeElement === document.body)) element.focus()
    }
  }
}
async function sync() {
  if (syncing.value) return
  const scope = props.scope; syncing.value = true; error.value = ''
  try {
    await props.retrySync()
    if (!mounted || scope !== props.scope) return
    const left = (await getPendingCompletions(scope)).length
    if (left) error.value = 'Some completions are still waiting. Reconnect and retry sync; queued work is kept.'
    else status.value = 'Completions synced.'
  } catch { if (mounted && scope === props.scope) error.value = 'Sync could not finish. Queued work is kept; reconnect and retry.' }
  finally { if (mounted && scope === props.scope) { syncing.value = false; await load() } }
}
function changed() { void load() }
function connection() { online.value = navigator.onLine; void load() }
watch(() => props.scope, () => { pending.value = null; paused.value = new Set(); syncing.value = false; status.value = ''; error.value = ''; void load() })
onMounted(async () => {
  window.addEventListener('ismi-downloads-changed', changed); window.addEventListener('focus', changed)
  window.addEventListener('online', connection); window.addEventListener('offline', connection)
  if (typeof BroadcastChannel !== 'undefined') { channel = new BroadcastChannel('ismi-downloads-v1'); channel.onmessage = changed }
  await load(); if (mounted && navigator.onLine) await refresh()
})
onBeforeUnmount(() => {
  mounted = false; ++revision; channel?.close()
  window.removeEventListener('ismi-downloads-changed', changed); window.removeEventListener('focus', changed)
  window.removeEventListener('online', connection); window.removeEventListener('offline', connection)
})
</script>

<template>
  <section class="downloads-center" aria-labelledby="downloads-heading">
    <BackControl href="#/account">Account</BackControl>
    <header class="downloads-header"><h1 id="downloads-heading">Downloads</h1><button class="secondary-action" type="button" :disabled="checking || !online" @click="refresh"><RefreshCw :size="18" aria-hidden="true" />{{ checking ? 'Checking…' : 'Refresh availability' }}</button></header>
    <p>Lessons and alphabets saved on this device are shared across accounts. Learning history stays separate.</p>
    <div class="downloads-summary"><p><strong>Managed downloads: {{ bytes === null ? 'Unavailable' : `about ${size(bytes)}` }}</strong></p><details><summary>Storage details</summary><p>Text and unique recordings; excludes app, font and media caches.</p><p>Browser storage estimate: {{ storage }}.<br />Your browser or device can remove saved content.</p></details></div>
    <p v-if="!online">Offline · showing last known availability. Reconnect to check for updates or withdrawn content.</p>
    <p v-if="pending !== null">{{ pending }} pending {{ pending === 1 ? 'completion' : 'completions' }} for {{ scope === 'guest' ? 'this guest session' : 'your account' }}. <button v-if="pending" type="button" class="secondary-action" :disabled="syncing || !online" @click="sync">{{ syncing ? 'Syncing…' : 'Retry sync' }}</button></p>
    <p role="status" aria-live="polite" aria-atomic="true">{{ status }}</p><p v-if="error" role="alert">{{ error }}</p>
    <p v-if="loading">Reading downloads…</p>
    <details class="download-help"><summary>About downloads</summary><p>Removing a download keeps progress, queued completions and saved lesson positions. Its offline Words and grammar examples may be unavailable until downloaded again.</p><p>Last availability checks are shown with each package.</p></details>
    <section v-for="group in groups" :key="group.id" class="download-course" :aria-labelledby="`downloads-${group.id}`">
      <h2 :id="`downloads-${group.id}`">{{ group.name }}</h2>
      <p v-if="!group.rows.length">No published downloads known for this course.</p>
      <ul v-else class="download-list">
        <li v-for="row in group.rows" :id="`download-${row.key}`" :key="row.key" class="download-row" tabindex="-1" :aria-label="row.title">
          <div class="download-detail"><h3>{{ row.title }}</h3><p>{{ row.type === 'alphabet' ? 'Alphabet' : 'Lesson' }} · <strong>{{ operations.has(row.key) ? 'Working…' : row.state }}</strong><span v-if="row.version"> · saved version {{ row.version }}</span></p>
            <p v-if="row.notice" class="download-notice">{{ row.notice }}</p>
            <p v-if="row.version">{{ row.audioCount ? `${row.audioCount} required recordings${row.complete ? ' saved' : ' · incomplete'}` : 'Text only · no attached recordings' }}<span v-if="row.complete && row.meta.error">. Saved version remains usable.</span></p>
            <p v-else>{{ row.meta.requiredAudio === 0 ? 'Text only · no attached recordings' : 'Recording details are checked when downloading.' }}</p>
            <p class="download-dates"><template v-if="row.meta.savedAt || row.version">Last saved: {{ date(row.meta.savedAt) }}<br /></template>Availability checked: {{ date(row.meta.checkedAt) }}</p>
            <p v-if="row.meta.error">{{ row.meta.error }}</p>
            <p v-if="paused.has(row.id) && !row.complete">Saved lesson position kept. Download again to resume offline.</p>
            <p v-if="row.meta.removed && !row.complete">Removed on this device. Download or open the lesson to save it again.</p>
          </div>
          <div class="download-actions"><button v-if="row.state !== 'Unavailable' && (!row.complete || row.state !== 'Saved' && row.state !== 'Saved · text only')" type="button" class="primary-action" :disabled="operations.has(row.key) || row.state === 'Downloading' || !online" :aria-label="`${downloadAction(row)} ${row.title}`" @click="act(row)"><Download :size="18" aria-hidden="true" />{{ downloadAction(row) }}</button><button v-if="row.version" type="button" class="secondary-action" :disabled="operations.has(row.key)" :aria-label="`Remove download ${row.title}`" @click="act(row, true)"><Trash2 :size="18" aria-hidden="true" />Remove download</button></div>
        </li>
      </ul>
    </section>
  </section>
</template>

<style scoped>
.downloads-center { max-width: 960px; margin: 0 auto 2rem; overflow-wrap: anywhere; }
.downloads-header,.download-row { display:flex; justify-content:space-between; align-items:flex-start; gap:1.25rem; flex-wrap:wrap; }
.downloads-header { align-items:center; margin:1rem 0; } h1,h2,h3 { margin:0; } h2 { margin:1.5rem 0 1rem; }
p { line-height:1.6; } .downloads-summary { border-left:5px solid #17684e; padding:.25rem 1rem; background:#fff; border-radius:8px; }
summary { cursor:pointer; min-height:44px; display:list-item; align-content:center; font-weight:650; } .download-help { margin:1rem 0; }
.download-list { list-style:none; padding:0; display:grid; gap:1rem; }
.download-row { border:1px solid #8fa99b; border-top:5px solid #17684e; border-radius:14px; background:#fff; padding:1rem; }
.download-detail { flex:1 1 280px; min-width:0; } .download-detail p { margin:.5rem 0; }
.download-actions { display:flex; flex-wrap:wrap; gap:.75rem; align-items:center; }
button { min-height:48px; white-space:normal; } .download-dates { font-size:.85rem; color:#485b52; }
.download-notice { background:#f4d16f; color:#352a12; border-radius:8px; padding:.5rem; }
[role=alert] { color:#922727; font-weight:650; } .download-row:focus { outline:3px solid #17684e; outline-offset:3px; }
@media(max-width:480px) { .download-actions { width:100%; } .download-actions button { flex:1 1 140px; } }
</style>
