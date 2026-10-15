<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { ApiRequestError, getLesson } from './api'
import { cacheLesson, getCachedLesson, getReviewHistory, removeCachedLesson, saveReviewAttempt } from './offline'
import { getRecallEvidence, saveRecallEvidence, queueRecallReport, flushRecallReports, getPendingRecallReports, discardRecallReport, type RecallEvidence, type QueuedRecallReport, type RecallResult } from './recallStorage'
import { recallQueue, recallStepId, type RecallTurn } from './recallQueue'
import { evaluateRecall } from './recallEvaluation'
import type { CourseLessonSummary, LessonResponse } from './types'
import LessonScroll from './LessonScroll.vue'
import LessonTransition from './LessonTransition.vue'
import SoundToggle from './SoundToggle.vue'
import { playUiSound } from './uiSounds'
import { reviewDueAt } from './reviewSchedule'
import CanDoProgress from './CanDoProgress.vue'
import { PenLine } from '@lucide/vue'

const props = defineProps<{ scope: string; lessons: CourseLessonSummary[]; historyRevision: number; view?: 'hidden' | 'tile' | 'recall' | 'can-do' }>()
const hubView = computed(() => props.view ?? 'recall')
const hubTarget = computed(() => ({ tile: '#practice-hub', recall: '#practice-recall', 'can-do': '#progress-cando' })[hubView.value as 'tile' | 'recall' | 'can-do'] ?? '')
const emit = defineEmits<{ 'open-change': [open: boolean] }>()
const packages = ref<LessonResponse[]>([])
const savedEvidence = ref<RecallEvidence[]>([])
const savedHistory = ref<Awaited<ReturnType<typeof getReviewHistory>>>([])
const now = ref(Date.now())
const available = computed(() => recallQueue(packages.value, savedEvidence.value, savedHistory.value, now.value))
const dueTargets = computed(() => available.value.filter(item => item.due).length)
let clock: ReturnType<typeof setInterval> | undefined
const loading = ref(true)
const error = ref('')
const notice = ref('')
const pending = ref<QueuedRecallReport[]>([])
const open = ref(false)
const finished = ref(false)
const queue = ref<RecallTurn[]>([])
const index = ref(0)
const turn = computed(() => queue.value[index.value])
const evidence = ref<RecallEvidence | null>(null)
const answer = ref('')
const inputMode = ref<'arabic' | 'arabizi'>('arabizi')
const result = ref<{ kind: RecallResult; explanation: string } | null>(null)
const help = ref<'none' | 'hint' | 'model'>('none')
const busy = ref(false)
const reportExplanation = ref('')
const reportForm = ref(false)
const reportSaved = ref(false)
const reportId = ref('')
const heading = ref<HTMLElement | null>(null)
const dialog = ref<HTMLElement | null>(null)
const field = ref<HTMLTextAreaElement | null>(null)
const closeButton = ref<HTMLButtonElement | null>(null)
let opener: HTMLElement | null = null
let returnFocusScope: string | null = null
let generation = 0
let sessionScope = ''
const independent = ref(0)
const total = ref(0)

async function refresh() {
  if (open.value) return
  const token = ++generation
  const scope = props.scope
  loading.value = true; error.value = ''; notice.value = ''
  try {
    const saved = await getRecallEvidence(scope)
    const history = await getReviewHistory(scope)
    const loaded: LessonResponse[] = []
    let missing = false
    for (const item of props.lessons.filter(l => l.isCompleted && l.reviewStatus !== 'demonstrative')) {
      let lesson: LessonResponse | undefined
      try {
        if (!navigator.onLine) throw new Error('Offline')
        lesson = await getLesson(item.id)
        await cacheLesson(lesson)
      } catch (caught) {
        if (caught instanceof ApiRequestError && [403, 404, 410].includes(caught.status)) await removeCachedLesson(item.id)
        else { lesson ??= await getCachedLesson(item.id); missing ||= !lesson }
      }
      if (token !== generation || scope !== props.scope) return
      if (lesson?.trackId === 'levantine' && lesson.recall?.length) loaded.push(lesson)
    }
    if (token !== generation || scope !== props.scope) return
    packages.value = loaded; savedEvidence.value = saved; savedHistory.value = history; now.value = Date.now()
    if (missing) notice.value = 'Connect to download recall practice for completed lessons.'
    await flushRecallReports(scope)
    if (token !== generation || scope !== props.scope) return
    pending.value = await getPendingRecallReports(scope)
  } catch { if (token === generation) {
    packages.value = []; savedEvidence.value = []; savedHistory.value = []
    error.value = 'Device storage is unavailable. Recall evidence and reports cannot be saved.'
  } }
  finally { if (token === generation) loading.value = false }
}
async function showTurn() {
  const current = turn.value
  if (!current) return
  const scope = sessionScope
  answer.value = ''; result.value = null; help.value = 'none'; reportForm.value = false; reportSaved.value = false
  reportExplanation.value = ''; reportId.value = crypto.randomUUID()
  const entry: RecallEvidence = {
    id: crypto.randomUUID(), scope, lessonId: current.lesson.id, version: current.lesson.version,
    targetId: current.target.id, variantId: current.variant.id, shownAt: new Date().toISOString(), completedAt: null,
    firstResult: null, firstHelped: false, helped: false, repeated: current.repeated, attempts: [],
    reviewDueAt: null,
  }
  evidence.value = entry
  try {
    const prior = (await getReviewHistory(scope)).find(h => h.lessonId === current.lesson.id &&
      h.version === current.lesson.version && h.stepId === recallStepId(current.target))
    entry.reviewDueAt = prior ? new Date(reviewDueAt(prior)).toISOString() : null
    await saveRecallEvidence(entry)
  }
  catch { if (scope === props.scope) error.value = 'This prompt could not be saved. Practice remains available; no evidence is claimed.' }
  if (scope !== props.scope) return
  await nextTick(); focusHeading()
}
async function start(lessonId?: string, targetId?: string) {
  if (loading.value || busy.value || !available.value.length) return
  opener = document.activeElement as HTMLElement
  returnFocusScope = null
  sessionScope = props.scope
  queue.value = lessonId ? available.value.filter(t => t.lesson.id === lessonId && t.target.id === targetId) : available.value.slice(0, 6)
  if (!queue.value.length) return
  index.value = 0; finished.value = false; independent.value = 0; total.value = 0
  open.value = true; document.body.style.overflow = 'hidden'
  busy.value = true
  try { await showTurn() } finally { busy.value = false }
  await nextTick(); closeButton.value?.focus()
}
async function close() {
  if (busy.value) return
  open.value = false; answer.value = ''; reportExplanation.value = ''; queue.value = []; evidence.value = null
  returnFocusScope = props.scope
  document.body.style.overflow = ''; await refresh(); await nextTick()
  await restoreOpenerFocus()
}
async function restoreOpenerFocus() {
  if (returnFocusScope !== props.scope || open.value || loading.value || busy.value) return
  await nextTick()
  if (returnFocusScope !== props.scope || open.value || loading.value || busy.value) return
  returnFocusScope = null
  // A newer refresh may supersede close()'s refresh. Restore only when that
  // refresh settles, and do not steal focus if the learner has already moved on.
  const active = document.activeElement
  if (active !== document.body && active?.id !== 'main-content') return
  if (opener?.isConnected && !opener.matches(':disabled')) opener.focus()
}
watch([loading, busy], () => void restoreOpenerFocus())
function focusHeading() {
  const content = heading.value?.closest<HTMLElement>('.lesson-content')
  if (content) content.scrollTop = 0
  heading.value?.focus({ preventScroll: true })
}
function trap(event: KeyboardEvent) {
  if (event.key !== 'Tab') return
  const controls = [...(dialog.value?.querySelectorAll<HTMLElement>('button:not(:disabled),textarea:not(:disabled),select:not(:disabled),summary,a[href],[tabindex="0"]') ?? [])]
    .filter(e => e.getClientRects().length && !e.closest('[inert]'))
  if (event.shiftKey && document.activeElement === controls[0]) { event.preventDefault(); controls.at(-1)?.focus() }
  else if (!event.shiftKey && document.activeElement === controls.at(-1)) { event.preventDefault(); controls[0]?.focus() }
}
async function assistance(mode: 'hint' | 'model') {
  if (!evidence.value || busy.value) return
  help.value = mode; evidence.value.helped = true
  busy.value = true
  try { await saveRecallEvidence(evidence.value) }
  catch { error.value = 'Help use could not be saved; this session will not count as independent evidence.' }
  finally { busy.value = false }
}
async function check() {
  if (!turn.value || !evidence.value || !answer.value.trim() || busy.value || result.value) return
  busy.value = true
  const current = turn.value
  const entry = evidence.value
  const scope = sessionScope
  const attemptHelped = entry.helped
  const judged = evaluateRecall(current.target, answer.value, inputMode.value)
  result.value = judged
  const first = evidence.value.attempts.length === 0
  if (first) { evidence.value.firstResult = judged.kind; evidence.value.firstHelped = evidence.value.helped }
  evidence.value.attempts.push({ result: judged.kind, at: new Date().toISOString(), inputMode: inputMode.value, helped: evidence.value.helped })
  try {
    entry.helped = true // Feedback displays models; subsequent retries are assisted.
    await saveRecallEvidence(entry)
    await saveReviewAttempt(scope, current.lesson, recallStepId(current.target), null,
      judged.kind === 'accepted', judged.explanation, first, attemptHelped)
  } catch { error.value = 'This response could not be saved. No saved evidence is claimed; retry remains available.' }
  finally { busy.value = false }
  if (judged.kind === 'accepted') playUiSound('correct')
  await nextTick(); focusHeading()
}
async function retry() {
  result.value = null; answer.value = ''; reportForm.value = false
  await nextTick(); field.value?.focus()
}
async function next() {
  if (!evidence.value || busy.value) return
  busy.value = true
  const entry = evidence.value
  const scope = sessionScope
  entry.completedAt = new Date().toISOString()
  try {
    await saveRecallEvidence(entry)
    if (scope !== props.scope) { busy.value = false; return }
    if (evidence.value.firstResult) total.value++
    if (evidence.value.firstResult === 'accepted' && !evidence.value.firstHelped) independent.value++
  } catch { error.value = 'Session evidence could not be saved.' }
  if (scope !== props.scope) { busy.value = false; return }
  index.value++
  if (index.value >= queue.value.length) { finished.value = true; answer.value = ''; await nextTick(); focusHeading() }
  else await showTurn()
  busy.value = false
}
async function sendReport() {
  if (!turn.value || !answer.value.trim() || busy.value || reportSaved.value) return
  busy.value = true
  const scope = sessionScope
  const current = turn.value
  const report = { id: reportId.value, lessonId: current.lesson.id, version: current.lesson.version,
    targetId: current.target.id, variantId: current.variant.id, inputMode: inputMode.value,
    response: answer.value, explanation: reportExplanation.value }
  try {
    await queueRecallReport(scope, report)
    if (scope !== props.scope) return
    reportSaved.value = true; reportForm.value = false; reportExplanation.value = ''
    await flushRecallReports(scope)
    if (scope === props.scope) pending.value = await getPendingRecallReports(scope)
  } catch { if (scope === props.scope) error.value = 'Report could not be saved. Your answer remains available for comparison.' }
  finally { busy.value = false }
}
async function discard(id: string) {
  await discardRecallReport(props.scope, id); pending.value = await getPendingRecallReports(props.scope)
}
async function online() {
  const scope = props.scope
  try {
    await flushRecallReports(scope)
    if (scope === props.scope) pending.value = await getPendingRecallReports(scope)
  } catch { if (scope === props.scope) error.value = 'Saved reports could not be sent. They remain on this device.' }
  await refresh()
}
watch(open, value => emit('open-change', value))
watch(() => props.scope, () => {
  returnFocusScope = null
  generation++; open.value = false; document.body.style.overflow = ''; answer.value = ''; queue.value = []; evidence.value = null
  pending.value = []; packages.value = []; savedEvidence.value = []; savedHistory.value = []; void refresh()
})
watch(() => [props.lessons, props.historyRevision], () => void refresh())
function visibility() { if (document.visibilityState === 'visible') { now.value = Date.now(); void refresh() } }
onMounted(() => {
  void refresh(); window.addEventListener('online', online); document.addEventListener('visibilitychange', visibility)
  clock = setInterval(() => { now.value = Date.now() }, 60_000)
})
onBeforeUnmount(() => {
  generation++; window.removeEventListener('online', online); document.removeEventListener('visibilitychange', visibility)
  if (clock) clearInterval(clock)
  if (open.value) document.body.style.overflow = ''
})
</script>

<template>
  <Teleport v-if="hubTarget" :to="hubTarget">
    <a v-if="hubView === 'tile'" class="feature-tile accent-red tile-recall" href="#/practice/recall" :aria-label="`Recall and recombine, ${available.length} targets, ${dueTargets} due`">
      <span class="feature-badge" aria-hidden="true"><PenLine :size="18" /></span>
      <span class="feature-copy"><strong>Recall</strong><small>{{ dueTargets }} due</small></span>
      <span class="feature-count">{{ available.length }}</span>
    </a>
    <CanDoProgress v-else-if="hubView === 'can-do'" :scope="scope" :lessons="packages" :evidence="savedEvidence" :history="savedHistory"
      :now="now" :loading="loading" @practice="start" />
    <section v-else class="review-hub" aria-label="Recall and recombine">
      <h2>Recall and recombine</h2>
      <p v-if="loading" role="status">Loading recall practice…</p>
      <p v-else-if="!available.length">Complete a lesson with published recall practice to begin.</p>
      <p v-else>{{ available.length }} targets available · {{ dueTargets }} due</p>
      <button class="primary-action" :disabled="loading || busy || !available.length" @click="start()">Start typed recall</button>
      <p v-if="notice" role="status">{{ notice }}</p>
      <p v-if="error && !open" role="alert">{{ error }}</p>
      <div v-for="item in pending" :key="item.report.id">
        <p role="status">{{ item.error || 'Recall report waiting to send when you reconnect.' }}</p>
        <button class="text-button" @click="discard(item.report.id)">Discard saved report</button>
      </div>
    </section>
  </Teleport>
  <Teleport to="body">
    <div v-if="open" class="lesson-overlay" @click.self="close">
      <section ref="dialog" class="lesson-sheet" role="dialog" aria-modal="true" aria-labelledby="recall-title" @keydown.esc="close" @keydown="trap">
        <header class="lesson-sheet-header">
          <h2 id="recall-title">Recall and recombine</h2>
          <div class="lesson-header-controls"><SoundToggle /><button ref="closeButton" class="close-button" :disabled="busy" aria-label="Close recall" @click="close">×</button></div>
        </header>
        <div class="practice-topline"><span>{{ finished ? 'Complete' : `Target ${index + 1} of ${queue.length}` }}</span></div>
        <LessonScroll>
          <LessonTransition @after-enter="focusHeading">
            <div v-if="finished" key="finished" class="practice-page">
              <h3 ref="heading" tabindex="-1">Recall complete</h3>
              <p>{{ independent }} of {{ total }} first answers matched without help.</p>
              <p>Written recall on this device. This does not assess speaking.</p>
              <button class="primary-action" @click="close">Back to practice</button>
            </div>
            <div v-else-if="turn" :key="`${turn.lesson.id}:${turn.variant.id}`" class="practice-page recall-page" :data-recall-target="turn.target.id" :data-recall-variant="turn.variant.id">
              <p class="review-origin">{{ turn.lesson.title }}</p>
              <p>{{ turn.repeated ? 'Repeated situation' : turn.variant.reservedForLater ? 'New situation · later review' : 'New situation' }}</p>
              <h3 ref="heading" tabindex="-1">{{ turn.variant.situation }}</h3>
              <p>{{ turn.target.dialect === 'palestinian-urban' ? 'Urban Palestinian' : 'Jordanian' }} · {{ turn.target.register }}</p>
              <p v-if="error" role="alert">{{ error }}</p>
              <label for="recall-input-mode">Write in</label>
              <select id="recall-input-mode" v-model="inputMode" :disabled="!!result || busy"><option value="arabizi">Arabizi / transliteration</option><option value="arabic">Arabic</option></select>
              <label for="recall-answer">Your response</label>
              <textarea id="recall-answer" ref="field" v-model="answer" :lang="inputMode === 'arabic' ? 'ar' : 'en'" :dir="inputMode === 'arabic' ? 'rtl' : 'ltr'" :disabled="!!result || busy" maxlength="500" rows="3" autocomplete="off" autocorrect="off" spellcheck="false" />
              <p class="review-origin">Your typed response is kept only for this session unless you send a report.</p>
              <div class="review-actions"><button class="secondary-action" :disabled="busy" @click="assistance('hint')">Hint</button><button class="secondary-action" :disabled="busy" @click="assistance('model')">Show model</button></div>
              <p v-if="help === 'hint'">{{ turn.target.hint }}</p>
              <div v-if="help === 'model' || result" class="recall-models">
                <h4>Accepted responses</h4>
                <p v-for="model in turn.target.acceptedAnswers" :key="model.arabic"><span class="arabic-prompt" lang="ar" dir="rtl">{{ model.arabic }}</span><br>{{ model.arabizi }}<br>{{ model.meaning }}<br>{{ model.rationale }}</p>
              </div>
              <div v-if="result" class="feedback-panel" role="status">
                <h4>{{ result.kind === 'accepted' ? 'That fits.' : result.kind === 'context-error' ? 'Check the situation.' : 'Unable to judge.' }}</h4>
                <p>{{ result.explanation }}</p>
                <p v-if="evidence?.firstHelped">Help used before the first response.</p>
                <button class="secondary-action" :disabled="busy" @click="retry">Try again</button>
                <button v-if="!reportSaved" class="text-button" :disabled="busy" @click="reportForm = !reportForm">Report this answer</button>
              </div>
              <div v-if="reportForm" class="recall-report-form">
                <label for="recall-report-note">Why should this response fit? (optional)</label>
                <textarea id="recall-report-note" v-model="reportExplanation" maxlength="500" rows="2" />
                <p>Send your response, optional explanation, and this exercise’s version/source context to the curriculum reviewer. No account identity is included. Offline reports stay on this device until sent or discarded.</p>
                <button class="secondary-action" :disabled="busy" @click="sendReport">Send answer for review</button>
              </div>
              <p v-if="reportSaved" role="status">{{ pending.some(p => p.report.id === reportId) ? 'Report saved on this device; it will send when connected.' : 'Report sent for review.' }}</p>
              <details v-if="result"><summary>Target and sources</summary><p>{{ turn.lesson.version }}</p><p>{{ turn.target.intent }}</p><p>Required concepts: {{ turn.target.requiredConcepts.join(', ') }}</p><p v-for="source in turn.target.sourceLocators" :key="source">{{ source }}</p></details>
            </div>
          </LessonTransition>
        </LessonScroll>
        <footer v-if="!finished" class="lesson-actions">
          <button v-if="!result" class="primary-action" :disabled="busy || !answer.trim()" @click="check">Check response</button>
          <button v-else class="primary-action" :disabled="busy" @click="next">{{ index === queue.length - 1 ? 'Finish recall' : 'Next target' }}</button>
          <button v-if="!result" class="text-button" :disabled="busy" @click="next">Skip target</button>
        </footer>
      </section>
    </div>
  </Teleport>
</template>
