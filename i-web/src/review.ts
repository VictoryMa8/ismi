import { reviewDueAt } from './reviewSchedule'
import type { LessonResponse, LessonStep } from './types'
import type { ReviewHistory } from './offline'

export type ReviewTurn = { lesson: LessonResponse; step: LessonStep; history?: ReviewHistory }
export type ReviewKind = 'mixed' | 'mistakes' | 'checkpoint' | 'due'
export type CheckpointResult = { completedAt: string; total: number; firstCorrect: number; helped: number }

export function reviewTurns(lessons: LessonResponse[], history: ReviewHistory[]): ReviewTurn[] {
  return lessons.flatMap(lesson => lesson.steps.map(step => ({
    lesson, step, history: history.find(item => item.lessonId === lesson.id && item.version === lesson.version && item.stepId === step.id),
  })))
}

function reviewSignature(turn: ReviewTurn): string {
  const answer = turn.step.answers.find(item => item.id.toLowerCase() === turn.step.evaluation.correctAnswerId.toLowerCase())
  return JSON.stringify([
    turn.lesson.trackId, turn.step.prompt.arabic, turn.step.prompt.arabizi, turn.step.prompt.meaning,
    turn.step.instruction, answer?.arabic, answer?.arabizi, answer?.meaning,
  ])
}

export function scheduledReviewContexts(turns: ReviewTurn[]): ReviewTurn[] {
  // Identical published exchanges share their most recent valid-version evidence
  // for due selection, so repeated fixture turns cannot create an endless backlog.
  const distinct = new Map<string, ReviewTurn>()
  for (const turn of turns) {
    const signature = JSON.stringify([turn.lesson.id, turn.lesson.version, reviewSignature(turn)])
    const previous = distinct.get(signature)
    if (!previous || (turn.history?.practicedAt ?? '') > (previous.history?.practicedAt ?? '')) distinct.set(signature, turn)
  }
  return [...distinct.values()]
}

export function makeReviewQueue(turns: ReviewTurn[], kind: ReviewKind, limit = 6, now = Date.now()): ReviewTurn[] {
  const candidates = kind === 'mistakes' ? turns.filter(turn => turn.history?.needsReview)
    : kind === 'due' ? scheduledReviewContexts(turns).filter(turn => reviewDueAt(turn.history) <= now) : [...turns]
  candidates.sort((a, b) => (kind === 'due' ? reviewDueAt(a.history) - reviewDueAt(b.history) : 0)
    || Number(Boolean(b.history?.needsReview)) - Number(Boolean(a.history?.needsReview))
    || (a.history?.practicedAt ?? '').localeCompare(b.history?.practicedAt ?? '')
    || a.lesson.courseOrder - b.lesson.courseOrder
    || a.lesson.id.localeCompare(b.lesson.id) || a.step.id.localeCompare(b.step.id))
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
      const signature = reviewSignature(turn)
      if (!signatures.has(signature)) { selected.push(turn); signatures.add(signature) }
    }
  }
  return selected
}

export function checkpointKey(scope: string, unitId: string, lessons: LessonResponse[]): string {
  return JSON.stringify(['checkpoint', scope, unitId, lessons.map(lesson => [lesson.id, lesson.version]).sort()])
}
