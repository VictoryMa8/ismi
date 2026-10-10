import { finishTeaching, responseChoices } from './lesson-helpers'
import { expect, test } from '@playwright/test'

// Uses only existing demonstration language. This is not an authored lesson.
test('owner imports and completes a saved draft without exposing or caching it', async ({ page }) => {
  await page.goto('/#/today')
  await page.getByRole('button', { name: 'Sign in or create an account', exact: true }).first().click()
  await page.getByRole('button', { name: 'Create account', exact: true }).click()
  await page.getByLabel('Display name', { exact: true }).fill('Preview owner')
  await page.getByLabel('Email', { exact: true }).fill('preview-owner@example.test')
  await page.getByLabel('Password', { exact: true }).fill('test-only-long-password')
  await page.getByRole('button', { name: 'Create account', exact: true }).last().click()
  await expect(page).toHaveURL(/#\/today$/)
  await expect(page.getByRole('button', { name: 'Open account for Preview owner' }).first()).toBeVisible()
  await page.getByRole('button', { name: 'Open account for Preview owner' }).first().click()
  await page.getByRole('button', { name: 'Open curriculum console' }).click()

  const seed = await (await page.request.get('/api/lessons/levantine-day-01')).json()
  const lesson = {
    ...seed, id: 'preview-fixture', title: 'Delivery preview fixture', reviewStatus: 'owner-review',
    introduction: {
      goal: 'Check the delivery of a conversation',
      dialogue: Array.from({ length: 4 }, (_, i) => ({ speaker: `Test speaker ${i + 1}`, line: seed.steps[0].prompt })),
      expressions: [seed.steps[0].prompt], usageNote: 'Test usage note', dialectNote: 'Test address note',
      recordingNote: 'Test script; no reviewed audio.', sourceLocators: ['internal:test'],
    },
    steps: Array.from({ length: 6 }, (_, i) => ({ ...seed.steps[0], id: `test-${i}`,
      answers: [...seed.steps[0].answers].reverse().map(answer => ({ ...answer, rationale: `Context mismatch for ${answer.id}` })),
    })),
  }
  const payload = { lesson, sources: [{ sourceType: 'test', title: 'Test fixture', locator: 'internal:test', rights: 'Test only', notes: '' }] }
  await page.getByLabel('Import a lesson package as a draft').setInputFiles({ name: 'fixture.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(payload)) })
  await expect(page.getByText('Imported draft version 1.', { exact: false })).toBeVisible()
  expect((await page.request.get('/api/lessons/preview-fixture')).status()).toBe(404)
  const writes: string[] = []
  page.on('request', request => {
    if (request.url().includes('/api/lessons/preview-fixture')) writes.push(request.url())
  })
  await page.getByRole('button', { name: 'Preview saved version' }).click()
  const dialog = page.getByRole('dialog', { name: lesson.title })
  await expect(dialog.getByRole('list', { name: 'Dialogue transcript' }).getByRole('listitem')).toHaveCount(4)
  await expect(dialog.getByRole('button', { name: 'Close lesson' })).toBeFocused()
  await page.keyboard.press('Shift+Tab')
  await expect(dialog.getByRole('button', { name: 'Interface sounds' })).toBeFocused()
  await page.keyboard.press('Shift+Tab')
  await expect(dialog.getByRole('button', { name: 'Learn the phrases' })).toBeFocused()
  await finishTeaching(page, dialog)
  await responseChoices(dialog)
  const wrong = dialog.locator('.answer-option').first()
  await wrong.focus()
  await page.keyboard.press('Enter')
  await dialog.getByRole('button', { name: 'Check answer' }).focus()
  await page.keyboard.press('Enter')
  await expect(dialog.getByText('Context mismatch for c')).toBeVisible()
  await dialog.getByRole('button', { name: 'Try again' }).focus()
  await page.keyboard.press('Enter')
  for (let i = 0; i < 6; i++) {
    await responseChoices(dialog, `test-${i}`)
    await dialog.locator('.answer-option').last().focus()
    await page.keyboard.press('Enter')
    await dialog.getByRole('button', { name: 'Check answer' }).focus()
    await page.keyboard.press('Enter')
    await dialog.getByRole('button', { name: i === 5 ? 'Complete lesson' : 'Next step' }).focus()
    await page.keyboard.press('Enter')
  }
  await expect(dialog.getByText('Preview complete', { exact: true })).toBeVisible()
  await dialog.getByRole('button', { name: 'Back to curriculum' }).click()
  await expect(page.getByRole('button', { name: 'Preview saved version' })).toBeFocused()
  expect(writes).toEqual([])
  expect(await page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('ismi-offline')
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
    const keys = await new Promise<IDBValidKey[]>((resolve, reject) => {
      const request = db.transaction('lessons').objectStore('lessons').getAllKeys()
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
    db.close()
    return keys
  })).not.toContain('preview-fixture')
})
