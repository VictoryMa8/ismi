<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { ApiRequestError, getLesson } from './api'
import { cacheLesson, getCachedLesson, getDeviceSnapshot, saveDeviceSnapshot, removeCachedLesson } from './offline'
import { placementQuestions, placementRecommendation, placementStorageKey, placementVersion,
  type PlacementAnswer, type PlacementQuestion, type PlacementResult } from './placement'
import { courseFor, textAttributes } from './courses'
import { studyTracks, type TrackId } from './studyPlan'
import type { CourseLessonSummary } from './types'

const props = defineProps<{ scope: string; selectedTrackIds: TrackId[]; lessons: CourseLessonSummary[]; courseId: TrackId }>()
const emit = defineEmits<{ 'open-lesson': [id: string] }>()
const stage = ref<'idle' | 'support' | 'questions' | 'result'>('idle')
const questions = ref<PlacementQuestion[]>([])
const answers = ref<PlacementAnswer[]>([])
const result = ref<PlacementResult>()
const busy = ref(false)
const notice = ref('')
const readingSupport = ref(true)
const soundSupport = ref(true)
const help = ref(false)
const selected = ref('')
const feedback = ref(false)
const heading = ref<HTMLElement>()
const questionHeading = ref<HTMLElement | null>(null)
const feedbackHeading = ref<HTMLElement | null>(null)
let generation = 0
const question = computed(() => questions.value[answers.value.length - (feedback.value ? 1 : 0)])
const currentAnswer = computed(() => answers.value.at(-1))
const available = computed(() => props.lessons.some(l => (l.trackId ?? 'levantine') === props.courseId && l.reviewStatus !== 'demonstrative'))
const recommendationAvailable = computed(() => result.value?.recommendation
  && props.lessons.some(l => l.id === result.value?.recommendation?.lessonId && l.reviewStatus !== 'demonstrative'))
async function focusHeading() {
  await nextTick()
  const target = stage.value === 'questions' ? (feedback.value ? feedbackHeading.value : questionHeading.value) : heading.value
  target?.focus({ preventScroll: true })
  target?.scrollIntoView({ behavior: 'instant', block: 'start' })
}
async function persist(value: PlacementResult) {
  const token = generation
  const key = placementStorageKey(props.scope, props.courseId)
  result.value = value
  stage.value = 'result'
  busy.value = true
  notice.value = 'Saving result…'
  try {
    await saveDeviceSnapshot(key, value)
    if (token === generation) notice.value = 'Result saved on this device.'
  }
  catch { if (token === generation) notice.value = 'Result could not be saved. It remains available until you leave this page.' }
  if (token === generation) { busy.value = false; await focusHeading() }
}
async function skip() {
  generation++
  busy.value = false
  notice.value = ''
  await persist({ policyVersion: placementVersion, trackId: props.courseId, completedAt: new Date().toISOString(),
    skipped: true, readingSupport: false, soundSupport: false, answers: [] })
}
async function start() {
  const token = ++generation
  busy.value = true
  notice.value = ''
  questions.value = []; answers.value = []; help.value = false; selected.value = ''; feedback.value = false
  readingSupport.value = true; soundSupport.value = true
  const candidates = props.lessons.filter(l => (l.trackId ?? 'levantine') === props.courseId && l.reviewStatus !== 'demonstrative')
    .sort((a, b) => a.courseOrder - b.courseOrder || a.id.localeCompare(b.id)).slice(0, 3)
  const packages = []
  for (const item of candidates) {
    try {
      let lesson
      if (navigator.onLine) {
        try {
          lesson = await getLesson(item.id)
          if (token !== generation) return
          try { await cacheLesson(lesson) } catch { notice.value = 'Some lessons could not be saved for offline use.' }
        } catch (error) {
          if (token !== generation) return
          if (error instanceof ApiRequestError && [403, 404, 410].includes(error.status)) {
            try { await removeCachedLesson(item.id) } catch { /* Do not use withdrawn content. */ }
            continue
          }
          lesson = await getCachedLesson(item.id)
        }
      } else lesson = await getCachedLesson(item.id)
      if (token !== generation) return
      if (lesson) packages.push(lesson)
    } catch { /* Missing content makes this check unavailable rather than shortening it. */ }
  }
  if (token !== generation) return
  const picked = placementQuestions(packages, props.courseId)
  busy.value = false
  if (candidates.length !== 3 || packages.length !== 3 || picked.length !== 6) {
    notice.value = 'This check needs the first three published lessons with explanations. Connect and download them, or skip for now.'
    stage.value = 'idle'
    return
  }
  questions.value = picked
  stage.value = 'support'
  await focusHeading()
}
async function answer() {
  const q = question.value
  if (!q || !selected.value || feedback.value) return
  answers.value.push({ lessonId: q.lessonId, version: q.version, stepId: q.step.id, answerId: selected.value,
    correct: selected.value === q.step.evaluation.correctAnswerId, help: help.value, sources: [...q.sources] })
  feedback.value = true
  await focusHeading()
}
async function advance() {
  if (answers.value.length === questions.value.length) {
    await persist({ policyVersion: placementVersion, trackId: props.courseId, completedAt: new Date().toISOString(),
      skipped: false, readingSupport: readingSupport.value, soundSupport: soundSupport.value,
      answers: [...answers.value], recommendation: placementRecommendation(questions.value, answers.value) })
  } else { feedback.value = false; selected.value = ''; help.value = false; await focusHeading() }
}
watch(() => [props.scope, props.courseId], async () => {
  const token = ++generation
  stage.value = 'idle'; result.value = undefined; questions.value = []; answers.value = []; busy.value = false; notice.value = ''
  try {
    const saved = await getDeviceSnapshot<PlacementResult>(placementStorageKey(props.scope, props.courseId))
    if (token === generation && saved?.policyVersion === placementVersion && saved.trackId === props.courseId) {
      result.value = saved; stage.value = 'result'
    }
  } catch { if (token === generation) notice.value = 'Device storage unavailable. You can still try the check.' }
}, { immediate: true, flush: 'sync' })
watch(() => props.selectedTrackIds.includes(props.courseId), () => { generation++; busy.value = false; stage.value = result.value ? 'result' : 'idle' })
onBeforeUnmount(() => { generation++ })
</script>

<template>
  <section class="placement-check" aria-labelledby="placement-title" :aria-busy="busy">
    <h2 id="placement-title" ref="heading" tabindex="-1">Find your starting point</h2>
    <p>Optional check for this course. Results stay on this device.</p>
    <template v-for="track in studyTracks.filter(t => t.id === courseId)" :key="track.id">
      <h3>{{ track.name }}</h3>
      <p v-if="!available">Placement and reading/sound modules not yet available.</p>
      <template v-else>
        <template v-if="stage === 'idle'">
          <p>Six contextual questions from published lessons. Use pronunciation help if you need it. No listening or speaking required.</p>
          <p v-if="!available">Placement content not yet available.</p>
          <button class="primary-action" :disabled="busy || !available" @click="start">{{ busy ? 'Loading check…' : courseId === 'levantine' ? 'Start Levantine check' : 'Start check' }}</button>
          <button class="secondary-action" @click="skip">Skip for now</button>
        </template>
        <form v-else-if="stage === 'support'" @submit.prevent="stage = 'questions'; focusHeading()">
          <fieldset><legend>Reading and sound support</legend>
            <label><input v-model="readingSupport" type="checkbox" /> I would like help reading {{ courseFor(courseId).languageName }} script</label>
            <label><input v-model="soundSupport" type="checkbox" /> I would like help with {{ courseFor(courseId).languageName }} sounds</label>
          </fieldset>
          <p>These are your preferences, not assessed skills.</p>
          <button class="primary-action" type="submit">Begin questions</button>
          <button class="secondary-action" type="button" @click="skip">Skip for now</button>
        </form>
        <template v-else-if="stage === 'questions' && question">
          <h4 :ref="el => { questionHeading = el as HTMLElement | null }" tabindex="-1">Question {{ answers.length + (feedback ? 0 : 1) }} of {{ questions.length }} · {{ question.title }}</h4>
          <details open class="placement-context"><summary>Conversation context</summary>
            <ul aria-label="Placement dialogue">
              <li v-for="(turn, index) in question.dialogue" :key="index">
                <strong>{{ turn.speaker }}</strong><span class="placement-arabic" v-bind="textAttributes(courseId)">{{ turn.line.arabic }}</span>
                <template v-if="help"><p dir="ltr">{{ turn.line.arabizi }}</p><p>{{ turn.line.meaning }}</p></template>
              </li>
            </ul>
          </details>
          <p>{{ question.step.instruction }}</p>
          <p class="placement-arabic" v-bind="textAttributes(courseId)">{{ question.step.prompt.arabic }}</p>
          <button v-if="!help && !feedback" class="secondary-action" @click="help = true">Show pronunciation help and meanings</button>
          <template v-if="help"><p dir="ltr">{{ question.step.prompt.arabizi }}</p><p>{{ question.step.prompt.meaning }}</p></template>
          <form @submit.prevent="answer">
            <fieldset :disabled="feedback"><legend>Choose a response</legend>
              <label v-for="option in question.step.answers" :key="option.id">
                <input v-model="selected" type="radio" name="placement-answer" :value="option.id" />
                <span><span class="placement-arabic" v-bind="textAttributes(courseId)">{{ option.arabic }}</span><template v-if="help"><br />{{ option.arabizi }}<br />{{ option.meaning }}</template></span>
              </label>
            </fieldset>
            <button v-if="!feedback" class="primary-action" type="submit" :disabled="!selected">Check response</button>
          </form>
          <div v-if="feedback" role="status">
            <h4 :ref="el => { feedbackHeading = el as HTMLElement | null }" tabindex="-1">{{ currentAnswer?.correct ? question.step.evaluation.correctTitle : question.step.evaluation.incorrectTitle }}</h4>
            <p v-if="question.step.answers.find(a => a.id === currentAnswer?.answerId)?.rationale !== question.step.evaluation.correctExplanation">{{ question.step.answers.find(a => a.id === currentAnswer?.answerId)?.rationale }}</p>
            <p>{{ question.step.evaluation.correctExplanation }}</p>
            <p class="placement-arabic" v-bind="textAttributes(courseId)">{{ question.step.answers.find(a => a.id === question.step.evaluation.correctAnswerId)?.arabic }}</p>
            <button class="primary-action" @click="advance">{{ answers.length === questions.length ? 'See recommendation' : 'Next question' }}</button>
          </div>
          <details><summary>Lesson version and sources</summary><p>{{ question.version }} · {{ question.step.id }}</p><ul><li v-for="source in question.sources" :key="source"><bdi>{{ source }}</bdi></li></ul></details>
          <button class="secondary-action" @click="skip">Skip for now</button>
        </template>
        <template v-else-if="stage === 'result' && result">
          <p v-if="result.skipped">Check skipped. Start with the first lesson or explore Courses.</p>
          <template v-else>
            <p>{{ result.answers.filter(a => a.correct).length }} of {{ result.answers.length }} responses fit the context; {{ result.answers.filter(a => a.help).length }} used help.</p>
            <p v-if="result.recommendation">Suggested start: {{ result.recommendation.title }}</p>
            <p>Start where you needed practice or help. If all six fit without help, try the last sampled lesson. This is a suggestion, not a proficiency level.</p>
            <button v-if="recommendationAvailable" class="primary-action" @click="emit('open-lesson', result.recommendation!.lessonId)">Open suggested lesson</button>
            <p v-else>The suggested lesson is unavailable. Explore Courses or retry when connected.</p>
            <p v-if="result.readingSupport">Recommended support: script and reading. Bootcamp lessons not yet available; use pronunciation help and lesson help.</p>
            <p v-if="result.soundSupport">Recommended support: course sounds. Sound bootcamp not yet available; pronunciation has not been assessed.</p>
            <p v-if="result.recommendation"><small>Based on {{ result.recommendation.version }}. Retry after content changes.</small></p>
          </template>
          <button class="secondary-action" :disabled="busy || !available" @click="start">{{ busy ? 'Loading check…' : courseId === 'levantine' ? 'Retry Levantine check' : 'Retry check' }}</button>
        </template>
      </template>
    </template>
    <p v-if="notice" role="status">{{ notice }}</p>
  </section>
</template>

<style scoped>
.placement-check { margin: 1.5rem 0; padding: 1.25rem; border: 1px solid #738d7b; border-radius: 1rem; background: white; color: #192b23; }
h2 { margin-top: 0; }
fieldset { border: 0; padding: 0; min-width: 0; margin: 1rem 0; }
legend { font-weight: 700; }
label { display: flex; align-items: start; gap: .6rem; padding: .7rem 0; min-height: 44px; }
input { flex-shrink: 0; width: 1.2rem; height: 1.2rem; accent-color: #12613f; }
.placement-arabic { display: block; font-size: 1.5em; line-height: 1.8; }
button { margin: .3rem .4rem .3rem 0; scroll-margin-block: 90px; }
h2, h4 { scroll-margin-top: 20px; }
p, li, span { overflow-wrap: anywhere; }
summary { cursor: pointer; padding: .7rem 0; }
</style>
