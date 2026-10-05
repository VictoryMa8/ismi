import type { CourseLessonSummary } from './types'

export const studyTracks = [
  { id: 'levantine', name: 'Palestinian Levantine' },
  { id: 'msa', name: 'Modern Standard Arabic' },
  { id: 'quranic', name: 'Quranic Arabic' },
] as const
export type TrackId = typeof studyTracks[number]['id']
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

// Whole lessons may exceed an allocation. Never interrupt or split a lesson to fit it.
export function buildStudyPlan(preferences: StudyPreferences, lessons: CourseLessonSummary[]) {
  const p = validPreferences(preferences) ? preferences : defaultPreferences()
  const ids = [p.primaryTrack, ...studyTracks.map(t => t.id).filter(id => id !== p.primaryTrack && p.selectedTrackIds.includes(id))]
  const primaryMinutes = ids.length === 1 ? p.goalMinutes : Math.ceil(p.goalMinutes * 0.6)
  const remainder = p.goalMinutes - primaryMinutes
  const secondaryCount = ids.length - 1
  const allocations = ids.map((id, index) => {
    const minutes = index === 0 ? primaryMinutes
      : Math.floor(remainder / secondaryCount) + (index <= remainder % secondaryCount ? 1 : 0)
    const course = lessons.filter(l => (l.trackId ?? 'levantine') === id)
    const todayMinutes = course.filter(l => l.completedToday).reduce((sum, l) => sum + l.estimatedMinutes, 0)
    let remaining = Math.max(0, minutes - todayMinutes)
    const queue: CourseLessonSummary[] = []
    for (const lesson of course) {
      if (remaining <= 0) break
      if (lesson.isCompleted) continue
      queue.push(lesson)
      remaining -= lesson.estimatedMinutes
    }
    return { id, name: studyTracks.find(t => t.id === id)!.name, minutes, available: course.length > 0,
      completedCount: course.filter(l => l.isCompleted).length, totalCount: course.length, queue }
  })
  return { allocations, queue: allocations.flatMap(a => a.queue) }
}
