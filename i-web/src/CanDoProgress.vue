<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { canDoLabels, deriveCanDo, outcomeAchievement, type CanDoCard } from './canDo'
import { getCanDoPreferences, recordCanDoAchievement, setCanDoAchievementDisplay, type CanDoPreferences } from './canDoStorage'
import type { RecallEvidence } from './recallStorage'
import type { ReviewHistory } from './offline'
import type { LessonResponse } from './types'

const props = defineProps<{ scope: string; lessons: LessonResponse[]; evidence: RecallEvidence[]; history: ReviewHistory[]; now: number; loading: boolean }>()
const emit = defineEmits<{ practice: [lessonId: string, targetId: string] }>()
const cards = computed(() => deriveCanDo(props.scope, props.lessons, props.evidence, props.history, props.now))
const currentAchievement = computed(() => outcomeAchievement(cards.value))
const preferences = ref<CanDoPreferences>({ showAchievements: true, achievements: [] })
const error = ref('')
const saving = ref(false)
const loadingPreferences = ref(true)
let generation = 0
let loadedScope = ''
const date = (value: string | number) => Number.isFinite(typeof value === 'number' ? value : Date.parse(value))
  ? new Date(value).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : 'Date unavailable'
function action(card: CanDoCard): string {
  if (!card.current.some(e => e.attempts.length)) return 'Try typed recall'
  return card.due ? 'Review now' : 'Practice again'
}
function facts(entry: RecallEvidence): string {
  if (!entry.attempts.length) return 'Shown; no response'
  const outcome = entry.firstResult === 'accepted' ? 'Matched' : entry.firstResult === 'context-error' ? 'Context mismatch' : 'Unable to judge'
  return `${outcome} · ${entry.firstHelped || entry.attempts[0]?.helped ? 'Help before first response' : 'No help before first response'} · ${entry.attempts.length - 1} retries`
}
async function refreshPreferences() {
  const token = ++generation
  const scope = props.scope
  loadingPreferences.value = true; error.value = ''
  if (loadedScope !== scope) {
    preferences.value = { showAchievements: true, achievements: [] }
    loadedScope = scope
  }
  try {
    const earned = currentAchievement.value
    const value = earned ? await recordCanDoAchievement(scope, earned) : await getCanDoPreferences(scope)
    if (token === generation && scope === props.scope) preferences.value = value
  } catch { if (token === generation) error.value = 'Achievement settings and history could not be saved on this device.' }
  finally { if (token === generation) loadingPreferences.value = false }
}
async function toggle(event: Event) {
  const scope = props.scope
  saving.value = true
  try {
    const value = await setCanDoAchievementDisplay(scope, (event.target as HTMLInputElement).checked)
    if (scope === props.scope) preferences.value = value
  } catch { if (scope === props.scope) error.value = 'Achievement display preference could not be saved.' }
  finally { saving.value = false }
}
watch(() => [props.scope, currentAchievement.value?.id], refreshPreferences, { immediate: true })
</script>

<template>
  <section class="can-do-progress review-hub" aria-labelledby="can-do-title">
    <h2 id="can-do-title">What you can do</h2>
    <p>Everyday conversations · Levantine · Written recall on this device</p>
    <p v-if="loading" role="status">Loading progress…</p>
    <div v-show="!loading" class="can-do-cards">
      <article v-for="card in cards" :key="card.targetId" class="can-do-card" :data-can-do="card.targetId">
        <h3>{{ card.title }}</h3>
        <p class="can-do-state">{{ canDoLabels[card.state] }}</p>
        <p v-if="card.lesson">{{ card.lesson.version }} · {{ card.target?.dialect === 'palestinian-urban' ? 'Urban Palestinian' : card.target?.dialect }} · {{ card.target?.register }}</p>
        <p v-if="!card.lesson">Current practice is unavailable here. Complete and download the published lesson to use this target.</p>
        <p v-if="card.historical.length">Evidence from earlier or unavailable content is preserved. Current content needs fresh practice; this does not mean you lost ability.</p>
        <p v-if="card.supporting.length">Evidence: {{ card.supporting.map(e => date(e.attempts[0]!.at)).join(' and ') }}</p>
        <p v-if="card.lesson && card.current.some(e => e.attempts.length)">
          {{ card.due ? 'Due for review' : `Review due ${date(card.nextDueAt)}` }}
        </p>
        <p v-if="card.state === 'independent'">Try a different situation when review is due, at least 24 hours after your independent response.</p>
        <button class="primary-action" :disabled="!card.lesson" :aria-label="`${action(card)}: ${card.title}`" @click="emit('practice', card.lessonId, card.targetId)">{{ action(card) }}</button>
        <details class="can-do-evidence">
          <summary>Attempts and sources</summary>
          <p>Arabic / Arabizi typed responses. Speaking and listening are not assessed.</p>
          <p v-if="!card.current.length && !card.historical.length">No recorded attempts. Lesson completion alone is not evidence.</p>
          <p v-if="card.lesson">{{ card.lesson.title }} · {{ card.lesson.version }}</p>
          <ul v-if="card.lesson">
            <li v-for="source in card.target?.sourceLocators" :key="source">{{ source }}</li>
          </ul>
          <ul>
            <li v-for="entry in [...card.current, ...card.historical].sort((a, b) => b.shownAt.localeCompare(a.shownAt))" :key="entry.id">
              {{ entry.version }}{{ card.historical.includes(entry) ? ' · Historical' : '' }} · {{ date(entry.attempts[0]?.at ?? entry.shownAt) }}
              <br />{{ entry.variantId }} · {{ entry.repeated ? 'Repeated situation' : 'New situation' }}
              <br />{{ facts(entry) }} · {{ entry.attempts[0]?.inputMode === 'arabic' ? 'Arabic' : entry.attempts.length ? 'Arabizi' : 'No input' }}
              <br />{{ entry.reviewDueAt ? `Review deadline when shown: ${date(entry.reviewDueAt)}` : 'No recorded prior review deadline' }}
            </li>
          </ul>
        </details>
      </article>
    </div>
    <details class="can-do-rules">
      <summary>How progress works</summary>
      <p>An accepted first response without a hint, model or retry demonstrates independent written recall. Two different situations, with the second shown when review is due at least 24 hours after the first independent response, demonstrate again later.</p>
      <p>All three targets demonstrated again later earn “Everyday responses — demonstrated again later.” Review becoming due preserves earlier evidence and achievements. Revised or unavailable content keeps historical evidence and requires current practice.</p>
      <p>These are practice records, not a proficiency score or proof of spoken fluency. Older attempts without a recorded review deadline cannot establish a later due-review demonstration. History is separate for each guest/account on this device and does not sync across devices.</p>
    </details>
    <label class="can-do-toggle"><input type="checkbox" :checked="preferences.showAchievements" :disabled="saving || loading || loadingPreferences" @change="toggle" /> Show outcome achievements</label>
    <p v-if="error" role="alert">{{ error }}</p>
    <div v-if="preferences.showAchievements && preferences.achievements.length" class="can-do-achievements" aria-label="Outcome achievements">
      <article v-for="achievement in preferences.achievements" :key="achievement.id">
        <h3>{{ achievement.title }}</h3>
        <p>Earned {{ date(achievement.earnedAt) }} · Written recall</p>
        <p v-if="achievement.id !== currentAchievement?.id">Historical achievement. Current content needs fresh evidence.</p>
        <details><summary>Achievement evidence</summary>
          <p v-for="entry in achievement.evidence" :key="entry.targetId">{{ entry.targetId }} · {{ entry.version }} · {{ date(entry.demonstratedAt) }}</p>
        </details>
      </article>
    </div>
  </section>
</template>

<style scoped>
.can-do-cards { display: grid; gap: 1rem; grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr)); }
.can-do-card { border: 1px solid #b7c8c0; border-top: 4px solid #087545; border-radius: 16px; padding: 1rem; min-width: 0; overflow-wrap: anywhere; }
.can-do-card h3, .can-do-achievements h3 { font-size: 1.05rem; margin: 0 0 .7rem; }
.can-do-card p { margin: .6rem 0; }
.can-do-state { font-weight: 700; }
.can-do-evidence { margin-top: 1rem; }
summary { cursor: pointer; min-height: 2.75rem; padding-block: .65rem; }
li { margin-bottom: .75rem; }
ul { padding-inline-start: 1.2rem; }
.can-do-rules { margin-top: .7rem; }
.can-do-toggle { display: flex; align-items: center; gap: .6rem; min-height: 2.75rem; }
.can-do-toggle input { width: 1.2rem; height: 1.2rem; accent-color: #087545; }
.can-do-achievements { margin-top: .8rem; border: 2px solid #a47113; border-radius: 16px; padding: 1rem; background: #fff8df; }
</style>
