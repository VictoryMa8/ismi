import type { CourseLessonSummary } from './types'
import type { StudyPreferences } from './studyPlan'

export type ActivityKind = 'lesson' | 'review' | 'checkpoint'
export type StudyActivity = {
  id: string; kind: ActivityKind; completedAt: string; lessonId?: string; unitId?: string; due?: boolean; practiceOnly?: boolean
}
export type QuestTask = {
  id: string; kind: ActivityKind; label: string; lessonId?: string; unitId?: string; due?: boolean; completedBy?: string
}
export type ReviewAvailability = { ready: boolean; due: boolean; mixed: boolean; checkpoints: { id: string; title: string }[] }
export const emptyReviewAvailability = (): ReviewAvailability => ({ ready: false, due: false, mixed: false, checkpoints: [] })
export type HabitState = {
  version: 1; timezone: string; questsEnabled: boolean; streakEnabled: boolean;
  week: string; tasks: QuestTask[]; studyDays: string[]; creditedIds: string[]; lastActivityDay: string
}

export function deviceTimezone(): string { return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC' }
export function calendarDay(now: number, timezone: string): string {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: timezone, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now)
  return ['year', 'month', 'day'].map(type => parts.find(part => part.type === type)!.value).join('-')
}
const dayMs = 86_400_000
export function shiftDay(day: string, amount: number): string {
  return new Date(Date.parse(`${day}T12:00:00Z`) + amount * dayMs).toISOString().slice(0, 10)
}
export function weekStart(day: string): string {
  const weekday = new Date(`${day}T12:00:00Z`).getUTCDay()
  return shiftDay(day, -(weekday + 6) % 7)
}
export function freshHabits(now = Date.now(), timezone = deviceTimezone()): HabitState {
  return { version: 1, timezone, questsEnabled: false, streakEnabled: false, week: weekStart(calendarDay(now, timezone)),
    tasks: [], studyDays: [], creditedIds: [], lastActivityDay: '' }
}
export function validHabits(value: HabitState): boolean {
  try {
    calendarDay(Date.now(), value.timezone)
    return value.version === 1 && typeof value.questsEnabled === 'boolean' && typeof value.streakEnabled === 'boolean'
      && /^\d{4}-\d{2}-\d{2}$/.test(value.week) && Array.isArray(value.tasks)
      && value.tasks.every(task => typeof task.id === 'string' && typeof task.label === 'string' && ['lesson', 'review', 'checkpoint'].includes(task.kind))
      && Array.isArray(value.studyDays) && value.studyDays.every(day => /^\d{4}-\d{2}-\d{2}$/.test(day))
      && Array.isArray(value.creditedIds) && value.creditedIds.every(id => typeof id === 'string')
      && typeof value.lastActivityDay === 'string'
  } catch { return false }
}
export function rollWeek(state: HabitState, now: number): HabitState {
  const week = weekStart(calendarDay(now, state.timezone))
  // Clock changes never reopen an earlier checklist or move completion credit backwards.
  return week > state.week ? { ...state, week, tasks: [] } : state
}
export function questCapacity(goal: number): number { return ({ 5: 1, 10: 2, 15: 3, 30: 6 } as Record<number, number>)[goal] ?? 3 }
export function planQuests(state: HabitState, preferences: StudyPreferences, lessons: CourseLessonSummary[], review: ReviewAvailability): HabitState {
  if (!state.questsEnabled || !review.ready) return state
  const selected = lessons.filter(lesson => preferences.selectedTrackIds.includes((lesson.trackId ?? 'levantine') as typeof preferences.primaryTrack))
    .sort((a, b) => Number(b.trackId === preferences.primaryTrack) - Number(a.trackId === preferences.primaryTrack) || a.courseOrder - b.courseOrder || a.id.localeCompare(b.id))
  const newTasks: QuestTask[] = selected.filter(lesson => !lesson.isCompleted).map(lesson => ({
    id: `lesson:${lesson.id}`, kind: 'lesson', label: lesson.title, lessonId: lesson.id,
  }))
  const reviewTask: QuestTask[] = review.due ? [{ id: 'review', kind: 'review', label: 'Complete a due review', due: true }]
    : review.mixed ? [{ id: 'review', kind: 'review', label: 'Complete a mixed review', due: false }] : []
  const checkpoints: QuestTask[] = review.checkpoints.map(unit => ({ id: `checkpoint:${unit.id}`, kind: 'checkpoint', label: `${unit.title} checkpoint`, unitId: unit.id }))
  // A mix of existing activities, with no repeated review quota or invented story/transfer work.
  const candidates = [...newTasks.slice(0, 1), ...reviewTask, ...checkpoints, ...newTasks.slice(1)]
  const done = state.tasks.filter(task => task.completedBy)
  const remaining = Math.max(0, questCapacity(preferences.goalMinutes) - done.length)
  const pending = candidates.filter(task => !done.some(item => item.id === task.id)).slice(0, remaining)
  return { ...state, tasks: [...done, ...pending] }
}
export function creditActivity(state: HabitState, activity: StudyActivity, now: number): HabitState {
  if (!state.questsEnabled && !state.streakEnabled || state.creditedIds.includes(activity.id)) return state
  const timestamp = Date.parse(activity.completedAt)
  if (!Number.isFinite(timestamp) || timestamp > now + 60_000) return state
  const day = calendarDay(timestamp, state.timezone)
  if (day < state.lastActivityDay) return state
  const next = rollWeek(state, now)
  // One activity acknowledges at most one task. Due tasks require a session that began due.
  const match = next.questsEnabled && weekStart(day) === next.week ? next.tasks.find(task => !task.completedBy && task.kind === activity.kind
    && (task.kind !== 'lesson' || task.lessonId === activity.lessonId && !activity.practiceOnly)
    && (task.kind !== 'checkpoint' || task.unitId === activity.unitId)
    && (!task.due || activity.due)) : undefined
  return { ...next, tasks: next.tasks.map(task => task === match ? { ...task, completedBy: activity.id } : task),
    creditedIds: [...next.creditedIds, activity.id], lastActivityDay: day,
    studyDays: next.streakEnabled ? [...new Set([...next.studyDays, day])].sort() : next.studyDays }
}
export function streakSummary(state: HabitState, now: number): { studyDays: number; graceUsed: number; graceRemaining: number; restart: boolean } {
  const today = calendarDay(now, state.timezone)
  const days = [...new Set(state.studyDays.filter(day => day <= today))].sort()
  const currentWeek = weekStart(today)
  let count = 0
  let previous = ''
  const grace = new Map<string, number>()
  // Advance through gaps only until the first exhausted week; long lapses stay bounded.
  function bridge(from: string, to: string): boolean {
    for (let day = shiftDay(from, 1); day < to; day = shiftDay(day, 1)) {
      const week = weekStart(day)
      const used = (grace.get(week) ?? 0) + 1
      grace.set(week, used)
      if (used > 2) return false
    }
    return true
  }
  for (const day of days) {
    if (previous && !bridge(previous, day)) count = 0
    count++
    previous = day
  }
  // Today is still available for study; only completed calendar days consume grace.
  if (previous && !bridge(previous, today)) count = 0
  const used = Math.min(2, grace.get(currentWeek) ?? 0)
  return { studyDays: count, graceUsed: used, graceRemaining: 2 - used, restart: Boolean(previous) && count === 0 }
}
