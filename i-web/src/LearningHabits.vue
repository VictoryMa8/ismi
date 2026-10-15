<script setup lang="ts">
import { computed, nextTick } from 'vue'
import { Check } from '@lucide/vue'
import { calendarDay, shiftDay, streakSummary, type HabitState, type QuestTask } from './learningHabits'
const props = defineProps<{ state: HabitState; now: number; error: string; section: 'streak' | 'quests' | 'rules'; reviewReady?: boolean }>()
const emit = defineEmits<{
  toggle: [feature: 'questsEnabled' | 'streakEnabled', enabled: boolean]; start: [task: QuestTask]
}>()
const streak = computed(() => streakSummary(props.state, props.now))
const completed = computed(() => props.state.tasks.filter(task => task.completedBy).length)
const weekLabel = computed(() => {
  const format = (day: string) => new Date(`${day}T12:00:00Z`).toLocaleDateString('en-US', { timeZone: 'UTC', month: 'short', day: 'numeric' })
  return `${format(props.state.week)}–${format(shiftDay(props.state.week, 6))}`
})
const returning = computed(() => props.state.lastActivityDay && props.state.lastActivityDay < shiftDay(calendarDay(props.now, props.state.timezone), -2))
async function toggle(feature: 'questsEnabled' | 'streakEnabled', event: Event) {
  const input = event.target as HTMLInputElement
  emit('toggle', feature, input.checked)
  await nextTick()
  input.checked = props.state[feature]
}
</script>

<template>
  <section v-if="section === 'streak'" class="learning-habits feature-panel accent-gold" aria-labelledby="streak-heading">
    <h2 id="streak-heading">Streak</h2>
    <label class="habit-switch"><input type="checkbox" :checked="state.streakEnabled" @change="toggle('streakEnabled', $event)" /> Forgiving streak</label>
    <p v-if="state.streakEnabled" class="streak-status" role="status">{{ streak.studyDays }} study {{ streak.studyDays === 1 ? 'day' : 'days' }} in your current streak · {{ streak.graceRemaining }} free grace {{ streak.graceRemaining === 1 ? 'day' : 'days' }} left this week.</p>
    <p v-else>Streak is off. Saved days stay on this device.</p>
    <p v-if="state.streakEnabled && streak.restart">A fresh start is always welcome. Your learning progress is here.</p>
    <p v-if="error" role="alert">{{ error }}</p>
  </section>

  <section v-else-if="section === 'quests'" class="learning-habits feature-panel accent-gold" aria-labelledby="weekly-habits-heading">
    <h2 id="weekly-habits-heading">This week</h2>
    <label class="habit-switch"><input type="checkbox" :checked="state.questsEnabled" @change="toggle('questsEnabled', $event)" /> Weekly quests</label>
    <p v-if="returning">Welcome back. Pick up wherever you like.</p>
    <template v-if="state.questsEnabled">
      <p class="quest-summary" role="status">{{ completed }} of {{ state.tasks.length }} weekly activities complete · {{ weekLabel }}</p>
      <p v-if="state.tasks.length && completed === state.tasks.length" class="quest-complete"><Check :size="18" aria-hidden="true" /> Weekly plan complete. Practice is always available.</p>
      <p v-if="!state.tasks.length">{{ reviewReady ? 'No activities available for your selected tracks. You can change your study settings or practise freely.' : 'Checking available activities…' }}</p>
      <ul v-else class="quest-list" aria-label="Weekly quests">
        <li v-for="task in state.tasks" :key="task.id">
          <span v-if="task.completedBy" class="completed-task"><Check :size="18" aria-hidden="true" /><span>Complete · {{ task.label }}</span></span>
          <button v-else type="button" class="secondary-action" :disabled="!reviewReady" @click="emit('start', task)">{{ task.label }}</button>
        </li>
      </ul>
      <p class="habit-note">These activities fit your study plan. Choose any order.</p>
    </template>
    <p v-else>Weekly quests are off. Saved progress stays on this device.</p>
  </section>

  <section v-else class="learning-habits feature-panel accent-ink" aria-labelledby="habit-rules-heading">
    <h2 id="habit-rules-heading">Rules</h2>
    <p class="habit-note">History stays on this device, separately for guests and each account.</p>
    <details class="habit-rules">
      <summary>Weekly and streak rules</summary>
      <p>Completed lessons, reviews and checkpoints count, including attempts with help or retries. Partial sessions do not count. Quests and streaks are separately optional.</p>
      <p>Weeks start Monday; days end at midnight in {{ state.timezone }}. This timezone stays fixed while you travel or change your device timezone.</p>
      <p>Weekly plans offer up to 1, 2, 3 or 6 activities for daily goals of 5, 10, 15 or 30 minutes. Available content may make the list shorter. Changing your goal keeps completed tasks and adjusts the remainder.</p>
      <p>Two missed days per week are covered automatically by free grace. Unused grace expires each Monday. Grace preserves a streak but does not add study days. Today is still open for study.</p>
      <p>Offline completions count immediately. Reloading, retries and reconnecting do not add duplicate credit. Turning tracking off pauses new credit and preserves saved history. No scores, XP or access depend on this checklist.</p>
    </details>
  </section>
</template>

<style scoped>
.learning-habits { margin: 0 0 16px; color: var(--ink, #192b23); overflow-wrap: anywhere; }
h2 { margin-top: 0; }
.habit-switch { display: flex; align-items: center; gap: .65rem; min-height: 48px; font-weight: 700; }
input { accent-color: #12613f; width: 1.2rem; height: 1.2rem; flex-shrink: 0; }
.quest-list { list-style: none; margin: 1rem 0; padding: 0; display: grid; gap: .75rem; }
.quest-list button { text-align: start; width: 100%; white-space: normal; background: #12613f; border-color: #12613f; color: #fff; }
.completed-task, .quest-complete { display: flex; align-items: center; gap: .5rem; font-weight: 700; }
.completed-task svg, .quest-complete svg { flex-shrink: 0; }
.quest-complete { padding: .75rem; border-radius: .5rem; background: #f6d878; color: #342500; }
.habit-note { font-size: .9rem; }
summary { cursor: pointer; min-height: 44px; padding-top: .75rem; font-weight: 700; }
</style>
