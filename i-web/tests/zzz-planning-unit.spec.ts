import { readFileSync } from 'node:fs'
import { expect, test, type Page, type Locator } from '@playwright/test'
import { finishTeaching, responseChoices } from './lesson-helpers'
import type { LessonResponse } from '../src/types'

const packages = [1, 2, 3].map(n => JSON.parse(readFileSync(
  new URL(`../../content/levantine/plans-02/0${n}-lesson.json`, import.meta.url), 'utf8',
))) as Array<{ lesson: LessonResponse; sources: unknown[] }>

async function post(page: Page, path: string, data: unknown = {}) {
  const csrf = await (await page.request.get('/api/auth/csrf')).json()
  return page.request.post(path, { data, headers: { 'X-CSRF-TOKEN': csrf.token } })
}
async function complete(page: Page, dialog: Locator, lesson: LessonResponse) {
  await finishTeaching(page, dialog)
  for (const [index, step] of lesson.steps.entries()) {
    await responseChoices(dialog, step.id)
    const wrong = step.answers.findIndex(a => a.id !== step.evaluation.correctAnswerId)
    if (index === 0) {
      await dialog.locator('.answer-option').nth(wrong).click()
      await dialog.getByRole('button', { name: 'Check answer' }).click()
      await expect(dialog.locator('.feedback-panel')).toContainText(step.answers[wrong]!.rationale!)
      await dialog.getByRole('button', { name: 'Try again' }).click()
      await responseChoices(dialog, step.id)
    }
    await dialog.locator('.answer-option').nth(step.answers.findIndex(a => a.id === step.evaluation.correctAnswerId)).click()
    await dialog.getByRole('button', { name: 'Check answer' }).click()
    await expect(dialog.locator('.feedback-panel')).toContainText(step.evaluation.correctExplanation)
    await dialog.getByRole('button', { name: index === lesson.steps.length - 1 ? 'Complete lesson' : 'Next step', exact: true }).click()
  }
}

test('planning drafts preview privately; test publications complete offline and sync as a separate unit', async ({ page, context }) => {
  test.setTimeout(180_000)
  await page.goto('/#/today')
  const registration = await post(page, '/api/auth/register', { displayName: 'Preview owner', email: 'preview-owner@example.test', password: 'test-only-long-password' })
  if (!registration.ok()) expect((await post(page, '/api/auth/login', { email: 'preview-owner@example.test', password: 'test-only-long-password', rememberMe: false })).ok()).toBeTruthy()
  await page.reload()
  await page.getByRole('button', { name: 'Open account for Preview owner' }).first().click()
  await page.getByRole('button', { name: 'Open curriculum console' }).click()
  const versions: number[] = []
  for (const pack of packages) {
    await page.getByLabel('Import a lesson package as a draft').setInputFiles({ name: 'lesson.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(pack)) })
    await expect(page.getByText('Imported draft version 1.', { exact: false })).toBeVisible()
    const all = await (await page.request.get('/api/admin/curriculum/versions')).json()
    versions.push(all.find((v: { lessonId: string }) => v.lessonId === pack.lesson.id).id)
    expect((await page.request.get(`/api/lessons/${pack.lesson.id}`)).status()).toBe(404)
    await page.getByRole('button', { name: 'Preview saved version' }).click()
    const dialog = page.getByRole('dialog', { name: pack.lesson.title, exact: true })
    await expect(dialog.getByRole('list', { name: 'Dialogue transcript' }).getByRole('listitem')).toHaveCount(6)
    await expect(dialog.locator('.dialogue-transcript .character-label')).toHaveCount(6)
    expect(await dialog.evaluate(el => el.scrollWidth <= el.clientWidth + 1)).toBeTruthy()
    await complete(page, dialog, pack.lesson)
    await expect(dialog.getByText('Preview complete', { exact: true })).toBeVisible()
    await dialog.getByRole('button', { name: 'Back to curriculum' }).click()
  }
  // These approvals publish copies only in Playwright's disposable database.
  for (const id of versions) {
    expect((await post(page, `/api/admin/curriculum/versions/${id}/approve`)).ok()).toBeTruthy()
    expect((await post(page, `/api/admin/curriculum/versions/${id}/publish`)).ok()).toBeTruthy()
  }
  await page.getByRole('button', { name: 'Back to learner app' }).click()
  await page.reload()
  await page.evaluate(async () => { await navigator.serviceWorker.ready })
  await page.getByRole('link', { name: 'Courses', exact: true }).click()
  const unit = page.getByRole('region', { name: 'Make a plan together', exact: true })
  await expect(unit.getByRole('button', { name: /^Open / })).toHaveCount(3)
  for (const { lesson } of packages) {
    await unit.getByRole('button', { name: `Open ${lesson.title}`, exact: true }).click()
    const dialog = page.getByRole('dialog', { name: lesson.title, exact: true })
    await expect(dialog.getByRole('list', { name: 'Dialogue transcript' })).toBeVisible()
    await dialog.getByRole('button', { name: 'Close lesson' }).click()
  }
  await context.setOffline(true)
  await page.reload()
  for (const { lesson } of packages) {
    await unit.getByRole('button', { name: `Open ${lesson.title}`, exact: true }).click()
    const dialog = page.getByRole('dialog', { name: lesson.title, exact: true })
    await complete(page, dialog, lesson)
    await expect(dialog.getByText('Saved on this device. Ismi will sync it when you reconnect.')).toBeVisible()
    await dialog.getByRole('button', { name: 'Back to courses' }).click()
  }
  await expect(unit.getByRole('heading', { name: 'Unit complete' })).toBeVisible()
  await expect(page.getByText('3 completions waiting to sync', { exact: true })).toBeVisible()
  await context.setOffline(false)
  await page.evaluate(() => window.dispatchEvent(new Event('online')))
  await expect(page.getByText('3 completions waiting to sync', { exact: true })).toHaveCount(0)
  await page.reload()
  await expect(unit.getByRole('heading', { name: 'Unit complete' })).toBeVisible()
})
