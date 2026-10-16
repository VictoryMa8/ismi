import type { CourseLessonSummary } from './types'

import { courses, type CourseId } from './courses'

export const studyTracks = courses
export type TrackId = CourseId
export type StudyPreferences = { goalMinutes: number; selectedTrackIds: TrackId[]; primaryTrack: TrackId }
export type StudySettings = { preferences: StudyPreferences; revision: number }
export const defaultPreferences = (): StudyPreferences => ({ goalMinutes: 15, selectedTrackIds: ['levantine'], primaryTrack: 'levantine' })
export function validPreferences(value: StudyPreferences): boolean {
  return [5, 10, 15, 30].includes(value?.goalMinutes)
    && Array.isArray(value?.selectedTrackIds) && value.selectedTrackIds.length > 0
    && value.selectedTrackIds.every(id => studyTracks.some(t => t.id === id))
    && new Set(value.selectedTrackIds).size === value.selectedTrackIds.length
    && value.selectedTrackIds.includes(value.primaryTrack)
}

export type StudyTask = { kind: 'lesson' | 'review'; courseId: TrackId; minutes: number; lesson?: CourseLessonSummary }

// Calendar-date rotation, shared online/offline. No random or visit-count ordering.
// A one-slot budget gives the primary 3/5 days; secondary slots rotate without starvation.
export function buildStudyPlan(preferences: StudyPreferences, lessons: CourseLessonSummary[],
  day = new Date().toISOString().slice(0, 10), dueByCourse: Record<string, number> = {}, completedReviewMinutes = 0) {
  const p = validPreferences(preferences) ? preferences : defaultPreferences()
  const secondaries = studyTracks.map(t => t.id).filter(id => id !== p.primaryTrack && p.selectedTrackIds.includes(id))
  const ordinal = Math.floor(Date.parse(`${day}T12:00:00Z`) / 86_400_000)
  const dayIndex = Number.isFinite(ordinal) ? ordinal : 0
  const rotation = secondaries.length ? ((Math.floor(dayIndex / 5) * 2 + (dayIndex % 5 === 3 ? 1 : 0)) % secondaries.length + secondaries.length) % secondaries.length : 0
  const rotated = [...secondaries.slice(rotation), ...secondaries.slice(0, rotation)]
  const ids: TrackId[] = [p.primaryTrack, ...rotated]
  const oneSlot = p.goalMinutes < 10 && secondaries.length > 0
  const secondaryDay = [1, 3].includes((dayIndex % 5 + 5) % 5)
  const active = oneSlot ? [secondaryDay ? rotated[0]! : p.primaryTrack] : ids
  let budget = Math.max(0, p.goalMinutes - completedReviewMinutes - lessons.filter(l => l.completedToday).reduce((sum, l) => sum + l.estimatedMinutes, 0))
  const tasks: StudyTask[] = []
  const allocations = ids.map(id => {
    const course = lessons.filter(l => (l.trackId ?? 'levantine') === id)
    const allocation = { id, name: studyTracks.find(t => t.id === id)!.name, minutes: 0, available: course.length > 0,
      completedCount: course.filter(l => l.isCompleted).length, totalCount: course.length, queue: [] as CourseLessonSummary[],
      omitted: false, reviewMinutes: 0 }
    if (!active.includes(id) || budget <= 0) { allocation.omitted = course.length > 0; return allocation }
    const limit = id === p.primaryTrack && secondaries.length && !oneSlot ? Math.ceil(p.goalMinutes * .6) : budget
    // Due review is one bounded five-minute session before new material in this course.
    if ((dueByCourse[id] ?? 0) > 0) {
      tasks.push({ kind: 'review', courseId: id, minutes: 5 })
      allocation.minutes += 5; allocation.reviewMinutes = 5; budget -= 5
    }
    for (const lesson of course.filter(l => !l.isCompleted)) {
      if (budget <= 0 || allocation.minutes >= limit) break
      // Reserve a useful whole session for a secondary when two sessions fit.
      if (id === p.primaryTrack && secondaries.length && allocation.minutes > 0 && budget - lesson.estimatedMinutes < 5) break
      allocation.queue.push(lesson)
      tasks.push({ kind: 'lesson', courseId: id, minutes: lesson.estimatedMinutes, lesson })
      allocation.minutes += lesson.estimatedMinutes; budget -= lesson.estimatedMinutes
    }
    allocation.omitted = allocation.available && allocation.minutes === 0
    return allocation
  })
  const plannedMinutes = tasks.reduce((sum, t) => sum + t.minutes, 0)
  const completedMinutes = lessons.filter(l => l.completedToday).reduce((sum, l) => sum + l.estimatedMinutes, 0)
  return { allocations, tasks, queue: tasks.flatMap(t => t.lesson ? [t.lesson] : []), plannedMinutes,
    overrunMinutes: Math.max(0, plannedMinutes + completedMinutes + completedReviewMinutes - p.goalMinutes), policyVersion: 'parallel-v1' }
}
