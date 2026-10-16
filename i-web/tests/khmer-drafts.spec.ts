import { readFileSync, mkdirSync } from 'node:fs'
import { expect, test, type Page } from '@playwright/test'
import { finishTeaching, responseChoices } from './lesson-helpers'
import type { LessonResponse } from '../src/types'

const packages = [1, 2, 3, 4, 5].map(n => JSON.parse(readFileSync(
  new URL(`../../content/khmer/meet-01/0${n}-lesson.json`, import.meta.url), 'utf8',
))) as Array<{ lesson: LessonResponse; sources: unknown[] }>
async function post(page: Page, path: string, data: unknown = {}) {
  const csrf = await (await page.request.get('/api/auth/csrf')).json()
  return page.request.post(path, { data, headers: { 'X-CSRF-TOKEN': csrf.token } })
}

test('pending Khmer candidates preview, script practice and offline retry preserve private status and Arabic', async ({ page, context }) => {
  test.setTimeout(180_000)
  await page.goto('/#/today')
  const arabicBefore = await (await page.request.get('/api/lessons/levantine-day-01')).text()
  const registration = await post(page, '/api/auth/register', { displayName: 'Preview owner', email: 'preview-owner@example.test', password: 'test-only-long-password' })
  if (!registration.ok()) expect((await post(page, '/api/auth/login', { email: 'preview-owner@example.test', password: 'test-only-long-password', rememberMe: false })).ok()).toBeTruthy()
  await page.reload()
  await page.getByRole('link', { name: 'Account', exact: true }).first().click()
  await page.getByRole('button', { name: 'Open curriculum console' }).click()
  const writes: string[] = []
  page.on('request', request => {
    if (/\/api\/lessons\/khmer-meet-01-/.test(request.url())) writes.push(request.url())
  })
  for (const [index, pack] of packages.entries()) {
    await page.getByLabel('Import a lesson package as a draft').setInputFiles({ name: 'lesson.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(pack)) })
    await expect(page.getByText('Imported draft version 1.', { exact: false })).toBeVisible()
    const all = await (await page.request.get('/api/admin/curriculum/versions')).json()
    const saved = all.find((v: { lessonId: string }) => v.lessonId === pack.lesson.id)
    expect((await post(page, `/api/admin/curriculum/versions/${saved.id}/approve`)).status()).toBe(400)
    await page.getByRole('button', { name: 'Preview saved version' }).click()
    const dialog = page.getByRole('dialog', { name: pack.lesson.title, exact: true })
    await expect(dialog.getByText('Unreviewed draft · fluent linguistic review pending.')).toBeVisible()
    await expect(dialog.getByRole('list', { name: 'Dialogue transcript' }).getByRole('listitem')).toHaveCount(pack.lesson.introduction!.dialogue.length)
    const script = dialog.locator('.script-support')
    await script.locator(':scope > summary').focus()
    await page.keyboard.press('Enter')
    await expect(script).toHaveAttribute('open', '')
    await expect(script.locator('[lang="km"]').first()).toHaveAttribute('dir', 'ltr')
    await expect(script.locator('[lang="km"]').first()).toHaveText(pack.lesson.introduction!.teachingCards![0]!.phrase.targetText!)
    await script.getByText('Show pronunciation help and meaning', { exact: true }).first().click()
    await expect(script).toContainText(pack.lesson.introduction!.teachingCards![0]!.phrase.pronunciationHelp!)
    if (index === 0) {
      mkdirSync(new URL('../../docs/khmer/previews/', import.meta.url), { recursive: true })
      for (const width of [320, 1440]) {
        await page.setViewportSize({ width, height: 900 })
        await dialog.locator('.lesson-content').evaluate(el => { el.scrollTop = 0 })
        expect(await dialog.evaluate(el => el.scrollWidth <= el.clientWidth + 1)).toBeTruthy()
        await page.screenshot({ path: new URL(`../../docs/khmer/previews/first-unit-${width}.png`, import.meta.url).pathname })
      }
      await page.setViewportSize({ width: 390, height: 844 })
      await dialog.evaluate(el => { (el as HTMLElement).style.fontSize = '200%' })
      expect(await dialog.evaluate(el => el.scrollWidth <= el.clientWidth + 1)).toBeTruthy()
      await dialog.evaluate(el => { (el as HTMLElement).style.fontSize = '' })
      // The already loaded private preview can run without a network. It must not
      // download draft packages, award completion or create a pending sync item.
      await context.setOffline(true)
      await finishTeaching(page, dialog)
      for (const [i, step] of pack.lesson.steps.entries()) {
        await responseChoices(dialog, step.id)
        if (i === 0) {
          const wrong = step.answers.findIndex(a => a.id !== step.evaluation.correctAnswerId)
          await dialog.locator('.answer-option').nth(wrong).click()
          await dialog.getByRole('button', { name: 'Check answer', exact: true }).click()
          await expect(dialog.locator('.feedback-panel')).toContainText(step.answers[wrong]!.rationale!)
          await dialog.getByRole('button', { name: 'Try again', exact: true }).click()
          await responseChoices(dialog, step.id)
        }
        await dialog.locator('.answer-option').nth(step.answers.findIndex(a => a.id === step.evaluation.correctAnswerId)).click()
        await dialog.getByRole('button', { name: 'Check answer', exact: true }).click()
        await dialog.getByRole('button', { name: i === pack.lesson.steps.length - 1 ? 'Complete lesson' : 'Next step', exact: true }).click()
      }
      await expect(dialog.getByText('Preview complete', { exact: true })).toBeVisible()
      await dialog.getByRole('button', { name: 'Back to curriculum' }).click()
      await context.setOffline(false)
    } else await dialog.getByRole('button', { name: 'Close lesson', exact: true }).click()
    await expect(page.getByRole('button', { name: 'Preview saved version' })).toBeFocused()
    await expect(page.getByText('Draft preview only. Linguistic review and publication checks remain open.')).toBeVisible()
  }
  // No learner attempt/completion or package download was made by any preview.
  expect(writes).toEqual([])
  for (const pack of packages) expect((await page.request.get(`/api/lessons/${pack.lesson.id}`)).status()).toBe(404)
  const versions = await (await page.request.get('/api/admin/curriculum/versions')).json()
  expect(versions.filter((v: { lessonId: string }) => v.lessonId.startsWith('khmer-meet-01-')).every((v: { status: string }) => v.status === 'draft')).toBeTruthy()
  expect(await (await page.request.get('/api/lessons/levantine-day-01')).text()).toBe(arabicBefore)
  const privateRecords = await page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const r = indexedDB.open('ismi-offline'); r.onsuccess = () => resolve(r.result); r.onerror = () => reject(r.error)
    })
    const records: unknown[] = []
    for (const name of ['lessons', 'pending-completions']) {
      if (!db.objectStoreNames.contains(name)) continue
      records.push(...await new Promise<unknown[]>((resolve, reject) => {
        const r = db.transaction(name).objectStore(name).getAll(); r.onsuccess = () => resolve(r.result); r.onerror = () => reject(r.error)
      }))
    }
    db.close(); return JSON.stringify(records)
  })
  expect(privateRecords).not.toContain('khmer-meet-01-')
})
