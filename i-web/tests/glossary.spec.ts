import { readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import catalog from '../src/content/glossary-catalog.json' with { type: 'json' }
import { expect, test, type Page } from '@playwright/test'
import { learnedVocabulary, matchesGlossary, vocabularyForLesson } from '../src/glossary'
import type { LessonResponse, LessonVocabulary } from '../src/types'
import { finishTeaching, responseChoices } from './lesson-helpers'

function approved(index = 1): LessonResponse {
  return JSON.parse(readFileSync(`../content/levantine/everyday-01/revisions/pilot-release/0${index}-lesson.json`, 'utf8')).lesson
}
const first = approved()
const second = approved(2)

async function fixture(page: Page, completed: string[] = [first.id]) {
  await page.route('**/api/dashboard', async route => {
    const response = await route.fetch()
    const dashboard = await response.json()
    dashboard.dailyPlan.lessons = [first, second].map(lesson => ({ ...lesson, isCompleted: completed.includes(lesson.id), isCurrent: !completed.includes(lesson.id) }))
    dashboard.dailyPlan.nextLessonId = dashboard.dailyPlan.lessons.find((l: { isCompleted: boolean }) => !l.isCompleted)?.id ?? first.id
    await route.fulfill({ json: dashboard })
  })
  for (const lesson of [first, second]) await page.route(`**/api/lessons/${lesson.id}`, route => route.fulfill({ json: lesson }))
}

test('catalog pins approved records, preserves senses and variants, and refuses changed text', () => {
  for (const record of catalog) {
    const bytes = readFileSync(`../${record.packagePath}`)
    expect(createHash('sha256').update(bytes).digest('hex')).toBe(record.packageSha256)
    const packageData = JSON.parse(bytes.toString())
    for (const entry of vocabularyForLesson(packageData.lesson))
      expect(entry.sourceLocators.every(locator => packageData.sources.some((source: { locator: string }) => source.locator === locator))).toBeTruthy()
  }
  const entries = learnedVocabulary([first, second])
  expect(entries.length).toBeGreaterThan(15)
  expect(learnedVocabulary([first, first])).toHaveLength(learnedVocabulary([first]).length)
  expect(entries.some(entry => entry.contexts.length > 1)).toBeTruthy()
  for (const entry of entries) {
    expect(entry.sourceLocators.length).toBeGreaterThan(0)
    expect(entry.forms).toEqual([])
    const context = entry.contexts[0]!
    const lesson = [first, second].find(lesson => lesson.id === context.lessonId)!
    const card = lesson.introduction!.teachingCards![context.cardIndex]!
    expect([card.phrase, ...card.chunks].some(text => text.arabic === entry.arabic && text.arabizi === entry.arabizi && text.meaning === entry.meaning)).toBeTruthy()
  }
  const changed = structuredClone(first)
  changed.introduction!.teachingCards!.forEach(card => { card.phrase.arabizi = 'updated'; card.note = 'new notes' })
  expect(vocabularyForLesson(changed)).toEqual([])
  expect(vocabularyForLesson({ ...first, vocabulary: [] })).toEqual([])
  const base = vocabularyForLesson(first)[0]!
  const variants: LessonVocabulary[] = [base, { ...base, senseId: 'different-sense', meaning: 'Other meaning' },
    { ...base, dialect: 'jordanian' }, { ...base, arabizi: 'variant' }]
  expect(learnedVocabulary([{ ...first, vocabulary: variants }])).toHaveLength(4)
  const searchable = entries.find(entry => entry.arabizi.includes('mnīḥ'))!
  expect(matchesGlossary(searchable, 'mnih')).toBeTruthy()
  expect(matchesGlossary(searchable, searchable.arabic.replace(/[\u064b-\u065f]/g, ''))).toBeTruthy()
})

test('completed lessons populate searchable accessible words and context links; offline reload retains them', async ({ page, context }, info) => {
  await fixture(page)
  await page.goto('/#/practice')
  const glossary = page.getByRole('region', { name: 'Learned words', exact: true })
  const expected = learnedVocabulary([first])
  await expect(glossary.getByText(`${expected.length} entries`, { exact: true })).toBeVisible()
  await glossary.getByRole('combobox', { name: 'Dialect', exact: true }).selectOption('palestinian-urban')
  await expect(glossary.getByText(`${expected.length} entries`, { exact: true })).toBeVisible()
  if (expected.length > 20) {
    await glossary.getByRole('button', { name: 'Next words', exact: true }).click()
    await expect(glossary.getByText('Page 2 of 2', { exact: true })).toBeVisible()
    await glossary.getByRole('button', { name: 'Previous words', exact: true }).click()
    await expect(glossary.getByText('Page 1 of 2', { exact: true })).toBeVisible()
  }
  await glossary.getByLabel('Search words').fill('mnih')
  await expect(glossary.locator('.glossary-entry')).not.toHaveCount(0)
  await expect(glossary.locator('.glossary-arabic').first()).toHaveAttribute('dir', 'rtl')
  await expect(glossary.locator('.glossary-arabic').first()).toHaveAttribute('lang', 'ar')
  await glossary.getByRole('combobox', { name: 'Type', exact: true }).selectOption('word')
  await expect(glossary.locator('.glossary-entry')).not.toHaveCount(0)
  const details = glossary.getByText('Forms and teaching context', { exact: true }).first()
  await details.focus(); await page.keyboard.press('Enter')
  await expect(glossary.getByText(/Additional grammatical forms not supplied/).first()).toBeVisible()
  const open = glossary.getByRole('button', { name: `Open lesson: ${first.title}`, exact: true }).first()
  await open.click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.getByRole('button', { name: 'Close lesson', exact: true }).click()
  await expect(open).toBeFocused()
  expect(await page.locator('body').evaluate(element => element.scrollWidth <= window.innerWidth)).toBeTruthy()
  await page.screenshot({ path: info.outputPath('glossary-mobile.png'), fullPage: true })
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.screenshot({ path: info.outputPath('glossary-desktop.png'), fullPage: true })
  await page.setViewportSize({ width: 320, height: 740 })
  await page.addStyleTag({ content: 'html { font-size: 24px; }' })
  expect(await glossary.evaluate(element => element.scrollWidth <= element.clientWidth + 1)).toBeTruthy()
  await page.evaluate(async () => { await navigator.serviceWorker.ready })
  await context.setOffline(true)
  await page.reload()
  await expect(glossary.getByText(`${expected.length} entries`, { exact: true })).toBeVisible()
  await expect(glossary.getByText('Reviewed audio not supplied.').first()).toBeVisible()
  await glossary.getByRole('combobox', { name: 'Track', exact: true }).selectOption('msa')
  await expect(glossary.getByText('No matching words. Try another search or filter.')).toBeVisible()
  await glossary.getByRole('combobox', { name: 'Track', exact: true }).selectOption('')
  await glossary.getByLabel('Search words').fill('impossibleword')
  await expect(glossary.getByText('No matching words. Try another search or filter.')).toBeVisible()
})

test('changed versions replace glossary text and withdrawn lessons cannot fall back to downloads', async ({ page }) => {
  await fixture(page)
  await page.goto('/#/practice')
  const glossary = page.getByRole('region', { name: 'Learned words', exact: true })
  await expect(glossary.locator('.glossary-entry').first()).toBeVisible()
  const updated = structuredClone(first)
  updated.version = 'test-v-next'
  updated.vocabulary = [{ ...vocabularyForLesson(first)[0]!, id: 'updated-record', senseId: 'updated-sense', forms: ['Supplied form note'] }]
  await page.route(`**/api/lessons/${first.id}`, route => route.fulfill({ json: updated }))
  await page.reload()
  await expect(glossary.getByText('1 entry', { exact: true })).toBeVisible()
  await glossary.getByText('Forms and teaching context', { exact: true }).click()
  await expect(glossary.getByText(/test-v-next/)).toBeVisible()
  await expect(glossary.getByText('Supplied form note', { exact: true })).toBeVisible()
  await page.route(`**/api/lessons/${first.id}`, route => route.fulfill({ status: 410, json: { message: 'Withdrawn' } }))
  await page.reload()
  await expect(glossary.getByText('0 entries', { exact: true })).toBeVisible()
  await expect(glossary.getByText(/completed lesson\(s\) unavailable/)).toBeVisible()
})

test('completion adds words locally offline without relying on review history', async ({ page, context }) => {
  await fixture(page, [])
  await page.goto('/#/practice')
  const glossary = page.getByRole('region', { name: 'Learned words', exact: true })
  await expect(glossary.getByText('0 entries', { exact: true })).toBeVisible()
  // Download before going offline, as a learner does on Today.
  await page.getByRole('link', { name: 'Today', exact: true }).click()
  await expect(page.getByRole('button', { name: /Continue in Levantine/ })).toBeVisible()
  await page.evaluate(async () => { await navigator.serviceWorker.ready })
  await context.setOffline(true)
  await page.getByRole('button', { name: /Continue in Levantine/ }).click()
  const dialog = page.getByRole('dialog')
  await finishTeaching(page, dialog)
  for (const step of first.steps) {
    await responseChoices(dialog)
    await dialog.locator('.answer-option').filter({ hasText: step.answers.find(a => a.id === step.evaluation.correctAnswerId)!.arabizi }).click()
    await dialog.getByRole('button', { name: 'Check answer', exact: true }).click()
    await dialog.getByRole('button', { name: /Next step|Complete lesson/ }).click()
  }
  await page.getByRole('button', { name: 'Back to today', exact: true }).click()
  await page.getByRole('link', { name: 'Practice', exact: true }).click()
  await expect(glossary.getByText(`${learnedVocabulary([first]).length} entries`, { exact: true })).toBeVisible()
  await page.reload()
  await expect(glossary.getByText(`${learnedVocabulary([first]).length} entries`, { exact: true })).toBeVisible()
})

test('supplied audio plays from verified offline bytes and stops when opening context', async ({ page, context }) => {
  const bytes = Buffer.alloc(32044)
  bytes.write('RIFF'); bytes.writeUInt32LE(bytes.length - 8, 4); bytes.write('WAVEfmt ', 8)
  bytes.writeUInt32LE(16, 16); bytes.writeUInt16LE(1, 20); bytes.writeUInt16LE(1, 22)
  bytes.writeUInt32LE(8000, 24); bytes.writeUInt32LE(16000, 28)
  bytes.writeUInt16LE(2, 32); bytes.writeUInt16LE(16, 34)
  bytes.write('data', 36); bytes.writeUInt32LE(32000, 40)
  const url = `/api/recordings/${createHash('sha256').update(bytes).digest('hex')}.wav`
  const recorded = structuredClone(first)
  recorded.steps[0]!.prompt.audioUrl = url
  recorded.steps[0]!.prompt.recording = { transcript: recorded.steps[0]!.prompt.arabic,
    speaker: 'Transport fixture', dialect: 'palestinian-urban', sourceLocator: 'internal:test-signal',
    reviewNotes: 'Silent transport test, not reviewed speech.' }
  await fixture(page)
  await page.route(`**/api/lessons/${first.id}`, route => route.fulfill({ json: recorded }))
  await page.route(`**${url}`, route => route.fulfill({ body: bytes, contentType: 'audio/wav' }))
  await page.goto('/#/practice')
  const glossary = page.getByRole('region', { name: 'Learned words', exact: true })
  await expect(glossary.getByText(`${learnedVocabulary([first]).length} entries`, { exact: true })).toBeVisible()
  await page.evaluate(async () => { await navigator.serviceWorker.ready })
  await context.setOffline(true)
  await page.reload()
  await expect(glossary.getByText(`${learnedVocabulary([first]).length} entries`, { exact: true })).toBeVisible()
  await glossary.getByLabel('Search words').fill('Shū ʿāmel?')
  await expect(glossary.locator('.glossary-entry')).toHaveCount(1)
  await page.evaluate(() => {
    const NativeAudio = window.Audio
    window.Audio = function(src?: string) {
      const audio = new NativeAudio(src)
      ;(window as unknown as { testAudio: HTMLAudioElement }).testAudio = audio
      return audio
    } as typeof Audio
  })
  await glossary.getByRole('button', { name: /^Play recording:/ }).click()
  await expect.poll(() => page.evaluate(() => {
    const audio = (window as unknown as { testAudio: HTMLAudioElement }).testAudio
    return audio?.src.startsWith('blob:') && audio.currentTime > 0
  })).toBe(true)
  await glossary.getByText('Forms and teaching context', { exact: true }).click()
  await glossary.getByRole('button', { name: `Open lesson: ${first.title}`, exact: true }).click()
  expect(await page.evaluate(() => (window as unknown as { testAudio: HTMLAudioElement }).testAudio.paused)).toBe(true)
  await expect(page.getByRole('dialog').getByText(first.introduction!.teachingCards![0]!.title, { exact: true })).toBeVisible()
})

test('synced completions populate a second device and stay isolated from guests and other accounts', async ({ page, browser }) => {
  test.setTimeout(90_000)
  const owner = await browser.newContext()
  const lessonId = 'levantine-day-01'
  let originalVersionId: number | undefined
  const csrfPost = async (request: Page['request'], path: string, data: unknown) => {
    const csrf = await (await request.get('/api/auth/csrf')).json()
    return request.post(path, { data, headers: { 'X-CSRF-TOKEN': csrf.token } })
  }
  try {
    const registration = await csrfPost(owner.request, '/api/auth/register', { displayName: 'Preview owner', email: 'preview-owner@example.test', password: 'test-only-long-password' })
    if (!registration.ok()) expect((await csrfPost(owner.request, '/api/auth/login', { email: 'preview-owner@example.test', password: 'test-only-long-password', rememberMe: false })).ok()).toBeTruthy()
    const packageData = JSON.parse(readFileSync('../content/levantine/everyday-01/revisions/pilot-release/01-lesson.json', 'utf8'))
    const versions = await (await owner.request.get('/api/admin/curriculum/versions')).json()
    originalVersionId = versions.find((version: { lessonId: string; status: string }) => version.lessonId === lessonId && version.status === 'published').id
    packageData.lesson.id = lessonId
    packageData.lesson.vocabulary = [...new Map(vocabularyForLesson(first).map(entry => [entry.id + entry.senseId, entry])).values()]
    const draftResponse = await csrfPost(owner.request, '/api/admin/curriculum/drafts', packageData)
    expect(draftResponse.ok()).toBeTruthy()
    const draft = await draftResponse.json()
    expect((await csrfPost(owner.request, `/api/admin/curriculum/versions/${draft.id}/approve`, {})).ok()).toBeTruthy()
    expect((await csrfPost(owner.request, `/api/admin/curriculum/versions/${draft.id}/publish`, {})).ok()).toBeTruthy()
    const email = `glossary-${Date.now()}@example.test`
    const password = 'long test password'
    expect((await csrfPost(page.request, '/api/auth/register', { displayName: 'Word learner', email, password })).ok()).toBeTruthy()
    expect((await csrfPost(page.request, `/api/lessons/${lessonId}/completions`, { completionId: crypto.randomUUID(), completedAt: new Date().toISOString() })).ok()).toBeTruthy()
    await page.goto('/#/practice')
    const glossary = page.getByRole('region', { name: 'Learned words', exact: true })
    await expect(glossary.getByText(`${learnedVocabulary([first]).length} entries`, { exact: true })).toBeVisible()
    const device = await browser.newContext({ storageState: { cookies: [], origins: [{ origin: 'http://127.0.0.1:4173', localStorage: [{ name: 'ismi-welcome-v1', value: 'done' }] }] } })
    try {
      expect((await csrfPost(device.request, '/api/auth/login', { email, password, rememberMe: false })).ok()).toBeTruthy()
      const secondPage = await device.newPage()
      await secondPage.goto('/#/practice')
      await expect(secondPage.getByRole('region', { name: 'Learned words', exact: true }).getByText(`${learnedVocabulary([first]).length} entries`, { exact: true })).toBeVisible()
    } finally { await device.close() }
    await page.getByRole('link', { name: 'Account', exact: true }).click()
    await page.getByRole('button', { name: 'Sign out', exact: true }).click()
    await page.getByRole('link', { name: 'Practice', exact: true }).click()
    await expect(glossary.getByText('0 entries', { exact: true })).toBeVisible()
    // A guest's offline queue must never enroll a new account in those lessons.
    await page.evaluate(async lessonId => {
      const db = await new Promise<IDBDatabase>((resolve, reject) => { const req = indexedDB.open('ismi-offline'); req.onsuccess = () => resolve(req.result); req.onerror = () => reject(req.error) })
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction('pending-completions', 'readwrite')
        tx.objectStore('pending-completions').put({ completionId: crypto.randomUUID(), lessonId, scope: 'guest', completedAt: new Date().toISOString(), estimatedMinutes: 6 })
        tx.oncomplete = () => resolve(); tx.onerror = () => reject(tx.error)
      }); db.close()
    }, lessonId)
    await page.getByRole('link', { name: 'Account', exact: true }).click()
    await page.getByRole('button', { name: 'Create account', exact: true }).click()
    await page.getByLabel('Display name').fill('Other learner')
    await page.getByLabel('Email', { exact: true }).fill(`other-${Date.now()}@example.test`)
    await page.getByLabel('Password', { exact: true }).fill(password)
    await page.locator('.auth-form').getByRole('button', { name: 'Create account', exact: true }).click()
    await expect(page.getByRole('heading', { name: 'Marhaba, Other learner.', exact: true })).toBeVisible()
    await page.getByRole('link', { name: 'Practice', exact: true }).click()
    await expect(glossary.getByText('0 entries', { exact: true })).toBeVisible()
    const dashboard = await (await page.request.get('/api/dashboard')).json()
    expect(dashboard.dailyPlan.lessons.find((lesson: { id: string }) => lesson.id === lessonId).isCompleted).toBe(false)
  } finally {
    if (originalVersionId) expect((await csrfPost(owner.request, `/api/admin/curriculum/lessons/${lessonId}/rollback`, { targetVersionId: originalVersionId })).ok()).toBeTruthy()
    await owner.close()
  }
})
