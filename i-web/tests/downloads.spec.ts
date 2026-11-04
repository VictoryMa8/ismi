import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { expect, test, type BrowserContext, type Page } from '@playwright/test'
import type { LessonResponse } from '../src/types'
import { canonical, type AlphabetPack } from '../src/alphabet'
import { finishTeaching, responseChoices } from './lesson-helpers'

const appVersion = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8')).version
const original = JSON.parse(readFileSync(new URL('../../content/levantine/everyday-01/revisions/guided-teaching/01-lesson.json', import.meta.url), 'utf8')).lesson as LessonResponse
const wave = Buffer.alloc(32044)
wave.write('RIFF'); wave.writeUInt32LE(wave.length - 8, 4); wave.write('WAVEfmt ', 8)
wave.writeUInt32LE(16, 16); wave.writeUInt16LE(1, 20); wave.writeUInt16LE(1, 22)
wave.writeUInt32LE(8000, 24); wave.writeUInt32LE(16000, 28); wave.writeUInt16LE(2, 32); wave.writeUInt16LE(16, 34)
wave.write('data', 36); wave.writeUInt32LE(32000, 40)
const audioUrl = `/api/recordings/${createHash('sha256').update(wave).digest('hex')}.wav`
const otherWave = Buffer.from(wave); otherWave[100] = 1
const otherUrl = `/api/recordings/${createHash('sha256').update(otherWave).digest('hex')}.wav`
const ids = ['levantine-day-01', 'levantine-day-02', 'french-download-fixture']
const alphabetDraft = JSON.parse(readFileSync(new URL('../../content/alphabet/inventory-preview/levantine.pack.json', import.meta.url), 'utf8'))
const alphabet: AlphabetPack = {
  id: alphabetDraft.id, courseId: 'levantine', version: 1, contentHash: '', textOnly: true,
  title: alphabetDraft.title, variety: alphabetDraft.variety, helpConvention: alphabetDraft.helpConvention,
  inventoryId: alphabetDraft.inventory.id, inventoryVersion: alphabetDraft.inventory.version,
  basicEntryIds: alphabetDraft.inventory.basicEntryIds, scriptEntries: alphabetDraft.inventory.entries,
  entries: alphabetDraft.entries.map((e: any) => ({ ...e, examples: [], activities: [] })), sources: alphabetDraft.sources, fonts: alphabetDraft.fonts,
  publicationNotice: { id: 'test-only', title: 'Unreviewed · text-only preview', detail: 'Transport fixture from the exact inventory preview; no human audio.' },
}
alphabet.contentHash = createHash('sha256').update(canonical(alphabet)).digest('hex')
const titles = ['Download fixture one', 'Download fixture two', 'Text preview fixture']
const row = (page: Page, title = titles[0]!) => page.getByRole('listitem', { name: title, exact: true })

async function fixture(context: BrowserContext) {
  await context.addInitScript(() => {
    const online = Object.getOwnPropertyDescriptor(Navigator.prototype, 'onLine')!.get!
    Object.defineProperty(navigator, 'onLine', { configurable: true, get: () => localStorage.getItem('downloads-test-offline') === 'yes' ? false : online.call(navigator) })
    const fetch = window.fetch.bind(window)
    window.fetch = (input, options) => {
      const path = new URL(typeof input === 'string' ? input : input instanceof URL ? input.href : input.url, location.href).pathname
      if (path.startsWith('/api/') && !navigator.onLine) return Promise.reject(new TypeError('Offline test transport'))
      return fetch(input, options)
    }
  })
  await context.route('**/api/alphabet', route => route.fulfill({ json: { schemaVersion: 1, courses: [{ courseId: 'levantine', packId: alphabet.id, version: alphabet.version, contentHash: alphabet.contentHash }], withdrawnIds: [] } }))
  await context.route('**/api/alphabet/packs/*', route => route.fulfill({ json: alphabet }))
  const lessons = new Map(ids.map((id, index) => {
    const lesson = structuredClone(original)
    Object.assign(lesson, { id, title: titles[index], trackId: index === 2 ? 'french' : 'levantine', version: 'fixture-v1', courseOrder: index + 1 })
    for (const step of lesson.steps) step.prompt.audioUrl = index === 2 ? null : audioUrl
    if (index === 2) lesson.publicationNotice = { releaseId: 'test-only', label: 'Unreviewed, text-only', details: 'Transport fixture; no linguistic acceptance.' }
    return [id, lesson]
  }))
  const failures = new Map<string, number | 'abort'>()
  let audioMode: 'valid' | 'corrupt' | 'abort' | 'missing' = 'valid'
  await context.route('**/api/dashboard', async route => {
    const response = await route.fetch(), data = await response.json()
    data.dailyPlan.lessons = [...lessons.values()].map((l, i) => ({ ...l, isCompleted: false, completedToday: false, isCurrent: i === 0 }))
    data.dailyPlan.primaryTrack = 'levantine'; data.dailyPlan.nextLessonId = ids[0]
    await route.fulfill({ json: data })
  })
  await context.route('**/api/lessons/*', async route => {
    if (route.request().method() !== 'GET') return route.continue()
    const id = new URL(route.request().url()).pathname.split('/').at(-1)!, fail = failures.get(id)
    if (fail === 'abort') return route.abort('internetdisconnected')
    if (fail) return route.fulfill({ status: fail, json: { message: 'Fixture unavailable' } })
    return route.fulfill({ json: lessons.get(id) ?? original })
  })
  await context.route('**/api/recordings/*.wav', async route => {
    if (route.request().url().endsWith(otherUrl) && audioMode !== 'valid') {
      if (audioMode === 'abort') return route.abort('connectionreset')
      return route.fulfill({ status: audioMode === 'missing' ? 404 : 200, body: Buffer.from('corrupt'), contentType: 'audio/wav' })
    }
    return route.fulfill({ body: route.request().url().endsWith(otherUrl) ? otherWave : wave, contentType: 'audio/wav' })
  })
  return { lessons, failures, setAudio: (mode: typeof audioMode) => { audioMode = mode }, update: () => {
    const lesson = lessons.get(ids[0]!)!; lesson.version = 'fixture-v2'; lesson.steps.forEach(s => { s.prompt.audioUrl = otherUrl })
  } }
}
// Chromium's network emulation resets navigator.onLine after a service-worker
// navigation in this environment. Preserve the emulated signal across reloads;
// requests still fail through real network emulation and the fixture transport.
async function setOffline(context: BrowserContext, value: boolean) {
  for (const page of context.pages()) await page.evaluate(value => {
    if (value) localStorage.setItem('downloads-test-offline', 'yes'); else localStorage.removeItem('downloads-test-offline')
  }, value)
  await context.setOffline(value)
}
async function open(page: Page) {
  await page.goto('/#/account')
  await expect(page.getByText(`Beta ${appVersion}`, { exact: false })).toBeVisible()
  await page.getByRole('link', { name: 'Downloads', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Downloads', exact: true })).toBeVisible()
  await expect(row(page).locator('strong')).toHaveText('Saved')
  await expect(row(page, titles[1]).locator('strong')).toHaveText('Saved')
  await expect(page.getByRole('button', { name: 'Refresh availability', exact: true })).toBeEnabled()
}
async function refresh(page: Page) {
  await page.getByRole('button', { name: 'Refresh availability', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Refresh availability', exact: true })).toBeEnabled()
}
async function records(page: Page, name: string) {
  return page.evaluate(async name => {
    const db = await new Promise<IDBDatabase>((resolve, reject) => { const r = indexedDB.open('ismi-offline'); r.onsuccess = () => resolve(r.result); r.onerror = reject })
    return new Promise<unknown[]>((resolve, reject) => {
      const tx = db.transaction(name), r = tx.objectStore(name).getAll()
      tx.oncomplete = () => { db.close(); resolve(r.result) }; tx.onabort = () => { db.close(); reject(tx.error) }
    })
  }, name)
}

test('inventory, shared audio, safe removal, durable intent, offline reload and keyboard layout', async ({ page, context }, info) => {
  await fixture(context); await open(page)
  expect((await records(page, 'recordings')).length).toBe(1)
  const savedBytes = (await records(page, 'lessons')).reduce<number>((sum, value) => sum + Buffer.byteLength(JSON.stringify(value)), 0) + wave.length
  await expect(page.getByText(`Managed downloads: about ${(savedBytes / 1024).toFixed(1)} KB`, { exact: true })).toBeVisible()
  await page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>(resolve => { const r = indexedDB.open('ismi-offline'); r.onsuccess = () => resolve(r.result) })
    await new Promise<void>(resolve => {
      const tx = db.transaction(['snapshots', 'pending-completions', 'review-history'], 'readwrite')
      for (const key of ['recall', 'report', 'placement', 'preferences']) tx.objectStore('snapshots').put({ key: `preservation-fixture:${key}`, value: key })
      tx.objectStore('snapshots').put({ key: 'started-lesson-v1:guest:levantine', value: { lessonId: 'levantine-day-01', version: 'fixture-v1', stepIndex: 1 } })
      for (const scope of ['guest', 'other-account']) tx.objectStore('pending-completions').put({ completionId: scope, scope, lessonId: 'levantine-day-01', completedAt: new Date().toISOString(), estimatedMinutes: 7 })
      tx.objectStore('review-history').put({ key: 'preservation-fixture', scope: 'guest', lessonId: 'levantine-day-01', stepId: 'one', needsReview: true })
      tx.oncomplete = () => { db.close(); resolve() }
    })
    window.dispatchEvent(new Event('ismi-downloads-changed'))
  })
  await expect(page.getByText('1 pending completion for this guest session.', { exact: false })).toBeVisible()
  const before = { snapshots: (await records(page, 'snapshots')).filter((r: any) => r.key.startsWith('preservation-fixture') || r.key.startsWith('started-lesson')), queue: await records(page, 'pending-completions'), review: await records(page, 'review-history') }
  await row(page).getByRole('button', { name: /Remove download/ }).click()
  await expect(row(page)).toContainText('Not saved')
  await expect(row(page)).toContainText('Saved lesson position kept')
  expect((await records(page, 'recordings')).length).toBe(1)
  expect((await records(page, 'pending-completions'))).toEqual(before.queue)
  expect((await records(page, 'review-history'))).toEqual(before.review)
  expect((await records(page, 'snapshots')).filter((r: any) => r.key.startsWith('preservation-fixture') || r.key.startsWith('started-lesson'))).toEqual(before.snapshots)
  await page.reload()
  await expect(row(page)).toContainText('Removed on this device')
  await expect(row(page, titles[1]).locator('strong')).toHaveText('Saved')
  await row(page, titles[1]).getByRole('button', { name: /Remove download/ }).click()
  await expect(row(page, titles[1])).toContainText('Not saved')
  expect((await records(page, 'recordings')).length).toBe(0)
  await row(page).getByRole('button', { name: /Download/ }).click()
  await expect(row(page)).toContainText('saved version') // Version remains explicit after saving.
  await row(page, titles[2]).getByRole('button', { name: /Download/ }).click()
  await expect(row(page, titles[2])).toContainText('Saved · text only')
  await expect(row(page, titles[2])).toContainText('Unreviewed, text-only')
  for (const width of [320, 1280]) {
    await page.setViewportSize({ width, height: 850 })
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    await page.screenshot({ path: info.outputPath(`downloads-${width}.png`), fullPage: true })
  }
  const control = row(page).getByRole('button', { name: /Remove download/ }); await control.focus(); await page.keyboard.press('Enter')
  await expect(row(page)).toBeFocused()
  await page.evaluate(async () => { await navigator.serviceWorker.ready })
  await setOffline(context, true); expect(await page.evaluate(() => navigator.onLine)).toBe(false); await page.reload()
  expect(await page.evaluate(() => navigator.onLine)).toBe(false)
  await expect(row(page, titles[2])).toContainText('Saved · text only')
  await expect(page.getByText('Offline · showing last known availability.', { exact: false })).toBeVisible()
})

for (const fault of ['corrupt', 'abort', 'missing', 'quota'] as const) test(`failed ${fault} update keeps the previous complete version, targeted retry succeeds`, async ({ page, context }) => {
  const data = await fixture(context); await open(page); data.update()
  await refresh(page); await expect(row(page)).toContainText('Update available')
  if (fault === 'quota') await page.evaluate(() => {
    const put = IDBObjectStore.prototype.put
    IDBObjectStore.prototype.put = function(value, key) { if (this.name === 'lessons' && value.version === 'fixture-v2') throw new DOMException('Storage full', 'QuotaExceededError'); return put.call(this, value, key) }
  })
  else data.setAudio(fault)
  await row(page).getByRole('button', { name: /Update/ }).click()
  await expect(row(page)).toContainText('Failed')
  await expect(row(page)).toContainText('Saved version remains usable')
  expect((await records(page, 'lessons') as LessonResponse[]).find(l => l.id === ids[0])?.version).toBe('fixture-v1')
  await expect(row(page, titles[1]).locator('strong')).toHaveText('Saved')
  // Reload recovers transient operation state and also resets the injected quota fault.
  data.setAudio('valid'); await page.reload()
  await expect(row(page).getByRole('button', { name: /^Retry/ })).toBeEnabled()
  await row(page).getByRole('button', { name: /^Retry/ }).click()
  await expect(row(page).locator('strong')).toHaveText('Saved')
  await expect(row(page)).toContainText('saved version fixture-v2')
  await expect(row(page).getByRole('button', { name: /^Retry/ })).toHaveCount(0)
})

test('transient availability failure retains downloads, confirmed forbidden publication removes fallback', async ({ page, context }) => {
  const data = await fixture(context); await open(page)
  data.failures.set(ids[0]!, 503); await refresh(page)
  await expect(row(page).locator('strong')).toHaveText('Saved')
  expect((await records(page, 'lessons') as LessonResponse[]).some(l => l.id === ids[0])).toBe(true)
  data.failures.set(ids[0]!, 403); await refresh(page)
  await expect(row(page)).toContainText('Unavailable')
  expect((await records(page, 'lessons') as LessonResponse[]).some(l => l.id === ids[0])).toBe(false)
  await setOffline(context, true); await page.reload()
  await expect(row(page)).toContainText('Unavailable')
})

test('two tabs serialize transfers/removal and protect an open lesson', async ({ page, context }) => {
  await fixture(context); await open(page)
  const second = await context.newPage(); await open(second)
  await page.goto('/#/today'); await page.getByRole('button', { name: /Continue in Levantine/ }).click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await row(second).getByRole('button', { name: /Remove download/ }).click()
  await expect(second.getByRole('alert')).toContainText('Close open lessons')
  await page.getByRole('button', { name: 'Close lesson', exact: true }).click()
  await row(second).getByRole('button', { name: /Remove download/ }).click()
  await expect(row(second)).toContainText('Not saved')
  await page.goto('/#/account/downloads'); await expect(row(page)).toContainText('Not saved')
  await Promise.all([row(page).getByRole('button', { name: /^Download/ }).evaluate(button => (button as HTMLButtonElement).click()), row(second).getByRole('button', { name: /^Download/ }).evaluate(button => (button as HTMLButtonElement).click())])
  await expect(row(page).locator('strong')).toHaveText('Saved'); await expect(row(second).locator('strong')).toHaveText('Saved')
  expect((await records(page, 'lessons') as LessonResponse[]).filter(l => l.id === ids[0])).toHaveLength(1)
  await row(second).getByRole('button', { name: /Remove download/ }).click()
  await expect(row(page)).toContainText('Not saved')
  await page.reload(); await expect(row(page)).toContainText('Not saved')
})

test('alphabet downloads reopen offline and removal preserves evidence and unpublished packs stay absent', async ({ page, context }) => {
  await fixture(context); await open(page)
  const alphabetRow = page.locator('#downloads-levantine').locator('..').getByRole('listitem').filter({ hasText: 'Alphabet' })
  await alphabetRow.getByRole('button', { name: /^Download/ }).click()
  await expect(alphabetRow).toContainText('Saved · text only')
  await expect(page.getByText('full-pack-draft', { exact: false })).toHaveCount(0)
  await page.evaluate(async () => { await navigator.serviceWorker.ready }); await setOffline(context, true)
  await page.goto('/#/practice/alphabet'); await expect(page.locator('.alphabet-grid')).toBeVisible()
  await page.goto('/#/account/downloads'); await expect(alphabetRow).toContainText('Saved · text only')
  await alphabetRow.getByRole('button', { name: /Remove download/ }).click()
  await expect(alphabetRow).toContainText('Not saved')
})

test('offline lesson completion survives removal and scoped sync retries are idempotent', async ({ page, context }) => {
  await fixture(context); await open(page)
  await page.evaluate(async () => { await navigator.serviceWorker.ready }); await setOffline(context, true)
  await page.goto('/#/today'); await page.getByRole('button', { name: /Continue in Levantine/ }).click()
  const dialog = page.getByRole('dialog'); await finishTeaching(page, dialog)
  for (const step of original.steps) {
    await responseChoices(dialog)
    const index = step.answers.findIndex(a => a.id.toLowerCase() === step.evaluation.correctAnswerId.toLowerCase())
    await dialog.locator('.answer-option').nth(index).click()
    await dialog.getByRole('button', { name: 'Check answer', exact: true }).click()
    await dialog.getByRole('button', { name: /^(Next step|Complete lesson)$/ }).click()
  }
  await expect(dialog.getByText('Conversation complete', { exact: true })).toBeVisible()
  await dialog.getByRole('button', { name: 'Close lesson', exact: true }).click()
  await page.goto('/#/account/downloads')
  await expect(page.getByText('1 pending completion for this guest session.', { exact: false })).toBeVisible()
  const queue = await records(page, 'pending-completions')
  await row(page).getByRole('button', { name: /Remove download/ }).click()
  await expect(row(page)).toContainText('Not saved')
  expect(await records(page, 'pending-completions')).toEqual(queue)
  await context.route('**/api/lessons/*/completions', route => route.fulfill({ status: 503, json: { message: 'Retry later' } }))
  await setOffline(context, false)
  await expect(page.getByRole('button', { name: 'Retry sync', exact: true })).toBeEnabled()
  await page.getByRole('button', { name: 'Retry sync', exact: true }).click()
  await expect(page.getByRole('alert')).toContainText('still waiting')
  expect(await records(page, 'pending-completions')).toEqual(queue)
  await context.unroute('**/api/lessons/*/completions')
  await page.getByRole('button', { name: 'Retry sync', exact: true }).click()
  await expect(page.getByText('0 pending completions for this guest session.', { exact: false })).toBeVisible()
})

test('account and guest recovery details are isolated and storage estimate denial is honest', async ({ page, context }) => {
  await fixture(context); await open(page)
  await page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>(resolve => { const r = indexedDB.open('ismi-offline'); r.onsuccess = () => resolve(r.result) })
    await new Promise<void>(resolve => {
      const tx = db.transaction('pending-completions', 'readwrite')
      tx.objectStore('pending-completions').put({ completionId: 'other-identity', scope: 'account:someone-else', lessonId: 'unknown-private-id', completedAt: new Date().toISOString(), estimatedMinutes: 7 })
      tx.oncomplete = () => { db.close(); resolve() }
    })
    Object.defineProperty(navigator.storage, 'estimate', { value: () => Promise.reject(new Error('Denied')) })
    window.dispatchEvent(new Event('ismi-downloads-changed'))
  })
  await expect(page.getByText('0 pending completions for this guest session.', { exact: false })).toBeVisible()
  await page.getByText('Storage details', { exact: true }).click()
  await expect(page.getByText('Browser storage estimate: Unavailable.', { exact: false })).toBeVisible()
  await expect(page.getByText('unknown-private-id')).toHaveCount(0)
  expect(await records(page, 'pending-completions')).toHaveLength(1)
})

test('missing required bytes never claim Saved, and one retry repairs shared availability', async ({ page, context }) => {
  await fixture(context); await open(page)
  await page.evaluate(async url => {
    const db = await new Promise<IDBDatabase>(resolve => { const r = indexedDB.open('ismi-offline'); r.onsuccess = () => resolve(r.result) })
    await new Promise<void>(resolve => { const tx = db.transaction('recordings', 'readwrite'); tx.objectStore('recordings').delete(url); tx.oncomplete = () => { db.close(); resolve() } })
    window.dispatchEvent(new Event('ismi-downloads-changed'))
  }, audioUrl)
  await expect(row(page).locator('strong')).toHaveText('Failed')
  await expect(row(page, titles[1]).locator('strong')).toHaveText('Failed')
  await row(page).getByRole('button', { name: /^Retry/ }).click()
  await expect(row(page).locator('strong')).toHaveText('Saved')
  await expect(row(page, titles[1]).locator('strong')).toHaveText('Saved')
})

test('reload during transfer releases locks and converges to a complete saved version', async ({ page, context }) => {
  const data = await fixture(context); await open(page); data.update(); await refresh(page)
  let release!: () => void
  const gate = new Promise<void>(resolve => { release = resolve })
  await context.route(`**${otherUrl}`, async route => {
    await gate
    await route.fulfill({ body: otherWave, contentType: 'audio/wav' }).catch(() => {})
  })
  await row(page).getByRole('button', { name: /^Update/ }).click()
  await expect(row(page).locator('strong')).toHaveText('Working…')
  const reloaded = page.reload(); release(); await reloaded
  await expect(row(page).locator('strong')).toHaveText('Saved')
  await expect(row(page)).toContainText('saved version fixture-v2')
  expect((await records(page, 'lessons') as LessonResponse[]).filter(l => l.id === ids[0])).toHaveLength(1)
})

test('sync rechecks identity and keeps the original queue when auth fails or changes in another tab', async ({ page, context }) => {
  await fixture(context); await open(page)
  await page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>(resolve => { const r = indexedDB.open('ismi-offline'); r.onsuccess = () => resolve(r.result) })
    await new Promise<void>(resolve => {
      const tx = db.transaction('pending-completions', 'readwrite')
      tx.objectStore('pending-completions').put({ completionId: 'guest-stays-private', scope: 'guest', lessonId: 'levantine-day-01', completedAt: new Date().toISOString(), estimatedMinutes: 7 })
      tx.oncomplete = () => { db.close(); resolve() }
    })
    window.dispatchEvent(new Event('ismi-downloads-changed'))
  })
  await expect(page.getByText('1 pending completion for this guest session.', { exact: false })).toBeVisible()
  const queue = await records(page, 'pending-completions')
  let submissions = 0
  await context.route('**/api/lessons/*/completions', route => { submissions++; return route.fulfill({ json: { accepted: true } }) })
  await context.route('**/api/auth/me', route => route.fulfill({ status: 503, json: { message: 'Unavailable' } }))
  await page.getByRole('button', { name: 'Retry sync', exact: true }).click()
  await expect(page.getByRole('alert')).toContainText('Sync could not finish')
  expect(submissions).toBe(0)
  expect(await records(page, 'pending-completions')).toEqual(queue)
  await context.route('**/api/auth/me', route => route.fulfill({ json: { isAuthenticated: true, userId: 'other-download-account', displayName: 'Other learner', email: null, canManageCurriculum: false } }))
  await page.getByRole('button', { name: 'Retry sync', exact: true }).click()
  await expect(page.getByText('0 pending completions for your account.', { exact: false })).toBeVisible()
  await expect(page.getByText('1 pending completion for this guest session.', { exact: false })).toHaveCount(0)
  expect(submissions).toBe(0)
  expect(await records(page, 'pending-completions')).toEqual(queue)
  await expect(row(page).locator('strong')).toHaveText('Saved')
})
