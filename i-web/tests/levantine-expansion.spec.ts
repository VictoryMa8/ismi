import { readFileSync } from 'node:fs'
import { expect, test } from '@playwright/test'
import { finishTeaching, responseChoices } from './lesson-helpers'
import type { LessonResponse } from '../src/types'
import { renameCharacterContent } from '../src/characters'
const packages = Array.from({ length: 20 }, (_, i) => JSON.parse(readFileSync(
  new URL(`../../content/levantine/expansion-20/${i + 11}-lesson.json`, import.meta.url), 'utf8'),
)) as { lesson: LessonResponse; sources: unknown[] }[]

test('character name migration preserves Arabic words and literal escapes', () => {
  expect(renameCharacterContent('خلينا نطبخ. لينا هون.')).toBe('خلينا نطبخ. فتوش هون.')
  expect(renameCharacterContent({ text: 'علينا وبالينا', literal: String.raw`\u0644\u064A\u0646\u0627` })).toEqual({ text: 'علينا وبالينا', literal: String.raw`\u0644\u064A\u0646\u0627` })
})

test('all twenty text previews disclose status, complete offline and sync without changing older publications', async ({ page, context }) => {
  test.setTimeout(300_000)
  await page.goto('/#/today')
  async function post(path: string, data: unknown = {}) {
    const csrf = await (await page.request.get('/api/auth/csrf')).json()
    return page.request.post(path, { data, headers: { 'X-CSRF-TOKEN': csrf.token } })
  }
  const credentials = { email: 'preview-owner@example.test', password: 'test-only-long-password' }
  const registration = await post('/api/auth/register', { displayName: 'Preview owner', ...credentials })
  if (!registration.ok()) expect((await post('/api/auth/login', { ...credentials, rememberMe: false })).ok()).toBeTruthy()
  const before = await (await page.request.get('/api/lessons/levantine-day-01')).json()
  for (const pack of packages) {
    const created = await post('/api/admin/curriculum/drafts', pack)
    expect(created.ok()).toBeTruthy()
    const draft = await created.json()
    expect((await page.request.get(`/api/lessons/${pack.lesson.id}`)).status()).toBe(404)
    expect((await post(`/api/admin/curriculum/versions/${draft.id}/approve`)).status()).toBe(400)
    expect((await post(`/api/admin/curriculum/versions/${draft.id}/approve-text-preview`)).ok()).toBeTruthy()
    expect((await post(`/api/admin/curriculum/versions/${draft.id}/publish`)).ok()).toBeTruthy()
  }
  expect(await (await page.request.get('/api/lessons/levantine-day-01')).json()).toEqual(before)
  await page.reload()
  await page.evaluate(async () => { await navigator.serviceWorker.ready })
  await page.getByRole('link', { name: 'Courses', exact: true }).click()
  for (const { lesson } of packages) {
    const unit = page.getByRole('region', { name: lesson.unitTitle!, exact: true })
    await unit.getByRole('button', { name: `Open ${lesson.title}`, exact: true }).click()
    const dialog = page.getByRole('dialog', { name: lesson.title, exact: true })
    await expect(dialog.getByText('Unreviewed · text-only preview', { exact: true }).first()).toBeVisible()
    await expect(dialog.getByRole('list', { name: 'Dialogue transcript' }).getByRole('listitem')).toHaveCount(6)
    await dialog.getByRole('button', { name: 'Close lesson' }).click()
  }
  await context.setOffline(true)
  await page.reload()
  for (const [index, { lesson }] of packages.entries()) {
    const unit = page.getByRole('region', { name: lesson.unitTitle!, exact: true })
    await unit.getByRole('button', { name: `Open ${lesson.title}`, exact: true }).click()
    const dialog = page.getByRole('dialog', { name: lesson.title, exact: true })
    await expect(dialog.getByText('Unreviewed · text-only preview', { exact: true }).first()).toBeVisible()
    await finishTeaching(page, dialog)
    for (const [stepIndex, step] of lesson.steps.entries()) {
      await responseChoices(dialog, step.id)
      if (stepIndex === 0) {
        const wrong = step.answers.findIndex(a => a.id !== step.evaluation.correctAnswerId)
        await dialog.locator('.answer-option').nth(wrong).click()
        await dialog.getByRole('button', { name: 'Check answer', exact: true }).click()
        await expect(dialog.locator('.feedback-panel')).toContainText(step.answers[wrong]!.rationale!)
        await dialog.getByRole('button', { name: 'Try again', exact: true }).click()
        await responseChoices(dialog, step.id)
      }
      await dialog.locator('.answer-option').nth(step.answers.findIndex(a => a.id === step.evaluation.correctAnswerId)).click()
      await dialog.getByRole('button', { name: 'Check answer', exact: true }).click()
      await dialog.getByRole('button', { name: stepIndex === lesson.steps.length - 1 ? 'Complete lesson' : 'Next step', exact: true }).click()
    }
    await expect(dialog.getByText('Saved on this device. Ismi will sync it when you reconnect.')).toBeVisible()
    await dialog.getByRole('button', { name: 'Back to courses', exact: true }).click()
    await expect(page.getByText(`${index + 1} completion${index ? 's' : ''} waiting to sync`, { exact: true })).toBeVisible()
  }
  await context.setOffline(false)
  await page.evaluate(() => window.dispatchEvent(new Event('online')))
  await expect(page.getByText('20 completions waiting to sync', { exact: true })).toHaveCount(0)
  await page.reload()
  for (const unitTitle of new Set(packages.map(p => p.lesson.unitTitle))) {
    await expect(page.getByRole('region', { name: unitTitle!, exact: true }).getByRole('heading', { name: 'Unit complete' })).toBeVisible()
  }
})
