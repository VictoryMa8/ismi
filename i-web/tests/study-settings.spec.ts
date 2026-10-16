import { expect, test, type Page } from '@playwright/test'
import { buildStudyPlan, type StudyPreferences } from '../src/studyPlan'
import type { CourseLessonSummary } from '../src/types'

function lesson(id: string, trackId: string, minutes = 5, completedToday = false): CourseLessonSummary {
  return { id, trackId, title: id, unitId: trackId, unitTitle: trackId, courseOrder: 1, estimatedMinutes: minutes,
    isCompleted: completedToday, completedToday, isCurrent: false, reviewStatus: 'demonstrative' }
}

test('whole-session queue respects courses, unavailable content, rotation and due review', () => {
  const ids = ['levantine', 'msa', 'quranic', 'french', 'khmer'] as const
  const lessons = ids.flatMap(id => [lesson(`${id}-1`, id), lesson(`${id}-2`, id), lesson(`${id}-3`, id)])
  for (const goalMinutes of [5, 10, 15, 30]) {
    for (let count = 1; count <= 5; count++) {
      const selectedTrackIds = ids.slice(0, count)
      const preferences = { goalMinutes, selectedTrackIds, primaryTrack: 'levantine' } as StudyPreferences
      const seen = new Set<string>()
      for (let day = 1; day <= 20; day++) {
        const date = `2026-10-${String(day).padStart(2, '0')}`
        const plan = buildStudyPlan(preferences, lessons, date)
        expect(plan).toEqual(buildStudyPlan(preferences, lessons, date))
        expect(new Set(plan.queue.map(l => l.id)).size).toBe(plan.queue.length)
        expect(plan.tasks.every(t => selectedTrackIds.includes(t.courseId))).toBeTruthy()
        expect(plan.plannedMinutes).toBeLessThanOrEqual(goalMinutes)
        plan.tasks.forEach(t => seen.add(t.courseId))
      }
      expect([...seen].sort()).toEqual([...selectedTrackIds].sort())
    }
  }
  const p: StudyPreferences = { goalMinutes: 15, selectedTrackIds: ['levantine', 'khmer'], primaryTrack: 'levantine' }
  const plan = buildStudyPlan(p, lessons, '2026-10-15', { levantine: 7, khmer: 3 })
  const afterReview = buildStudyPlan(p, lessons, '2026-10-15', {}, 5)
  expect(afterReview.plannedMinutes).toBeLessThanOrEqual(10)
  expect(plan.tasks[0]!.kind).toBe('review')
  expect(plan.tasks.filter(t => t.courseId === 'khmer')[0]!.kind).toBe('review')
  expect(buildStudyPlan(p, [], '2026-10-15').tasks).toEqual([])
  const overrun = buildStudyPlan({ ...p, goalMinutes: 5, selectedTrackIds: ['levantine'] }, [lesson('long', 'levantine', 7)], '2026-10-15')
  expect(overrun.overrunMinutes).toBe(2)
  expect(overrun.queue[0]!.estimatedMinutes).toBe(7)
  const completed = buildStudyPlan(p, lessons.map(l => ({ ...l, isCompleted: true, completedToday: true })), '2026-10-15')
  expect(completed.tasks).toEqual([])
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
  await page.getByLabel('Primary course', { exact: true }).selectOption('quranic')
  await page.getByRole('button', { name: 'Save study settings' }).click()
  await expect(page.getByRole('button', { name: 'Save study settings', exact: true })).toBeEnabled()
  await expect(page.getByText('Saved on this device.', { exact: true })).toBeVisible()
  await page.reload()
  await expect(page.getByLabel('30 min', { exact: true })).toBeChecked()
  await expect(page.getByLabel('Primary course', { exact: true })).toHaveValue('quranic')
  expect(await page.locator('body').evaluate(el => el.scrollWidth <= window.innerWidth)).toBeTruthy()
  await page.screenshot({ path: testInfo.outputPath('study-settings-mobile.png'), fullPage: true })
  await page.getByRole('link', { name: 'Today', exact: true }).click()
  const plan = page.getByRole('region', { name: 'Your plan' })
  await plan.getByText('Study time by course', { exact: true }).click()
  await expect(plan).toContainText('Quranic Arabic · 0 min')
  await expect(plan).toContainText('Palestinian Levantine · 33 min')
  // Today now surfaces the next lesson directly rather than duplicating a queue.
  await expect(page.getByRole('button', { name: /Continue in Levantine/ })).toBeVisible()
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
