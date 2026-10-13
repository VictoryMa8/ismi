import { expect, test, type Page, type Locator } from '@playwright/test'
import { calendarDay, creditActivity, freshHabits, planQuests, rollWeek, streakSummary, weekStart, type HabitState, type ReviewAvailability } from '../src/learningHabits'
import { defaultPreferences } from '../src/studyPlan'
import type { CourseLessonSummary, LessonResponse } from '../src/types'
import { finishTeaching, responseChoices } from './lesson-helpers'

const monday = Date.parse('2026-10-05T12:00:00Z')
const day = 86_400_000
const available: ReviewAvailability = { ready: true, due: true, mixed: true, checkpoints: [{ id: 'unit', title: 'Everyday' }] }
const catalog: CourseLessonSummary[] = Array.from({ length: 7 }, (_, index) => ({ id: `lesson-${index}`, title: `Lesson ${index}`,
  trackId: 'levantine', unitId: 'unit', unitTitle: 'Everyday', courseOrder: index + 1, estimatedMinutes: 5,
  reviewStatus: 'owner-review', isCompleted: false, isCurrent: index === 0 }))
function enabled(): HabitState { return { ...freshHabits(monday, 'UTC'), questsEnabled: true, streakEnabled: true } }
function lessonCredit(state: HabitState, date: number, id = String(date)) {
  return creditActivity(state, { id, kind: 'lesson', lessonId: 'lesson-0', completedAt: new Date(date).toISOString() }, date)
}

test('all goals get bounded distinct available tasks; empty content, pending availability and track changes are honest', () => {
  for (const [goalMinutes, count] of [[5, 1], [10, 2], [15, 3], [30, 6]]) {
    const planned = planQuests(enabled(), { ...defaultPreferences(), goalMinutes: goalMinutes! }, catalog, available)
    expect(planned.tasks).toHaveLength(count!)
    expect(new Set(planned.tasks.map(task => task.id)).size).toBe(count!)
    if (count! >= 2) expect(planned.tasks[1]!.due).toBe(true)
    if (count! >= 3) expect(planned.tasks[2]!.kind).toBe('checkpoint')
  }
  const none = { ready: true, due: false, mixed: false, checkpoints: [] }
  const acrossUnits = [{ ...catalog[3]!, unitId: 'published-path' }, { ...catalog[0]!, unitId: 'fixtures' }]
  expect(planQuests(enabled(), { ...defaultPreferences(), goalMinutes: 5 }, acrossUnits, none).tasks[0]!.lessonId).toBe(catalog[3]!.id)
  expect(planQuests(enabled(), defaultPreferences(), [], none).tasks).toEqual([])
  expect(planQuests(enabled(), defaultPreferences(), catalog, { ...none, ready: false }).tasks).toEqual([])
  expect(planQuests(enabled(), { goalMinutes: 30, primaryTrack: 'msa', selectedTrackIds: ['msa'] }, catalog, none).tasks).toEqual([])
  expect(planQuests(enabled(), defaultPreferences(), catalog.slice(0, 1), none).tasks).toHaveLength(1)
  const fallback = planQuests(enabled(), defaultPreferences(), [], { ...none, mixed: true })
  expect(fallback.tasks).toMatchObject([{ kind: 'review', due: false }])
})

test('credit is idempotent, one task per completion; goal changes and independent opt-outs preserve evidence', () => {
  let state = planQuests(enabled(), defaultPreferences(), catalog, available)
  const practice = creditActivity(state, { id: 'lesson-practice', kind: 'lesson', lessonId: 'lesson-0', practiceOnly: true,
    completedAt: new Date(monday).toISOString() }, monday)
  expect(practice.tasks.filter(task => task.completedBy)).toHaveLength(0)
  expect(practice.studyDays).toHaveLength(1)
  state = lessonCredit(state, monday, 'stable-id')
  expect(state.tasks.filter(task => task.completedBy)).toHaveLength(1)
  expect(lessonCredit(state, monday + day, 'stable-id')).toEqual(state)
  const smaller = planQuests(state, { ...defaultPreferences(), goalMinutes: 5 }, catalog, available)
  expect(smaller.tasks).toHaveLength(1)
  expect(smaller.tasks[0]!.completedBy).toBe('stable-id')
  expect(planQuests(smaller, { ...defaultPreferences(), goalMinutes: 30 }, catalog, available).tasks).toHaveLength(6)
  const wrongKind = creditActivity(state, { id: 'mixed', kind: 'review', completedAt: new Date(monday).toISOString() }, monday)
  expect(wrongKind.tasks.filter(task => task.completedBy)).toHaveLength(1)
  const due = creditActivity(wrongKind, { id: 'due', kind: 'review', due: true, completedAt: new Date(monday).toISOString() }, monday)
  expect(due.tasks.filter(task => task.completedBy)).toHaveLength(2)
  expect(due.studyDays).toHaveLength(1)
  expect(lessonCredit({ ...state, questsEnabled: false }, monday + day).studyDays).toHaveLength(2)
  expect(lessonCredit({ ...state, streakEnabled: false }, monday + day).studyDays).toHaveLength(1)
  const off = { ...state, questsEnabled: false, streakEnabled: false }
  expect(lessonCredit(off, monday + day)).toEqual(off)
  expect(rollWeek(state, monday + 7 * day).tasks).toEqual([])
  expect(rollWeek(state, monday + 7 * day).studyDays).toEqual(state.studyDays)
  expect(rollWeek(state, monday - 7 * day)).toEqual(state)
  expect(lessonCredit(state, monday - day, 'backward')).toEqual(state)
})

test('calendar boundaries use the saved timezone through DST and device timezone changes', () => {
  expect(calendarDay(Date.parse('2026-10-12T04:59:59Z'), 'America/Chicago')).toBe('2026-10-11')
  expect(calendarDay(Date.parse('2026-10-12T05:00:00Z'), 'America/Chicago')).toBe('2026-10-12')
  expect(weekStart('2026-10-11')).toBe('2026-10-05')
  expect(weekStart('2026-10-12')).toBe('2026-10-12')
  const state = { ...freshHabits(Date.parse('2026-03-07T18:00:00Z'), 'America/Chicago'), streakEnabled: true }
  const a = lessonCredit(state, Date.parse('2026-03-08T07:59:00Z'))
  const b = lessonCredit(a, Date.parse('2026-03-08T08:01:00Z'))
  expect(b.studyDays).toEqual(['2026-03-08'])
  const c = lessonCredit(b, Date.parse('2026-03-09T04:59:00Z'))
  expect(c.studyDays).toEqual(['2026-03-08'])
  expect(c.timezone).toBe('America/Chicago')
  expect(rollWeek(c, Date.parse('2026-03-09T05:00:00Z')).week).toBe('2026-03-09')
})

test('two free grace days per Monday week preserve study days; exhausted gaps welcome a fresh start', () => {
  let state = lessonCredit(enabled(), monday)
  expect(streakSummary(state, monday + 2 * day)).toMatchObject({ studyDays: 1, graceRemaining: 1 })
  state = lessonCredit(state, monday + 3 * day)
  expect(streakSummary(state, monday + 3 * day)).toEqual({ studyDays: 2, graceUsed: 2, graceRemaining: 0, restart: false })
  expect(streakSummary(state, monday + 5 * day)).toMatchObject({ studyDays: 0, restart: true })
  state = lessonCredit(state, monday + 6 * day)
  expect(streakSummary(state, monday + 6 * day).studyDays).toBe(1)
  expect(streakSummary(state, monday + 7 * day)).toMatchObject({ studyDays: 1, graceRemaining: 2 })
  state = lessonCredit(state, monday + 9 * day)
  expect(streakSummary(state, monday + 9 * day)).toMatchObject({ studyDays: 2, graceRemaining: 0 })
  expect(streakSummary(state, monday + 8000 * day).restart).toBe(true)
})

async function enable(page: Page) {
  await page.goto('/#/account')
  await page.getByRole('checkbox', { name: 'Weekly quests', exact: true }).check()
  await page.getByRole('checkbox', { name: 'Forgiving streak', exact: true }).check()
  await page.getByLabel('5 min', { exact: true }).check()
  await page.getByRole('button', { name: 'Save study settings' }).click()
  await expect(page.getByRole('button', { name: 'Save study settings' })).toBeEnabled()
  await page.getByRole('link', { name: 'Today', exact: true }).click()
  await expect(page.getByRole('region', { name: 'This week' }).getByRole('listitem')).toHaveCount(1)
}
async function saved(page: Page, scope = 'guest'): Promise<HabitState> {
  return page.evaluate(scope => JSON.parse(localStorage.getItem(`ismi-learning-habits-v1:${scope}`) ?? '{}'), scope)
}
async function completeLesson(page: Page, lesson: LessonResponse) {
  const dialog = page.getByRole('dialog')
  await finishTeaching(page, dialog)
  for (const step of lesson.steps) {
    await responseChoices(dialog, step.id)
    const answer = step.answers.find(answer => answer.id === step.evaluation.correctAnswerId)!
    await dialog.locator('.answer-option').filter({ hasText: answer.arabizi }).click()
    await dialog.getByRole('button', { name: 'Check answer', exact: true }).click()
    await dialog.getByRole('button', { name: /^(Next exchange|Complete lesson)$/ }).click()
  }
  await dialog.getByRole('button', { name: 'Back to today' }).click()
}
async function chooseReview(page: Page, dialog: Locator, lessons: LessonResponse[]) {
  await expect(dialog.locator('.lesson-card-enter-active, .lesson-card-leave-active')).toHaveCount(0)
  const card = dialog.locator('[data-review-step]')
  const lessonId = await card.getAttribute('data-review-lesson')
  const stepId = await card.getAttribute('data-review-step')
  const step = lessons.find(lesson => lesson.id === lessonId)!.steps.find(step => step.id === stepId)!
  const reveal = dialog.getByRole('button', { name: 'Show response choices', exact: true })
  if (await reveal.isVisible()) await reveal.click()
  else await dialog.getByRole('button', { name: 'Use response choices instead', exact: true }).click()
  await dialog.locator('.answer-option').filter({ hasText: step.answers.find(answer => answer.id === step.evaluation.correctAnswerId)!.arabizi }).click()
  await dialog.getByRole('button', { name: 'Check answer', exact: true }).click()
  await dialog.getByRole('button', { name: /^(Next exchange|Finish review)$/ }).click()
  await expect(dialog.locator(`[data-review-lesson="${lessonId}"][data-review-step="${stepId}"]`)).toHaveCount(0)
}

test('optional controls, keyboard, goal changes, enlarged text and missing tracks', async ({ page }, testInfo) => {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  await page.goto('/#/today')
  await expect(page.getByRole('heading', { name: 'Your plan' })).toBeVisible()
  await expect(page.getByRole('region', { name: 'This week' })).toHaveCount(0)
  await page.getByRole('link', { name: 'Account', exact: true }).click()
  await expect(page.getByRole('checkbox', { name: 'Weekly quests', exact: true })).not.toBeChecked()
  await page.getByRole('checkbox', { name: 'Weekly quests', exact: true }).focus()
  await page.keyboard.press('Space')
  await expect(page.getByRole('checkbox', { name: 'Forgiving streak', exact: true })).not.toBeChecked()
  await page.getByRole('link', { name: 'Today', exact: true }).click()
  const region = page.getByRole('region', { name: 'This week' })
  await expect(region.getByRole('list', { name: 'Weekly quests' }).getByRole('listitem')).toHaveCount(3)
  for (const [goal, count] of [[5, 1], [10, 2], [30, 6]]) {
    await page.getByRole('link', { name: 'Account', exact: true }).click()
    await page.getByLabel(`${goal} min`, { exact: true }).check()
    await page.getByRole('button', { name: 'Save study settings' }).click()
    await expect(page.getByRole('button', { name: 'Save study settings' })).toBeEnabled()
    await page.getByRole('link', { name: 'Today', exact: true }).click()
    await expect(region.getByRole('listitem')).toHaveCount(count!)
  }
  await page.emulateMedia({ reducedMotion: 'reduce' })
  for (const width of [390, 1280]) {
    await page.setViewportSize({ width, height: 844 })
    await region.getByText('Weekly and streak rules', { exact: true }).focus()
    await page.keyboard.press('Enter')
    await expect(region).toContainText('Two missed days per week')
    await page.screenshot({ path: testInfo.outputPath(`habits-${width}.png`), fullPage: true })
    await page.keyboard.press('Enter')
  }
  await page.setViewportSize({ width: 390, height: 844 })
  await region.evaluate(element => {
    const elements = [element, ...element.querySelectorAll<HTMLElement>('*')]
    const sizes = elements.map(el => parseFloat(getComputedStyle(el).fontSize))
    elements.forEach((el, index) => { (el as HTMLElement).style.fontSize = `${sizes[index]! * 2}px` })
  })
  expect(await page.locator('body').evaluate(el => el.scrollWidth <= window.innerWidth)).toBe(true)
  await page.getByRole('link', { name: 'Account', exact: true }).click()
  await page.getByLabel('Modern Standard Arabic').check()
  await page.getByLabel('Palestinian Levantine').uncheck()
  await page.getByRole('button', { name: 'Save study settings' }).click()
  await expect(page.getByRole('button', { name: 'Save study settings' })).toBeEnabled()
  await page.getByRole('link', { name: 'Today', exact: true }).click()
  await expect(region).toContainText('No activities available')
  expect(errors).toEqual([])
})

test('offline completion, reload, reconnection and opt-out preserve one credit and completion acknowledgment', async ({ page, context }) => {
  await enable(page)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.getByRole('button', { name: 'Interface sounds', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Interface sounds', exact: true })).toHaveAttribute('aria-pressed', 'false')
  const region = page.getByRole('region', { name: 'This week' })
  await expect(region.getByRole('listitem')).toHaveCount(1)
  const first = (await saved(page)).tasks[0]!
  const lesson: LessonResponse = await (await page.request.get(`/api/lessons/${first.lessonId}`)).json()
  await page.evaluate(async () => { await navigator.serviceWorker.ready })
  await context.setOffline(true)
  await page.reload()
  await expect(region.getByRole('button', { name: first.label, exact: true })).toBeEnabled()
  await region.getByRole('button', { name: first.label, exact: true }).click()
  await completeLesson(page, lesson)
  await expect(region).toContainText('Weekly plan complete')
  await expect(region).toContainText('1 study day in your current streak')
  const credited = await saved(page)
  expect(credited.creditedIds).toHaveLength(1)
  await page.reload()
  await expect(region).toContainText('1 of 1 weekly activities complete')
  await expect(page.getByRole('button', { name: 'Interface sounds', exact: true })).toHaveAttribute('aria-pressed', 'false')
  await context.setOffline(false)
  await page.evaluate(() => window.dispatchEvent(new Event('online')))
  await expect.poll(async () => page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>(resolve => { const r = indexedDB.open('ismi-offline'); r.onsuccess = () => resolve(r.result) })
    return new Promise<number>(resolve => { const r = db.transaction('pending-completions').objectStore('pending-completions').count(); r.onsuccess = () => { db.close(); resolve(r.result) } })
  })).toBe(0)
  await page.reload()
  await expect(region).toContainText('1 of 1 weekly activities complete')
  expect((await saved(page)).creditedIds).toEqual(credited.creditedIds)
  await page.getByRole('link', { name: 'Account', exact: true }).click()
  await page.getByRole('checkbox', { name: 'Weekly quests', exact: true }).uncheck()
  await expect(page.getByRole('checkbox', { name: 'Forgiving streak', exact: true })).toBeChecked()
  await page.getByRole('link', { name: 'Today', exact: true }).click()
  await expect(region.getByRole('list')).toHaveCount(0)
  await expect(region).toContainText('1 study day')
  await page.getByRole('link', { name: 'Account', exact: true }).click()
  await page.getByRole('checkbox', { name: 'Forgiving streak', exact: true }).uncheck()
  await page.getByRole('link', { name: 'Today', exact: true }).click()
  await expect(region).toHaveCount(0)
  expect((await saved(page)).studyDays).toEqual(credited.studyDays)
})

test('review partial sessions do not count; completing a due quest with help counts once', async ({ page }) => {
  await enable(page)
  const dashboard = await (await page.request.get('/api/dashboard')).json()
  const lesson: LessonResponse = await (await page.request.get(`/api/lessons/${dashboard.dailyPlan.lessons[0].id}`)).json()
  // Existing reviewed practice makes the published package available without claiming a core completion.
  await page.evaluate(async lesson => {
    const db = await new Promise<IDBDatabase>(resolve => { const r = indexedDB.open('ismi-offline'); r.onsuccess = () => resolve(r.result) })
    await new Promise<void>(resolve => {
      const tx = db.transaction('review-history', 'readwrite')
      for (const step of lesson.steps) tx.objectStore('review-history').put({ key: JSON.stringify(['guest', lesson.id, lesson.version, step.id]),
        scope: 'guest', lessonId: lesson.id, version: lesson.version, stepId: step.id, practicedAt: '2020-01-01T00:00:00Z',
        needsReview: false, explanation: '', answerId: null, schedule: { intervalIndex: 0, dueAt: '2020-01-02T00:00:00Z' } })
      tx.oncomplete = () => { db.close(); resolve() }
    })
  }, lesson)
  await page.getByRole('link', { name: 'Account', exact: true }).click()
  await page.getByLabel('10 min', { exact: true }).check()
  await page.getByRole('button', { name: 'Save study settings' }).click()
  await expect(page.getByRole('button', { name: 'Save study settings' })).toBeEnabled()
  await page.getByRole('link', { name: 'Today', exact: true }).click()
  const quest = page.getByRole('region', { name: 'This week' }).getByRole('button', { name: 'Complete a due review', exact: true })
  await expect(quest).toBeEnabled()
  await quest.click()
  const dialog = page.getByRole('dialog', { name: 'Scheduled review' })
  await dialog.getByRole('button', { name: 'Close review' }).click()
  expect((await saved(page)).creditedIds).toHaveLength(0)
  await quest.click()
  await chooseReview(page, dialog, [lesson])
  await expect(dialog.getByText('Review complete', { exact: true })).toBeVisible()
  await dialog.getByRole('button', { name: 'Back to practice' }).click()
  await expect(page.getByRole('region', { name: 'This week' })).toContainText('Complete · Complete a due review')
  expect((await saved(page)).creditedIds).toHaveLength(1)
  expect((await saved(page)).studyDays).toHaveLength(1)
  await page.reload()
  await expect(page.getByRole('region', { name: 'This week' })).toContainText('1 of 2 weekly activities complete')
})

test('guest and account controls/history stay separate across sign-in and sign-out', async ({ page }) => {
  await enable(page)
  const guest = await saved(page)
  const csrf = await (await page.request.get('/api/auth/csrf')).json()
  const response = await page.request.post('/api/auth/register', { headers: { 'X-CSRF-TOKEN': csrf.token },
    data: { displayName: 'Habit learner', email: `habits-${Date.now()}@example.test`, password: 'long-test-password' } })
  expect(response.ok()).toBe(true)
  await page.reload()
  await expect(page.getByRole('heading', { name: 'Your plan' })).toBeVisible()
  await expect(page.getByRole('region', { name: 'This week' })).toHaveCount(0)
  await page.getByRole('link', { name: 'Account', exact: true }).click()
  await expect(page.getByRole('checkbox', { name: 'Weekly quests', exact: true })).not.toBeChecked()
  await page.getByRole('checkbox', { name: 'Forgiving streak', exact: true }).check()
  await page.getByRole('button', { name: 'Sign out', exact: true }).click()
  await expect(page.getByRole('checkbox', { name: 'Weekly quests', exact: true })).toBeChecked()
  await expect(page.getByRole('checkbox', { name: 'Forgiving streak', exact: true })).toBeChecked()
  expect((await saved(page)).tasks).toEqual(guest.tasks)
})

test('device storage failure leaves tracking off and core study accessible', async ({ page }) => {
  await page.addInitScript(() => { const original = Storage.prototype.setItem; Storage.prototype.setItem = function(key: string, value: string) {
    if (key.startsWith('ismi-learning-habits')) throw new DOMException('Storage full', 'QuotaExceededError')
    original.call(this, key, value)
  } })
  await page.goto('/#/account')
  await page.getByRole('checkbox', { name: 'Weekly quests', exact: true }).click()
  await expect(page.getByRole('alert')).toContainText('Learning habits could not be saved')
  await expect(page.getByRole('checkbox', { name: 'Weekly quests', exact: true })).not.toBeChecked()
  await page.getByRole('link', { name: 'Today', exact: true }).click()
  await expect(page.getByRole('button', { name: /Continue in Levantine/ })).toBeEnabled()
})

test('Monday resets a partial checklist; traveling keeps the saved timezone and welcomes a lapse', async ({ page, browser }) => {
  await page.clock.install({ time: new Date('2026-10-12T04:59:50Z') })
  await enable(page)
  const prior = await saved(page)
  // Seed earlier device-local evidence to exercise a missed week and a partial checklist.
  prior.timezone = 'America/Chicago'
  prior.week = '2026-10-05'
  prior.lastActivityDay = '2026-10-05'
  prior.studyDays = ['2026-10-05']
  prior.creditedIds = ['earlier-session']
  await page.evaluate(state => { localStorage.setItem('ismi-learning-habits-v1:guest', JSON.stringify(state)); window.dispatchEvent(new Event('focus')) }, prior)
  const region = page.getByRole('region', { name: 'This week' })
  await expect(region).toContainText('Welcome back')
  await expect(region).toContainText('A fresh start is always welcome')
  await expect(region).toContainText('Oct 5–Oct 11')
  await page.clock.runFor(35_000)
  await expect(region).toContainText('Oct 12–Oct 18')
  await expect(region).toContainText('2 free grace days left this week')
  const current = await saved(page)
  expect(current.studyDays).toEqual(prior.studyDays)
  expect(current.creditedIds).toEqual(prior.creditedIds)
  const traveler = await browser.newContext({ timezoneId: 'Asia/Tokyo', storageState: await page.context().storageState() })
  try {
    const tab = await traveler.newPage()
    await tab.clock.install({ time: new Date('2026-10-12T05:00:25Z') })
    await tab.goto('/#/today')
    await expect(tab.getByRole('region', { name: 'This week' })).toContainText('Oct 12–Oct 18')
    expect((await saved(tab)).timezone).toBe('America/Chicago')
    expect((await saved(tab)).studyDays).toEqual(prior.studyDays)
  } finally { await traveler.close() }
})

test('checkpoint quests use the existing completed-unit flow without extra lesson credit', async ({ page }) => {
  await enable(page)
  const dashboard = await (await page.request.get('/api/dashboard')).json()
  const lessons: LessonResponse[] = await Promise.all(dashboard.dailyPlan.lessons.map(async (lesson: { id: string }) =>
    (await page.request.get(`/api/lessons/${lesson.id}`)).json()))
  await page.evaluate(async ids => {
    const token = (await (await fetch('/api/auth/csrf')).json()).token
    for (const id of ids) {
      const response = await fetch(`/api/lessons/${id}/completions`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': token },
        body: JSON.stringify({ completionId: crypto.randomUUID(), completedAt: new Date().toISOString() }) })
      if (!response.ok) throw new Error(`Completion failed: ${response.status}`)
    }
  }, lessons.map(lesson => lesson.id))
  await page.getByRole('link', { name: 'Account', exact: true }).click()
  await page.getByLabel('15 min', { exact: true }).check()
  await page.getByRole('button', { name: 'Save study settings' }).click()
  await expect(page.getByRole('button', { name: 'Save study settings' })).toBeEnabled()
  await page.reload()
  await page.getByRole('link', { name: 'Today', exact: true }).click()
  const region = page.getByRole('region', { name: 'This week' })
  const start = region.getByRole('button', { name: `${lessons[0]!.unitTitle} checkpoint`, exact: true })
  await expect(start).toBeEnabled()
  await start.click()
  const dialog = page.getByRole('dialog', { name: 'Unit checkpoint' })
  let turns = 0
  while (!await dialog.getByText('Checkpoint complete', { exact: true }).isVisible()) {
    await chooseReview(page, dialog, lessons)
    if (++turns > 6) throw new Error('Checkpoint did not finish')
  }
  await dialog.getByRole('button', { name: 'Back to practice' }).click()
  await expect(region).toContainText(`Complete · ${lessons[0]!.unitTitle} checkpoint`)
  expect((await saved(page)).creditedIds).toHaveLength(1)
  expect((await saved(page)).studyDays).toHaveLength(1)
  expect((await (await page.request.get('/api/dashboard')).json()).dailyPlan.lessons.every((lesson: { isCompleted: boolean }) => lesson.isCompleted)).toBe(true)
})
