import { readFileSync } from 'node:fs'
import { expect, test, type Page } from '@playwright/test'
import { placementQuestions, placementRecommendation, placementStorageKey, type PlacementAnswer } from '../src/placement'
import type { LessonResponse } from '../src/types'
import { chooseCourse } from './courseSwitcher'
const packages: LessonResponse[] = [1, 2, 3].map(n => JSON.parse(readFileSync(new URL(`../../content/levantine/everyday-01/revisions/pilot-release/0${n}-lesson.json`, import.meta.url), 'utf8')).lesson)
const questions = placementQuestions(packages)
async function fixture(page: Page) {
  await page.route('**/api/dashboard', async route => {
    const dashboard = await (await route.fetch()).json()
    dashboard.dailyPlan.lessons = packages.map(p => ({ ...p, isCompleted: false, completedToday: false, isCurrent: p === packages[0] }))
    dashboard.dailyPlan.nextLessonId = packages[0]!.id
    await route.fulfill({ json: dashboard })
  })
  for (const pack of packages) await page.route(`**/api/lessons/${pack.id}`, route => route.fulfill({ json: pack }))
}
const region = (page: Page) => page.getByRole('region', { name: 'Find your starting point' })
async function begin(page: Page) {
  await region(page).getByRole('button', { name: 'Start Levantine check', exact: true }).click()
  await region(page).getByRole('button', { name: 'Begin questions', exact: true }).click()
}
async function finish(page: Page, withHelp = false, wrongFirst = false) {
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i]!
    if (withHelp && i === 0) await region(page).getByRole('button', { name: 'Show pronunciation help and meanings' }).click()
    const answerIndex = q.step.answers.findIndex(a => wrongFirst && i === 0 ? a.id !== q.step.evaluation.correctAnswerId : a.id === q.step.evaluation.correctAnswerId)
    await region(page).getByRole('radio').nth(answerIndex).focus()
    await page.keyboard.press('Space')
    await region(page).getByRole('button', { name: 'Check response' }).focus()
    await page.keyboard.press('Enter')
    await expect(region(page).getByText(q.step.evaluation.correctExplanation, { exact: true })).toBeVisible()
    if (wrongFirst && i === 0) await expect(region(page).getByText(q.step.answers[answerIndex]!.rationale!, { exact: true })).toBeVisible()
    await region(page).getByRole('button', { name: i === 5 ? 'See recommendation' : 'Next question', exact: true }).click()
  }
}
test('placement excludes fixtures and recommends conservatively from source versions', () => {
  expect(questions).toHaveLength(6)
  for (const change of [{ reviewStatus: 'demonstrative' }, { trackId: 'msa' }, { introduction: null }])
    expect(placementQuestions(packages.map(p => ({ ...p, ...change }) as LessonResponse))).toEqual([])
  const answers: PlacementAnswer[] = questions.map(q => ({ lessonId: q.lessonId, version: q.version, stepId: q.step.id, answerId: q.step.evaluation.correctAnswerId, correct: true, help: false, sources: q.sources }))
  expect(placementRecommendation(questions, answers)?.lessonId).toBe(packages[2]!.id)
  answers[2]!.correct = false
  expect(placementRecommendation(questions, answers)?.lessonId).toBe(packages[1]!.id)
  answers[0]!.help = true
  expect(placementRecommendation(questions, answers)?.lessonId).toBe(packages[0]!.id)
  expect(placementRecommendation(questions, [])?.lessonId).toBe(packages[0]!.id)
  expect(placementStorageKey('guest')).not.toBe(placementStorageKey('user:1'))
  for (const q of questions) expect(q.sources).toEqual(packages.find(p => p.id === q.lessonId)!.introduction!.sourceLocators)
})
test('keyboard check retains support and help offline without awarding completion', async ({ page, context }, info) => {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  await fixture(page)
  await page.setViewportSize({ width: 320, height: 844 })
  await page.goto('/#/account')
  await page.evaluate(async () => { await navigator.serviceWorker.ready })
  await begin(page)
  await expect(region(page).getByRole('list', { name: 'Placement dialogue' }).getByRole('listitem')).toHaveCount(packages[0]!.introduction!.dialogue.length)
  await page.screenshot({ path: info.outputPath('placement-question-mobile.png'), fullPage: true })
  await finish(page, true)
  await expect(region(page)).toContainText('6 of 6 responses fit the context; 1 used help.')
  await expect(region(page)).toContainText(`Suggested start: ${packages[0]!.title}`)
  await expect(region(page)).toContainText('Bootcamp lessons not yet available')
  expect(await page.locator('body').evaluate(el => el.scrollWidth <= window.innerWidth)).toBeTruthy()
  await page.screenshot({ path: info.outputPath('placement-result-mobile.png'), fullPage: true })
  await context.setOffline(true); await page.reload()
  await expect(region(page)).toContainText('6 of 6 responses fit the context; 1 used help.')
  await region(page).getByRole('button', { name: 'Retry Levantine check' }).click()
  await region(page).getByRole('button', { name: 'Begin questions' }).click()
  await finish(page)
  await expect(region(page)).toContainText(`Suggested start: ${packages[2]!.title}`)
  await region(page).getByRole('button', { name: 'Open suggested lesson' }).click()
  await expect(page.getByRole('dialog', { name: packages[2]!.title, exact: true })).toBeVisible()
  await page.getByRole('dialog').getByRole('button', { name: 'Close lesson' }).click()
  await context.setOffline(false)
  expect((await (await page.request.get('/api/dashboard')).json()).dailyPlan.completedMinutes).toBe(0)
  expect(errors).toEqual([])
})
test('skipped state persists and account results are isolated from guests', async ({ page }) => {
  await fixture(page); await page.goto('/#/account')
  await region(page).getByRole('button', { name: 'Skip for now' }).click()
  await expect(region(page)).toContainText('Result saved on this device.')
  await page.reload()
  await expect(region(page)).toContainText('Check skipped.')
  const csrf = await (await page.request.get('/api/auth/csrf')).json()
  expect((await page.request.post('/api/auth/register', { headers: { 'X-CSRF-TOKEN': csrf.token }, data: { displayName: 'Placement learner', email: `placement-${Date.now()}@example.test`, password: 'placement-test-long-password' } })).ok()).toBeTruthy()
  await page.reload()
  await expect(page.getByRole('button', { name: 'Sign out', exact: true })).toBeVisible()
  await expect(region(page).getByRole('button', { name: 'Start Levantine check' })).toBeVisible()
  await begin(page); await finish(page, false, true)
  await expect(region(page)).toContainText(`Suggested start: ${packages[0]!.title}`)
  await page.getByRole('button', { name: 'Sign out', exact: true }).click()
  await page.getByRole('link', { name: 'Account', exact: true }).click()
  await expect(region(page)).toContainText('Check skipped.')
})
test('withdrawn content cannot shorten assessment; other tracks remain unavailable', async ({ page }) => {
  await fixture(page); await page.goto('/#/account')
  await page.route(`**/api/lessons/${packages[2]!.id}`, route => route.fulfill({ status: 410, json: { message: 'Withdrawn' } }))
  await region(page).getByRole('button', { name: 'Start Levantine check' }).click()
  await expect(region(page)).toContainText('This check needs the first three published lessons')
  await expect(region(page).getByRole('button', { name: 'Begin questions' })).toHaveCount(0)
  await page.getByRole('checkbox', { name: /Modern Standard Arabic/ }).check()
  await page.getByRole('checkbox', { name: /Quranic Arabic/ }).check()
  await page.getByRole('button', { name: 'Save study settings', exact: true }).click()
  for (const id of ['msa', 'quranic']) {
    await chooseCourse(page, id)
    await expect(region(page).getByText('Placement and reading/sound modules not yet available.', { exact: true })).toHaveCount(1)
  }
})
