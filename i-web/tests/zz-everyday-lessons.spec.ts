import { readFileSync } from 'node:fs'
import { expect, test, type Page, type Locator } from '@playwright/test'
import type { LessonResponse } from '../src/types'

const packages = Array.from({ length: 7 }, (_, index) => JSON.parse(readFileSync(
  new URL(`../../content/levantine/everyday-01/0${index + 1}-lesson.json`, import.meta.url), 'utf8',
))) as Array<{ lesson: LessonResponse; sources: unknown[] }>

async function post(page: Page, path: string, data: unknown = {}) {
  const csrf = await (await page.request.get('/api/auth/csrf')).json()
  return page.request.post(path, { data, headers: { 'X-CSRF-TOKEN': csrf.token } })
}
async function tabTo(page: Page, target: Locator) {
  for (let count = 0; count < 24; count++) {
    if (await target.evaluate(element => element === document.activeElement)) return
    await page.keyboard.press('Tab')
  }
  await expect(target).toBeFocused()
}
async function complete(page: Page, dialog: Locator, lesson: LessonResponse, wrongFirst = false) {
  await tabTo(page, dialog.getByRole('button', { name: 'Start practice' }))
  await page.keyboard.press('Enter')
  for (const [index, step] of lesson.steps.entries()) {
    if (wrongFirst && index === 0) {
      const wrong = step.answers.find(answer => answer.id !== step.evaluation.correctAnswerId)!
      const wrongIndex = step.answers.indexOf(wrong)
      await tabTo(page, dialog.locator('.answer-option').nth(wrongIndex))
      await page.keyboard.press('Enter')
      await tabTo(page, dialog.getByRole('button', { name: 'Check answer' }))
      await page.keyboard.press('Enter')
      await expect(dialog.getByText(wrong.rationale!, { exact: true })).toBeVisible()
      await tabTo(page, dialog.getByRole('button', { name: 'Try again' }))
      await page.keyboard.press('Enter')
    }
    const correctIndex = step.answers.findIndex(answer => answer.id === step.evaluation.correctAnswerId)
    await tabTo(page, dialog.locator('.answer-option').nth(correctIndex))
    await page.keyboard.press('Enter')
    await tabTo(page, dialog.getByRole('button', { name: 'Check answer' }))
    await page.keyboard.press('Enter')
    await expect(dialog.getByText(step.evaluation.correctExplanation, { exact: true })).toBeVisible()
    await tabTo(page, dialog.getByRole('button', { name: index === lesson.steps.length - 1 ? 'Complete lesson' : 'Next step' }))
    await page.keyboard.press('Enter')
  }
}

test('all authored lessons preview, then published test copies complete offline and reopen for review', async ({ page, context }, testInfo) => {
  test.setTimeout(120_000)
  await page.goto('/')
  const registration = await post(page, '/api/auth/register', { displayName: 'Preview owner', email: 'preview-owner@example.test', password: 'test-only-long-password' })
  if (!registration.ok()) expect((await post(page, '/api/auth/login', { email: 'preview-owner@example.test', password: 'test-only-long-password', rememberMe: false })).ok()).toBeTruthy()
  await page.reload()
  await page.getByRole('button', { name: 'Open account for Preview owner' }).first().click()
  await page.getByRole('button', { name: 'Open curriculum console' }).click()
  const versions: number[] = []
  const timing: Array<{ lesson: string; automatedWalkthroughSeconds: number }> = []
  for (const pack of packages) {
    await page.getByLabel('Import a lesson package as a draft').setInputFiles({ name: 'lesson.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(pack)) })
    await expect(page.getByText('Imported draft version 1.', { exact: false })).toBeVisible()
    const all = await (await page.request.get('/api/admin/curriculum/versions')).json()
    versions.push(all.find((version: { lessonId: string }) => version.lessonId === pack.lesson.id).id)
    expect((await page.request.get(`/api/lessons/${pack.lesson.id}`)).status()).toBe(404)
    const started = Date.now()
    await page.getByRole('button', { name: 'Preview saved version' }).click()
    const dialog = page.getByRole('dialog', { name: pack.lesson.title, exact: true })
    await expect(dialog.getByRole('list', { name: 'Dialogue transcript' }).getByRole('listitem')).toHaveCount(6)
    await expect(dialog.locator('[lang="ar"][dir="rtl"]').first()).toBeVisible()
    expect(await dialog.evaluate(element => element.scrollWidth <= element.clientWidth + 1)).toBeTruthy()
    if (pack.lesson.englishHelpInitiallyHidden) {
      await expect(dialog.getByRole('button', { name: 'Show English help' })).toBeVisible()
      await dialog.getByRole('button', { name: 'Show English help' }).click()
    }
    await expect(dialog.getByText(pack.lesson.introduction!.dialogue[0]!.line.meaning, { exact: true }).first()).toBeVisible()
    if (pack.lesson.courseOrder === 1) await page.screenshot({ path: testInfo.outputPath('lesson-01-dialogue.png') })
    await complete(page, dialog, pack.lesson, true)
    await expect(dialog.getByText('Preview complete', { exact: true })).toBeVisible()
    timing.push({ lesson: pack.lesson.id, automatedWalkthroughSeconds: (Date.now() - started) / 1000 })
    await dialog.getByRole('button', { name: 'Back to curriculum' }).click()
  }
  await testInfo.attach('automated-walkthrough-times', { body: JSON.stringify(timing, null, 2), contentType: 'application/json' })
  // Approval here applies ONLY to copies in the disposable Playwright database.
  for (const id of versions) {
    expect((await post(page, `/api/admin/curriculum/versions/${id}/approve`)).ok()).toBeTruthy()
    expect((await post(page, `/api/admin/curriculum/versions/${id}/publish`)).ok()).toBeTruthy()
  }
  await page.getByRole('button', { name: 'Back to learner app' }).click()
  await page.reload()
  await page.evaluate(async () => { await navigator.serviceWorker.ready })
  // Open each published package once so the entire unit, including notes, is cached.
  for (const { lesson } of packages) {
    await page.getByRole('button', { name: `Open ${lesson.title}`, exact: true }).click()
    const dialog = page.getByRole('dialog', { name: lesson.title, exact: true })
    await expect(dialog.getByRole('list', { name: 'Dialogue transcript' })).toBeVisible()
    await dialog.getByRole('button', { name: 'Close lesson' }).click()
  }
  await context.setOffline(true)
  await page.reload()
  for (const { lesson } of packages) {
    await page.getByRole('button', { name: `Open ${lesson.title}`, exact: true }).click()
    const dialog = page.getByRole('dialog', { name: lesson.title, exact: true })
    await expect(dialog.getByRole('list', { name: 'Dialogue transcript' })).toBeVisible()
    await complete(page, dialog, lesson, true)
    await expect(dialog.getByText('Saved on this device. Ismi will sync it when you reconnect.')).toBeVisible()
    await dialog.getByRole('button', { name: 'Back to today' }).click()
  }
  const unit = page.getByRole('region', { name: 'Everyday conversations with someone you love', exact: true })
  await expect(unit.getByRole('heading', { name: 'Unit complete' })).toBeVisible()
  await expect(page.getByText('7 completions waiting to sync', { exact: true })).toBeVisible()
  await unit.getByRole('button', { name: 'Review the unit' }).click()
  await complete(page, page.getByRole('dialog', { name: packages[0]!.lesson.title, exact: true }), packages[0]!.lesson)
  await page.getByRole('button', { name: 'Back to today' }).click()
  await expect(page.getByText('7 completions waiting to sync', { exact: true })).toBeVisible()
  await context.setOffline(false)
  await page.evaluate(() => window.dispatchEvent(new Event('online')))
  await expect(page.getByText('Progress synced', { exact: true })).toBeVisible()
  await page.reload()
  await expect(unit.getByRole('heading', { name: 'Unit complete' })).toBeVisible()
  await expect(page.getByText('7 of 13 lessons complete', { exact: true })).toBeVisible()
  await page.evaluate(() => window.dispatchEvent(new Event('online')))
  await expect(page.getByText('7 of 13 lessons complete', { exact: true })).toBeVisible()
})
