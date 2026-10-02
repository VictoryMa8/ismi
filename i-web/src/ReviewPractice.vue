<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { Check, ChevronRight, RotateCcw } from '@lucide/vue'
import { ApiRequestError, getLesson } from './api'
import { cacheLesson, getCachedLesson, getDeviceSnapshot, getReviewHistory, recordingPlaybackUrl, removeCachedLesson, saveDeviceSnapshot, saveReviewAttempt } from './offline'
import { evaluateOffline } from './evaluation'
import { checkpointKey, makeReviewQueue, reviewTurns, type CheckpointResult, type ReviewKind, type ReviewTurn } from './review'
import type { CourseLessonSummary, LessonAttemptResponse, LessonResponse } from './types'
import LessonScroll from './LessonScroll.vue'
import LessonTransition from './LessonTransition.vue'
import PhraseBuilder from './PhraseBuilder.vue'
import SoundToggle from './SoundToggle.vue'
import CharacterCue from './CharacterCue.vue'
import { playUiSound } from './uiSounds'

const props = defineProps<{ scope: string; lessons: CourseLessonSummary[]; historyRevision: number }>()
const emit = defineEmits<{ 'open-change': [open: boolean]; 'prompt-playback': [playing: boolean] }>()
const packages = ref<LessonResponse[]>([])
const history = ref<Awaited<ReturnType<typeof getReviewHistory>>>([])
const loading = ref(true)
const notice = ref('')
const storageError = ref('')
const open = ref(false)
const finished = ref(false)
const kind = ref<ReviewKind>('mixed')
const queue = ref<ReviewTurn[]>([])
const index = ref(0)
const mode = ref<'recall' | 'build' | 'choose'>('recall')
const answerId = ref<string | null>(null)
const buildComplete = ref(false)
const feedback = ref<LessonAttemptResponse | null>(null)
const attempts = ref(0)
const retries = ref(0)
const promptHelp = ref(false)
const answerHelp = ref(false)
const helped = ref(false)
const firstCorrect = ref(0)
const helpedTurns = ref(0)
const saving = ref(false)
const resultKey = ref('')
const results = ref<Record<string, CheckpointResult>>({})
const closeButton = ref<HTMLButtonElement | null>(null)
const heading = ref<HTMLElement | null>(null)
const feedbackPanel = ref<HTMLElement | null>(null)
const finishHeading = ref<HTMLElement | null>(null)
let opener: HTMLElement | null = null
let generation = 0
let audio: HTMLAudioElement | null = null
let objectUrl: string | null = null
let audioGeneration = 0
const audioError = ref('')
const turn = computed(() => queue.value[index.value])
const model = computed(() => turn.value?.step.answers.find(answer => answer.id.toLowerCase() === turn.value?.step.evaluation.correctAnswerId.toLowerCase()))
const turns = computed(() => reviewTurns(packages.value, history.value))
const mistakeCount = computed(() => turns.value.filter(item => item.history?.needsReview).length)
const units = computed(() => {
  const map = new Map<string, { id: string; title: string; lessons: CourseLessonSummary[] }>()
  for (const lesson of props.lessons) {
    if (!map.has(lesson.unitId)) map.set(lesson.unitId, { id: lesson.unitId, title: lesson.unitTitle, lessons: [] })
    map.get(lesson.unitId)!.lessons.push(lesson)
  }
  return [...map.values()].map(unit => ({ ...unit,
    complete: unit.lessons.every(lesson => lesson.isCompleted),
    available: unit.lessons.every(lesson => packages.value.some(item => item.id === lesson.id)),
  }))
})

async function refresh() {
  if (open.value) return
  const token = ++generation
  loading.value = true
  notice.value = ''
  storageError.value = ''
  let saved: typeof history.value = []
  try { saved = await getReviewHistory(props.scope) }
  catch { storageError.value = 'Device storage is unavailable. Practice is still free; review history cannot be saved.' }
  const available: LessonResponse[] = []
  let missing = 0
  for (const item of props.lessons.filter(item => item.isCompleted || saved.some(entry => entry.lessonId === item.id))) {
    let lesson: LessonResponse | undefined
    try {
      if (!navigator.onLine) throw new Error('Offline')
      lesson = await getLesson(item.id)
      try { await cacheLesson(lesson) }
      catch { storageError.value = 'Some review downloads could not be saved. Reconnect to download them before offline practice.' }
    } catch (error) {
      // A deliberate server withdrawal must not fall back to a cached version.
      if (error instanceof ApiRequestError && [403, 404, 410].includes(error.status)) {
        try { await removeCachedLesson(item.id) } catch { /* Do not offer it in this session. */ }
      } else {
        try { lesson = await getCachedLesson(item.id) } catch { /* Show missing packages below. */ }
      }
    }
    if (token !== generation) return
    if (lesson?.trackId === 'levantine') available.push(lesson)
    else missing++
  }
  if (token !== generation) return
  history.value = saved
  packages.value = available
  results.value = {}
  for (const unit of units.value.filter(unit => unit.available)) {
    try {
      const result = await getDeviceSnapshot<CheckpointResult>(checkpointKey(props.scope, unit.id, available.filter(lesson => lesson.unitId === unit.id)))
      if (token !== generation) return
      if (result) results.value[unit.id] = result
    } catch { /* Practice remains available without checkpoint history. */ }
  }
  if (missing) notice.value = `${missing} lesson${missing === 1 ? '' : 's'} unavailable for review. Reconnect to download; offline checkpoints need the whole unit.`
  loading.value = false
}

function stopAudio() {
  audioGeneration++
  audio?.pause(); audio = null
  emit('prompt-playback', false)
  if (objectUrl) URL.revokeObjectURL(objectUrl)
  objectUrl = null
}
async function playAudio() {
  stopAudio(); audioError.value = ''
  const token = audioGeneration
  const url = turn.value?.step.prompt.audioUrl
  if (!url) return
  const playbackUrl = await recordingPlaybackUrl(url)
  if (token !== audioGeneration || !open.value) {
    if (playbackUrl.startsWith('blob:')) URL.revokeObjectURL(playbackUrl)
    return
  }
  objectUrl = playbackUrl.startsWith('blob:') ? playbackUrl : null
  audio = new Audio(playbackUrl)
  emit('prompt-playback', true)
  const fail = () => { if (token === audioGeneration) { audioError.value = 'Audio could not play. Read the prompt and continue.'; stopAudio() } }
  audio.addEventListener('ended', () => { if (token === audioGeneration) stopAudio() }, { once: true })
  audio.addEventListener('error', fail, { once: true })
  try { await audio.play() } catch { fail() }
}

function resetTurn() {
  stopAudio()
  audioError.value = ''
  mode.value = kind.value === 'checkpoint' ? 'recall' : (index.value % 2 === 0 && (model.value?.arabic.trim().includes(' ')) ? 'build' : 'recall')
  answerId.value = null; buildComplete.value = false; feedback.value = null
  attempts.value = 0; promptHelp.value = false; answerHelp.value = false; helped.value = false
}

async function start(nextKind: ReviewKind, unitId?: string) {
  if (loading.value || saving.value) return
  const unit = units.value.find(unit => unit.id === unitId)
  if (nextKind === 'checkpoint' && (!unit?.complete || !unit.available)) return
  const candidates = unitId ? turns.value.filter(turn => turn.lesson.unitId === unitId) : turns.value
  const selected = makeReviewQueue(candidates, nextKind)
  if (!selected.length) return
  opener = document.activeElement as HTMLElement
  kind.value = nextKind; queue.value = selected; index.value = 0
  finished.value = false; firstCorrect.value = 0; helpedTurns.value = 0
  resultKey.value = unitId ? checkpointKey(props.scope, unitId, packages.value.filter(lesson => lesson.unitId === unitId)) : ''
  open.value = true
  document.body.style.overflow = 'hidden'
  resetTurn()
  await nextTick(); closeButton.value?.focus()
}
function close() {
  if (saving.value) return
  stopAudio(); open.value = false
  document.body.style.overflow = ''
  nextTick(() => {
    if (opener?.isConnected && !opener.matches(':disabled')) opener.focus()
    else document.querySelector<HTMLElement>('.review-actions .primary-action')?.focus()
  })
}
function trapFocus(event: KeyboardEvent) {
  if (event.key !== 'Tab') return
  const controls = [...(event.currentTarget as HTMLElement).querySelectorAll<HTMLElement>('button:not(:disabled), summary, a[href], [tabindex="0"]')]
    .filter(item => item.getClientRects().length && !item.closest('[inert]'))
  if (event.shiftKey && document.activeElement === controls[0]) { event.preventDefault(); controls.at(-1)?.focus() }
  else if (!event.shiftKey && document.activeElement === controls.at(-1)) { event.preventDefault(); controls[0]?.focus() }
}
async function reveal(nextMode: 'build' | 'choose') {
  if (nextMode === 'choose') helped.value = true
  mode.value = nextMode; answerId.value = null; buildComplete.value = false
  await nextTick(); focusTurn()
}
function focusTurn() {
  const content = heading.value?.closest<HTMLElement>('.lesson-content')
  if (content) content.scrollTop = 0
  heading.value?.focus({ preventScroll: true })
}
async function check() {
  if (!turn.value || saving.value || feedback.value || (!answerId.value && !buildComplete.value)) return
  const current = turn.value
  const first = attempts.value === 0
  const outcome = answerId.value ? evaluateOffline(current.step, answerId.value) : {
    stepId: current.step.id, isCorrect: false, correctAnswerId: current.step.evaluation.correctAnswerId,
    feedbackTitle: 'Compare the phrase order',
    explanation: 'This checks the supplied phrase order. Other natural Arabic responses are not evaluated.',
    retryHint: current.step.evaluation.retryHint,
  }
  attempts.value++
  if (first && outcome.isCorrect) firstCorrect.value++
  feedback.value = outcome
  saving.value = true
  try { await saveReviewAttempt(props.scope, current.lesson, current.step.id, answerId.value, outcome.isCorrect, outcome.explanation, first) }
  catch { storageError.value = 'Review history could not be saved on this device. You can still finish and retry.' }
  finally { saving.value = false }
  playUiSound(outcome.isCorrect ? 'correct' : 'retry')
  await nextTick(); feedbackPanel.value?.focus()
}
async function retry() {
  retries.value++; answerId.value = null; buildComplete.value = false; feedback.value = null
  await nextTick(); focusTurn()
}
async function advance() {
  if (!feedback.value?.isCorrect || saving.value) return
  if (helped.value) helpedTurns.value++
  if (index.value < queue.value.length - 1) {
    index.value++; resetTurn(); await nextTick(); focusTurn(); return
  }
  stopAudio(); saving.value = true
  const result: CheckpointResult = { completedAt: new Date().toISOString(), total: queue.value.length, firstCorrect: firstCorrect.value, helped: helpedTurns.value }
  try {
    if (kind.value === 'checkpoint') {
      await saveDeviceSnapshot(resultKey.value, result)
      const unitId = queue.value[0]?.lesson.unitId
      if (unitId) results.value[unitId] = result
    }
    history.value = await getReviewHistory(props.scope)
  } catch { storageError.value = 'Practice complete. Some history could not be saved on this device.' }
  finally { saving.value = false }
  finished.value = true; playUiSound('complete')
  await nextTick(); finishHeading.value?.focus()
}

onMounted(() => { void refresh(); window.addEventListener('online', refresh) })
watch(open, value => emit('open-change', value))
watch(() => [props.scope, props.historyRevision, props.lessons.map(lesson => `${lesson.id}:${lesson.isCompleted}`).join('|')], () => {
  stopAudio(); open.value = false; document.body.style.overflow = ''; void refresh()
})
onBeforeUnmount(() => { generation++; stopAudio(); emit('open-change', false); document.body.style.overflow = ''; window.removeEventListener('online', refresh) })
</script>

<template>
  <section class="review-hub" aria-label="Review and checkpoints">
    <h2>Review</h2>
    <p class="review-status-note">History stays on this device.</p>
    <p v-if="loading" role="status">Preparing review…</p>
    <p v-if="notice" role="status">{{ notice }}</p>
    <p v-if="storageError" role="alert">{{ storageError }}</p>
    <div class="review-actions">
      <button type="button" class="primary-action" :disabled="loading || !turns.length" @click="start('mixed')">Mixed review</button>
      <button type="button" class="secondary-action" :disabled="loading || !mistakeCount" @click="start('mistakes')">Review mistakes ({{ mistakeCount }})</button>
    </div>
    <p v-if="!loading && !turns.length">Complete a lesson or try an exercise to begin review.</p>
    <article v-for="unit in units" :key="unit.id" class="checkpoint-card">
      <div><h3>{{ unit.title }} checkpoint</h3>
        <p v-if="!unit.complete">Complete the unit’s lessons to open its checkpoint.</p>
        <p v-else-if="!unit.available">Connect to download all of this unit’s lessons.</p>
        <p v-else>Try the exchange before revealing help. You can retry freely.</p>
        <p v-if="results[unit.id]" class="checkpoint-history">Last checkpoint: {{ results[unit.id]!.firstCorrect }} of {{ results[unit.id]!.total }} first answers matched · translations or choices used on {{ results[unit.id]!.helped }}.</p>
      </div>
      <button type="button" class="secondary-action" :disabled="loading || !unit.complete || !unit.available" :aria-label="`Start ${unit.title} checkpoint`" @click="start('checkpoint', unit.id)">Start checkpoint</button>
    </article>
  </section>

  <Teleport to="body">
  <div v-if="open" class="lesson-overlay" role="presentation" @click.self="close">
    <section class="lesson-sheet" role="dialog" aria-modal="true" aria-labelledby="review-title" @keydown.esc="close" @keydown="trapFocus">
      <header class="lesson-sheet-header">
        <h2 id="review-title">{{ kind === 'checkpoint' ? 'Unit checkpoint' : kind === 'mistakes' ? 'Mistake review' : 'Mixed review' }}</h2>
        <div class="lesson-header-controls"><SoundToggle /><button ref="closeButton" class="close-button" type="button" aria-label="Close review" :disabled="saving" @click="close">×</button></div>
      </header>
      <section class="practice-journey review-journey">
        <p class="review-stage">{{ finished ? 'Complete' : `Exchange ${index + 1} of ${queue.length}` }}</p>
        <LessonScroll>
          <div v-if="finished" class="lesson-state lesson-success">
            <span class="completion-mark"><Check :size="32" aria-hidden="true" /></span>
            <strong ref="finishHeading" tabindex="-1">{{ kind === 'checkpoint' ? 'Checkpoint complete' : 'Review complete' }}</strong>
            <p>{{ firstCorrect }} of {{ queue.length }} first answers matched the supplied responses.</p>
            <p>Translations or choices used on {{ helpedTurns }} exchange{{ helpedTurns === 1 ? '' : 's' }}. Word pieces and choices are guided practice, not a test of spontaneous conversation.</p>
            <p v-if="storageError" role="alert">{{ storageError }}</p>
          </div>
          <LessonTransition v-else-if="turn" @after-enter="element => { element.removeAttribute('inert'); focusTurn() }">
            <div :key="`${turn.lesson.id}-${turn.step.id}`" class="practice-page" :data-review-step="turn.step.id" :data-review-lesson="turn.lesson.id">
              <p class="review-origin">{{ turn.lesson.title }} · {{ turn.lesson.version }} · {{ turn.lesson.reviewStatus === 'demonstrative' ? 'Demonstration' : 'Owner-approved · no native-expert review' }}</p>
              <p v-if="turn.step.characters" class="review-scene">{{ turn.lesson.scenario }}</p>
              <CharacterCue :roles="turn.step.characters" :registry-version="turn.lesson.characters?.registryVersion" />
              <div class="scenario-panel"><div>
                <p class="arabic-prompt" lang="ar" dir="rtl">{{ turn.step.prompt.arabic }}</p>
                <p class="arabizi-prompt">{{ turn.step.prompt.arabizi }}</p>
                <p v-if="promptHelp || feedback" class="prompt-meaning">{{ turn.step.prompt.meaning }}</p>
                <button v-if="!feedback" type="button" class="text-button" :aria-expanded="promptHelp" @click="promptHelp = !promptHelp; helped = true">{{ promptHelp ? 'Hide prompt translation' : 'Translate prompt' }}</button>
                <button v-if="turn.step.prompt.audioUrl" type="button" class="text-button" data-ui-sound="silent" @click="playAudio">Play recorded prompt</button>
                <details v-if="turn.step.prompt.recording" class="recording-details"><summary>Recording transcript and source</summary>
                  <p>Recorded · {{ turn.step.prompt.recording.speaker }} · {{ turn.step.prompt.recording.dialect === 'jordanian' ? 'Jordanian variant' : 'Urban Palestinian' }}</p>
                  <p lang="ar" dir="rtl">{{ turn.step.prompt.recording.transcript }}</p><p>Source: {{ turn.step.prompt.recording.sourceLocator }}</p>
                </details>
                <p v-if="audioError" role="alert">{{ audioError }}</p>
              </div></div>
              <h3 ref="heading" tabindex="-1" class="practice-instruction">{{ turn.step.instruction }}</h3>
              <div v-if="mode === 'recall'" class="recall-panel"><h4>Try a response from memory</h4><p>Say it aloud, or form it in your head. Then use pieces or choices to check.</p></div>
              <template v-else-if="mode === 'build'">
                <PhraseBuilder :key="`${turn.lesson.id}-${turn.step.id}-${retries}`" :step="turn.step" :disabled="Boolean(feedback) || saving" @select="(id, complete) => { answerId = id; buildComplete = complete }" />
                <button v-if="!feedback" type="button" class="text-button" @click="reveal('choose')">Use response choices instead</button>
              </template>
              <fieldset v-else class="answer-group" :disabled="Boolean(feedback) || saving"><legend class="sr-only">Response choices</legend>
                <button v-for="answer in turn.step.answers" :key="answer.id" type="button" class="answer-option" :aria-pressed="answerId === answer.id" :class="{ selected: answerId === answer.id, correct: feedback && feedback.correctAnswerId === answer.id, incorrect: feedback && !feedback.isCorrect && answerId === answer.id }" @click="answerId = answer.id">
                  <span class="answer-copy"><span class="answer-arabic" lang="ar" dir="rtl">{{ answer.arabic }}</span><span class="answer-arabizi">{{ answer.arabizi }}</span><span v-if="answerHelp || feedback" class="answer-meaning">{{ answer.meaning }}</span></span>
                  <Check v-if="feedback && feedback.correctAnswerId === answer.id" :size="21" aria-label="Correct answer" />
                </button>
              </fieldset>
              <button v-if="mode === 'choose' && !feedback" class="text-button" type="button" :aria-expanded="answerHelp" @click="answerHelp = !answerHelp; helped = true">{{ answerHelp ? 'Hide response translations' : 'Translate response choices' }}</button>
              <div v-if="feedback" ref="feedbackPanel" tabindex="-1" class="feedback-panel" :class="feedback.isCorrect ? 'positive' : 'try-again'" aria-live="polite">
                <CharacterCue :roles="turn.step.characters" :registry-version="turn.lesson.characters?.registryVersion" feedback />
                <strong>{{ feedback.feedbackTitle }}</strong>
                <p v-if="!feedback.isCorrect && answerId">Your response: <span lang="ar" dir="rtl">{{ turn.step.answers.find(answer => answer.id === answerId)?.arabic }}</span></p>
                <div class="feedback-model"><p lang="ar" dir="rtl">{{ model?.arabic }}</p><p>{{ model?.arabizi }}</p><p>{{ model?.meaning }}</p></div>
                <p>{{ feedback.explanation }}</p><p v-if="!feedback.isCorrect">{{ feedback.retryHint }}</p>
              </div>
              <details v-if="kind === 'mistakes' && turn.history?.needsReview && feedback" class="review-previous"><summary>Previous mistake</summary><p v-if="turn.history.answerId"><span lang="ar" dir="rtl">{{ turn.step.answers.find(answer => answer.id === turn.history?.answerId)?.arabic }}</span></p><p>{{ turn.history.explanation }}</p></details>
              <details v-if="turn.lesson.introduction" class="recording-details"><summary>Lesson sources</summary><p>{{ turn.lesson.introduction.dialectNote }}</p><p v-for="source in turn.lesson.introduction.sourceLocators" :key="source">{{ source }}</p></details>
              <p v-if="storageError" role="alert">{{ storageError }}</p>
            </div>
          </LessonTransition>
        </LessonScroll>
        <footer class="lesson-actions" aria-label="Review navigation">
          <button v-if="finished" class="primary-action" type="button" @click="close">Back to practice</button>
          <template v-else-if="mode === 'recall'">
            <button class="primary-action" type="button" @click="reveal('build')">Build response</button>
            <button class="text-button" type="button" @click="reveal('choose')">Show response choices</button>
          </template>
          <button v-else-if="feedback && !feedback.isCorrect" class="secondary-action" type="button" :disabled="saving" @click="retry"><RotateCcw :size="18" aria-hidden="true" /> Try again</button>
          <button v-else-if="feedback" class="primary-action" type="button" :disabled="saving" @click="advance">{{ index === queue.length - 1 ? 'Finish review' : 'Next exchange' }}<ChevronRight :size="20" aria-hidden="true" /></button>
          <button v-else class="primary-action" type="button" data-ui-sound="feedback" :disabled="(!answerId && !buildComplete) || saving" @click="check">Check answer</button>
        </footer>
      </section>
    </section>
  </div>
  </Teleport>
</template>
