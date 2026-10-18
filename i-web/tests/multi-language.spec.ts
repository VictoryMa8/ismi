import { expect, test, type Page } from '@playwright/test'
import { readableLesson, courses } from '../src/courses'
import { placementQuestions, placementStorageKey } from '../src/placement'
import { learnedVocabulary } from '../src/glossary'
import type { DashboardResponse, LessonResponse } from '../src/types'
import { finishTeaching, responseChoices } from './lesson-helpers'
import { chooseCourse, courseSwitch, expectViewedCourse } from './courseSwitcher'

// Synthetic transport/rendering fixtures. No curriculum, linguistic or review claims.
function fixture(courseId: 'french' | 'khmer', n = 1): LessonResponse {
  const targetText = courseId === 'khmer' ? 'កិខ' : 'é test'
  const pronunciationHelp = 'engineering fixture'
  const phrase = { arabic: '', arabizi: '', targetText, pronunciationHelp, meaning: 'Engineering text only', audioUrl: null }
  return { id: `fixture-${courseId}-${n}`, trackId: courseId, schemaVersion: 2, title: `${courseId} engineering ${n}`,
    scenario: 'Transport and rendering fixture; not a course', estimatedMinutes: 5, version: 'test-v1',
    unitId: `fixture-${courseId}`, unitTitle: `${courseId} engineering unit`, courseOrder: n, reviewStatus: 'owner-review',
    contentReview: { languageTag: courseId === 'khmer' ? 'km' : 'fr', variety: 'engineering', helpConvention: 'engineering', reviewer: 'none', reviewDisposition: 'pending', rightsDisposition: 'pending', criticalIssues: [], engineeringFixture: true },
    introduction: { goal: 'Exercise the interface', dialogue: Array.from({ length: 4 }, (_, i) => ({ speaker: `Test ${i}`, line: phrase })),
      expressions: [phrase], usageNote: 'Synthetic test only.', dialectNote: 'No language claims.', recordingNote: 'No model recording.', sourceLocators: ['test:engineering'],
      teachingCards: [{ title: 'Engineering text', phrase, note: 'Synthetic test only.', chunks: [{ ...phrase }], sourceLocators: ['test:engineering'] }] },
    vocabulary: [{ ...phrase, id: 'test', senseId: 'test', kind: 'expression', dialect: 'engineering', register: 'engineering', forms: [], note: 'Synthetic test only.', sourceLocators: ['test:engineering'], teachingCardIndex: 0 }],
    steps: [1, 2].map(i => ({ id: `step-${i}`, instruction: 'Select the engineering sample.', prompt: phrase,
      answers: [{ ...phrase, id: 'a', rationale: 'Synthetic matching sample.', segments: courseId === 'khmer' ? ['កិ', 'ខ'] : ['é ', 'test'] },
        { ...phrase, id: 'b', targetText: `${targetText}x`, rationale: 'Synthetic nonmatching sample.', segments: [`${targetText}x`] }],
      evaluation: { correctAnswerId: 'a', correctTitle: 'That fits.', incorrectTitle: 'Compare the sample.', correctExplanation: 'Synthetic matching sample.', incorrectExplanation: 'Synthetic nonmatching sample.', retryHint: 'Use the matching sample.' } })) }
}
async function install(page: Page, completedKhmer = false) {
  const base = await (await page.request.get('/api/dashboard')).json() as DashboardResponse
  const packs = [1, 2, 3].flatMap(n => [fixture('french', n), fixture('khmer', n)])
  const dashboard = { ...base, dailyPlan: { ...base.dailyPlan, lessons: [...base.dailyPlan.lessons, ...packs.map(p => ({ ...p, isCompleted: completedKhmer && p.id === 'fixture-khmer-1', isCurrent: p.courseOrder === 1, completedToday: false }))] } }
  // WebKit's service worker can bypass page.route. Inject only the synthetic API
  // transport before app code; offline requests still fail and must use real IndexedDB.
  await page.addInitScript(({ dashboard, packs }) => {
    const nativeFetch = window.fetch.bind(window)
    window.fetch = async (input, options) => {
      const url = new URL(typeof input === 'string' ? input : input instanceof URL ? input.href : input.url, location.href)
      const pack = packs.find(p => url.pathname === `/api/lessons/${p.id}`)
      const attempt = /^\/api\/lessons\/fixture-.*\/attempts$/.test(url.pathname)
      const completion = /^\/api\/lessons\/fixture-.*\/completions$/.test(url.pathname)
      if (url.pathname !== '/api/dashboard' && !pack && !attempt && !completion) return nativeFetch(input, options)
      if (!navigator.onLine) throw new TypeError('Offline test transport')
      const completed = JSON.parse(sessionStorage.getItem('engineering-completions') ?? '[]') as string[]
      let json: unknown = pack
      if (url.pathname === '/api/dashboard') {
        json = { ...dashboard, dailyPlan: { ...dashboard.dailyPlan, lessons: dashboard.dailyPlan.lessons.map(l => completed.includes(l.id) ? { ...l, isCompleted: true, completedToday: true } : l) } }
      }
      if (attempt) {
        const body = JSON.parse(String(options?.body))
        json = { stepId: body.stepId, isCorrect: body.answerId === 'a', correctAnswerId: 'a', feedbackTitle: 'That fits.', explanation: 'Synthetic matching sample.', retryHint: null }
      }
      if (completion) {
        const id = url.pathname.split('/').at(-2)!
        sessionStorage.setItem('engineering-completions', JSON.stringify([...new Set([...completed, id])]))
        json = { accepted: true, alreadyRecorded: completed.includes(id), completedMinutes: 5, goalMinutes: 15 }
      }
      return new Response(JSON.stringify(json), { headers: { 'Content-Type': 'application/json' } })
    }
  }, { dashboard, packs })
  let disconnected = false
  await page.route('**/api/dashboard', route => disconnected ? route.abort() : route.fulfill({ json: dashboard }))
  for (const pack of packs) await page.route(`**/api/lessons/${pack.id}`, route => disconnected ? route.abort() : route.fulfill({ json: pack }))
  await page.route('**/api/lessons/fixture-*/attempts', async route => {
    if (disconnected) return route.abort()
    await route.fulfill({ json: { stepId: route.request().postDataJSON().stepId, isCorrect: true, correctAnswerId: 'a', feedbackTitle: 'That fits.', explanation: 'Synthetic matching sample.', retryHint: null } })
  })
  await page.route('**/api/lessons/fixture-*/completions', async route => {
    if (disconnected) return route.abort()
    const id = route.request().url().split('/').at(-2)
    const item = dashboard.dailyPlan.lessons.find(l => l.id === id)
    if (item) { item.isCompleted = true; item.completedToday = true }
    await route.fulfill({ json: { accepted: true, alreadyRecorded: false, completedMinutes: 5, goalMinutes: 15 } })
  })
  return { packs, disconnect: () => { disconnected = true }, reconnect: () => { disconnected = false } }
}

const switchCourse = chooseCourse

test('neutral schema preserves exact Khmer segments and legacy Arabic; course placement/glossary stay separate', async ({ request }) => {
  const old = await (await request.get('/api/lessons/levantine-day-01')).json()
  expect(readableLesson(old)).toEqual(old)
  const km = fixture('khmer'), fr = fixture('french')
  const original = JSON.stringify(km)
  const adapted = readableLesson(km)
  expect(adapted.steps[0]!.prompt.arabic).toBe('កិខ')
  expect(adapted.steps[0]!.answers[0]!.segments!.join('')).toBe('កិខ')
  expect(JSON.stringify(km)).toBe(original)
  expect(placementQuestions([adapted], 'khmer')).toEqual([])
  const packages = [1, 2, 3].flatMap(n => [fixture('khmer', n), fixture('french', n)]).map(p => readableLesson({ ...p, contentReview: { ...p.contentReview!, engineeringFixture: false } }))
  expect(placementQuestions(packages, 'khmer')).toHaveLength(6)
  expect(placementQuestions(packages, 'french')).toHaveLength(6)
  expect(placementStorageKey('guest', 'khmer')).not.toBe(placementStorageKey('guest', 'french'))
  expect(learnedVocabulary([readableLesson(fr), adapted]).map(v => v.trackId).sort()).toEqual(['french', 'khmer'])
  const registry = await (await request.get('/api/courses')).json()
  expect(registry.map((entry: { course: object }) => entry.course)).toEqual(courses.map(({ accent: _accent, nativeName: _nativeName, ...metadata }) => metadata))
})

for (const width of [320, 1280]) test(`course switching filters all pages and survives offline reload at ${width}px`, async ({ page, context }, info) => {
  const { disconnect, reconnect } = await install(page)
  await page.setViewportSize({ width, height: 900 })
  const errors: string[] = []; page.on('pageerror', e => errors.push(e.message))
  await page.goto('/#/courses')
  await page.evaluate(async () => { await navigator.serviceWorker.ready })
  await switchCourse(page, 'khmer')
  await expect(page.getByRole('button', { name: 'Open khmer engineering 1', exact: true })).toBeVisible()
  await expect(page.getByRole('button', { name: /Open Answer a friend/ })).toHaveCount(0)
  await page.getByRole('button', { name: 'Open khmer engineering 1', exact: true }).click()
  const dialog = page.getByRole('dialog', { name: 'khmer engineering 1', exact: true })
  await finishTeaching(page, dialog)
  await expect(dialog.locator('.arabic-prompt')).toHaveAttribute('lang', 'km')
  await expect(dialog.locator('.arabic-prompt')).toHaveAttribute('dir', 'ltr')
  await page.evaluate(async () => { await document.fonts.load('24px "Ismi Khmer"') })
  expect(await dialog.locator('[data-script="khmer"]').first().evaluate(el => getComputedStyle(el).fontFamily)).toContain('Ismi Khmer')
  await responseChoices(dialog)
  await dialog.locator('.answer-option').first().click()
  await dialog.getByRole('button', { name: 'Check answer', exact: true }).click()
  await dialog.getByRole('button', { name: 'Next step', exact: true }).click()
  await expect(dialog.locator('.practice-page:not([inert])')).toHaveAttribute('data-step-id', 'step-2')
  await dialog.getByRole('button', { name: 'Close lesson', exact: true }).click()
  await switchCourse(page, 'french')
  await expect(page.getByRole('button', { name: 'Open french engineering 1', exact: true })).toBeVisible()
  await switchCourse(page, 'khmer')
  await page.getByRole('button', { name: 'Open khmer engineering 1', exact: true }).click()
  await expect(dialog.locator('.practice-page:not([inert])')).toHaveAttribute('data-step-id', 'step-2')
  await dialog.getByRole('button', { name: 'Close lesson', exact: true }).click()
  // Stored settings still default to Levantine; switching is independent.
  await page.getByRole('link', { name: 'Account', exact: true }).first().click()
  await expect(page.getByLabel('Primary course', { exact: true })).toHaveValue('levantine')
  for (const checked of [true, false, true]) {
    await page.getByRole('checkbox', { name: 'Khmer', exact: true }).setChecked(checked)
    await page.getByRole('button', { name: 'Save study settings', exact: true }).click()
    await expect(page.getByRole('button', { name: 'Save study settings', exact: true })).toBeEnabled()
  }
  for (const route of ['Today', 'Practice', 'Progress', 'Words']) {
    await page.getByRole('link', { name: route, exact: true }).first().click()
    await expectViewedCourse(page, 'khmer')
  }
  await page.getByRole('link', { name: 'Courses', exact: true }).first().click()
  disconnect(); await context.setOffline(true); await page.reload()
  await expectViewedCourse(page, 'khmer')
  await page.getByRole('button', { name: 'Open khmer engineering 1', exact: true }).click()
  await expect(dialog.locator('.practice-page:not([inert])')).toHaveAttribute('data-step-id', 'step-2')
  await responseChoices(dialog)
  await dialog.locator('.answer-option').first().click()
  await dialog.getByRole('button', { name: 'Check answer', exact: true }).click()
  await dialog.getByRole('button', { name: 'Complete lesson', exact: true }).click()
  await expect(dialog.getByText('Saved on this device. Ismi will sync it when you reconnect.', { exact: true })).toBeVisible()
  expect(await page.evaluate(() => document.fonts.check('24px "Ismi Khmer"'))).toBeTruthy()
  await page.screenshot({ path: info.outputPath(`khmer-offline-${width}.png`), fullPage: true })
  await dialog.getByRole('button', { name: 'Back to courses', exact: true }).click()
  await expect(page.getByText('Khmer · 1 of 3 lessons complete', { exact: true })).toBeVisible()
  await switchCourse(page, 'french')
  await expect(page.getByText('French · 0 of 3 lessons complete', { exact: true })).toBeVisible()
  expect(await page.locator('body').evaluate(el => el.scrollWidth <= innerWidth)).toBeTruthy()
  reconnect(); await context.setOffline(false)
  await page.evaluate(() => window.dispatchEvent(new Event('online')))
  await expect.poll(() => pendingRows(page)).toEqual([])
  await switchCourse(page, 'khmer')
  await expect(page.getByText('Khmer · 1 of 3 lessons complete', { exact: true })).toBeVisible()
  expect(errors).toEqual([])
})

test('unavailable courses never substitute Arabic and keep factual empty states', async ({ page }) => {
  await page.goto('/#/today')
  await switchCourse(page, 'khmer')
  await expect(page.getByRole('status').filter({ has: page.getByRole('heading', { name: 'Khmer', exact: true }) })).toContainText('Lessons not yet available')
  await expect(page.locator('.primary-lesson-card')).toHaveCount(0)
  await page.reload()
  await expectViewedCourse(page, 'khmer')
  await page.getByRole('link', { name: 'Courses', exact: true }).first().click()
  await expect(page.locator('.course-path')).toHaveCount(0)
})

async function pendingRows(page: Page) {
  return page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('ismi-offline'); request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error)
    })
    return new Promise<unknown[]>(resolve => {
      const tx = db.transaction('pending-completions'); const request = tx.objectStore('pending-completions').getAll()
      tx.oncomplete = () => { db.close(); resolve(request.result) }
    })
  })
}

test('Khmer uses exact authored pieces, enlarged text and keyboard; no Arabic voice fallback', async ({ page }, info) => {
  await install(page)
  await page.addInitScript(() => { Object.defineProperty(window.speechSynthesis, 'getVoices', { value: () => [{ name: 'Arabic only', lang: 'ar-JO' }] }) })
  await page.setViewportSize({ width: 320, height: 900 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/#/courses')
  await switchCourse(page, 'khmer')
  await page.getByRole('button', { name: 'Open khmer engineering 1', exact: true }).click()
  const dialog = page.getByRole('dialog', { name: 'khmer engineering 1', exact: true })
  await finishTeaching(page, dialog)
  await expect(dialog.getByRole('button', { name: /No Khmer device voice available/ })).toBeDisabled()
  const bank = dialog.locator('.word-bank')
  for (const text of ['កិ', 'ខ']) {
    await bank.getByRole('button', { name: `Add ${text}`, exact: true }).focus(); await page.keyboard.press('Enter')
  }
  await dialog.getByRole('button', { name: 'Check answer', exact: true }).focus(); await page.keyboard.press('Enter')
  await expect(dialog.getByText('That fits.', { exact: true })).toBeVisible()
  await page.addStyleTag({ content: 'html { font-size: 200% !important; }' })
  expect(await dialog.evaluate(el => el.scrollWidth <= el.clientWidth)).toBeTruthy()
  await page.screenshot({ path: info.outputPath('khmer-large-keyboard.png'), fullPage: true })
})

test('legacy IndexedDB Arabic download and scoped pending completions survive upgrade and reconnect', async ({ page, context }) => {
  await page.goto('/#/today')
  await page.evaluate(async () => { await navigator.serviceWorker.ready })
  const dashboard = await (await page.request.get('/api/dashboard')).json()
  const current = await (await page.request.get('/api/lessons/levantine-day-01')).json()
  const lesson = JSON.parse(JSON.stringify(current, (key, value) => ['targetText', 'pronunciationHelp', 'schemaVersion', 'contentReview', 'languageTag', 'segments'].includes(key) ? undefined : value))
  // Emulate the existing database-version-3 records, with no neutral text fields.
  await page.evaluate(async ({ dashboard, lesson }) => {
    const db = await new Promise<IDBDatabase>(resolve => { const r = indexedDB.open('ismi-offline', 3); r.onsuccess = () => resolve(r.result) })
    await new Promise<void>(resolve => {
      const tx = db.transaction(['lessons', 'snapshots', 'pending-completions'], 'readwrite')
      tx.objectStore('lessons').put(lesson)
      tx.objectStore('snapshots').put({ key: 'dashboard:guest', value: dashboard })
      for (const scope of ['guest', 'user:other']) tx.objectStore('pending-completions').put({ scope, completionId: `upgrade-${scope}`, lessonId: lesson.id, estimatedMinutes: lesson.estimatedMinutes, completedAt: new Date().toISOString() })
      tx.oncomplete = () => { db.close(); resolve() }
    })
  }, { dashboard, lesson })
  await context.setOffline(true); await page.reload()
  await expect(page.getByRole('heading', { name: 'Marhaba, Guest.' })).toBeVisible()
  const rows = await pendingRows(page) as Array<{ scope: string; completionId: string; lessonId: string }>
  expect(rows.map(r => r.completionId).sort()).toEqual(['upgrade-guest', 'upgrade-user:other'])
  await page.getByRole('link', { name: 'Courses', exact: true }).first().click()
  await page.getByRole('button', { name: 'Review Answer a friend’s check-in', exact: true }).click()
  await expect(page.getByRole('dialog')).toContainText(lesson.title)
  await page.getByRole('button', { name: 'Close lesson', exact: true }).click()
  await context.setOffline(false); await page.evaluate(() => window.dispatchEvent(new Event('online')))
  await expect.poll(async () => (await pendingRows(page) as Array<{ scope: string }>).map(r => r.scope)).toEqual(['user:other'])
})


test('schema-2 import refuses an older API before it can discard neutral fields', async ({ page }) => {
  const csrf = await (await page.request.get('/api/auth/csrf')).json()
  const credentials = { email: 'preview-owner@example.test', password: 'test-only-long-password' }
  const registered = await page.request.post('/api/auth/register', { data: { ...credentials, displayName: 'Owner' }, headers: { 'X-CSRF-TOKEN': csrf.token } })
  if (!registered.ok()) expect((await page.request.post('/api/auth/login', { data: { ...credentials, rememberMe: false }, headers: { 'X-CSRF-TOKEN': csrf.token } })).ok()).toBeTruthy()
  await page.addInitScript(() => {
    const nativeFetch = window.fetch.bind(window)
    window.fetch = (input, options) => {
      const url = new URL(typeof input === 'string' ? input : input instanceof URL ? input.href : input.url, location.href)
      return url.pathname === '/api/health' ? Promise.resolve(new Response(JSON.stringify({ features: ['typed-recall-v1'] }), { headers: { 'Content-Type': 'application/json' } })) : nativeFetch(input, options)
    }
  })
  await page.goto('/#/account')
  await page.getByRole('button', { name: 'Open curriculum console', exact: true }).click()
  await page.route('**/api/health', route => route.fulfill({ json: { features: ['typed-recall-v1'] } }))
  let writes = 0
  page.on('request', r => { if (r.url().endsWith('/api/admin/curriculum/drafts') && r.method() === 'POST') writes++ })
  const payload = { lesson: fixture('khmer'), sources: [] }
  await page.getByLabel('Import a lesson package as a draft').setInputFiles({ name: 'engineering.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(payload)) })
  await expect(page.getByRole('alert')).toContainText('Deploy the API with multi-language support')
  expect(writes).toBe(0)
})


test('completed review time consumes the shared daily budget once and survives reload', async ({ page }) => {
  await install(page, true)
  await page.goto('/#/practice/review')
  await switchCourse(page, 'khmer')
  await expect(page.getByRole('button', { name: 'Mixed review', exact: true })).toBeEnabled()
  await page.getByRole('button', { name: 'Mixed review', exact: true }).click()
  const dialog = page.getByRole('dialog', { name: 'Mixed review', exact: true })
  await responseChoices(dialog)
  await dialog.locator('.answer-option').first().click()
  await dialog.getByRole('button', { name: 'Check answer', exact: true }).click()
  await dialog.getByRole('button', { name: 'Finish review', exact: true }).click()
  await dialog.getByRole('button', { name: 'Back to practice', exact: true }).click()
  await page.getByRole('link', { name: 'Today', exact: true }).first().click()
  await expect(page.locator('.daily-progress')).toContainText(/5 of\s+15 minutes/)
  await page.reload()
  await expect(page.locator('.daily-progress')).toContainText(/5 of\s+15 minutes/)
})

test('Today retains manual lessons and shared guides when switching outside the daily allocation', async ({ page, context }) => {
  const { disconnect } = await install(page)
  await page.goto('/#/today')
  // Default plan selects only Levantine. Viewing another language must still
  // expose its lesson without editing the primary course or selected courses.
  for (const id of ['khmer', 'french', 'levantine', 'khmer', 'french']) {
    await switchCourse(page, id)
    if (id !== 'levantine') {
      await expect(page.getByRole('button', { name: `Open ${id} engineering 1`, exact: true })).toBeVisible()
      await expect(page.getByText('Extra practice · your daily goal stays the same.', { exact: true })).toBeVisible()
      await expect(page.locator('.primary-lesson-card [data-character="fattoush"]')).toBeVisible()
      await expect(page.locator('.primary-lesson-card [data-character="knafeh"]')).toBeVisible()
    }
  }
  await page.getByRole('button', { name: 'Open french engineering 1', exact: true }).click()
  const dialog = page.getByRole('dialog', { name: 'french engineering 1', exact: true })
  await expect(dialog.locator('.character-cast').filter({ hasText: 'Fattoush' })).toContainText('Knafeh')
  // Guides are separate from the authored dialogue speakers.
  await expect(dialog.getByRole('list', { name: 'Dialogue transcript' })).toContainText('Test 0')
  await expect(dialog.locator('.dialogue-transcript .character-label')).toHaveCount(0)
  await dialog.getByRole('button', { name: 'Learn the phrases', exact: true }).click()
  await expect(dialog.locator('.teaching-page:not([inert]) [data-character="fattoush"]')).toBeVisible()
  await dialog.getByRole('button', { name: 'Close lesson', exact: true }).click()
  await switchCourse(page, 'khmer')
  await switchCourse(page, 'french')
  await page.getByRole('button', { name: /^Resume / }).click()
  await expect(dialog.getByRole('button', { name: 'Try from memory', exact: true })).toBeVisible()
  await dialog.getByRole('button', { name: 'Close lesson', exact: true }).click()
  await page.getByRole('link', { name: 'Account', exact: true }).first().click()
  await expect(page.getByLabel('Primary course', { exact: true })).toHaveValue('levantine')
  await expect(page.getByRole('checkbox', { name: 'French', exact: true })).not.toBeChecked()
  await expect(page.getByRole('checkbox', { name: 'Khmer', exact: true })).not.toBeChecked()
  await page.getByRole('link', { name: 'Today', exact: true }).first().click()
  await page.evaluate(async () => { await navigator.serviceWorker.ready })
  disconnect()
  await context.setOffline(true)
  await page.reload()
  await expectViewedCourse(page, 'french')
  await expect(page.locator('.primary-lesson-card')).toContainText('french engineering 1')
  await page.getByRole('button', { name: /^Resume / }).click()
  await expect(dialog.getByRole('button', { name: 'Try from memory', exact: true })).toBeVisible()
  await expect(dialog.locator('.teaching-page:not([inert]) [data-character="knafeh"] img')).toBeVisible()
})

test('course selection waits for startup data instead of accepting a choice that can be overwritten', async ({ page }) => {
  let release!: () => void
  const ready = new Promise<void>(resolve => { release = resolve })
  await page.route('**/api/dashboard', async route => { await ready; await route.continue() })
  await page.goto('/#/today')
  await expect(courseSwitch(page)).toBeDisabled()
  release()
  await expect(courseSwitch(page)).toBeEnabled()
  await switchCourse(page, 'french')
  await expect(page.getByRole('status').filter({ has: page.getByRole('heading', { name: 'French', exact: true }) })).toBeVisible()
  await switchCourse(page, 'levantine')
  await expect(page.getByRole('button', { name: /Continue in Levantine/ })).toBeVisible()
})
