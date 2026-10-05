import { expect, test, type Page } from '@playwright/test'
import { buildStudyPlan, type StudyPreferences } from '../src/studyPlan'
import type { CourseLessonSummary } from '../src/types'

function lesson(id: string, trackId: string, minutes = 5, completedToday = false): CourseLessonSummary {
  return { id, trackId, title: id, unitId: trackId, unitTitle: trackId, courseOrder: 1, estimatedMinutes: minutes,
    isCompleted: completedToday, completedToday, isCurrent: false, reviewStatus: 'demonstrative' }
}

test('allocation preserves totals, primary priority, whole lessons and per-track completions', () => {
  for (const goalMinutes of [5, 10, 15, 30]) {
    for (const selectedTrackIds of [['levantine'], ['levantine', 'msa'], ['levantine', 'msa', 'quranic']] as StudyPreferences['selectedTrackIds'][]) {
      const plan = buildStudyPlan({ goalMinutes, selectedTrackIds, primaryTrack: 'levantine' }, [])
      expect(plan.allocations.reduce((sum, a) => sum + a.minutes, 0)).toBe(goalMinutes)
      expect(plan.allocations[0]!.minutes).toBeGreaterThanOrEqual(plan.allocations.at(-1)!.minutes)
      expect(plan.queue).toEqual([])
    }
  }
  const plan = buildStudyPlan({ goalMinutes: 15, selectedTrackIds: ['levantine', 'msa', 'quranic'], primaryTrack: 'msa' },
    [lesson('l1', 'levantine'), lesson('m1', 'msa', 5, true), lesson('m2', 'msa', 6), lesson('m3', 'msa')])
  expect(plan.allocations.map(a => a.minutes)).toEqual([9, 3, 3])
  expect(plan.queue.map(l => l.id)).toEqual(['m2', 'l1'])
  expect(plan.allocations[2]!.available).toBe(false)
})

async function saveGoal(page: Page, minutes: number) {
  await page.getByLabel(`${minutes} min`, { exact: true }).check()
  await page.getByRole('button', { name: 'Save study settings', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Save study settings', exact: true })).toBeEnabled()
}
async function post(page: Page, path: string, data: unknown) {
  const csrf = await (await page.request.get('/api/auth/csrf')).json()
  return page.request.post(path, { data, headers: { 'X-CSRF-TOKEN': csrf.token } })
}

test('guest settings work offline, keep unavailable tracks honest and preserve course access', async ({ page, context }, testInfo) => {
  await page.goto('/#/account')
  await expect(page.getByRole('button', { name: 'Save study settings' })).toBeEnabled()
  await page.evaluate(async () => { await navigator.serviceWorker.ready })
  await saveGoal(page, 30)
  await context.setOffline(true)
  await page.getByRole('checkbox', { name: /Modern Standard Arabic/ }).check()
  await page.getByRole('checkbox', { name: /Quranic Arabic/ }).check()
  await page.getByLabel('Primary track', { exact: true }).selectOption('quranic')
  await page.getByRole('button', { name: 'Save study settings' }).click()
  await expect(page.getByRole('button', { name: 'Save study settings', exact: true })).toBeEnabled()
  await expect(page.getByText('Saved on this device.', { exact: true })).toBeVisible()
  await page.reload()
  await expect(page.getByLabel('30 min', { exact: true })).toBeChecked()
  await expect(page.getByLabel('Primary track', { exact: true })).toHaveValue('quranic')
  expect(await page.locator('body').evaluate(el => el.scrollWidth <= window.innerWidth)).toBeTruthy()
  await page.screenshot({ path: testInfo.outputPath('study-settings-mobile.png'), fullPage: true })
  await page.getByRole('link', { name: 'Today', exact: true }).click()
  const plan = page.getByRole('region', { name: 'Your plan' })
  await expect(plan).toContainText('Quranic Arabic · 18 min')
  await expect(plan).toContainText('Palestinian Levantine · 6 min')
  await expect(plan.getByRole('list', { name: 'Today’s lesson queue' }).getByRole('listitem')).toHaveCount(2)
  await page.getByRole('link', { name: 'Edit study settings' }).click()
  await page.getByRole('checkbox', { name: 'Palestinian Levantine', exact: true }).uncheck()
  await page.getByRole('checkbox', { name: /Modern Standard Arabic/ }).uncheck()
  await page.getByRole('button', { name: 'Save study settings' }).click()
  await expect(page.getByRole('button', { name: 'Save study settings', exact: true })).toBeEnabled()
  await page.getByRole('link', { name: 'Today', exact: true }).click()
  await expect(page.getByText(/No new lessons are available for this plan/)).toBeVisible()
  await expect(page.getByRole('button', { name: /Continue in/ })).toHaveCount(0)
  await page.getByRole('link', { name: 'Courses', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Open Answer a friend’s check-in', exact: true })).toBeVisible()
})

test('account edits synchronize after offline conflict resolution and guest settings remain separate', async ({ page, context }) => {
  await page.goto('/#/account')
  await saveGoal(page, 5)
  expect((await post(page, '/api/auth/register', { displayName: 'Settings learner', email: 'study-settings@example.test', password: 'long test password' })).ok()).toBeTruthy()
  await page.reload()
  await expect(page.getByLabel('15 min', { exact: true })).toBeChecked()
  await saveGoal(page, 30)
  await expect(page.getByText('Study settings synced.', { exact: true })).toBeVisible()
  const saved = await (await page.request.get('/api/study-settings')).json()
  // A second device saves a different goal after this device's last fetch.
  expect((await post(page, '/api/study-settings', { revision: saved.revision, preferences: { ...saved.preferences, goalMinutes: 15 } })).ok()).toBeTruthy()
  await context.setOffline(true)
  await saveGoal(page, 10)
  await expect(page.getByText('Saved on this device. Account sync pending.', { exact: true })).toBeVisible()
  await page.reload()
  await expect(page.getByLabel('10 min', { exact: true })).toBeChecked()
  await context.setOffline(false)
  await page.evaluate(() => window.dispatchEvent(new Event('online')))
  await expect(page.getByRole('button', { name: 'Keep this device’s settings' })).toBeVisible()
  expect((await (await page.request.get('/api/study-settings')).json()).preferences.goalMinutes).toBe(15)
  await page.getByRole('button', { name: 'Keep this device’s settings' }).click()
  await expect(page.getByText('Study settings synced.', { exact: true })).toBeVisible()
  expect((await (await page.request.get('/api/study-settings')).json()).preferences.goalMinutes).toBe(10)
  await page.reload()
  await expect(page.getByLabel('10 min', { exact: true })).toBeChecked()
  await page.getByRole('button', { name: 'Sign out', exact: true }).click()
  await page.getByRole('link', { name: 'Account', exact: true }).click()
  await expect(page.getByLabel('5 min', { exact: true })).toBeChecked()
})
