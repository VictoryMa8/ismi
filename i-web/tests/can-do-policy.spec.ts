import { readFileSync } from 'node:fs'
import { expect, test } from '@playwright/test'
import { canDoDelay, deriveCanDo, outcomeAchievement } from '../src/canDo'
import type { LessonResponse } from '../src/types'
import type { RecallEvidence } from '../src/recallStorage'

const lessons = [1, 3, 6].map(n => JSON.parse(readFileSync(new URL(`../../content/levantine/everyday-01/revisions/recall/${String(n).padStart(2, '0')}-lesson.json`, import.meta.url), 'utf8')).lesson) as LessonResponse[]
const start = Date.parse('2026-03-07T18:00:00Z') // across US daylight saving; elapsed UTC hours
function success(lesson: LessonResponse, later = false, at = start): RecallEvidence {
  const target = lesson.recall![0]!
  return { id: `${target.id}:${later}:${at}`, scope: 'guest', lessonId: lesson.id, version: lesson.version,
    targetId: target.id, variantId: target.variants.find(v => v.reservedForLater === later)!.id,
    shownAt: new Date(at).toISOString(), completedAt: null, firstResult: 'accepted', firstHelped: false,
    helped: true, repeated: false, reviewDueAt: later ? new Date(start + canDoDelay).toISOString() : null,
    attempts: [{ result: 'accepted', at: new Date(at).toISOString(), inputMode: 'arabizi', helped: false }] }
}
const derive = (evidence: RecallEvidence[], at = start + 2 * canDoDelay, scope = 'guest', current = lessons) => deriveCanDo(scope, current, evidence, [], at)

test('F17.6 accepted first answers count; help, retries, uncertainty and absent facts cannot imply independent production', () => {
  const first = success(lessons[0]!)
  expect(derive([]).every(c => c.state === 'not-practiced')).toBe(true)
  expect(derive([first])[0]!.state).toBe('independent')
  expect(derive([{ ...first, firstHelped: true }])[0]!.state).toBe('assisted')
  expect(derive([{ ...first, firstResult: 'uncertain', attempts: [{ ...first.attempts[0]!, result: 'uncertain' }] }])[0]!.state).toBe('practiced')
  expect(derive([{ ...first, firstResult: 'context-error', attempts: [
    { ...first.attempts[0]!, result: 'context-error' }, { ...first.attempts[0]!, helped: true },
  ] }])[0]!.state).toBe('assisted')
  expect(derive([{ ...first, attempts: [] }])[0]!.state).toBe('not-practiced')
  expect(derive([{ ...first, attempts: [{ ...first.attempts[0]!, helped: true }] }])[0]!.state).toBe('assisted')
  expect(derive([{ ...first, variantId: 'unpublished-context' }])[0]!.state).toBe('not-practiced')
  expect(derive([{ ...first, shownAt: 'invalid' }])[0]!.state).not.toBe('independent')
})

test('F17.6 later evidence needs distinct situations, 24 elapsed hours and a captured deadline due when shown', () => {
  const first = success(lessons[0]!)
  const later = success(lessons[0]!, true, start + canDoDelay)
  expect(derive([first, later])[0]!.state).toBe('later')
  expect(derive([first, { ...later, shownAt: new Date(start + canDoDelay - 1).toISOString() }])[0]!.state).toBe('independent')
  expect(derive([first, { ...later, reviewDueAt: new Date(start + canDoDelay + 1).toISOString() }])[0]!.state).toBe('independent')
  expect(derive([first, { ...later, reviewDueAt: undefined }])[0]!.state).toBe('independent')
  expect(derive([first, { ...later, variantId: first.variantId }])[0]!.state).toBe('independent')
  expect(derive([first, { ...later, firstHelped: true }])[0]!.state).toBe('independent')
  // Waiting on an already-shown early prompt is not a delayed demonstration.
  expect(derive([first, { ...later, shownAt: first.shownAt }])[0]!.state).toBe('independent')
  // The delay starts at the response, not its exposure.
  const slowFirst = { ...first, attempts: [{ ...first.attempts[0]!, at: new Date(start + 1).toISOString() }] }
  expect(derive([slowFirst, later])[0]!.state).toBe('independent')
})

test('F17.6 achievement requires all three current targets; due review preserves demonstrations and versions/identities stay separate', () => {
  const evidence = lessons.flatMap(l => [success(l), success(l, true, start + canDoDelay)])
  const cards = derive(evidence)
  expect(cards.every(c => c.state === 'later' && c.due)).toBe(true)
  const achievement = outcomeAchievement(cards)!
  expect(achievement.evidence).toHaveLength(3)
  expect(achievement.earnedAt).toBe(new Date(start + canDoDelay).toISOString())
  expect(outcomeAchievement(derive(evidence.slice(0, -1)))).toBeUndefined()
  expect(outcomeAchievement(derive(evidence, start + 2 * canDoDelay, 'account:other'))).toBeUndefined()
  const revised = derive(evidence, start + 2 * canDoDelay, 'guest', lessons.map(l => ({ ...l, version: 'revised' })))
  expect(revised.every(c => c.state === 'not-practiced' && c.historical.length === 2)).toBe(true)
  expect(outcomeAchievement(revised)).toBeUndefined()
  const withdrawn = derive(evidence, start + 2 * canDoDelay, 'guest', [])
  expect(withdrawn.every(c => !c.lesson && c.historical.length === 2)).toBe(true)
  expect(outcomeAchievement(withdrawn)).toBeUndefined()
  // Repeating the same version bundle never creates a second achievement ID.
  expect(outcomeAchievement(derive([...evidence, ...evidence.map(e => ({ ...e, id: `repeat:${e.id}`, repeated: true }))]))?.id).toBe(achievement.id)
})
