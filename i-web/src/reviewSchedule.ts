// Elapsed days (UTC milliseconds), independent of timezone and daylight saving.
export const reviewIntervals = [1, 3, 7, 14] as const
const day = 86_400_000
export type ReviewSchedule = { intervalIndex: number; dueAt: string }
type PreviousReview = { practicedAt: string; schedule?: ReviewSchedule }

export function reviewDueAt(previous?: PreviousReview): number {
  if (!previous) return 0
  const scheduled = Date.parse(previous.schedule?.dueAt ?? '')
  if (Number.isFinite(scheduled)) return scheduled
  // F05 records have no difficulty/help evidence: start conservatively at 1 day.
  const practiced = Date.parse(previous.practicedAt)
  return Number.isFinite(practiced) ? practiced + day : 0
}

export function nextReviewSchedule(
  previous: PreviousReview | undefined,
  correct: boolean, firstAttempt: boolean, helped: boolean, now: number,
): ReviewSchedule {
  const previousIndex = previous?.schedule?.intervalIndex
  const index = Number.isInteger(previousIndex) && previousIndex! >= 0 && previousIndex! < reviewIntervals.length
    ? previousIndex! : 0
  const success = correct && firstAttempt && !helped
  // Retries preserve the first answer's schedule. Early successful practice does
  // not move a due date or allow learners to race through the intervals.
  if (previous && ((!firstAttempt && correct) || (success && reviewDueAt(previous) > now))) {
    return { intervalIndex: index, dueAt: new Date(reviewDueAt(previous)).toISOString() }
  }
  const nextIndex = success && previous ? Math.min(index + 1, reviewIntervals.length - 1) : 0
  return { intervalIndex: nextIndex, dueAt: new Date(now + reviewIntervals[nextIndex]! * day).toISOString() }
}
