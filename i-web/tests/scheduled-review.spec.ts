import { expect, test, type Page } from '@playwright/test'
import { nextReviewSchedule, reviewDueAt } from '../src/reviewSchedule'
import { makeReviewQueue, reviewTurns, scheduledReviewContexts } from '../src/review'
import type { LessonResponse } from '../src/types'

const day = 86_400_000
const start = Date.parse('2026-03-07T18:00:00Z')

test('schedule advances at exact elapsed-day boundaries, caps at 14, and resists early practice and retries', () => {
  let previous = { practicedAt: new Date(start).toISOString(), schedule: nextReviewSchedule(undefined, true, true, false, start) }
  expect(reviewDueAt(previous)).toBe(start + day)
  for (const days of [3, 7, 14, 14]) {
    const due = reviewDueAt(previous)
    expect(nextReviewSchedule(previous, true, true, false, due - 1)).toEqual(previous.schedule)
    const schedule = nextReviewSchedule(previous, true, true, false, due)
    expect(Date.parse(schedule.dueAt)).toBe(due + days * day)
    expect(nextReviewSchedule({ ...previous, schedule }, true, false, false, due + 1000)).toEqual(schedule)
    previous = { practicedAt: new Date(due).toISOString(), schedule }
  }
  for (const [correct, helped] of [[false, false], [true, true]]) {
    const schedule = nextReviewSchedule(previous, correct!, true, helped!, start)
    expect(schedule).toEqual({ intervalIndex: 0, dueAt: new Date(start + day).toISOString() })
  }
  expect(reviewDueAt({ practicedAt: new Date(start).toISOString() })).toBe(start + day)
  expect(reviewDueAt(undefined)).toBe(0)
  expect(reviewDueAt({ practicedAt: 'invalid' })).toBe(0)
})

async function seed(page: Page, lesson: LessonResponse, dueAt: string, version = lesson.version) {
  await page.evaluate(async ({ lesson, dueAt, version }) => {
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const r = indexedDB.open('ismi-offline'); r.onsuccess = () => resolve(r.result); r.onerror = () => reject(r.error)
    })
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction('review-history', 'readwrite')
      for (const step of lesson.steps) tx.objectStore('review-history').put({
        key: JSON.stringify(['guest', lesson.id, version, step.id]), scope: 'guest', lessonId: lesson.id,
        version, stepId: step.id, practicedAt: new Date().toISOString(), needsReview: false,
        answerId: step.evaluation.correctAnswerId, explanation: 'Saved practice', schedule: { intervalIndex: 1, dueAt },
      })
      tx.oncomplete = () => { db.close(); resolve() }; tx.onerror = () => reject(tx.error)
    })
  }, { lesson, dueAt, version })
}

async function firstLesson(page: Page): Promise<LessonResponse> {
  const dashboard = await (await page.request.get('/api/dashboard')).json()
  return (await page.request.get(`/api/lessons/${dashboard.dailyPlan.lessons[0].id}`)).json()
}

async function history(page: Page) {
  return page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>(resolve => { const r = indexedDB.open('ismi-offline'); r.onsuccess = () => resolve(r.result) })
    return new Promise<any[]>(resolve => { const r = db.transaction('review-history').objectStore('review-history').getAll(); r.onsuccess = () => { db.close(); resolve(r.result) } })
  })
}

test('due queue excludes future versions and future dates with stable bounded selection', async ({ page }) => {
  await page.goto('/#/today')
  const lesson = await firstLesson(page)
  const future = lesson.steps.map(step => ({ key: step.id, scope: 'guest', lessonId: lesson.id, version: lesson.version,
    stepId: step.id, practicedAt: new Date(start).toISOString(), needsReview: false, answerId: null, explanation: '',
    schedule: { intervalIndex: 0, dueAt: new Date(start + day).toISOString() } }))
  expect(makeReviewQueue(reviewTurns([lesson], future), 'due', 6, start + day - 1)).toEqual([])
  expect(makeReviewQueue(reviewTurns([lesson], future), 'due', 6, start + day).length).toBeGreaterThan(0)
  const changed = { ...lesson, version: 'new-version' }
  expect(makeReviewQueue(reviewTurns([changed], future), 'due', 6, start).length).toBeGreaterThan(0)
  const original = reviewTurns([lesson], future)[0]!
  const latest = { ...original, step: { ...original.step, id: 'same-context' }, history: {
    ...future[0]!, stepId: 'same-context', practicedAt: new Date(start + 1).toISOString(),
    schedule: { intervalIndex: 2, dueAt: new Date(start + 7 * day).toISOString() },
  } }
  expect(scheduledReviewContexts([original, latest])).toEqual([latest])
  expect(makeReviewQueue([original, latest], 'due', 6, start + 2 * day)).toEqual([])
})

test('Today due review survives offline reload; help resets, early practice stays free, and partial close refreshes', async ({ page, context }, testInfo) => {
  await page.goto('/#/today')
  const lesson = await firstLesson(page)
  await expect(page.getByRole('button', { name: /^Review due/ })).toBeDisabled()
  await seed(page, lesson, '2020-01-01T00:00:00Z')
  await page.reload()
  const due = page.getByRole('button', { name: /^Review due/ })
  await expect(due).toBeEnabled()
  await page.evaluate(async () => { await navigator.serviceWorker.ready })
  await context.setOffline(true)
  await page.reload()
  await expect(due).toBeEnabled()
  await due.click()
  const dialog = page.getByRole('dialog', { name: 'Scheduled review' })
  await expect(dialog.getByRole('button', { name: 'Build response', exact: true })).toBeVisible()
  const stepId = await dialog.locator('[data-review-step]').getAttribute('data-review-step')
  const step = lesson.steps.find(s => s.id === stepId)!
  await dialog.getByRole('button', { name: 'Show response choices', exact: true }).click()
  await dialog.locator('.answer-option').filter({ hasText: step.answers.find(a => a.id === step.evaluation.correctAnswerId)!.arabizi }).click()
  const before = Date.now()
  await dialog.getByRole('button', { name: 'Check answer', exact: true }).click()
  await expect(dialog.locator('.feedback-panel')).toBeFocused()
  const saved = (await history(page)).find(row => row.stepId === stepId)
  expect(saved.schedule.intervalIndex).toBe(0)
  expect(Date.parse(saved.schedule.dueAt)).toBeGreaterThanOrEqual(before + day)
  await dialog.getByRole('button', { name: 'Close review' }).click()
  await expect(dialog).toHaveCount(0)
  await page.getByRole('link', { name: 'Practice', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Mixed review', exact: true })).toBeEnabled()
  await page.screenshot({ path: testInfo.outputPath('scheduled-review-mobile.png'), fullPage: true })
  await seed(page, lesson, '2099-01-01T00:00:00Z')
  await page.reload()
  await expect(page.getByRole('button', { name: /^Review due/ })).toBeDisabled()
  const dueLabel = await page.evaluate(() => new Date('2099-01-01T00:00:00Z').toLocaleDateString(undefined, { month: 'short', day: 'numeric' }))
  await expect(page.getByText(`Next review: ${dueLabel}`, { exact: true })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Mixed review', exact: true })).toBeEnabled()
})

test('new published version restarts due review and withdrawal removes it', async ({ page }) => {
  await page.goto('/#/today')
  const lesson = await firstLesson(page)
  await expect(page.getByRole('button', { name: /^Review due/ })).toBeDisabled()
  await seed(page, lesson, '2099-01-01T00:00:00Z', 'previous-version')
  await page.reload()
  await expect(page.getByRole('button', { name: /^Review due/ })).toBeEnabled()
  await page.route(`**/api/lessons/${lesson.id}`, route => route.fulfill({ status: 410, contentType: 'application/json', body: '{}' }))
  await page.reload()
  await expect(page.getByRole('button', { name: /^Review due/ })).toBeDisabled()
})

test('unassisted due response advances once, duplicate contexts clear, and guest scheduling stays isolated', async ({ page }) => {
  await page.goto('/#/today')
  const lesson = await firstLesson(page)
  await expect(page.getByRole('button', { name: /^Review due/ })).toBeDisabled()
  await seed(page, lesson, '2020-01-01T00:00:00Z')
  await page.reload()
  await page.getByRole('button', { name: /^Review due/ }).click()
  const dialog = page.getByRole('dialog', { name: 'Scheduled review' })
  const stepId = await dialog.locator('[data-review-step]').getAttribute('data-review-step')
  const step = lesson.steps.find(s => s.id === stepId)!
  const target = step.answers.find(a => a.id === step.evaluation.correctAnswerId)!
  await dialog.getByRole('button', { name: 'Build response', exact: true }).click()
  for (const word of target.arabic.trim().split(/\s+/)) {
    await dialog.locator('.word-bank .word-tile:not(:disabled)').filter({ has: page.getByText(word, { exact: true }) }).first().click()
  }
  const before = Date.now()
  await dialog.getByRole('button', { name: 'Check answer', exact: true }).click()
  await expect(dialog.locator('.feedback-panel')).toBeFocused()
  const saved = (await history(page)).find(row => row.stepId === stepId)
  expect(saved.schedule.intervalIndex).toBe(2)
  expect(Date.parse(saved.schedule.dueAt)).toBeGreaterThanOrEqual(before + 7 * day)
  await dialog.getByRole('button', { name: 'Close review' }).click()
  await expect(dialog).toHaveCount(0)
  // All fixture steps in this lesson repeat this exact exchange. The most recent
  // result prevents the unselected duplicate steps from remaining due.
  const distinct = new Set(lesson.steps.map(s => JSON.stringify([s.prompt, s.instruction])))
  if (distinct.size === 1) await expect(page.getByRole('button', { name: /^Review due/ })).toBeDisabled()
  await seed(page, lesson, '2020-01-01T00:00:00Z')
  const csrf = await (await page.request.get('/api/auth/csrf')).json()
  expect((await page.request.post('/api/auth/register', {
    headers: { 'X-CSRF-TOKEN': csrf.token },
    data: { displayName: 'Schedule learner', email: `schedule-${Date.now()}@example.test`, password: 'long-test-password' },
  })).ok()).toBeTruthy()
  await page.reload()
  await expect(page.getByRole('button', { name: /^Review due/ })).toBeDisabled()
  await page.getByRole('link', { name: 'Account', exact: true }).click()
  await page.getByRole('button', { name: 'Sign out', exact: true }).click()
  await page.getByRole('link', { name: 'Today', exact: true }).click()
  await expect(page.getByRole('button', { name: /^Review due/ })).toBeEnabled()
})
