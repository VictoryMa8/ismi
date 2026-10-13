import type { LessonResponse, RecallTarget } from './types'
import type { RecallEvidence } from './recallStorage'
import type { ReviewHistory } from './offline'
import { reviewDueAt } from './reviewSchedule'

export type RecallTurn = { lesson: LessonResponse; target: RecallTarget; variant: RecallTarget['variants'][number]; repeated: boolean; due: boolean }
export const recallStepId = (target: RecallTarget) => `recall:${target.id}`
export function recallQueue(lessons: LessonResponse[], evidence: RecallEvidence[], history: ReviewHistory[], now = Date.now()): RecallTurn[] {
  const turns = lessons.flatMap(lesson => (lesson.recall ?? []).flatMap(target => {
    const previous = evidence.filter(e => e.lessonId === lesson.id && e.version === lesson.version && e.targetId === target.id)
    const schedule = history.find(h => h.lessonId === lesson.id && h.version === lesson.version && h.stepId === recallStepId(target))
    const due = reviewDueAt(schedule) <= now
    // A first encounter always uses the ordinary prompt. A held-back situation is
    // offered only on a later elapsed-day due review after an actual response.
    const laterReady = due && previous.some(e => e.firstResult !== null && now - Date.parse(e.shownAt) >= 86_400_000)
    const later = target.variants.find(v => v.reservedForLater)
    const base = target.variants.find(v => !v.reservedForLater)
    const variant = laterReady && later ? later : base
    if (!variant) return []
    return [{ lesson, target, variant, due, repeated: previous.some(e => e.variantId === variant.id) }]
  }))
  return turns.sort((a, b) => Number(b.due) - Number(a.due) || a.lesson.courseOrder - b.lesson.courseOrder || a.target.id.localeCompare(b.target.id))
}
