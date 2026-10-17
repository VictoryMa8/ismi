<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { BookOpen, Download, Search, Volume2 } from '@lucide/vue'
import BackControl from './BackControl.vue'
import LessonScroll from './LessonScroll.vue'
import AlphabetWord from './AlphabetWord.vue'
import { courseFor, textAttributes, type CourseId } from './courses'
import { request } from './api'
import { type AlphabetPack, type AlphabetCatalog, type AlphabetEvidence, type AlphabetActivity } from './alphabet'
import { alphabetBrowseKey, alphabetHistory, alphabetPlayback, cachedAlphabetCatalog, downloadAlphabet, getAlphabetPack, reconcileAlphabet, removeAlphabet, saveAlphabetEvidence, verifyAlphabetPack } from './alphabetOffline'
import { getDeviceSnapshot, saveDeviceSnapshot } from './offline'

const props = defineProps<{ courseId: CourseId; scope: string; previewPack?: AlphabetPack; suspended?: boolean }>()
const emit = defineEmits<{ audio: [playing: boolean] }>()
const course = computed(() => courseFor(props.courseId))
const pack = ref<AlphabetPack | null>(null), downloaded = ref<AlphabetPack | null>(null), entryId = ref<string | null>(null)
const search = ref(''), category = ref(''), busy = ref(false), saving = ref(false), error = ref(''), status = ref(''), offline = ref(!navigator.onLine)
const history = ref<AlphabetEvidence[]>([]), heading = ref<HTMLElement>(), letterHeading = ref<HTMLElement>()
const moving = ref(false)
const dialog = ref<HTMLDialogElement>(), activityIndex = ref(0), practice = ref<{ entryId: string; activity: AlphabetActivity }[]>([])
const answers = ref<string[]>([]), help = ref(false), feedback = ref<string | null>(null), correct = ref<boolean | null>(null), finished = ref(false), results = ref<AlphabetEvidence[]>([])
let epoch = 0, playback = 0, audio: HTMLAudioElement | null = null, objectUrl: string | null = null, opener: HTMLElement | null = null
const playingUrl = ref<string | null>(null), played = ref(false)
let contextScope = props.scope
let currentRecorded = false
let snapshotHash = ''
let sessionWrites = Promise.resolve()
function writeSession(key: string, value: SavedPractice | null) {
  const snapshot = JSON.parse(JSON.stringify(value)) as SavedPractice | null
  sessionWrites = sessionWrites.catch(() => {}).then(async () => { await saveDeviceSnapshot(key, snapshot) })
  void sessionWrites.catch(() => { error.value = 'Practice position could not be saved.' })
  return sessionWrites
}
type SavedPractice = { hash: string; practice: { entryId: string; activity: AlphabetActivity }[]; index: number; answers: string[]; help: boolean; feedback: string | null; correct: boolean | null; finished: boolean; results: AlphabetEvidence[]; recorded: boolean }
const savedPractice = ref<SavedPractice | null>(null)
function practiceKey(scope: string, course: CourseId) { return `alphabet-session-v1:${scope}:${course}` }
function persistPractice() {
  if (!pack.value || props.previewPack || !practice.value.length) return
  const value: SavedPractice = { hash: snapshotHash, practice: practice.value, index: activityIndex.value, answers: answers.value, help: help.value, feedback: feedback.value, correct: correct.value, finished: finished.value, results: results.value, recorded: currentRecorded }
  savedPractice.value = JSON.parse(JSON.stringify(value)) as SavedPractice
  void writeSession(practiceKey(contextScope, pack.value.courseId), value)
}
watch([answers, help, feedback, correct, finished, activityIndex], persistPractice, { deep: true, flush: 'post' })

const entry = computed(() => pack.value?.entries.find(e => e.id === entryId.value))
const scriptEntry = computed(() => pack.value?.scriptEntries.find(e => e.id === entryId.value))
const filtered = computed(() => pack.value?.scriptEntries.filter(e => (!category.value || e.category === category.value) &&
  [e.text, pack.value?.entries.find(t => t.id === e.id)?.name, pack.value?.entries.find(t => t.id === e.id)?.help].some(v => v?.toLocaleLowerCase().includes(search.value.toLocaleLowerCase()))) ?? [])
const categories = computed(() => [...new Set(pack.value?.scriptEntries.map(e => e.category) ?? [])])
const current = computed(() => practice.value[activityIndex.value])
const practiceEntry = computed(() => pack.value?.entries.find(e => e.id === current.value?.entryId))
const practiceExample = computed(() => practiceEntry.value?.examples.find(e => e.id === current.value?.activity.exampleId))
const currentDownloaded = computed(() => downloaded.value?.contentHash === pack.value?.contentHash)
const currentHistory = computed(() => history.value.filter(e => e.contentHash === pack.value?.contentHash && e.kind !== 'viewed'))
const kindName = { shape: 'Shape recognition', listening: 'Listening recognition', spot: 'Word spotting', repeat: 'Listen and repeat' }
function stopAudio() {
  playback++; audio?.pause(); if (audio) audio.src = ''; audio = null
  if (objectUrl) URL.revokeObjectURL(objectUrl); objectUrl = null; playingUrl.value = null; emit('audio', false)
}
async function play(url: string) {
  stopAudio(); const token = playback; emit('audio', true); playingUrl.value = url
  try {
    const source = await alphabetPlayback(url)
    if (token !== playback) { if (source.startsWith('blob:')) URL.revokeObjectURL(source); return }
    if (source.startsWith('blob:')) objectUrl = source
    audio = new Audio(source); audio.onended = () => { if (token === playback) { played.value = true; stopAudio() } }
    audio.onerror = () => { if (token === playback) { error.value = 'Audio could not play. Use the transcript or a visual activity.'; stopAudio() } }
    await audio.play()
  } catch { if (token === playback) { error.value = 'Audio could not play. Use the transcript or a visual activity.'; stopAudio() } }
}
function routeLetter() { const part = window.location.hash.split('/')[3]; return part && /^[a-z0-9-]{1,80}$/.test(part) ? part : null }
async function load() {
  const token = ++epoch, scope = props.scope, id = props.courseId
  stopAudio(); closePractice(true); contextScope = scope; savedPractice.value = null; pack.value = null; entryId.value = null; history.value = []; downloaded.value = null; busy.value = true; error.value = ''; status.value = ''; search.value = ''; category.value = ''
  const live = () => token === epoch
  try {
    if (props.previewPack) { pack.value = props.previewPack; return }
    await sessionWrites.catch(() => {})
    if (!live()) return
    const [cached, past, browse, session] = await Promise.all([getAlphabetPack(id), alphabetHistory(scope, id), getDeviceSnapshot<string>(alphabetBrowseKey(scope, id)), getDeviceSnapshot<SavedPractice>(practiceKey(scope, id))])
    if (!live()) return
    downloaded.value = cached ?? null; history.value = past ?? []
    let catalog: AlphabetCatalog | undefined
    try {
      catalog = await request<AlphabetCatalog>('/api/alphabet'); if (!live()) return
      await reconcileAlphabet(catalog); if (!live()) return
      const available = catalog.courses.find(c => c.courseId === id)
      if (!available?.packId) { downloaded.value = null; return }
      const p = await request<AlphabetPack>(`/api/alphabet/packs/${available.packId}`); await verifyAlphabetPack(p)
      if (!live()) return
      if (p.courseId !== id || p.contentHash !== available.contentHash) throw new Error('The alphabet changed. Refresh to load its current version.')
      pack.value = p; offline.value = false
    } catch (caught) {
      if (!live()) return
      catalog ??= await cachedAlphabetCatalog(); if (!live()) return
      const allowed = catalog?.courses.find(c => c.courseId === id)
      const old = await getAlphabetPack(id); if (!live()) return
      if (old && allowed?.packId === old.id && !catalog?.withdrawnIds.includes(old.id)) {
        await verifyAlphabetPack(old); if (!live()) return
        pack.value = old; downloaded.value = old
        status.value = navigator.onLine ? 'Showing your download. Current availability could not be checked.' : 'Offline · downloaded version. Availability will be checked on reconnection.'
      } else error.value = navigator.onLine ? (caught instanceof Error ? caught.message : 'Alphabet could not load. Try again.') : 'No alphabet pack is downloaded for this course.'
    }
    if (!live()) return
    if (session && session.hash === pack.value?.contentHash) savedPractice.value = session
    snapshotHash = pack.value?.contentHash ?? ''
    const chosen = routeLetter() ?? browse
    if (chosen && pack.value?.entries.some(e => e.id === chosen)) entryId.value = chosen
  } catch { if (live()) error.value = 'Alphabet storage could not be opened. Refresh or try another browser.' }
  finally { if (live()) { busy.value = false; await nextTick(); heading.value?.focus({ preventScroll: true }) } }
}
async function record(item: AlphabetEvidence) {
  if (props.previewPack) return
  const scope = contextScope, token = epoch
  try { await saveAlphabetEvidence(scope, item); if (token === epoch) history.value.push(item) }
  catch { if (token === epoch) error.value = 'Practice could not be saved on this device. You can continue.' }
}
function evidence(kind: AlphabetEvidence['kind'], id: string): AlphabetEvidence {
  return { id: crypto.randomUUID(), packId: pack.value!.id, courseId: pack.value!.courseId, version: pack.value!.version,
    contentHash: pack.value!.contentHash, entryId: id, activityId: null, kind, firstAnswer: null, answers: [], help: false, correct: null, selfChecked: false, at: new Date().toISOString() }
}
async function select(id: string | null) {
  stopAudio(); entryId.value = id
  if (!props.previewPack) {
    if (id) void record(evidence('viewed', id))
    void saveDeviceSnapshot(alphabetBrowseKey(props.scope, props.courseId), id).catch(() => { error.value = 'Browsing position could not be saved.' })
    const hash = id ? `#/practice/alphabet/${id}` : '#/practice/alphabet'
    if (window.location.hash !== hash) window.history.pushState(null, '', hash)
  }
  await nextTick(); (id ? letterHeading.value : heading.value)?.focus({ preventScroll: true })
}
function hashChanged() { if (!props.previewPack && window.location.hash.startsWith('#/practice/alphabet')) { const id = routeLetter(); if (!id || pack.value?.entries.some(e => e.id === id)) void select(id) } }
async function download() {
  if (!pack.value || saving.value || props.previewPack) return
  saving.value = true; error.value = ''; const p = pack.value, token = epoch
  try {
    await downloadAlphabet(p)
    if (token !== epoch) return
    downloaded.value = p; status.value = 'Downloaded · text, practice and all model recordings.'
  } catch (caught) { if (token === epoch) error.value = `Alphabet download failed. Previous download retained. ${caught instanceof Error ? caught.message : ''}` }
  finally { saving.value = false }
}
async function remove() { if (saving.value) return; const id = props.courseId; try { await removeAlphabet(id); if (props.courseId === id) { downloaded.value = null; status.value = 'Download removed.' } } catch { error.value = 'The download could not be removed.' } }
function begin(mixed = false) {
  if (!pack.value) return
  opener = document.activeElement as HTMLElement
  const entries = mixed ? [...pack.value.entries].sort((a, b) =>
    currentHistory.value.filter(h => h.entryId === a.id).length - currentHistory.value.filter(h => h.entryId === b.id).length
  ).slice(0, 2) : entry.value ? [entry.value] : []
  // Interleave kinds/letters; authored questions supply all distractors and rationales.
  practice.value = (['shape', 'listening', 'spot', 'repeat'] as const).flatMap(kind => entries.flatMap(e => e.activities.filter(a => a.kind === kind).slice(0, 1).map(activity => ({ entryId: e.id, activity })))).slice(0, mixed ? 8 : 4)
  if (!practice.value.length) return
  snapshotHash = pack.value.contentHash; activityIndex.value = 0; results.value = []; finished.value = false; resetQuestion(); stopAudio(); persistPractice(); dialog.value?.showModal()
  void nextTick(() => focusPractice())
}
function focusPractice() {
  const area = dialog.value?.querySelector<HTMLElement>('.lesson-content'); if (area) area.scrollTop = 0
  dialog.value?.querySelector<HTMLElement>('h2')?.focus({ preventScroll: true })
}
function resetQuestion() { currentRecorded = false; answers.value = []; help.value = false; feedback.value = null; correct.value = null; played.value = false }
function resumePractice() {
  const s = savedPractice.value; if (!s || !pack.value || s.hash !== pack.value.contentHash) return
  opener = document.activeElement as HTMLElement; practice.value = s.practice; activityIndex.value = s.index; answers.value = s.answers; help.value = s.help; feedback.value = s.feedback; correct.value = s.correct; finished.value = s.finished; results.value = s.results; currentRecorded = s.recorded; played.value = false; snapshotHash = s.hash
  dialog.value?.showModal(); void nextTick(() => focusPractice())
}
function closePractice(preserve = false) {
  if (preserve) persistPractice()
  else if (pack.value && practice.value.length && !props.previewPack) {
    if (!currentRecorded && current.value && (answers.value.length || help.value)) {
      const item = { ...evidence(current.value.activity.kind, current.value.entryId), activityId: current.value.activity.id,
        firstAnswer: answers.value[0] ?? null, answers: [...answers.value], help: help.value, correct: answers.value.length ? false : null }
      void record(item)
    }
    void writeSession(practiceKey(contextScope, pack.value.courseId), null)
    savedPractice.value = null
  }
  stopAudio(); dialog.value?.close(); practice.value = []; opener?.focus({ preventScroll: true }); opener = null
}
async function answer(id: string | null, selfChecked = false) {
  if (!current.value || !pack.value || currentRecorded) return
  const a = current.value.activity
  if (a.kind === 'listening' && !played.value) return
  if (a.kind === 'repeat' && (!played.value || !selfChecked)) return
  if (id) answers.value.push(id)
  const ok = a.kind === 'repeat' ? null : a.acceptedIds.includes(id ?? '')
  correct.value = ok; feedback.value = a.explanation
  if (ok === false) return // Retry remains available; one final evidence record preserves first/help/retries.
  const item = { ...evidence(a.kind, current.value.entryId), activityId: a.id, firstAnswer: answers.value[0] ?? null,
    answers: [...answers.value], help: help.value, correct: ok, selfChecked }
  currentRecorded = true; results.value.push(item); persistPractice(); await record(item)
}
async function next(skip = false) {
  if (moving.value) return
  moving.value = true; const token = epoch
  try {
    if (skip && !currentRecorded && current.value && pack.value) {
      const a = current.value.activity; const item = { ...evidence(a.kind, current.value.entryId), activityId: a.id,
        firstAnswer: answers.value[0] ?? null, answers: [...answers.value], help: help.value, correct: answers.value.length ? false : null }
      currentRecorded = true; results.value.push(item); await record(item)
      if (token !== epoch) return
    }
    stopAudio()
    if (activityIndex.value + 1 >= practice.value.length) finished.value = true
    else { activityIndex.value++; resetQuestion() }
    persistPractice(); await nextTick(); focusPractice()
  } finally { moving.value = false }
}
function visibilityChange() { if (document.hidden) stopAudio() }
watch(() => props.suspended, value => { if (value) stopAudio() })
function onlineChange() { offline.value = !navigator.onLine; if (navigator.onLine && !props.previewPack) void load() }
watch(() => [props.courseId, props.scope, props.previewPack] as const, (values, previous) => {
  if (previous && values[0] !== previous[0] && !props.previewPack && window.location.hash.startsWith('#/practice/alphabet/')) window.history.replaceState(null, '', '#/practice/alphabet')
  void load()
}, { immediate: true })
onMounted(() => { document.addEventListener('visibilitychange', visibilityChange); window.addEventListener('online', onlineChange); window.addEventListener('offline', onlineChange); window.addEventListener('hashchange', hashChanged); window.addEventListener('popstate', hashChanged) })
onBeforeUnmount(() => { epoch++; closePractice(true); document.removeEventListener('visibilitychange', visibilityChange); window.removeEventListener('online', onlineChange); window.removeEventListener('offline', onlineChange); window.removeEventListener('hashchange', hashChanged); window.removeEventListener('popstate', hashChanged) })
</script>

<template>
  <section class="alphabet-explorer" aria-labelledby="alphabet-heading">
    <BackControl v-if="!previewPack" href="#/practice">Back to Practice</BackControl>
    <header class="alphabet-header">
      <div><p class="alphabet-course">{{ course.name }}</p><h1 id="alphabet-heading" ref="heading" tabindex="-1">Alphabet</h1></div>
      <button v-if="!previewPack" type="button" class="secondary-action" :disabled="busy || saving" @click="load">Refresh alphabet</button>
    </header>
    <p v-if="previewPack" class="alphabet-notice">Private draft preview · unreviewed content may be incomplete. Practice is not saved.</p>
    <p v-if="busy" role="status">Loading alphabet…</p>
    <p v-if="error" role="alert" class="alphabet-error">{{ error }}</p>
    <p v-if="status" role="status">{{ status }}</p>
    <div v-if="!busy && !pack" class="alphabet-empty">
      <BookOpen :size="36" aria-hidden="true" /><h2>No alphabet pack published yet</h2>
      <p>Letters, examples and human recordings will appear after review and publication.</p>
      <a href="#/courses" class="back-control">Browse courses</a>
    </div>
    <template v-if="pack">
      <div class="alphabet-toolbar">
        <span>{{ pack.variety }} · Version {{ pack.version }}</span>
        <button v-if="!previewPack" type="button" class="primary-action" :disabled="saving || currentDownloaded" @click="download"><Download :size="18" aria-hidden="true" />{{ saving ? 'Downloading…' : currentDownloaded ? 'Downloaded' : 'Download alphabet' }}</button>
        <button v-if="downloaded && !previewPack" type="button" class="secondary-action" :disabled="saving" @click="remove">Remove download</button>
      </div>
      <p v-if="downloaded && !currentDownloaded">Version {{ downloaded.version }} is saved offline. Download this version to replace it.</p>
      <p v-if="!previewPack" class="alphabet-evidence-note">Practice history stays on this device for this learner and course. Recognition and self-checks do not assess pronunciation.</p>
      <button v-if="savedPractice" type="button" class="secondary-action" @click="resumePractice">Resume alphabet practice</button>
      <p v-if="currentHistory.length">{{ currentHistory.length }} practice activities recorded for this version.</p>
      <template v-if="!entry">
        <div class="alphabet-filters">
          <label><Search :size="16" aria-hidden="true" /> Find a letter<input v-model="search" type="search" placeholder="Character, name or pronunciation help" /></label>
          <label>Group<select v-model="category"><option value="">All groups</option><option v-for="c in categories" :key="c">{{ c }}</option></select></label>
        </div>
        <button type="button" class="primary-action" @click="begin(true)">Mixed practice</button>
        <p>{{ pack.basicEntryIds.length }} basic entries · {{ pack.scriptEntries.length - pack.basicEntryIds.length }} supporting entries</p>
        <div class="alphabet-grid" aria-label="Letters">
          <button v-for="s in filtered" :key="s.id" type="button" class="alphabet-letter" @click="select(s.id)">
            <b v-bind="textAttributes(courseId)">{{ s.text }}</b><span>{{ pack.entries.find(e => e.id === s.id)?.name }}</span>
          </button>
        </div>
        <p v-if="!filtered.length">No letters match your search.</p>
      </template>
      <article v-else class="alphabet-detail">
        <BackControl @click="select(null)">Back to letters</BackControl>
        <div class="alphabet-letter-title"><span class="alphabet-hero" v-bind="textAttributes(courseId)">{{ scriptEntry?.text }}</span><div><h2 ref="letterHeading" tabindex="-1">{{ entry.name }}</h2><p>{{ entry.help }}</p></div></div>
        <p>{{ entry.note }}</p>
        <div class="alphabet-actions"><button type="button" class="secondary-action" data-ui-sound="silent" @click="play(entry.nameAudio.url)"><Volume2 :size="18" aria-hidden="true" />Play name</button><button type="button" class="secondary-action" data-ui-sound="silent" @click="play(entry.soundAudio.url)"><Volume2 :size="18" aria-hidden="true" />Play sound</button><button v-if="playingUrl" type="button" class="secondary-action" data-ui-sound="silent" @click="stopAudio">Stop audio</button></div>
        <p><strong>Sound context:</strong> {{ entry.soundContext }}</p><p>Sound transcript: <span v-bind="textAttributes(courseId)">{{ entry.soundAudio.transcript }}</span></p>
        <div class="alphabet-forms"><div v-for="f in scriptEntry?.forms" :key="f.label"><strong>{{ f.label }}</strong><span v-bind="textAttributes(courseId)">{{ f.text }}</span><small>{{ f.note }}</small></div></div>
        <h3>Words</h3>
        <div class="alphabet-examples"><article v-for="w in entry.examples" :key="w.id"><p class="alphabet-word" v-bind="textAttributes(courseId)"><AlphabetWord :text="w.text" :target="w.target" :occurrences="w.occurrences" /></p><p><strong>{{ w.meaning }}</strong></p><p>{{ w.help }}</p><p>Find <bdi v-bind="textAttributes(courseId)">{{ w.target }}</bdi> · {{ w.occurrences.length }} {{ w.occurrences.length === 1 ? 'occurrence' : 'occurrences' }}.</p><p>{{ w.note }}</p><button type="button" class="secondary-action" data-ui-sound="silent" :aria-label="`Play word: ${w.meaning}`" @click="play(w.audio.url)"><Volume2 :size="18" aria-hidden="true" />Play word</button></article></div>
        <button type="button" class="primary-action" @click="begin()">Practice this letter</button>
        <details><summary>Sources and version</summary><p>{{ pack.inventoryId }} v{{ pack.inventoryVersion }} · {{ pack.helpConvention }}</p><ul><li v-for="s in pack.sources.filter(s => entry?.sourceIds.includes(s.id) || entry?.examples.some(w => w.sourceIds.includes(s.id)))" :key="s.id">{{ s.citation }} · {{ s.locator }} · {{ s.version }}</li></ul></details>
      </article>
    </template>
    <dialog ref="dialog" class="alphabet-practice" aria-labelledby="alphabet-practice-title" @cancel.prevent="closePractice()">
      <header><span>{{ course.name }} · {{ finished ? 'Practice recap' : `${activityIndex + 1} of ${practice.length}` }}</span><button type="button" class="secondary-action" @click="closePractice()">Close practice</button></header>
      <LessonScroll>
        <template v-if="finished"><h2 id="alphabet-practice-title" tabindex="-1">Practice complete</h2><p>{{ results.length }} activities tried.</p><p>{{ results.filter(r => r.correct === true && r.answers.length === 1 && !r.help).length }} recognition answers without help or retries.</p><p>{{ results.filter(r => r.selfChecked).length }} sound self-checks · unscored.</p><p v-if="results.some(r => r.correct === false || r.answers.length > 1 || r.help)">Revisit entries where you used help or another try.</p></template>
        <template v-else-if="current">
          <h2 id="alphabet-practice-title" tabindex="-1">{{ kindName[current.activity.kind] }}</h2><p>{{ current.activity.prompt }}</p>
          <p v-if="practiceExample" class="alphabet-word" v-bind="textAttributes(courseId)"><AlphabetWord :text="practiceExample.text" :target="practiceExample.target" :occurrences="help || feedback ? practiceExample.occurrences : []" /></p>
          <button v-if="current.activity.audioUrl" type="button" class="secondary-action" data-ui-sound="silent" @click="play(current.activity.audioUrl)">Play model</button>
          <p v-if="current.activity.kind === 'repeat'">Say it aloud, replay and check against the model. This is unscored.</p>
          <p v-if="current.activity.kind === 'listening' && !played">Play the complete model before choosing. You can skip to a visual activity.</p>
          <div v-if="current.activity.kind !== 'repeat'" class="alphabet-choices"><button v-for="c in current.activity.choices" :key="c.id" type="button" class="secondary-action" :disabled="correct === true || (current.activity.kind === 'listening' && !played)" v-bind="textAttributes(courseId)" @click="answer(c.id)">{{ c.text }}</button></div>
          <button type="button" class="secondary-action" @click="help = true">Show explanation</button>
          <p v-if="help">{{ current.activity.explanation }}</p>
          <p v-if="help && current.activity.kind === 'listening'">Help used · this will not count as an independent listening answer.</p>
          <p v-if="feedback" role="status"><strong>{{ correct === false ? 'Try again. ' : correct === true ? 'Accepted. ' : '' }}</strong>{{ feedback }} {{ current.activity.rationale }}</p>
          <p v-if="error" role="alert">{{ error }}</p>
        </template>
      </LessonScroll>
      <footer><button v-if="finished" type="button" class="primary-action" @click="closePractice()">Back to alphabet</button><template v-else><button v-if="!feedback || correct === false" type="button" class="secondary-action" :disabled="moving" @click="next(true)">Skip</button><button v-if="current?.activity.kind === 'repeat' && !feedback" type="button" class="primary-action" :disabled="!played" @click="answer(null, true)">I compared my sound</button><button v-if="feedback && correct !== false" type="button" class="primary-action" :disabled="moving" @click="next()">Continue</button></template></footer>
    </dialog>
  </section>
</template>

<style scoped>
.alphabet-explorer { max-width: 980px; margin: 0 auto 2rem; }
.alphabet-header,.alphabet-toolbar,.alphabet-actions,.alphabet-letter-title { display:flex; align-items:center; justify-content:space-between; gap:1rem; flex-wrap:wrap; margin:1.25rem 0; }
.alphabet-header h1 { margin:.2rem 0; } .alphabet-course { color:#325746; font-weight:700; margin:0; }
.alphabet-toolbar { justify-content:flex-start; } .alphabet-actions { justify-content:flex-start; }
.alphabet-explorer button { min-height:48px; } .alphabet-explorer p,.alphabet-explorer li { line-height:1.7; overflow-wrap:anywhere; }
.alphabet-empty { border:1px solid #c2d3c8; border-top:5px solid #17684e; padding:2rem; border-radius:18px; background:#fff; margin:1.5rem 0; }
.alphabet-empty svg { color:#17684e; } .alphabet-error { color:#8f2929; font-weight:650; } .alphabet-notice { background:#f4d16f; color:#352a12; padding:1rem; border-radius:12px; }
.alphabet-evidence-note { color:#4b5a52; font-size:.9rem; }
.alphabet-filters { display:flex; flex-wrap:wrap; gap:1rem; margin:1.5rem 0; }
.alphabet-filters label { display:flex; flex:1 1 180px; flex-wrap:wrap; align-items:center; gap:.5rem; font-weight:650; }
.alphabet-filters input,.alphabet-filters select { width:100%; min-height:48px; padding:.75rem; border:1px solid #6e897a; border-radius:10px; font:inherit; background:white; color:#263a34; }
.alphabet-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(112px,1fr)); gap:.8rem; margin:1rem 0; }
.alphabet-letter { display:flex; flex-direction:column; align-items:center; justify-content:center; padding:1rem .5rem; gap:.8rem; background:#fff; border:1px solid #a1b7a9; border-bottom:4px solid #17684e; border-radius:14px; cursor:pointer; }
.alphabet-letter b { font-size:2.5rem; line-height:1.8; } .alphabet-letter span { font-size:.9rem; overflow-wrap:anywhere; }
.alphabet-hero { font-size:5rem; line-height:1.8; color:#17684e; } .alphabet-letter-title { justify-content:flex-start; gap:2rem; }
.alphabet-forms,.alphabet-examples { display:grid; grid-template-columns:repeat(auto-fit,minmax(180px,1fr)); gap:1rem; margin:1.5rem 0; }
.alphabet-forms > div,.alphabet-examples article { background:#fff; border:1px solid #b5c9bc; border-radius:14px; padding:1rem; min-width:0; }
.alphabet-forms span { display:block; font-size:2.5rem; line-height:2; } .alphabet-forms small { display:block; line-height:1.7; }
.alphabet-word { font-size:2rem; line-height:2 !important; white-space:pre-wrap; } .alphabet-detail details { margin:1.5rem 0; }
.alphabet-practice { width:min(700px,calc(100vw - 24px)); height:min(760px,calc(100dvh - 32px)); max-height:calc(100dvh - 32px); border:1px solid #688775; border-radius:18px; padding:0; color:#263a34; background:#fffdf8; }
.alphabet-practice[open] { display:grid; grid-template-rows:auto minmax(0,1fr) auto; }
.alphabet-practice::backdrop { background:rgba(20,35,28,.6); } .alphabet-practice header,.alphabet-practice footer { padding:1rem; display:flex; align-items:center; justify-content:space-between; gap:.75rem; border-bottom:1px solid #cad5cd; }
.alphabet-practice footer { justify-content:flex-end; border-bottom:0; border-top:1px solid #cad5cd; }
.alphabet-practice :deep(.lesson-scroll-region) { min-height:0; height:100%; } .alphabet-practice :deep(.lesson-content) { max-height:100%; height:100%; padding:1.25rem; }
.alphabet-choices { display:grid; grid-template-columns:repeat(auto-fit,minmax(100px,1fr)); gap:.75rem; margin:1rem 0; } .alphabet-choices button { font-size:1.6rem; }
@media (max-width:480px) { .alphabet-examples,.alphabet-forms { grid-template-columns:1fr; } .alphabet-practice header { align-items:flex-start; font-size:.875rem; } .alphabet-practice footer { flex-wrap:wrap; } }
</style>
