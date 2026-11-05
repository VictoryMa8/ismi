<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { BookOpen, Check, ChevronRight, LockKeyhole, PenLine } from '@lucide/vue'
import { canDoLabels, deriveCanDo, outcomeAchievement, type CanDoCard } from './canDo'
import { getCanDoPreferences, recordCanDoAchievement, setCanDoAchievementDisplay, type CanDoPreferences } from './canDoStorage'
import type { RecallEvidence } from './recallStorage'
import type { ReviewHistory } from './offline'
import type { LessonResponse } from './types'

const props = defineProps<{ scope: string; lessons: LessonResponse[]; evidence: RecallEvidence[]; history: ReviewHistory[]; now: number; loading: boolean }>()
const emit = defineEmits<{ practice: [lessonId: string, targetId: string] }>()
const cards = computed(() => deriveCanDo(props.scope, props.lessons, props.evidence, props.history, props.now))
const currentAchievement = computed(() => outcomeAchievement(cards.value))
const demonstratedCount = computed(() => cards.value.filter(card => card.state === 'independent' || card.state === 'later').length)
const unavailableCount = computed(() => cards.value.filter(card => !card.lesson).length)
const preferences = ref<CanDoPreferences>({ showAchievements: true, achievements: [] })
const error = ref('')
const saving = ref(false)
const loadingPreferences = ref(true)
let generation = 0
let loadedScope = ''
const date = (value: string | number) => Number.isFinite(typeof value === 'number' ? value : Date.parse(value))
  ? new Date(value).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : 'Date unavailable'
function action(card: CanDoCard): string {
  if (!card.current.some(e => e.attempts.length)) return 'Try writing a response'
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
    <div class="can-do-heading">
      <div>
        <h2 id="can-do-title">What you can do</h2>
        <p v-if="!loading" class="can-do-summary"><strong>{{ demonstratedCount }} of {{ cards.length }}</strong> targets demonstrated independently</p>
        <p>Levantine · Written responses on this device</p>
      </div>
      <div v-if="!loading && cards.length" class="can-do-milestones" aria-hidden="true">
        <span v-for="step in cards.length" :key="step" :class="{ earned: step <= demonstratedCount }"><Check v-if="step <= demonstratedCount" :size="15" /></span>
      </div>
    </div>
    <p v-if="loading" role="status">Loading progress…</p>
    <div v-if="!loading && unavailableCount" class="can-do-start">
      <BookOpen :size="22" aria-hidden="true" />
      <div><h3>{{ unavailableCount === cards.length ? 'Start with a lesson' : 'Unlock more targets' }}</h3><p>Complete and download an Everyday lesson to unlock writing practice.</p></div>
      <a href="#/courses">Explore lessons <ChevronRight :size="18" aria-hidden="true" /></a>
    </div>
    <div v-show="!loading" class="can-do-cards">
      <details v-for="card in cards" :key="card.targetId" class="can-do-card" :data-can-do="card.targetId" :data-state="card.state">
        <summary class="can-do-row">
          <span class="can-do-marker" aria-hidden="true"><LockKeyhole v-if="!card.lesson" :size="18" /><Check v-else-if="card.state === 'independent' || card.state === 'later'" :size="20" /><PenLine v-else :size="18" /></span>
          <span class="can-do-copy">
            <strong>{{ card.title }}</strong>
            <span class="can-do-state">{{ canDoLabels[card.state] }}</span>
            <span v-if="!card.lesson" class="can-do-next">Lesson needed</span>
            <span v-else-if="card.current.some(e => e.attempts.length)" class="can-do-next">{{ card.due ? 'Due for review' : `Review due ${date(card.nextDueAt)}` }}</span>
          </span>
          <ChevronRight class="can-do-chevron" :size="17" aria-hidden="true" />
        </summary>
        <div class="can-do-detail">
          <p v-if="!card.lesson && !card.historical.length">Complete and download the lesson to try this response.</p>
          <button v-if="card.lesson" class="secondary-action can-do-action" :aria-label="`${action(card)}: ${card.title}`" @click="emit('practice', card.lessonId, card.targetId)">{{ !card.current.some(e => e.attempts.length) ? 'Practice' : card.due ? 'Review now' : 'Practice again' }}<ChevronRight :size="17" aria-hidden="true" /></button>
          <p v-if="card.historical.length" class="can-do-history-note">Earlier evidence saved. Fresh practice does not mean you lost ability.</p>
          <details v-if="card.lesson || card.current.length || card.historical.length" class="can-do-evidence">
            <summary>Attempts and sources</summary>
            <p v-if="card.lesson">{{ card.lesson.version }} · {{ card.target?.dialect === 'palestinian-urban' ? 'Urban Palestinian' : card.target?.dialect }} · {{ card.target?.register }}</p>
            <p v-if="card.supporting.length">Evidence: {{ card.supporting.map(e => date(e.attempts[0]!.at)).join(' and ') }}</p>
            <p v-if="card.state === 'independent'">Try a different situation when review is due, at least 24 hours after your independent response.</p>
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
        </div>
      </details>
    </div>
    <details class="can-do-rules">
      <summary>How progress works</summary>
      <ol>
        <li><strong>Try independently.</strong> An accepted first response without a hint, model or retry demonstrates writing from memory.</li>
        <li><strong>Return when review is due.</strong> Succeed in a different situation shown at least 24 hours after your first independent response to demonstrate again later.</li>
        <li><strong>Build all three.</strong> Demonstrate each target again later to earn “Everyday responses — demonstrated again later.”</li>
      </ol>
      <p>Due review preserves earlier evidence and achievements. Revised or unavailable content keeps historical evidence and needs fresh practice. Older attempts without a recorded review deadline cannot demonstrate again later.</p>
      <p>Written practice records do not assess listening, speaking or proficiency. History stays on this device, separately for each guest/account; it does not sync across devices.</p>
      <label class="can-do-toggle"><input type="checkbox" :checked="preferences.showAchievements" :disabled="saving || loading || loadingPreferences" @change="toggle" /> Show outcome achievements</label>
    </details>
    <p v-if="error" role="alert">{{ error }}</p>
    <div v-if="preferences.showAchievements && preferences.achievements.length" class="can-do-achievements" aria-label="Outcome achievements">
      <article v-for="achievement in preferences.achievements" :key="achievement.id">
        <h3>{{ achievement.title }}</h3>
        <p>Earned {{ date(achievement.earnedAt) }} · Written responses</p>
        <p v-if="achievement.id !== currentAchievement?.id">Historical achievement. Current content needs fresh evidence.</p>
        <details><summary>Achievement evidence</summary>
          <p v-for="entry in achievement.evidence" :key="entry.targetId">{{ entry.targetId }} · {{ entry.version }} · {{ date(entry.demonstratedAt) }}</p>
        </details>
      </article>
    </div>
  </section>
</template>

<style scoped>
.can-do-progress { display: grid; gap: 18px; margin: 0; }
.can-do-heading { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: clamp(18px, 4vw, 26px); border-radius: 19px; color: #273321; background: #ffd77f; }
.can-do-heading h2 { margin: 0; color: inherit; font-size: clamp(1.35rem, 4vw, 1.9rem); line-height: 1.15; }
.can-do-heading p { margin: 6px 0 0; font-size: .8rem; line-height: 1.4; }
.can-do-summary { font-weight: 650; }
.can-do-milestones { display: flex; flex: none; gap: 5px; }
.can-do-milestones span { display: grid; place-items: center; width: 21px; height: 21px; border: 1px solid #80601e; border-radius: 50%; }
.can-do-milestones .earned { color: white; background: #064e3a; border-color: #064e3a; }
.can-do-start { display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 10px 12px; padding: 16px; border-radius: 14px; background: var(--teal-dark); color: white; }
.can-do-start > svg { margin-top: 2px; }
.can-do-start h3 { color: white; font-size: 1rem; margin: 0 0 5px; }
.can-do-start p { font-size: .85rem; margin: 0; line-height: 1.5; }
.can-do-start a { grid-column: 2; display: flex; align-items: center; justify-content: center; gap: 8px; width: fit-content; min-height: 44px; padding: 8px 14px; border-radius: 9px; background: white; color: var(--teal-dark); font-weight: 750; font-size: .85rem; text-decoration: none; }
.can-do-start a:hover { background: var(--gold-soft); }
.can-do-start a:focus-visible { outline-color: var(--gold-bright); }
.can-do-cards { display: grid; gap: 0; }
.can-do-card { min-width: 0; border-bottom: 1px solid var(--line); overflow-wrap: anywhere; }
.can-do-row { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; align-items: center; gap: 12px; min-height: 66px; padding: 12px 2px; list-style: none; }
.can-do-row::-webkit-details-marker { display: none; }
.can-do-marker { display: grid; place-items: center; width: 34px; height: 34px; border-radius: 50%; background: var(--teal-soft); color: var(--teal-dark); }
[data-state="independent"] .can-do-marker, [data-state="later"] .can-do-marker { background: var(--teal-dark); color: white; }
.can-do-copy { display: grid; gap: 3px; }
.can-do-copy strong, .can-do-achievements h3 { font-size: .95rem; line-height: 1.4; }
.can-do-state, .can-do-next { font-size: .78rem; line-height: 1.4; color: var(--ink-soft); }
.can-do-chevron { color: var(--teal-dark); }
.can-do-card[open] .can-do-chevron { transform: rotate(90deg); }
.can-do-detail { padding: 2px 0 16px 48px; }
.can-do-action { width: auto; padding: 8px 12px; font-size: .85rem; min-height: 44px; }
.can-do-action:hover { background: var(--gold-soft); }
.can-do-evidence { margin-top: 6px; font-size: .8rem; line-height: 1.6; }
.can-do-history-note { font-size: .8rem; line-height: 1.5; }
summary { cursor: pointer; min-height: 44px; padding-block: 12px; }
summary:focus-visible { outline: 3px solid var(--teal); outline-offset: 2px; border-radius: 4px; }
li { margin-bottom: .75rem; }
ul, ol { padding-inline-start: 1.2rem; }
.can-do-rules { margin: 0; font-size: .85rem; line-height: 1.6; }
.can-do-toggle { display: flex; align-items: center; gap: .6rem; min-height: 44px; font-size: .85rem; line-height: 1.5; cursor: pointer; }
.can-do-toggle input { width: 1.2rem; height: 1.2rem; accent-color: #087545; }
.can-do-toggle input:focus-visible { outline: 3px solid var(--teal); outline-offset: 3px; }
.can-do-achievements { margin-top: .8rem; border: 2px solid #a47113; border-radius: 16px; padding: 1rem; background: #fff8df; }
@media (max-width: 420px) {
  .can-do-heading { flex-wrap: wrap; }
  .can-do-row { gap: 9px; }
  .can-do-detail { padding-inline-start: 12px; }
}
@media (forced-colors: active) {
  .can-do-heading, .can-do-marker, .can-do-milestones span { border: 1px solid CanvasText; }
}
</style>
