import { readFileSync } from 'node:fs'
import { expect, test, type Page } from '@playwright/test'
import { finishTeaching, responseChoices } from './lesson-helpers'
import { chooseCourse } from './courseSwitcher'
import { placementQuestions } from '../src/placement'
import type { LessonResponse } from '../src/types'
const packs = [1, 2, 3, 4, 5].map(n => JSON.parse(readFileSync(new URL(`../../content/khmer/meet-01/0${n}-lesson.json`, import.meta.url), 'utf8'))) as { lesson: LessonResponse; sources: unknown[] }[]
async function post(page: Page, path: string, data: unknown = {}) {
  const csrf = await (await page.request.get('/api/auth/csrf')).json()
  return page.request.post(path, { data, headers: { 'X-CSRF-TOKEN': csrf.token } })
}
test('owner publishes exact unreviewed text previews; labels, offline completion and separate progress survive reconnect', async ({ page, context }) => {
  test.setTimeout(180_000)
  await page.goto('/#/today')
  const registration = await post(page, '/api/auth/register', { displayName: 'Preview owner', email: 'preview-owner@example.test', password: 'test-only-long-password' })
  if (!registration.ok()) expect((await post(page, '/api/auth/login', { email: 'preview-owner@example.test', password: 'test-only-long-password', rememberMe: false })).ok()).toBeTruthy()
  const arabic = (await (await page.request.get('/api/dashboard')).json()).tracks.find((t: { id: string }) => t.id === 'levantine').progressPercent
  const versions = await (await page.request.get('/api/admin/curriculum/versions')).json()
  for (const pack of packs) {
    if (!versions.some((v: { lessonId: string }) => v.lessonId === pack.lesson.id)) expect((await post(page, '/api/admin/curriculum/drafts', pack)).ok()).toBeTruthy()
  }
  await page.reload()
  await page.getByRole('link', { name: 'Account', exact: true }).first().click()
  await page.getByRole('button', { name: 'Open curriculum console' }).click()
  const published: LessonResponse[] = []
  for (const pack of packs) {
    await page.locator('.version-item').filter({ hasText: pack.lesson.id }).click()
    await page.getByRole('button', { name: 'Approve text-only preview', exact: true }).click()
    await expect(page.getByText('Approved only as an unreviewed text-only development preview.', { exact: false })).toBeVisible()
    await page.getByRole('button', { name: 'Publish', exact: true }).click()
    await expect(page.getByText('Published. Learners now receive this version from the API.', { exact: true })).toBeVisible()
    const lesson = await (await page.request.get(`/api/lessons/${pack.lesson.id}`)).json() as LessonResponse
    expect(lesson.contentReview!.reviewDisposition).toBe('pending')
    expect(lesson.contentReview!.rightsDisposition).toBe('pending')
    expect(lesson.contentReview!.reviewer).toBe('')
    expect(lesson.publicationNotice!.label).toBe('Unreviewed · text-only preview')
    expect(lesson.steps).toEqual(pack.lesson.steps.map(s => ({ ...s, characters: null,
      prompt: { ...s.prompt, recording: null } })))
    published.push(lesson)
  }
  expect(placementQuestions(published, 'khmer')).toEqual([])
  const catalog = await (await page.request.get('/api/courses')).json()
  expect(catalog.find((c: { course: { id: string } }) => c.course.id === 'khmer').unreviewedPreviewLessonCount).toBe(5)
  await page.getByRole('button', { name: 'Back to learner app' }).click()
  await page.reload()
  await chooseCourse(page, 'khmer')
  await page.getByRole('link', { name: 'Courses', exact: true }).click()
  await expect(page.locator('.publication-notice')).toHaveCount(0)
  await expect(page.getByRole('button', { name: /^Open / })).toHaveCount(5)
  const pack = packs[0]!
  await page.getByRole('button', { name: `Open ${pack.lesson.title}`, exact: true }).click()
  let dialog = page.getByRole('dialog', { name: pack.lesson.title, exact: true })
  await expect(dialog.locator('.publication-notice')).toContainText('Unreviewed · text-only preview')
  await expect(dialog.getByRole('list', { name: 'Dialogue transcript' })).toBeVisible()
  await dialog.getByRole('button', { name: 'Close lesson', exact: true }).click()
  await page.evaluate(async () => { await navigator.serviceWorker.ready })
  await context.setOffline(true)
  await page.reload()
  await page.getByRole('button', { name: `Open ${pack.lesson.title}`, exact: true }).click()
  dialog = page.getByRole('dialog', { name: pack.lesson.title, exact: true })
  await expect(dialog.locator('.publication-notice')).toContainText('Unreviewed · text-only preview')
  await finishTeaching(page, dialog)
  await expect(dialog.getByRole('button', { name: 'Text-only preview · audio unavailable', exact: true })).toBeDisabled()
  for (const [i, step] of pack.lesson.steps.entries()) {
    await responseChoices(dialog, step.id)
    await expect(dialog.locator('.publication-notice')).toBeVisible()
    await dialog.locator('.answer-option').nth(step.answers.findIndex(a => a.id === step.evaluation.correctAnswerId)).click()
    await dialog.getByRole('button', { name: 'Check answer', exact: true }).click()
    await dialog.getByRole('button', { name: i === pack.lesson.steps.length - 1 ? 'Complete lesson' : 'Next step', exact: true }).click()
  }
  await expect(dialog.getByText('Saved on this device. Ismi will sync it when you reconnect.')).toBeVisible()
  await expect(dialog.locator('.publication-notice')).toBeVisible()
  await dialog.getByRole('button', { name: 'Back to courses' }).click()
  await context.setOffline(false)
  await page.evaluate(() => window.dispatchEvent(new Event('online')))
  await expect(page.getByText('1 completion waiting to sync', { exact: true })).toHaveCount(0)
  await expect.poll(async () => {
    const d = await (await page.request.get('/api/dashboard')).json()
    return d.tracks.find((t: { id: string }) => t.id === 'khmer').progressPercent
  }).toBe(20)
  const dashboard = await (await page.request.get('/api/dashboard')).json()
  expect(dashboard.tracks.find((t: { id: string }) => t.id === 'levantine').progressPercent).toBe(arabic)
  await page.goto('/')
  await expect(page.locator('.track-khmer')).toContainText('Unreviewed · text-only preview')
  await expect(page.locator('.track-khmer')).toContainText('Five AI-assisted text lessons.')
})
