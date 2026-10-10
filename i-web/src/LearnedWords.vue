<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { ApiRequestError, getLesson } from './api'
import { cacheLesson, getCachedLesson, recordingPlaybackUrl, removeCachedLesson } from './offline'
import { glossaryCaution, learnedVocabulary, matchesGlossary, vocabularyForLesson, type GlossaryEntry } from './glossary'
import { studyTracks } from './studyPlan'
import type { CourseLessonSummary, LessonResponse } from './types'

const props = defineProps<{ scope: string; lessons: CourseLessonSummary[]; suspended?: boolean }>()
const emit = defineEmits<{ 'open-lesson': [id: string, cardIndex: number]; 'prompt-playback': [playing: boolean] }>()
const packages = ref<LessonResponse[]>([])
const loading = ref(false)
const notice = ref('')
const query = ref('')
const track = ref('')
const dialect = ref('')
const kind = ref('')
const page = ref(0)
let lastScope: string | undefined
let generation = 0
let audioGeneration = 0
let audio: HTMLAudioElement | null = null
let objectUrl: string | null = null
const audioError = ref('')
const playing = ref('')
const entries = computed(() => learnedVocabulary(packages.value))
const filtered = computed(() => entries.value.filter(entry => (!track.value || entry.trackId === track.value)
  && (!dialect.value || entry.dialect === dialect.value) && (!kind.value || entry.kind === kind.value)
  && matchesGlossary(entry, query.value)))
const visible = computed(() => filtered.value.slice(page.value * 20, (page.value + 1) * 20))
const dialects = computed(() => [...new Set(entries.value.map(entry => entry.dialect))])
function dialectName(id: string) { return id === 'palestinian-urban' ? 'Urban Palestinian' : id === 'jordanian' ? 'Jordanian' : id }
function trackName(id: string) { return studyTracks.find(item => item.id === id)?.name ?? id }
function entryKey(entry: GlossaryEntry) { return JSON.stringify([entry.trackId, entry.id, entry.senseId, entry.arabic, entry.arabizi, entry.meaning, entry.dialect, entry.register, entry.kind, entry.forms]) }

function stopAudio() {
  audioGeneration++
  audio?.pause()
  audio = null
  if (objectUrl) URL.revokeObjectURL(objectUrl)
  objectUrl = null
  playing.value = ''
  emit('prompt-playback', false)
}
async function play(entry: GlossaryEntry) {
  const key = entryKey(entry)
  const wasPlaying = playing.value === key
  stopAudio()
  audioError.value = ''
  if (wasPlaying) return
  const url = entry.contexts.find(context => context.audioUrl)?.audioUrl
  if (!url) return
  const token = audioGeneration
  try {
    const resolved = await recordingPlaybackUrl(url)
    if (token !== audioGeneration) { if (resolved.startsWith('blob:')) URL.revokeObjectURL(resolved); return }
    if (resolved.startsWith('blob:')) objectUrl = resolved
    audio = new Audio(resolved)
    playing.value = key
    emit('prompt-playback', true)
    audio.addEventListener('ended', stopAudio, { once: true })
    audio.addEventListener('error', () => { if (token === audioGeneration) { stopAudio(); audioError.value = 'Recording unavailable. Read the text or reopen the lesson.' } }, { once: true })
    await audio.play()
  } catch {
    if (token === audioGeneration) { stopAudio(); audioError.value = 'Recording unavailable. Read the text or reopen the lesson.' }
  }
}
async function refresh() {
  const token = ++generation
  stopAudio()
  packages.value = []
  notice.value = ''
  loading.value = true
  const completed = props.lessons.filter(item => item.isCompleted)
  const available: LessonResponse[] = []
  let missing = 0
  let noVocabulary = 0
  let unsaved = false
  for (const item of completed) {
    let lesson: LessonResponse | undefined
    try {
      if (!navigator.onLine) throw new Error('Offline')
      lesson = await getLesson(item.id)
      if (token !== generation) return
      try { await cacheLesson(lesson) } catch { unsaved = true }
    } catch (error) {
      if (token !== generation) return
      if (error instanceof ApiRequestError && [403, 404, 410].includes(error.status)) {
        try { await removeCachedLesson(item.id) } catch { /* Withdrawn content stays hidden. */ }
      } else {
        try { lesson = await getCachedLesson(item.id) } catch { /* Explain unavailable downloads. */ }
      }
    }
    if (token !== generation) return
    if (!lesson) missing++
    else { available.push(lesson); if (!vocabularyForLesson(lesson).length) noVocabulary++ }
  }
  if (token !== generation) return
  packages.value = available
  page.value = 0
  notice.value = [missing ? `${missing} completed lesson(s) unavailable. Reconnect to refresh.` : '',
    noVocabulary ? `${noVocabulary} completed lesson(s) have no matching glossary records.` : '',
    unsaved ? 'Some downloads could not be saved. Offline words may be unavailable.' : ''].filter(Boolean).join(' ')
  loading.value = false
}
watch(() => [props.scope, props.lessons.map(item => `${item.id}:${item.isCompleted}`).join('|')], () => {
  if (lastScope !== props.scope) {
    query.value = ''; track.value = ''; dialect.value = ''; kind.value = ''; page.value = 0
    lastScope = props.scope
  }
  void refresh()
}, { immediate: true, flush: 'sync' })
watch([query, track, dialect, kind], () => { page.value = 0; stopAudio() })
watch(() => props.suspended, suspended => { if (suspended) stopAudio() })
window.addEventListener('online', refresh)
onBeforeUnmount(() => { generation++; stopAudio(); window.removeEventListener('online', refresh) })
</script>

<template>
  <section class="glossary" aria-labelledby="learned-words-title" :aria-busy="loading">
    <h2 id="learned-words-title">Learned words</h2>
    <p>Words and expressions from completed lessons. Completion does not mean mastery.</p>
    <div class="glossary-filters">
      <label class="glossary-search">Search words<input v-model="query" type="search" placeholder="Arabic, English or transliteration" dir="auto" /></label>
      <label>Track<select v-model="track"><option value="">All tracks</option><option v-for="item in studyTracks" :key="item.id" :value="item.id">{{ item.name }}</option></select></label>
      <label>Dialect<select v-model="dialect"><option value="">All dialects</option><option v-for="id in dialects" :key="id" :value="id">{{ dialectName(id) }}</option></select></label>
      <label>Type<select v-model="kind"><option value="">Words and expressions</option><option value="word">Words</option><option value="expression">Expressions</option></select></label>
    </div>
    <p v-if="loading" role="status">Loading learned words…</p>
    <template v-else>
      <p role="status">{{ filtered.length }} {{ filtered.length === 1 ? 'entry' : 'entries' }}</p>
      <p v-if="!entries.length">Complete a lesson with glossary records to add words here.</p>
      <p v-else-if="!filtered.length">No matching words. Try another search or filter.</p>
      <ul class="glossary-list">
        <li v-for="entry in visible" :key="entryKey(entry)" class="glossary-entry">
          <p class="glossary-arabic" lang="ar" dir="rtl">{{ entry.arabic }}</p>
          <p dir="ltr">{{ entry.arabizi }}</p>
          <p>{{ entry.meaning }}</p>
          <small>{{ trackName(entry.trackId) }} · {{ dialectName(entry.dialect) }} · {{ entry.register }} · {{ entry.kind }}</small>
          <p v-if="glossaryCaution(entry)" class="glossary-caution">{{ glossaryCaution(entry) }}</p>
          <button v-if="entry.contexts.some(context => context.audioUrl)" type="button" :aria-label="`${playing === entryKey(entry) ? 'Stop' : 'Play'} recording: ${entry.meaning}`" @click="play(entry)">{{ playing === entryKey(entry) ? 'Stop recording' : 'Play recording' }}</button>
          <p v-else class="glossary-audio-status">Reviewed audio not supplied.</p>
          <details>
            <summary>Forms and teaching context</summary>
            <p v-if="!entry.forms.length">Additional grammatical forms not supplied. Context notes below describe the taught usage.</p>
            <ul v-else><li v-for="form in entry.forms" :key="form" dir="auto">{{ form }}</li></ul>
            <div v-for="context in entry.contexts" :key="`${context.lessonId}:${context.cardIndex}`" class="glossary-context">
              <p>{{ context.note }}</p>
              <p v-if="context.recording">Recording: {{ context.recording.speaker }} · {{ dialectName(context.recording.dialect) }}<br /><bdi>{{ context.recording.sourceLocator }}</bdi><br />{{ context.recording.reviewNotes }}</p>
              <button type="button" @click="stopAudio(); emit('open-lesson', context.lessonId, context.cardIndex)">Open lesson: {{ context.title }}</button>
              <small>{{ context.version }} · Teaching card {{ context.cardIndex + 1 }}</small>
              <ul aria-label="Source records"><li v-for="locator in context.sourceLocators" :key="locator"><a v-if="/^https?:\/\//.test(locator)" :href="locator"><bdi>{{ locator }}</bdi></a><bdi v-else>{{ locator }}</bdi></li></ul>
            </div>
          </details>
        </li>
      </ul>
      <nav v-if="filtered.length > 20" class="glossary-pagination" aria-label="Learned words pages">
        <button type="button" :disabled="page === 0" @click="stopAudio(); page--">Previous words</button>
        <span role="status">Page {{ page + 1 }} of {{ Math.ceil(filtered.length / 20) }}</span>
        <button type="button" :disabled="(page + 1) * 20 >= filtered.length" @click="stopAudio(); page++">Next words</button>
      </nav>
    </template>
    <p v-if="notice" role="status">{{ notice }}</p>
    <p v-if="audioError" role="alert">{{ audioError }}</p>
    <button v-if="notice" type="button" @click="refresh">Refresh words</button>
  </section>
</template>

<style scoped>
.glossary { margin: 1.5rem 0; padding: 1.2rem; border: 1px solid var(--border, #c9cec8); border-radius: 1rem; background: #fff; color: #202820; }
.glossary h2 { margin-top: 0; }
.glossary-filters { display: flex; flex-wrap: wrap; gap: .75rem; }
.glossary-filters label { display: grid; gap: .35rem; font-weight: 600; flex: 1 1 10rem; min-width: 0; }
.glossary-search { flex-basis: 100% !important; }
.glossary input, .glossary select { width: 100%; min-width: 0; padding: .65rem; border: 1px solid #657465; border-radius: .4rem; background: #fff; color: #202820; font: inherit; }
.glossary-list { list-style: none; padding: 0; display: grid; gap: .8rem; }
.glossary-entry { padding: 1rem; border: 1px solid #c9cec8; border-inline-start: 4px solid #167144; border-radius: .5rem; overflow-wrap: anywhere; }
.glossary-entry p { margin: .45rem 0; }
.glossary-arabic { font-size: 1.7rem; line-height: 1.8; text-align: start; }
.glossary small { display: block; line-height: 1.6; }
.glossary summary { cursor: pointer; padding: .7rem 0; font-weight: 600; }
.glossary button { padding: .65rem .85rem; margin: .4rem 0; border: 1px solid #167144; border-radius: .4rem; color: #115832; background: #fff; font: inherit; cursor: pointer; }
.glossary button:disabled { opacity: .5; cursor: default; }
.glossary :is(button, input, select, summary):focus-visible { outline: 3px solid #a73b1f; outline-offset: 3px; }
.glossary-context { padding: .5rem 0; border-top: 1px solid #c9cec8; }
.glossary-caution { padding: .5rem; border-inline-start: 3px solid #b94229; }
.glossary-pagination { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: .5rem; }
</style>
