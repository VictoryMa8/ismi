import type { LessonResponse, LessonStep } from './types'
import type { ReviewHistory } from './offline'

export type ReviewTurn = { lesson: LessonResponse; step: LessonStep; history?: ReviewHistory }
export type ReviewKind = 'mixed' | 'mistakes' | 'checkpoint'
export type CheckpointResult = { completedAt: string; total: number; firstCorrect: number; helped: number }

export function reviewTurns(lessons: LessonResponse[], history: ReviewHistory[]): ReviewTurn[] {
  return lessons.flatMap(lesson => lesson.steps.map(step => ({
    lesson, step, history: history.find(item => item.lessonId === lesson.id && item.version === lesson.version && item.stepId === step.id),
  })))
}

export function makeReviewQueue(turns: ReviewTurn[], kind: ReviewKind, limit = 6): ReviewTurn[] {
  const candidates = kind === 'mistakes' ? turns.filter(turn => turn.history?.needsReview) : [...turns]
  candidates.sort((a, b) => Number(Boolean(b.history?.needsReview)) - Number(Boolean(a.history?.needsReview))
    || (a.history?.practicedAt ?? '').localeCompare(b.history?.practicedAt ?? '')
    || a.lesson.courseOrder - b.lesson.courseOrder)
  const selected: ReviewTurn[] = []
  const signatures = new Set<string>()
  // Round-robin across lessons, using least recently practised contexts first.
  // Repeated fixture steps do not pad out a review session.
  while (candidates.length && selected.length < limit) {
    const seenLessons = new Set<string>()
    for (let index = 0; index < candidates.length && selected.length < limit;) {
      const turn = candidates[index]!
      if (seenLessons.has(turn.lesson.id)) { index++; continue }
      seenLessons.add(turn.lesson.id)
      candidates.splice(index, 1)
      const answer = turn.step.answers.find(item => item.id.toLowerCase() === turn.step.evaluation.correctAnswerId.toLowerCase())
      const signature = JSON.stringify([
        turn.step.prompt.arabic, turn.step.prompt.arabizi, turn.step.prompt.meaning,
        turn.step.instruction, answer?.arabic, answer?.arabizi, answer?.meaning,
      ])
      if (!signatures.has(signature)) { selected.push(turn); signatures.add(signature) }
    }
  }
  return selected
}

export function checkpointKey(scope: string, unitId: string, lessons: LessonResponse[]): string {
  return JSON.stringify(['checkpoint', scope, unitId, lessons.map(lesson => [lesson.id, lesson.version]).sort()])
}
