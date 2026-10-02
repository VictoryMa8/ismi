import type { LessonAttemptResponse, LessonStep } from './types'

// All feedback comes from the authored evaluation and accepted answer records.
export function evaluateOffline(step: LessonStep, answerId: string): LessonAttemptResponse {
  const correct = step.evaluation.correctAnswerId.toLowerCase() === answerId.toLowerCase()
  return {
    stepId: step.id, isCorrect: correct, correctAnswerId: step.evaluation.correctAnswerId,
    feedbackTitle: correct ? step.evaluation.correctTitle : step.evaluation.incorrectTitle,
    explanation: correct ? step.evaluation.correctExplanation
      : step.answers.find(answer => answer.id === answerId)?.rationale ?? step.evaluation.incorrectExplanation,
    retryHint: correct ? null : step.evaluation.retryHint,
  }
}
