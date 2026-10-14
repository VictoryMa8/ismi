import type { LessonResponse, RecallTarget } from './types'
import type { RecallEvidence } from './recallStorage'
import type { ReviewHistory } from './offline'
import { recallStepId } from './recallQueue'
import { reviewDueAt } from './reviewSchedule'

export const canDoPolicy = 'everyday-written-v1'
export const canDoDelay = 86_400_000
export const achievementTitle = 'Everyday responses — demonstrated again later'
export const canDoTargets = [
  { lessonId: 'levantine-everyday-01-01', targetId: 'rest-a-little', title: 'Accept a break and ask for a little rest' },
  { lessonId: 'levantine-everyday-01-03', targetId: 'request-tea', title: 'Request tea politely' },
  { lessonId: 'levantine-everyday-01-06', targetId: 'confirm-seven', title: 'State the arranged time: seven' },
] as const
export type CanDoState = 'not-practiced' | 'practiced' | 'assisted' | 'independent' | 'later'
export const canDoLabels: Record<CanDoState, string> = {
  'not-practiced': 'Not yet practiced', practiced: 'Practiced — try independently',
  assisted: 'Practiced with help', independent: 'Demonstrated independently', later: 'Demonstrated again later',
}
export type CanDoCard = {
  lessonId: string; targetId: string; title: string; lesson?: LessonResponse
  target?: RecallTarget
  state: CanDoState; current: RecallEvidence[]; historical: RecallEvidence[]
  supporting: RecallEvidence[]; due: boolean; nextDueAt: number
}
function firstTime(entry: RecallEvidence): number { return Date.parse(entry.attempts[0]?.at ?? '') }
function independent(entry: RecallEvidence): boolean {
  const first = entry.attempts[0]
  return entry.firstResult === 'accepted' && !entry.firstHelped &&
    first?.result === 'accepted' && !first.helped &&
    Number.isFinite(firstTime(entry)) && Date.parse(entry.shownAt) <= firstTime(entry)
}

// Completion, XP, tile exercises, spoken self-reports and uncertain answers are
// intentionally absent. Only version-matching authored typed recall facts count.
export function deriveCanDo(scope: string, lessons: LessonResponse[], evidence: RecallEvidence[], history: ReviewHistory[], now = Date.now()): CanDoCard[] {
  return canDoTargets.map(definition => {
    const lesson = lessons.find(l => l.id === definition.lessonId && l.trackId === 'levantine' &&
      l.unitId === 'levantine-everyday-01' && l.reviewStatus !== 'demonstrative' && l.recall?.some(t => t.id === definition.targetId))
    const target = lesson?.recall?.find(t => t.id === definition.targetId)
    const all = evidence.filter(e => e.scope === scope && e.lessonId === definition.lessonId && e.targetId === definition.targetId)
      .sort((a, b) => Date.parse(a.shownAt) - Date.parse(b.shownAt) || a.id.localeCompare(b.id))
    const current = all.filter(e => lesson && e.version === lesson.version && target?.variants.some(v => v.id === e.variantId))
    const historical = all.filter(e => !current.includes(e))
    const successes = current.filter(e => independent(e) && firstTime(e) <= now)
    let supporting = successes.length ? [successes[0]!] : []
    let state: CanDoState = successes.length ? 'independent' :
      current.some(e => e.attempts.length && (e.firstHelped || e.attempts.some(a => a.helped))) ? 'assisted' :
      current.some(e => e.attempts.length) ? 'practiced' : 'not-practiced'
    for (const later of successes) {
      const deadline = Date.parse(later.reviewDueAt ?? '')
      // Require an actual previous deadline, due when shown, and a different
      // authored situation at least 24 elapsed hours after an independent answer.
      if (!Number.isFinite(deadline) || Date.parse(later.shownAt) < deadline) continue
      const earlier = successes.find(e => e.variantId !== later.variantId &&
        Date.parse(later.shownAt) - firstTime(e) >= canDoDelay)
      if (earlier) { state = 'later'; supporting = [earlier, later]; break }
    }
    const schedule = lesson && target ? history.find(h => h.scope === scope && h.lessonId === lesson.id &&
      h.version === lesson.version && h.stepId === recallStepId(target)) : undefined
    const nextDueAt = reviewDueAt(schedule)
    return { ...definition, lesson, target, state, current, historical, supporting, due: Boolean(lesson) && nextDueAt <= now, nextDueAt }
  })
}

export type CanDoAchievement = {
  id: string; policy: typeof canDoPolicy; title: string; earnedAt: string
  evidence: Array<{ lessonId: string; version: string; targetId: string; attemptIds: string[]; demonstratedAt: string }>
}
export function outcomeAchievement(cards: CanDoCard[]): CanDoAchievement | undefined {
  if (cards.length !== canDoTargets.length || !cards.every(c => c.lesson && c.state === 'later')) return
  const evidence = cards.map(card => ({ lessonId: card.lessonId, version: card.lesson!.version,
    targetId: card.targetId, attemptIds: card.supporting.map(e => e.id),
    demonstratedAt: card.supporting[1]!.attempts[0]!.at }))
  return { id: JSON.stringify([canDoPolicy, ...evidence.map(e => [e.lessonId, e.version, e.targetId])]),
    policy: canDoPolicy, title: achievementTitle,
    earnedAt: new Date(Math.max(...evidence.map(e => Date.parse(e.demonstratedAt)))).toISOString(), evidence }
}
