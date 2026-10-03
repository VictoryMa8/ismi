import { readFileSync } from 'node:fs'
import { expect, test } from '@playwright/test'
import { finishTeaching, responseChoices } from './lesson-helpers'
import type { LessonResponse } from '../src/types'

const proposal = JSON.parse(readFileSync(new URL('../../content/levantine/everyday-01/revisions/characters/01-lesson.json', import.meta.url), 'utf8'))
const names: Record<string, string> = { fattoush: 'Fattoush', knafeh: 'Knafeh' }
test.use({ serviceWorkers: 'block' })

for (const imagesFail of [false, true]) {
  test(`character owner preview completes with ${imagesFail ? 'failed' : 'loaded'} portraits and unchanged recall`, async ({ page, context }, testInfo) => {
    test.setTimeout(90_000)
    if (imagesFail) await page.route('**/characters/v1/cast.webp', route => route.abort())
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/#/today')
    const errors: string[] = []
    page.on('pageerror', error => errors.push(error.message))
    async function post(path: string, data: unknown) {
      const csrf = await (await page.request.get('/api/auth/csrf')).json()
      return page.request.post(path, { data, headers: { 'X-CSRF-TOKEN': csrf.token } })
    }
    const registered = await post('/api/auth/register', { displayName: 'Preview owner', email: 'preview-owner@example.test', password: 'test-only-long-password' })
    if (!registered.ok()) expect((await post('/api/auth/login', { email: 'preview-owner@example.test', password: 'test-only-long-password', rememberMe: false })).ok()).toBeTruthy()
    await page.reload()
    await page.getByRole('button', { name: /Open account for/ }).first().click()
    await page.getByRole('button', { name: 'Open curriculum console' }).click()
    const pack = structuredClone(proposal)
    pack.lesson.id = imagesFail ? 'character-preview-fallback' : 'character-preview-loaded'
    pack.lesson.title = imagesFail ? 'Character fallback preview' : 'Character art preview'
    await page.getByLabel('Import a lesson package as a draft').setInputFiles({ name: 'characters.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(pack)) })
    await expect(page.getByText('Imported draft version 1.', { exact: false })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Character mapping' })).toBeVisible()
    expect((await page.request.get(`/api/lessons/${pack.lesson.id}`)).status()).toBe(404)
    await page.getByRole('button', { name: 'Preview saved version' }).click()
    const dialog = page.getByRole('dialog', { name: pack.lesson.title, exact: true })
    const labels = dialog.locator('.dialogue-transcript .character-label')
    await expect(labels).toHaveCount(6)
    await expect(labels.nth(0).locator('strong')).toHaveText('Fattoush → Knafeh')
    await expect(labels.nth(2).locator('strong')).toHaveText('Fattoush → Knafeh')
    // Portraits never create duplicate accessible names.
    await expect(dialog.getByRole('img')).toHaveCount(0)
    if (imagesFail) {
      await expect(dialog.locator('.character-portrait img')).toHaveCount(0)
      await expect(dialog.locator('.character-placeholder').first()).toBeVisible()
      await context.setOffline(true)
    } else {
      await expect.poll(async () => dialog.locator('.character-portrait img').first().evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBeTruthy()
    }
    for (const width of [320, 1280]) {
      await page.setViewportSize({ width, height: 900 })
      expect(await dialog.evaluate(element => element.scrollWidth <= element.clientWidth)).toBeTruthy()
      await page.screenshot({ path: testInfo.outputPath(`scene-${width}.png`) })
    }
    await dialog.getByRole('button', { name: 'Learn the phrases' }).click()
    await expect(dialog.locator('.teaching-page > .character-label strong')).toHaveText('Fattoush → Knafeh')
    await dialog.getByRole('button', { name: 'Try from memory' }).click()
    await expect(dialog.locator('.teaching-page > .character-label strong')).toHaveText('Fattoush → Knafeh')
    await expect(dialog.locator('.phrase-spotlight')).toHaveCount(0)
    await page.screenshot({ path: testInfo.outputPath('recall.png') })
    await dialog.getByRole('button', { name: 'Reveal phrase' }).click()
    await dialog.getByRole('button', { name: 'Look back' }).click()
    await dialog.getByRole('button', { name: 'Look back' }).click()
    await finishTeaching(page, dialog)
    for (const [index, step] of (pack.lesson as LessonResponse).steps.entries()) {
      await responseChoices(dialog, step.id)
      const label = `Reply as ${names[step.characters!.responseSpeakerId!]} to ${names[step.characters!.responseAddresseeId!]}`
      await expect(dialog.locator('.practice-page > .character-cue')).toContainText(label)
      await expect(dialog.locator('.prompt-meaning')).toHaveCount(0)
      if (index === 0) {
        const wrong = step.answers.findIndex(answer => answer.id !== step.evaluation.correctAnswerId)
        await dialog.locator('.answer-option').nth(wrong).focus()
        await page.keyboard.press('Enter')
        await dialog.getByRole('button', { name: 'Check answer' }).click()
        await expect(dialog.locator('.feedback-panel')).toBeFocused()
        await expect(dialog.locator('.feedback-panel .character-cue')).toContainText(label)
        await page.screenshot({ path: testInfo.outputPath('mistake-feedback.png') })
        await dialog.getByRole('button', { name: 'Try again' }).click()
      }
      await dialog.locator('.answer-option').nth(step.answers.findIndex(answer => answer.id === step.evaluation.correctAnswerId)).click()
      await dialog.getByRole('button', { name: 'Check answer' }).click()
      await expect(dialog.locator('.feedback-panel')).toContainText(step.evaluation.correctExplanation)
      await dialog.getByRole('button', { name: index === 7 ? 'Complete lesson' : 'Next step' }).click()
    }
    await expect(dialog.getByText('Preview complete', { exact: true })).toBeVisible()
    expect((await page.request.get(`/api/lessons/${pack.lesson.id}`)).status()).toBe(404)
    expect(errors).toEqual([])
  })
}

test('unknown character references retain authored text and usable teaching', async ({ page }) => {
  const lesson: LessonResponse = structuredClone(proposal.lesson)
  lesson.id = 'levantine-day-01'
  lesson.characters!.registryVersion = 'future-registry'
  lesson.introduction!.dialogue[0]!.speakerId = 'future-character'
  await page.route('**/api/lessons/levantine-day-01', route => route.fulfill({ json: lesson }))
  await page.goto('/#/today')
  await page.getByRole('button', { name: /Continue in Levantine/ }).click()
  const dialog = page.getByRole('dialog')
  await expect(dialog.locator('.dialogue-transcript .character-label strong').first()).toHaveText('Fattoush → Knafeh')
  await expect(dialog.locator('.character-portrait img')).toHaveCount(0)
  await dialog.getByRole('button', { name: 'Learn the phrases' }).click()
  await expect(dialog.getByRole('button', { name: 'Try from memory' })).toBeEnabled()
})

test.describe('legacy offline compatibility', () => {
  test.use({ serviceWorkers: 'allow' })

test('legacy downloaded character packages use current names after offline reload', async ({ page, context }) => {
  const legacy = JSON.parse(JSON.stringify(proposal.lesson)
    .replaceAll('Fattoush', 'Lina').replaceAll('Knafeh', 'Omar')
    .replaceAll('fattoush', 'lina').replaceAll('knafeh', 'omar').replaceAll('فتوش', 'لينا'))
  legacy.id = 'levantine-day-01'
  await page.route('**/api/lessons/levantine-day-01', route => route.fulfill({ json: legacy }))
  await page.goto('/#/today')
  await expect.poll(() => page.evaluate(async () => {
    // Observe initialization without accidentally creating an empty v3 database.
    if (!(await indexedDB.databases()).some(db => db.name === 'ismi-offline')) return 0
    const db = await new Promise<IDBDatabase>(resolve => { const r = indexedDB.open('ismi-offline'); r.onsuccess = () => resolve(r.result) })
    if (!db.objectStoreNames.contains('lessons')) { db.close(); return 0 }
    const count = await new Promise<number>(resolve => { const r = db.transaction('lessons').objectStore('lessons').count(); r.onsuccess = () => resolve(r.result) })
    db.close(); return count
  })).toBeGreaterThanOrEqual(3)
  await page.evaluate(async () => { await navigator.serviceWorker.ready; if (!navigator.serviceWorker.controller) location.reload() })
  await page.waitForLoadState('domcontentloaded')
  // Simulate an immutable package downloaded before the rename.
  await page.evaluate(async lesson => {
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('ismi-offline', 3)
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction('lessons', 'readwrite')
      transaction.objectStore('lessons').put(lesson)
      transaction.oncomplete = () => resolve()
      transaction.onerror = () => reject(transaction.error)
    })
    db.close()
  }, legacy)
  await context.setOffline(true)
  await page.reload()
  await page.getByRole('button', { name: /Continue in Levantine/ }).click()
  const dialog = page.getByRole('dialog')
  await expect(dialog.locator('.character-label strong').first()).toHaveText('Fattoush → Knafeh')
  await expect(dialog).not.toContainText(/Lina|Omar/)
  await expect(dialog.locator('.character-portrait img').first()).toBeVisible()
})
})
