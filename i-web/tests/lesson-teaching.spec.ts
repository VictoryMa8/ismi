import { readFileSync } from 'node:fs'
import { expect, test } from '@playwright/test'
import { finishTeaching, responseChoices } from './lesson-helpers'
import type { LessonResponse } from '../src/types'
const revision = JSON.parse(readFileSync(new URL('../../content/levantine/everyday-01/revisions/guided-teaching/01-lesson.json', import.meta.url), 'utf8')) as { lesson: LessonResponse; sources: unknown[] }

test('teaching supports recall, bounded phrase assembly, optional translations and keyboard retry', async ({ page }, testInfo) => {
  test.setTimeout(90_000)
  await page.goto('/#/today')
  const csrf = await (await page.request.get('/api/auth/csrf')).json()
  const credentials = { displayName: 'Preview owner', email: 'preview-owner@example.test', password: 'test-only-long-password' }
  const register = await page.request.post('/api/auth/register', { data: credentials, headers: { 'X-CSRF-TOKEN': csrf.token } })
  if (!register.ok()) {
    const token = await (await page.request.get('/api/auth/csrf')).json()
    expect((await page.request.post('/api/auth/login', { data: { ...credentials, rememberMe: false }, headers: { 'X-CSRF-TOKEN': token.token } })).ok()).toBeTruthy()
  }
  await page.reload()
  await page.getByRole('button', { name: 'Open account for Preview owner' }).first().click()
  await page.getByRole('button', { name: 'Open curriculum console' }).click()
  const pack = { ...revision, lesson: { ...revision.lesson, id: 'teaching-v2-fixture', title: 'Teaching flow fixture' } }
  await page.getByLabel('Import a lesson package as a draft').setInputFiles({ name: 'lesson.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(pack)) })
  await page.getByRole('button', { name: 'Preview saved version' }).click()
  const dialog = page.getByRole('dialog', { name: pack.lesson.title, exact: true })
  await expect(dialog.getByRole('list', { name: 'Dialogue transcript' }).getByRole('listitem')).toHaveCount(6)
  await expect(dialog.locator('.answer-option')).toHaveCount(0)
  await page.screenshot({ path: testInfo.outputPath('conversation.png') })
  await dialog.getByRole('button', { name: 'Learn the phrases' }).focus()
  await page.keyboard.press('Enter')
  await expect(dialog.getByRole('heading', { name: 'Start with a casual check-in' })).toBeFocused()
  await expect(dialog.getByRole('definition').filter({ hasText: 'what' })).toBeVisible()
  await dialog.getByText('Phrase sources', { exact: true }).click()
  await expect(dialog.getByRole('link', { name: /SAMPLE-Levantine-Arabic-Verbs/ })).toHaveAttribute('href', pack.lesson.introduction!.teachingCards![0]!.sourceLocators![1]!)
  await dialog.getByText('Phrase sources', { exact: true }).click()
  await page.screenshot({ path: testInfo.outputPath('phrase-building-blocks.png') })
  await dialog.getByRole('button', { name: 'Try from memory' }).focus()
  await page.keyboard.press('Enter')
  await expect(dialog.getByRole('heading', { name: 'How would you say this?' })).toBeFocused()
  await expect(dialog.locator('.spotlight-arabic')).toHaveCount(0)
  await expect(dialog.getByText(pack.lesson.introduction!.teachingCards![0]!.recallCue!, { exact: true })).toBeVisible()
  await dialog.getByRole('button', { name: 'Reveal phrase' }).click()
  await expect(dialog.locator('.spotlight-arabic')).toHaveText('شو عامل؟')
  // Exercise the return-to-teaching path, then finish all of the teaching cards.
  await dialog.getByRole('button', { name: 'Look back' }).click()
  await dialog.getByRole('button', { name: 'Look back' }).click()
  await finishTeaching(page, dialog)
  await expect(dialog.locator('.answer-option')).toHaveCount(0)
  await responseChoices(dialog)
  await expect(dialog.locator('.answer-meaning')).toHaveCount(0)
  await dialog.getByRole('button', { name: 'Translate prompt', exact: true }).click()
  await expect(dialog.locator('.prompt-meaning')).toBeVisible()
  await expect(dialog.locator('.answer-meaning')).toHaveCount(0)
  await dialog.getByRole('button', { name: 'Translate response choices' }).click()
  await expect(dialog.locator('.answer-meaning')).toHaveCount(3)
  await dialog.getByRole('button', { name: 'Hide response translations' }).click()
  await dialog.locator('.answer-option').first().focus()
  await page.keyboard.press('Enter')
  await dialog.getByRole('button', { name: 'Check answer' }).click()
  await expect(dialog.locator('.feedback-panel')).toBeFocused()
  await expect(dialog.getByText(pack.lesson.steps[0]!.answers[0]!.rationale!, { exact: true })).toBeVisible()
  await dialog.getByRole('button', { name: 'Try again' }).click()
  await expect(dialog.locator('.practice-instruction')).toBeFocused()
  await dialog.locator('.answer-option').nth(1).click()
  await dialog.getByRole('button', { name: 'Check answer' }).click()
  await dialog.getByRole('button', { name: 'Next step' }).click()
  // One-word responses use choices. Advance to the multiword reconstruction turn.
  for (let index = 1; index < 4; index++) {
    await responseChoices(dialog, pack.lesson.steps[index]!.id)
    const correctIndex = pack.lesson.steps[index]!.answers.findIndex(a => a.id === pack.lesson.steps[index]!.evaluation.correctAnswerId)
    await dialog.locator('.answer-option').nth(correctIndex).click()
    await dialog.getByRole('button', { name: 'Check answer' }).click()
    await dialog.getByRole('button', { name: 'Next step' }).click()
  }
  // Support resets when a new turn begins.
  await expect(dialog.getByRole('region', { name: 'Build the response' })).toBeVisible()
  await expect(dialog.locator('.prompt-meaning')).toHaveCount(0)
  await expect(dialog.locator('.answer-option')).toHaveCount(0)
  const target = pack.lesson.steps[4]!.answers.find(a => a.id === pack.lesson.steps[4]!.evaluation.correctAnswerId)!
  // A complete wrong order can be checked and retried; no premature correctness hint.
  let attemptRequests = 0
  page.on('request', request => { if (request.url().includes('/attempts')) attemptRequests++ })
  for (const word of target.arabic.split(/\s+/).reverse()) {
    await dialog.locator('.word-bank .word-tile:not(:disabled)').filter({ has: page.locator('[lang="ar"]', { hasText: word }) }).first().click()
  }
  await expect(dialog.getByRole('button', { name: 'Check answer' })).toBeEnabled()
  await expect(dialog.getByText('All pieces placed. Check your response when you’re ready.')).toBeVisible()
  await dialog.getByRole('button', { name: 'Check answer' }).click()
  await expect(dialog.locator('.feedback-panel')).toBeFocused()
  await expect(dialog.getByText('Compare the phrase order', { exact: true })).toBeVisible()
  expect(attemptRequests).toBe(0)
  await dialog.getByRole('button', { name: 'Try again' }).click()
  await expect(dialog.locator('.built-phrase .word-tile')).toHaveCount(0)
  for (const word of target.arabic.split(/\s+/)) {
    const tile = dialog.locator('.word-bank .word-tile').filter({ has: page.locator('[lang="ar"]', { hasText: word }) }).first()
    await tile.focus(); await page.keyboard.press('Enter')
  }
  await expect(dialog.getByRole('button', { name: 'Check answer' })).toBeEnabled()
  // Teaching is a reference, not a reset of the in-progress reconstruction.
  await dialog.getByRole('button', { name: 'Review teaching', exact: true }).click()
  await dialog.getByRole('button', { name: 'Learn the phrases' }).click()
  await dialog.getByRole('button', { name: 'Go to practice', exact: true }).click()
  await expect(dialog.locator('.practice-instruction')).toBeFocused()
  await expect(dialog.locator('.built-phrase .word-tile')).toHaveCount(target.arabic.split(/\s+/).length)
  await dialog.getByRole('button', { name: 'Undo', exact: true }).click()
  await expect(dialog.getByRole('button', { name: 'Check answer' })).toBeDisabled()
  await dialog.locator('.word-bank .word-tile:not(:disabled)').first().click()
  await dialog.getByRole('button', { name: 'Check answer' }).click()
  await expect(dialog.locator('.feedback-panel')).toBeFocused()
  await expect(dialog.locator('.feedback-model [lang="ar"]')).toHaveText(target.arabic)
  await page.setViewportSize({ width: 320, height: 740 })
  expect(await dialog.evaluate(el => el.scrollWidth <= el.clientWidth + 1)).toBeTruthy()
  await page.screenshot({ path: testInfo.outputPath('assembled-response-320.png') })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await dialog.getByRole('button', { name: 'Next step' }).click()
  await expect(dialog.locator('.practice-instruction')).toBeFocused()
  expect(await dialog.locator('.practice-page').evaluate(el => parseFloat(getComputedStyle(el).transitionDuration))).toBeLessThanOrEqual(0.001)
  await dialog.getByRole('button', { name: 'Close lesson' }).click()
  await expect(page.getByRole('button', { name: 'Preview saved version' })).toBeFocused()
  expect((await page.request.get('/api/lessons/teaching-v2-fixture')).status()).toBe(404)
})
