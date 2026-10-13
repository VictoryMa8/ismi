import { ref } from 'vue'
import { creditActivity, freshHabits, planQuests, rollWeek, validHabits, type HabitState, type ReviewAvailability, type StudyActivity } from './learningHabits'
import type { StudyPreferences } from './studyPlan'
import type { CourseLessonSummary } from './types'

// Synchronous, scope-keyed commits avoid delayed saves landing in another identity.
// Read the latest stored value rather than writing a stale UI snapshot.
export function useLearningHabits() {
  const state = ref(freshHabits())
  const error = ref('')
  let scope = ''
  const key = () => `ismi-learning-habits-v1:${scope}`
  function read(): HabitState {
    const stored = localStorage.getItem(key())
    if (!stored) return freshHabits()
    const parsed = JSON.parse(stored) as HabitState
    if (!validHabits(parsed)) throw new Error('Invalid habit history')
    return parsed
  }
  function load(nextScope: string) {
    scope = nextScope
    state.value = freshHabits()
    error.value = ''
    try { state.value = rollWeek(read(), Date.now()) }
    catch { error.value = 'Learning habits could not be loaded on this device. Study is still available.' }
  }
  function mutate(update: (current: HabitState) => HabitState) {
    if (!scope) return
    try {
      const current = read()
      const next = update(rollWeek(current, Date.now()))
      if (JSON.stringify(next) !== JSON.stringify(current)) localStorage.setItem(key(), JSON.stringify(next))
      if (JSON.stringify(next) !== JSON.stringify(state.value)) state.value = next
      error.value = ''
    } catch { error.value = 'Learning habits could not be saved on this device. Study is still available.' }
  }
  function toggle(feature: 'questsEnabled' | 'streakEnabled', enabled: boolean) {
    mutate(current => ({ ...current, [feature]: enabled }))
  }
  function plan(preferences: StudyPreferences, lessons: CourseLessonSummary[], review: ReviewAvailability) {
    mutate(current => planQuests(current, preferences, lessons, review))
  }
  function credit(activity: StudyActivity, activityScope: string) {
    if (activityScope !== scope) return
    mutate(current => creditActivity(current, activity, Date.now()))
  }
  function refresh() { if (scope) load(scope) }
  return { state, error, load, toggle, plan, credit, refresh }
}
