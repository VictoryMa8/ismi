import { expect, test, type Locator, type Page } from '@playwright/test'
import { finishTeaching, responseChoices } from './lesson-helpers'
import { makeReviewQueue, reviewTurns } from '../src/review'
import type { LessonResponse } from '../src/types'

async function published(page: Page): Promise<LessonResponse[]> {
  const dashboard = await (await page.request.get('/api/dashboard')).json()
  return Promise.all(dashboard.dailyPlan.lessons.map(async (lesson: { id: string }) =>
    (await page.request.get(`/api/lessons/${lesson.id}`)).json()))
}

async function choose(dialog: Locator, lessons: LessonResponse[], wrong = false) {
  await expect(dialog.locator('.lesson-card-enter-active, .lesson-card-leave-active')).toHaveCount(0)
  const card = dialog.locator('[data-review-step]')
  await expect(card).toBeVisible()
  const lessonId = await card.getAttribute('data-review-lesson')
  const stepId = await card.getAttribute('data-review-step')
  const step = lessons.find(lesson => lesson.id === lessonId)!.steps.find(step => step.id === stepId)!
  const reveal = dialog.getByRole('button', { name: 'Show response choices', exact: true })
  const alternative = dialog.getByRole('button', { name: 'Use response choices instead' })
  if (await reveal.isVisible()) await reveal.click()
  else if (await alternative.isVisible()) await alternative.click()
  const chosen = step.answers.find(answer => wrong ? answer.id !== step.evaluation.correctAnswerId : answer.id === step.evaluation.correctAnswerId)!
  await dialog.locator('.answer-option').filter({ hasText: chosen.arabizi }).click()
  await dialog.getByRole('button', { name: 'Check answer', exact: true }).click()
  await expect(dialog.locator('.feedback-panel')).toBeFocused()
  return step
}

test('review queue mixes published contexts without padding repeated fixture turns', async ({ page }) => {
  await page.goto('/')
  const lessons = await published(page)
  const turns = reviewTurns(lessons, [])
  const queue = makeReviewQueue(turns, 'mixed')
  expect(queue.length).toBeGreaterThan(1)
  expect(queue.length).toBeLessThanOrEqual(6)
  expect(new Set(queue.map(turn => turn.step.prompt.arabic)).size).toBe(queue.length)
  expect(makeReviewQueue(turns, 'mistakes')).toEqual([])
})

test('lesson mistakes persist through retry and offline reload; fresh review resolves them', async ({ page, context }) => {
  test.setTimeout(60_000)
  await page.goto('/')
  const lessons = await published(page)
  const lesson = lessons[0]!
  await page.getByRole('button', { name: /Continue in Levantine/i }).click()
  const dialog = page.getByRole('dialog')
  await finishTeaching(page, dialog)
  await responseChoices(dialog)
  const step = lesson.steps[0]!
  const wrong = step.answers.find(answer => answer.id !== step.evaluation.correctAnswerId)!
  await dialog.locator('.answer-option').filter({ hasText: wrong.arabizi }).click()
  await dialog.getByRole('button', { name: 'Check answer' }).click()
  await expect(dialog.locator('.feedback-panel')).toBeFocused()
  await dialog.getByRole('button', { name: 'Try again' }).click()
  await dialog.locator('.answer-option').filter({ hasText: step.answers.find(answer => answer.id === step.evaluation.correctAnswerId)!.arabizi }).click()
  await dialog.getByRole('button', { name: 'Check answer' }).click()
  await expect(dialog.locator('.feedback-panel')).toBeFocused()
  await dialog.getByRole('button', { name: 'Close lesson' }).click()
  await page.getByRole('link', { name: 'Practice', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Review mistakes (1)' })).toBeEnabled()
  await page.evaluate(async () => { await navigator.serviceWorker.ready })
  await context.setOffline(true)
  await page.reload()
  await expect(page.getByRole('button', { name: 'Review mistakes (1)' })).toBeEnabled()
  const opener = page.getByRole('button', { name: 'Review mistakes (1)' })
  await opener.focus(); await page.keyboard.press('Enter')
  const review = page.getByRole('dialog', { name: 'Mistake review' })
  await expect(review.getByRole('button', { name: 'Close review' })).toBeFocused()
  await page.screenshot({ path: '/tmp/ismi-mistake-review-mobile.png', animations: 'disabled' })
  await page.keyboard.press('Shift+Tab')
  await expect(review.getByRole('button', { name: 'Interface sounds' })).toBeFocused()
  await choose(review, lessons)
  await review.getByText('Previous mistake', { exact: true }).click()
  await expect(review.locator('.review-previous')).toContainText(wrong.arabic)
  await review.getByRole('button', { name: 'Finish review' }).click()
  await expect(review.getByText('Review complete', { exact: true })).toBeFocused()
  await review.getByRole('button', { name: 'Back to practice' }).click()
  await expect(page.getByRole('button', { name: 'Review mistakes (0)' })).toBeDisabled()
  await expect(page.getByRole('button', { name: 'Mixed review' })).toBeFocused()
  await page.reload()
  await expect(page.getByRole('button', { name: 'Review mistakes (0)' })).toBeDisabled()
})

test('offline unit checkpoint records first answers and help without completing lessons twice', async ({ page, context }) => {
  test.setTimeout(60_000)
  await page.goto('/#/practice')
  const lessons = await published(page)
  await expect(page.getByRole('button', { name: /^Start .* checkpoint$/ })).toBeDisabled()
  await page.evaluate(async ids => {
    const token = (await (await fetch('/api/auth/csrf')).json()).token
    for (const id of ids) {
      const response = await fetch(`/api/lessons/${id}/completions`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': token }, body: JSON.stringify({ completionId: crypto.randomUUID(), completedAt: new Date().toISOString() }) })
      if (!response.ok) throw new Error(`Completion failed: ${response.status}`)
    }
  }, lessons.map(lesson => lesson.id))
  await page.reload()
  const start = page.getByRole('button', { name: /^Start .* checkpoint$/ })
  await expect(start).toBeEnabled()
  await page.evaluate(async () => { await navigator.serviceWorker.ready })
  await context.setOffline(true); await page.reload()
  await expect(start).toBeEnabled()
  await start.click()
  const dialog = page.getByRole('dialog', { name: 'Unit checkpoint' })
  await expect(dialog.getByRole('button', { name: 'Build response', exact: true })).toBeVisible()
  await expect(dialog.locator('.answer-option, .word-tile, .prompt-meaning')).toHaveCount(0)
  let count = 0
  while (!await dialog.getByText('Checkpoint complete', { exact: true }).isVisible()) {
    if (count === 0) {
      await choose(dialog, lessons, true)
      await dialog.getByRole('button', { name: 'Try again' }).click()
    }
    await choose(dialog, lessons)
    const current = dialog.locator('[data-review-step]')
    const oldLesson = await current.getAttribute('data-review-lesson')
    const oldStep = await current.getAttribute('data-review-step')
    await dialog.getByRole('button', { name: /^(Next exchange|Finish review)$/ }).click()
    await expect(dialog.locator(`[data-review-lesson="${oldLesson}"][data-review-step="${oldStep}"]`)).toHaveCount(0)
    count++
    if (count > 6) throw new Error('Checkpoint did not finish')
  }
  await expect(dialog).toContainText(`${count - 1} of ${count} first answers matched`)
  await expect(dialog).toContainText(`Translations or choices used on ${count} exchanges`)
  await dialog.getByRole('button', { name: 'Back to practice' }).click()
  await expect(page.locator('.checkpoint-history')).toContainText(`${count - 1} of ${count}`)
  await page.reload()
  await expect(page.locator('.checkpoint-history')).toContainText(`${count - 1} of ${count}`)
  await context.setOffline(false)
  expect((await (await page.request.get('/api/dashboard')).json()).dailyPlan.lessons.every((lesson: { isCompleted: boolean }) => lesson.isCompleted)).toBe(true)
  expect(await page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>(resolve => { const request = indexedDB.open('ismi-offline'); request.onsuccess = () => resolve(request.result) })
    return new Promise<number>(resolve => { const request = db.transaction('pending-completions').objectStore('pending-completions').count(); request.onsuccess = () => { db.close(); resolve(request.result) } })
  })).toBe(0)
})

test('review excludes withdrawn content and history from a previous version', async ({ page }) => {
  await page.goto('/')
  const lessons = await published(page)
  await page.evaluate(async lesson => {
    const db = await new Promise<IDBDatabase>(resolve => { const request = indexedDB.open('ismi-offline'); request.onsuccess = () => resolve(request.result) })
    await new Promise<void>(resolve => {
      const transaction = db.transaction('review-history', 'readwrite')
      transaction.objectStore('review-history').put({ key: 'old', scope: 'guest', lessonId: lesson.id, version: 'old-version', stepId: lesson.steps[0]!.id, needsReview: true, practicedAt: new Date().toISOString() })
      transaction.oncomplete = () => { db.close(); resolve() }
    })
  }, lessons[0]!)
  await page.getByRole('link', { name: 'Practice', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Mixed review' })).toBeEnabled()
  await expect(page.getByRole('button', { name: 'Review mistakes (0)' })).toBeDisabled()
  await page.route(`**/api/lessons/${lessons[0]!.id}`, route => route.fulfill({ status: 404, contentType: 'application/json', body: '{}' }))
  await page.reload()
  await expect(page.getByRole('button', { name: 'Mixed review' })).toBeDisabled()
  await expect(page.getByText(/1 lesson unavailable for review/)).toBeVisible()
})

test('review history stays separate for guest and account, with fixed desktop controls', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  await page.goto('/')
  const lessons = await published(page)
  const lesson = lessons[0]!
  await expect.poll(async () => page.evaluate(() => indexedDB.databases().then(databases => databases.some(database => database.name === 'ismi-offline')))).toBe(true)
  await page.evaluate(async lesson => {
    const db = await new Promise<IDBDatabase>(resolve => { const request = indexedDB.open('ismi-offline'); request.onsuccess = () => resolve(request.result) })
    await new Promise<void>(resolve => {
      const transaction = db.transaction('review-history', 'readwrite')
      transaction.objectStore('review-history').put({ key: 'guest-layout-test', scope: 'guest', lessonId: lesson.id, version: lesson.version, stepId: lesson.steps[0]!.id, needsReview: true, practicedAt: new Date().toISOString(), answerId: lesson.steps[0]!.answers[1]!.id, explanation: 'Fixture mistake' })
      transaction.oncomplete = () => { db.close(); resolve() }
    })
  }, lesson)
  await page.getByRole('link', { name: 'Practice', exact: true }).click()
  await page.getByRole('button', { name: 'Review mistakes (1)' }).click()
  const dialog = page.getByRole('dialog', { name: 'Mistake review' })
  const header = await dialog.locator('.lesson-sheet-header').boundingBox()
  const footer = await dialog.locator('.lesson-actions').boundingBox()
  await choose(dialog, lessons, true)
  await dialog.getByText('Previous mistake', { exact: true }).click()
  await dialog.getByRole('region', { name: 'Lesson content' }).evaluate(element => { element.scrollTop = element.scrollHeight })
  expect(await dialog.locator('.lesson-sheet-header').boundingBox()).toEqual(header)
  expect(await dialog.locator('.lesson-actions').boundingBox()).toEqual(footer)
  await page.screenshot({ path: '/tmp/ismi-mistake-review-desktop.png' })
  await page.keyboard.press('Escape')
  await page.getByRole('link', { name: 'Account', exact: true }).click()
  await page.getByRole('button', { name: 'Create account', exact: true }).click()
  await page.getByLabel('Display name', { exact: true }).fill('Review learner')
  await page.getByLabel('Email', { exact: true }).fill(`review-${Date.now()}@example.test`)
  await page.getByLabel('Password', { exact: true }).fill('test-only-long-password')
  await page.getByRole('button', { name: 'Create account', exact: true }).last().click()
  await expect(page.getByRole('heading', { name: 'Marhaba, Review learner.' })).toBeVisible()
  await page.getByRole('link', { name: 'Practice', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Review mistakes (0)' })).toBeDisabled()
  await page.getByRole('link', { name: 'Account', exact: true }).click()
  await page.getByRole('button', { name: 'Sign out', exact: true }).click()
  await page.getByRole('link', { name: 'Practice', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Review mistakes (1)' })).toBeEnabled()
  expect(errors).toEqual([])
})
