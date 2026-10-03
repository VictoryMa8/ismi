import { readFileSync } from 'node:fs'
import { expect, test } from '@playwright/test'
import { finishTeaching, responseChoices } from '../tests/lesson-helpers'
import type { LessonResponse } from '../src/types'

const packages = Array.from({ length: 7 }, (_, index) => JSON.parse(readFileSync(
  new URL(`../../content/levantine/everyday-01/revisions/pilot-release/0${index + 1}-lesson.json`, import.meta.url), 'utf8',
))) as Array<{ lesson: LessonResponse; sources: unknown[] }>

// Online touch coverage complements the existing Chromium keyboard/offline suite.
// Real iPhone offline reload and VoiceOver remain explicit manual release gates.
test('candidate unit completes by touch with retries and preserved progress', async ({ page }, testInfo) => {
  test.setTimeout(240_000)
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  async function post(path: string, data: unknown = {}) {
    const csrf = await (await page.request.get('/api/auth/csrf')).json()
    return page.request.post(path, { data, headers: { 'X-CSRF-TOKEN': csrf.token } })
  }
  await page.goto('/#/today')
  expect((await post('/api/auth/register', {
    displayName: 'Preview owner', email: 'preview-owner@example.test', password: 'test-only-long-password',
  })).ok()).toBeTruthy()
  // These approvals only publish disposable test copies, never owner/host content.
  for (const pack of packages) {
    const created = await post('/api/admin/curriculum/drafts', pack)
    expect(created.ok()).toBeTruthy()
    const { id } = await created.json()
    expect((await post(`/api/admin/curriculum/versions/${id}/validate`)).ok()).toBeTruthy()
    expect((await post(`/api/admin/curriculum/versions/${id}/approve`)).ok()).toBeTruthy()
    expect((await post(`/api/admin/curriculum/versions/${id}/publish`)).ok()).toBeTruthy()
  }
  expect((await post('/api/auth/logout')).ok()).toBeTruthy()
  await page.reload()
  await page.getByRole('link', { name: 'Courses', exact: true }).tap()
  for (const { lesson } of packages) {
    await page.getByRole('button', { name: `Open ${lesson.title}`, exact: true }).tap()
    const dialog = page.getByRole('dialog', { name: lesson.title, exact: true })
    await expect(dialog.getByRole('list', { name: 'Dialogue transcript' }).getByRole('listitem')).toHaveCount(6)
    expect(await dialog.evaluate(element => element.scrollWidth <= element.clientWidth + 1)).toBeTruthy()
    if (lesson.courseOrder === 1) {
      await expect(dialog.locator('.lesson-card-enter-active, .lesson-card-leave-active')).toHaveCount(0)
      await page.screenshot({ path: testInfo.outputPath('iphone-dialogue.png'), animations: 'disabled' })
    }
    await finishTeaching(page, dialog)
    for (const [index, step] of lesson.steps.entries()) {
      await responseChoices(dialog, step.id)
      if (step.id === 'e04-07') await expect(dialog.locator('.practice-page > .character-cue')).toContainText('Reply as Knafeh to Fattoush')
      if (step.id === 'e05-01') await expect(dialog.locator('.practice-page > .character-cue')).toContainText('Reply as Fattoush to Knafeh')
      if (index === 0) {
        const wrong = step.answers.findIndex(answer => answer.id !== step.evaluation.correctAnswerId)
        await dialog.locator('.answer-option').nth(wrong).tap()
        await dialog.getByRole('button', { name: 'Check answer' }).tap()
        await expect(dialog.locator('.feedback-panel')).toContainText(step.answers[wrong]!.rationale!)
        await dialog.getByRole('button', { name: 'Try again' }).tap()
      }
      await dialog.locator('.answer-option').nth(step.answers.findIndex(answer => answer.id === step.evaluation.correctAnswerId)).tap()
      await dialog.getByRole('button', { name: 'Check answer' }).tap()
      await expect(dialog.locator('.feedback-panel')).toContainText(step.evaluation.correctExplanation)
      if (step.id === 'e04-07') await page.screenshot({ path: testInfo.outputPath('iphone-corrected-role.png') })
      await dialog.getByRole('button', { name: index === lesson.steps.length - 1 ? 'Complete lesson' : 'Next step' }).tap()
    }
    await dialog.getByRole('button', { name: 'Back to courses' }).tap()
  }
  const unit = page.getByRole('region', { name: 'Everyday conversations with someone you love', exact: true })
  await expect(unit.getByRole('heading', { name: 'Unit complete' })).toBeVisible()
  await page.reload()
  await expect(unit.getByRole('heading', { name: 'Unit complete' })).toBeVisible()
  await expect(page.getByText('7 of 13 lessons complete', { exact: true })).toBeVisible()
  expect(errors).toEqual([])
})
