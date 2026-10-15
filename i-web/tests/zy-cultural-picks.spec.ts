import { expect, test, type APIRequestContext } from '@playwright/test'
import { emptyCulturalEdition, validCulturalCatalog, validPublicEdition, type CulturalDetail, type CulturalEdition } from '../src/culture'

// Explicitly synthetic records, published only into Playwright's disposable database.
function edition(weeksAgo = 0): CulturalEdition {
  const e = emptyCulturalEdition(), date = new Date(e.weekStartUtc)
  date.setUTCDate(date.getUTCDate() - weeksAgo * 7)
  e.id = `test-culture-${weeksAgo < 0 ? 'future' : weeksAgo}`; e.weekStartUtc = date.toISOString()
  e.title = `Synthetic Arabic collection ${weeksAgo}`; e.theme = 'Synthetic media for interface verification only.'
  for (const i of e.items) {
    i.title = `Synthetic ${i.slot}`; i.arabicTitle = 'عنوان تجريبي'; i.creator = 'Test creator'; i.dialect = 'Egyptian'
    i.register = 'Conversational / sung'; i.difficultyReason = 'Natural speed'; i.description = 'Synthetic description, not a real recommendation.'
    i.prompt = 'Notice one greeting.'; i.textAlternative = 'Read a downloaded lesson and identify a greeting.'
    i.sourceEvidence = 'Synthetic private source evidence'; i.reviewNotes = 'Synthetic test only, not owner review of real media.'
    const r = i.resources[0]!
    r.platform = 'YouTube'; r.url = `https://www.youtube.com/watch?v=synthetic-${i.slot}`
    r.access = i.slot === 'film' ? 'rental' : 'ad-supported'; r.accessNotes = i.slot === 'film' ? 'Rental; price and region may vary.' : 'Free with possible platform ads.'
    r.region = 'Synthetic test region'; r.loginRequired = i.slot === 'film'; r.captionLanguages = ['Arabic', 'English']; r.captionOrigin = 'publisher'
    r.supportNotes = 'Synthetic subtitle description.'; r.evidence = 'Synthetic internal resource check'
    if (i.slot === 'film') i.resources.push({ ...r, id: 'film-companion', purpose: 'free-companion', access: 'ad-supported',
      url: 'https://www.youtube.com/watch?v=synthetic-companion', accessNotes: 'Free official companion, not the full film.', loginRequired: false })
  }
  return e
}
async function post(request: APIRequestContext, path: string, data: unknown) {
  const token = await (await request.get('/api/auth/csrf')).json()
  return request.post(path, { headers: { 'X-CSRF-TOKEN': token.token }, data })
}
async function owner(request: APIRequestContext) {
  const credentials = { email: 'preview-owner@example.test', password: 'test-only-long-password' }
  const registration = await post(request, '/api/auth/register', { displayName: 'Owner', ...credentials })
  if (registration.status() === 400) expect((await post(request, '/api/auth/login', credentials)).ok()).toBeTruthy()
  else expect(registration.ok()).toBeTruthy()
}
async function publish(request: APIRequestContext, content: CulturalEdition) {
  const existing = await request.get(`/api/admin/culture/editions/${content.id}`)
  if (existing.ok()) return await existing.json() as CulturalDetail
  let response = await post(request, '/api/admin/culture/drafts', { edition: content })
  expect(response.ok(), await response.text()).toBeTruthy()
  let detail = await response.json() as CulturalDetail
  for (const action of ['approve', 'publish']) {
    response = await post(request, `/api/admin/culture/editions/${content.id}/${action}`, { expectedRevision: detail.revision, version: 1 })
    expect(response.ok(), await response.text()).toBeTruthy(); detail = await response.json()
  }
  return detail
}
test.beforeAll(async ({ request }) => {
  await owner(request)
  for (let weeks = 0; weeks < 10; weeks++) await publish(request, edition(weeks))
})

test('unpublished catalog and failed refresh have clear guest states', async ({ page }) => {
  await page.route('**/api/culture/weekly*', route => route.fulfill({ json: {
    schemaVersion: 1, serverTimeUtc: new Date().toISOString(), catalogRevision: 'empty', currentId: null,
    isCurrentWeek: false, editions: [], withdrawnIds: [], offset: 0, hasMore: false,
  } }))
  await page.goto('/#/practice/culture')
  await expect(page.getByText('No weekly collection has been published yet.')).toBeVisible()
  await page.route('**/api/culture/weekly*', route => route.abort())
  await page.getByRole('button', { name: 'Refresh picks' }).click()
  await expect(page.getByRole('alert')).toBeVisible()
  await page.getByRole('link', { name: 'Back to Practice', exact: true }).click()
  await expect(page.getByRole('link', { name: 'Watch & listen Weekly Arabic picks' })).toBeVisible()
})

test('owner can save preview validate approve publish and inspect a real API-delivered edition', async ({ page }) => {
  await owner(page.request)
  await page.goto('/#/account')
  await page.getByRole('button', { name: /Open curriculum console/ }).click()
  await page.getByRole('navigation', { name: 'Console sections' }).getByRole('button', { name: 'Watch & listen', exact: true }).click()
  await page.getByLabel('Collection JSON', { exact: true }).fill(JSON.stringify(edition(10), null, 2))
  await page.getByRole('button', { name: 'Save media draft', exact: true }).click()
  await expect(page.getByText('Draft saved. It remains hidden from learners.')).toBeVisible()
  await page.getByRole('button', { name: 'Validate media', exact: true }).click()
  await expect(page.getByText('Validation passed. Human review is still required.')).toBeVisible()
  await page.getByRole('button', { name: 'Preview collection', exact: true }).click()
  await expect(page.getByRole('region', { name: 'Media draft preview' }).locator('article')).toHaveCount(3)
  await page.getByRole('button', { name: 'Approve media revision', exact: true }).click()
  await expect(page.getByText('Exact saved revision approved. Publish when ready.')).toBeVisible()
  await page.getByRole('button', { name: 'Publish media revision', exact: true }).click()
  await expect(page.getByText('Published for the edition date.', { exact: false })).toBeVisible()
  await page.getByRole('button', { name: 'Back to learner app', exact: true }).click()
  await page.goto('/#/practice/culture/test-culture-10')
  await expect(page.getByRole('heading', { name: 'Synthetic Arabic collection 10', exact: true })).toBeVisible()
  await expect(page.locator('.culture-card')).toHaveCount(3)
  await expect(page.getByRole('link', { name: /^Full film on/ })).toHaveAttribute('target', '_blank')
  await expect(page.getByRole('link', { name: /^Free companion on/ })).toHaveAttribute('rel', 'noopener noreferrer')
})

for (const width of [320, 390, 1280]) {
  test(`weekly collections keep three accessible cards and safe publisher links at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 }); await page.emulateMedia({ reducedMotion: 'reduce' })
    const external: string[] = []
    page.on('request', request => { if (!new URL(request.url()).hostname.match(/^(127\.0\.0\.1|localhost)$/)) external.push(request.url()) })
    await page.goto('/#/today')
    await page.getByRole('link', { name: 'Watch & listen', exact: true }).click()
    await expect(page.getByRole('heading', { name: 'Watch & listen', exact: true })).toBeVisible()
    await expect(page.locator('.culture-card')).toHaveCount(3)
    await expect(page.locator('.culture-edition-label')).toContainText('This week')
    await page.getByText('Listening prompt and access details', { exact: true }).first().click()
    await expect(page.getByText('Text alternative:', { exact: false }).first()).toBeVisible()
    await page.getByRole('button', { name: 'Older picks', exact: true }).click()
    await expect(page.getByRole('link', { name: /^Synthetic Arabic collection 9/ })).toBeVisible()
    if (width === 390 || width === 1280) await page.screenshot({ path: `test-results/cultural-picks-${width}.png`, fullPage: true })
    await page.addStyleTag({ content: 'html { font-size: 200%; }' })
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBeTruthy()
    expect(external).toEqual([])
    await page.getByRole('link', { name: /^Watch on/ }).focus()
    await expect(page.getByRole('link', { name: /^Watch on/ })).toBeFocused()
  })
}

test('archive detail survives offline reload and withdrawal removes cached links on reconnect', async ({ page, context, request }) => {
  await owner(request); let detail = await publish(request, edition(11))
  await page.goto('/#/practice/culture/test-culture-11')
  await expect(page.getByRole('heading', { name: 'Synthetic Arabic collection 11', exact: true })).toBeVisible()
  await expect(page.locator('.culture-page')).toHaveAttribute('aria-busy', 'false')
  await context.setOffline(true); await page.reload()
  await expect(page.getByText(/Saved picks · playback needs internet/)).toBeVisible()
  await expect(page.locator('.culture-card')).toHaveCount(3)
  await expect(page.getByRole('link', { name: /^Full film on/ })).toHaveCount(0)
  const response = await post(request, `/api/admin/culture/editions/${detail.id}/withdraw`, { expectedRevision: detail.revision, version: 1, reason: 'Synthetic withdrawal for offline test.' })
  expect(response.ok()).toBeTruthy(); detail = await response.json()
  await context.setOffline(false)
  // Chromium's offline reload may retain navigator.onLine; exercise the explicit retry as well.
  await page.getByRole('button', { name: 'Refresh picks', exact: true }).click()
  await expect(page.getByText('This edition is no longer available.', { exact: false })).toBeVisible()
  await expect(page.locator('.culture-card')).toHaveCount(0)
  await expect(page.locator('.culture-page')).toHaveAttribute('aria-busy', 'false')
  await context.setOffline(true); await page.reload()
  await expect(page.locator('.culture-card')).toHaveCount(0)
})

test('malformed catalog cannot replace a complete saved collection', async ({ page }) => {
  await page.goto('/#/practice/culture')
  await expect(page.locator('.culture-card')).toHaveCount(3)
  await expect(page.locator('.culture-page')).toHaveAttribute('aria-busy', 'false')
  await page.route('**/api/culture/weekly*', route => route.fulfill({ json: { schemaVersion: 1, editions: [{ items: [null] }] } }))
  await page.getByRole('button', { name: 'Refresh picks' }).click()
  await expect(page.getByRole('alert')).toContainText('incomplete')
  await expect(page.locator('.culture-card')).toHaveCount(3)
  expect(validCulturalCatalog({})).toBe(false); expect(validPublicEdition({ items: [null] })).toBe(false)
})
