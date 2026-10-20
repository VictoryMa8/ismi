import { readFileSync } from 'node:fs'
import { expect, test } from '@playwright/test'
import { buildStudyPlan } from '../src/studyPlan'
import { coursePathLessons } from '../src/courseSequence'
import type { DashboardResponse, LessonResponse } from '../src/types'

const packs = [
  '../../content/levantine/everyday-01/01-lesson.json',
  '../../content/levantine/expansion-20/11-lesson.json',
  '../../content/levantine/expansion-20/16-lesson.json',
  '../../content/levantine/expansion-20/21-lesson.json',
  '../../content/levantine/expansion-20/26-lesson.json',
].map(file => JSON.parse(readFileSync(new URL(file, import.meta.url), 'utf8')).lesson as LessonResponse)

for (const width of [390, 1280]) test(`one ordered course, no draft card, legacy practice retained offline at ${width}px`, async ({ page, context }, info) => {
  await page.setViewportSize({ width, height: 900 })
  const original = await (await page.request.get('/api/dashboard')).json() as DashboardResponse
  const demos = original.dailyPlan.lessons.map((item, index) => ({ ...item, isCompleted: index === 0 }))
  const lessons = packs.map(pack => ({ ...pack, isCompleted: false, isCurrent: false,
    publicationNotice: pack.courseOrder > 1 ? { releaseId: 'test-release', label: 'Unreviewed · text-only preview', details: 'AI-assisted draft. Human/source review pending.' } : null }))
  // Reproduce the old API order: units by internal name, legacy week at the end.
  const mixed = [...demos, ...lessons].sort((a, b) => a.unitId.localeCompare(b.unitId) || a.courseOrder - b.courseOrder)
  const dashboard = { ...original, dailyPlan: { ...original.dailyPlan, lessons: mixed } }
  const expected = [...lessons].sort((a, b) => a.courseOrder - b.courseOrder)
  expect(coursePathLessons(mixed).map(l => l.id)).toEqual(expected.map(l => l.id))
  const plan = buildStudyPlan({ goalMinutes: 15, selectedTrackIds: ['levantine'], primaryTrack: 'levantine' }, mixed)
  expect(plan.queue.map(l => l.id)).toEqual(expected.slice(0, 3).map(l => l.id))
  // Completed extra practice still consumes today's time.
  const practiced = mixed.map(l => l.id === demos[0]!.id ? { ...l, completedToday: true, estimatedMinutes: 15 } : l)
  expect(buildStudyPlan({ goalMinutes: 15, selectedTrackIds: ['levantine'], primaryTrack: 'levantine' }, practiced).tasks).toEqual([])
  expect(coursePathLessons(demos).map(l => l.id)).toEqual(demos.map(l => l.id))
  await page.route('**/api/dashboard', route => route.fulfill({ json: dashboard }))
  for (const pack of packs) await page.route(`**/api/lessons/${pack.id}`, route => route.fulfill({ json: { ...pack, publicationNotice: lessons.find(l => l.id === pack.id)!.publicationNotice } }))
  await page.goto('/#/today')
  await expect(page.locator('.publication-notice')).toHaveCount(0)
  await expect(page.locator('.primary-lesson-card')).toContainText(packs[0]!.title)
  await page.getByRole('link', { name: 'Courses', exact: true }).click()
  await expect(page.locator('.course-path-copy strong')).toHaveText(expected.map(l => l.title))
  await expect(page.locator('.course-path-marker')).toHaveText(['1', '11', '16', '21', '26'])
  await expect(page.getByRole('heading', { name: /Week 1/ })).toHaveCount(0)
  await expect(page.getByText('0 of 5 lessons complete', { exact: true })).toBeVisible()
  await expect(page.locator('.course-path li.current')).toContainText(packs[0]!.title)
  await expect(page.locator('.course-path li.current')).toContainText('Up next')
  await expect(page.locator('.course-path li').filter({ hasText: 'Up next' })).toHaveCount(1)
  await page.getByRole('button', { name: `Open ${packs[1]!.title}`, exact: true }).click()
  const dialog = page.getByRole('dialog', { name: packs[1]!.title, exact: true })
  await expect(dialog.locator('.publication-notice')).toContainText('Unreviewed · text-only preview')
  await dialog.getByRole('button', { name: 'Close lesson' }).click()
  await page.getByRole('link', { name: 'Practice', exact: true }).click()
  await page.getByRole('link', { name: /^Lesson practice,/ }).click()
  await expect(page.getByRole('heading', { name: 'Extra practice', exact: true })).toBeVisible()
  await expect(page.getByRole('button', { name: new RegExp(demos[0]!.title) })).toBeVisible()
  await page.getByRole('button', { name: new RegExp(demos[0]!.title) }).click()
  await expect(page.getByRole('dialog', { name: demos[0]!.title, exact: true })).toBeVisible()
  await page.getByRole('dialog').getByRole('button', { name: 'Learn the phrases', exact: true }).click()
  await page.getByRole('button', { name: 'Close lesson' }).click()
  await page.getByRole('link', { name: 'Today', exact: true }).click()
  await expect(page.getByRole('button', { name: `Resume ${demos[0]!.title}`, exact: true })).toBeVisible()
  await page.evaluate(async () => { await navigator.serviceWorker.ready })
  await context.setOffline(true)
  await page.reload()
  await page.getByRole('button', { name: `Resume ${demos[0]!.title}`, exact: true }).click()
  await expect(page.getByRole('dialog').getByRole('button', { name: 'Try from memory', exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Close lesson' }).click()
  await page.getByRole('link', { name: 'Courses', exact: true }).click()
  await expect(page.locator('.course-path-copy strong')).toHaveText(expected.map(l => l.title))
  await expect(page.locator('.publication-notice')).toHaveCount(0)
  expect(await page.locator('body').evaluate(el => el.scrollWidth <= innerWidth)).toBeTruthy()
  await page.getByRole('heading', { name: 'Courses', exact: true }).click()
  await page.screenshot({ path: info.outputPath(`course-sequence-${width}.png`), fullPage: true })
  await context.setOffline(false)
})
