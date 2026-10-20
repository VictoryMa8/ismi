import type { CourseLessonSummary } from './types'

// Keep the original demo IDs available for saved progress and manual practice.
export function isLegacyDemo(lesson: CourseLessonSummary): boolean {
  return (lesson.trackId ?? 'levantine') === 'levantine'
    && lesson.unitId === 'levantine-week-01' && /^levantine-day-0[1-6]$/.test(lesson.id)
}

export function orderedLessons(lessons: CourseLessonSummary[]): CourseLessonSummary[] {
  return [...lessons].sort((a, b) => a.courseOrder - b.courseOrder || a.id.localeCompare(b.id))
}

export function coursePathLessons(lessons: CourseLessonSummary[]): CourseLessonSummary[] {
  const hasLevantineCourse = lessons.some(lesson => (lesson.trackId ?? 'levantine') === 'levantine' && !isLegacyDemo(lesson))
  return orderedLessons(lessons.filter(lesson => !hasLevantineCourse || !isLegacyDemo(lesson)))
}
