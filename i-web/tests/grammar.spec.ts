import { readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { expect, test, type Page } from '@playwright/test'
import type { LessonResponse } from '../src/types'
import metadata from '../package.json' with { type: 'json' }
import { responseChoices } from './lesson-helpers'
const path = '../content/levantine/everyday-01/revisions/phrase-anatomy/'
const candidate = JSON.parse(readFileSync(`${path}01-lesson.json`, 'utf8'))
const lesson = candidate.lesson as LessonResponse
async function fixture(page: Page) {
  await page.route('**/api/dashboard', async route => {
    const dashboard = await (await route.fetch()).json()
    dashboard.dailyPlan.lessons = [{ ...lesson, isCompleted: true, isCurrent: true }]
    dashboard.dailyPlan.nextLessonId = lesson.id
    await route.fulfill({ json: dashboard })
  })
  await page.route(`**/api/lessons/${lesson.id}`, route => route.fulfill({ json: lesson }))
}

test('six exact phrase candidates use authored chunks, two patterns and three sourced notes', () => {
  const manifest = JSON.parse(readFileSync(`${path}review-manifest.json`, 'utf8'))
  expect(createHash('sha256').update(readFileSync(`${path}01-lesson.json`)).digest('hex')).toBe(manifest.candidateSha256)
  expect(createHash('sha256').update(readFileSync(`../${manifest.basePackage}`)).digest('hex')).toBe(manifest.baseSha256)
  const base = JSON.parse(readFileSync(`../${manifest.basePackage}`, 'utf8'))
  const { languageSupport, ...unchanged } = lesson
  expect(unchanged).toEqual(base.lesson)
  expect(languageSupport!.phrases).toHaveLength(6)
  expect(languageSupport!.references).toHaveLength(2)
  expect(languageSupport!.usageNotes).toHaveLength(3)
  expect(languageSupport!.reviewDisposition).toBe('pending')
  expect(languageSupport!.reviewer).toBe('')
  for (const phrase of languageSupport!.phrases) {
    const card = lesson.introduction!.teachingCards![phrase.teachingCardIndex]!
    for (const part of phrase.functions) expect(card.chunks[part.chunkIndex]).toBeTruthy()
    expect(phrase.sourceLocators.every(s => candidate.sources.some((source: { locator: string }) => source.locator === s))).toBeTruthy()
  }
})

test('reference search preserves its query through teaching; keyboard links restore focus and lesson position', async ({ page }, info) => {
  await fixture(page)
  await page.goto('/#/practice/grammar')
  const library = page.getByRole('region', { name: 'Grammar reference', exact: true })
  await expect(library.getByText('2 references', { exact: true })).toBeVisible()
  for (const query of ['بدي', 'biddi', 'want']) {
    await library.getByRole('searchbox').fill(query)
    await expect(library.getByText('1 reference', { exact: true })).toBeVisible()
    await expect(library.getByRole('heading', { name: 'Saying who wants to rest' })).toBeVisible()
  }
  await library.getByRole('searchbox').fill('not-a-grammar-topic')
  await expect(library.getByText(/No matching references/)).toBeVisible()
  await library.getByRole('searchbox').fill('speaker adjective')
  await library.getByRole('button', { name: /Open lesson: .*Phrase 2$/ }).click()
  const dialog = page.getByRole('dialog', { name: lesson.title, exact: true })
  await expect(dialog.locator('.spotlight-arabic')).toHaveText('أنا منيح.')
  const anatomy = dialog.locator('.phrase-anatomy')
  await anatomy.getByText('How this phrase works', { exact: true }).focus()
  await page.keyboard.press('Enter')
  const link = anatomy.getByRole('button', { name: 'Describing how you feel', exact: true }).first()
  await link.focus(); await page.keyboard.press('Enter')
  await expect(anatomy.getByRole('region', { name: 'Grammar reference' })).toBeFocused()
  await expect(anatomy.getByRole('heading', { name: 'Describing how you feel' })).toBeVisible()
  await anatomy.getByRole('button', { name: '← Back to phrase' }).click()
  await expect(link).toBeFocused()
  await expect(anatomy.getByText(/The English “am” has no separate chunk/)).toBeVisible()
  await page.addStyleTag({ content: '.reference-target, .spotlight-arabic { font-size: 3rem !important; }' })
  expect(await anatomy.locator('[lang|="ar"]').first().getAttribute('dir')).toBe('rtl')
  expect(await dialog.evaluate(el => el.scrollWidth <= el.clientWidth + 1)).toBeTruthy()
  await page.screenshot({ path: info.outputPath('phrase-anatomy-enlarged.png') })
  await dialog.getByRole('button', { name: 'Close lesson', exact: true }).click()
  await expect(library.getByRole('searchbox')).toHaveValue('speaker adjective')
  await page.goto('/#/about')
  await expect(page.getByText(`Beta ${metadata.version}`, { exact: true }).first()).toBeVisible()
})

test('downloaded references work after offline reload and withdrawn or revised lessons are refreshed honestly', async ({ page, context }) => {
  await fixture(page)
  await page.goto('/#/practice/grammar')
  const library = page.getByRole('region', { name: 'Grammar reference', exact: true })
  await expect(library.getByText('2 references', { exact: true })).toBeVisible()
  await page.evaluate(async () => { await navigator.serviceWorker.ready })
  // Mocked fulfillments bypass Chromium offline transport. Abort the lesson request
  // as a real disconnected API would, including engines retaining navigator.onLine.
  await page.route(`**/api/lessons/${lesson.id}`, route => route.abort('internetdisconnected'))
  await context.setOffline(true); await page.reload()
  await expect(library.getByText('2 references', { exact: true })).toBeVisible()
  await expect(library.getByText(/Showing downloaded lesson versions/)).toBeVisible()
  await library.getByRole('searchbox').fill('biddi')
  await expect(library.getByText('1 reference', { exact: true })).toBeVisible()
  await context.setOffline(false)
  await page.route(`**/api/lessons/${lesson.id}`, route => route.fulfill({ json: { ...lesson, version: 'test-revision', languageSupport: null } }))
  await library.getByRole('button', { name: 'Refresh references', exact: true }).click()
  await expect(library.getByText(/No grammar references in the available/)).toBeVisible()
  await page.route(`**/api/lessons/${lesson.id}`, route => route.fulfill({ status: 410, json: { code: 'withdrawn', message: 'Withdrawn test fixture' } }))
  await library.getByRole('button', { name: 'Refresh references', exact: true }).click()
  await expect(library.getByText(/1 lesson\(s\) unavailable/)).toBeVisible()
  await context.setOffline(true); await library.getByRole('button', { name: 'Refresh references', exact: true }).click()
  await expect(library.getByText('0 references', { exact: true })).toBeVisible()
})

test('Words and answer feedback reuse the same lesson anatomy', async ({ page }) => {
  await fixture(page)
  await page.goto('/#/words')
  const words = page.getByRole('region', { name: 'Learned words', exact: true })
  await words.getByRole('searchbox').fill('biddi')
  const entry = words.locator('.glossary-entry').first()
  await entry.getByText('Forms and teaching context', { exact: true }).click()
  await entry.getByText('How this phrase works', { exact: true }).click()
  await expect(entry.getByRole('button', { name: 'Saying who wants to rest' }).first()).toBeVisible()
  await entry.getByRole('button', { name: /Open lesson:/ }).click()
  const dialog = page.getByRole('dialog', { name: lesson.title, exact: true })
  await dialog.getByRole('button', { name: 'Go to practice', exact: true }).click()
  await responseChoices(dialog)
  await dialog.locator('.answer-option').filter({ hasText: 'أنا منيح.' }).click()
  await dialog.getByRole('button', { name: 'Check answer', exact: true }).click()
  const feedback = dialog.locator('.feedback-panel')
  await expect(feedback.locator('.phrase-anatomy')).toHaveCount(2)
  await feedback.getByText('How this phrase works', { exact: true }).last().click()
  await expect(feedback.getByRole('button', { name: 'Describing how you feel' }).first()).toBeVisible()
})

test('console imports a pending anatomy draft for inspection without learner publication', async ({ page }) => {
  await page.goto('/#/today')
  const credentials = { displayName: 'Preview owner', email: 'preview-owner@example.test', password: 'test-only-long-password' }
  let csrf = await (await page.request.get('/api/auth/csrf')).json()
  const register = await page.request.post('/api/auth/register', { data: credentials, headers: { 'X-CSRF-TOKEN': csrf.token } })
  if (!register.ok()) {
    csrf = await (await page.request.get('/api/auth/csrf')).json()
    expect((await page.request.post('/api/auth/login', { data: { ...credentials, rememberMe: false }, headers: { 'X-CSRF-TOKEN': csrf.token } })).ok()).toBeTruthy()
  }
  await page.reload()
  await page.getByRole('link', { name: 'Account', exact: true }).first().click()
  await page.getByRole('button', { name: 'Open curriculum console' }).click()
  const pack = { ...candidate, lesson: { ...lesson, id: 'grammar-review-fixture', title: 'Grammar review fixture' } }
  await page.getByLabel('Import a lesson package as a draft').setInputFiles({ name: 'lesson.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(pack)) })
  const review = page.getByRole('region', { name: 'Phrase anatomy review', exact: true })
  await expect(review.getByText('6 phrases · 2 grammar references · 3 usage notes', { exact: true })).toBeVisible()
  await expect(review.getByText('Disposition: pending · Reviewer: Not designated')).toBeVisible()
  await expect(review.locator('.phrase-anatomy')).toHaveCount(6)
  const editor = page.getByLabel('Structured lesson JSON', { exact: true })
  const saved = await editor.inputValue()
  const malformed = JSON.parse(saved)
  malformed.languageSupport.references = {}
  await editor.fill(JSON.stringify(malformed))
  await expect(review.getByText('Language support is incomplete. Validate the draft to inspect errors.')).toBeVisible()
  await editor.fill(saved)
  await expect(review.locator('.phrase-anatomy')).toHaveCount(6)
  expect((await page.request.get('/api/lessons/grammar-review-fixture')).status()).toBe(404)
  await page.getByRole('button', { name: 'Preview saved version' }).click()
  const dialog = page.getByRole('dialog', { name: 'Grammar review fixture', exact: true })
  await dialog.getByRole('button', { name: 'Learn the phrases' }).click()
  await dialog.getByText('How this phrase works', { exact: true }).click()
  await expect(dialog.getByText(/Unreviewed draft · literal meanings/)).toBeVisible()
})
