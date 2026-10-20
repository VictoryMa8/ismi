import { readFileSync } from 'node:fs'
import { expect, test } from '@playwright/test'
import { courseCoverage, levantineCoursePlan as plan } from '../src/courseCoverage'
import type { CurriculumVersionSummary } from '../src/types'

function version(overrides: Partial<CurriculumVersionSummary> = {}): CurriculumVersionSummary {
  return { id: 101, lessonId: 'levantine-plans-02-01', title: 'Choose a plan', versionNumber: 1,
    status: 'draft', createdAtUtc: '', createdBy: 'local package import', publishedAtUtc: null,
    trackId: 'levantine', unitId: 'levantine-plans-02', courseOrder: 8, reviewStatus: 'owner-review', ...overrides }
}

test('course coverage separates versions, live predecessors, withdrawn content and demonstrations', () => {
  const coverage = courseCoverage([
    version({ id: 100, status: 'published' }), version({ versionNumber: 2 }),
    version({ lessonId: 'levantine-plans-02-02', courseOrder: 9, status: 'withdrawn' }),
    version({ lessonId: 'levantine-plans-02-03', courseOrder: 999 }),
    version({ lessonId: 'levantine-everyday-01-01', unitId: 'levantine-everyday-01', courseOrder: 1, reviewStatus: 'demonstrative' }),
    version({ lessonId: 'levantine-day-01', status: 'published', createdBy: 'system migration' }),
  ])
  expect(coverage.total).toBe(60)
  expect(coverage.authored).toBe(1)
  expect(coverage.approved).toBe(0)
  expect(coverage.published).toBe(1)
  expect(coverage.unmapped).toBe(1)
  expect(coverage.weeks[1]!.lessons[0]!.current?.versionNumber).toBe(2)
  expect(coverage.weeks[1]!.lessons[2]!.placementMismatch).toBe(true)
  expect(courseCoverage([version({ trackId: undefined })]).metadataMissing).toBe(true)
  expect(plan.weeks.map(w => w.week)).toEqual(Array.from({ length: 12 }, (_, n) => n + 1))
  const slots = plan.weeks.flatMap(w => w.lessons)
  expect(new Set(slots.map(l => l.lessonId)).size).toBe(60)
  expect(slots.map(l => l.courseOrder)).toEqual(Array.from({ length: 60 }, (_, n) => n + 1))
})

test('owner opens the course plan, inspects private draft and refreshes coverage after saving', async ({ page }) => {
  await page.goto('/#/today')
  async function post(path: string, data: unknown) {
    const csrf = await (await page.request.get('/api/auth/csrf')).json()
    return page.request.post(path, { data, headers: { 'X-CSRF-TOKEN': csrf.token } })
  }
  const credentials = { email: 'preview-owner@example.test', password: 'test-only-long-password' }
  const registered = await post('/api/auth/register', { displayName: 'Preview owner', ...credentials })
  if (!registered.ok()) expect((await post('/api/auth/login', { ...credentials, rememberMe: false })).ok()).toBeTruthy()
  const pack = JSON.parse(readFileSync(new URL('../../content/levantine/plans-02/01-lesson.json', import.meta.url), 'utf8'))
  const draftResponse = await post('/api/admin/curriculum/drafts', pack)
  expect(draftResponse.ok()).toBeTruthy()
  await page.reload()
  await page.getByRole('link', { name: 'Account', exact: true }).first().click()
  await expect(page.getByText(/Beta 0\.0\.8/)).toBeVisible()
  await page.getByRole('button', { name: 'Open curriculum console' }).click()
  const planView = page.locator('.course-coverage')
  await planView.locator('summary').first().focus()
  await page.keyboard.press('Enter')
  await expect(planView.getByRole('status')).toContainText('1 of 60 planned lessons stored')
  await expect(planView.getByRole('status')).toContainText('0 live publications')
  await planView.getByText('Week 2 · Make a plan together', { exact: true }).click()
  await planView.screenshot({ path: '/tmp/ismi-f12-course-plan-mobile.png' })
  await planView.getByRole('button', { name: 'Review Choose a plan', exact: true }).click()
  await expect(page.getByRole('textbox', { name: 'Structured lesson JSON' })).toHaveValue(/levantine-plans-02-01/)
  await page.getByRole('button', { name: 'Save draft', exact: true }).click()
  await expect(planView.getByRole('status')).toContainText('1 of 60 planned lessons stored')
  expect((await page.request.get('/api/lessons/levantine-plans-02-01')).status()).toBe(404)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBeTruthy()
  await page.getByRole('button', { name: 'Back to learner app' }).click()
  await page.route('**/api/admin/curriculum/versions', route => route.abort())
  await page.getByRole('button', { name: 'Open curriculum console' }).click()
  await planView.locator('summary').first().click()
  await expect(planView.getByRole('status')).toContainText('Coverage unavailable')
  await expect(planView).not.toContainText('0 of 60 planned lessons stored')
})
