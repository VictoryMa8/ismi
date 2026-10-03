import { readFileSync } from 'node:fs'
import { expect, test } from '@playwright/test'

test.use({ serviceWorkers: 'block', storageState: { cookies: [], origins: [] } })

for (const width of [320, 390, 768, 1440]) {
  test(`landing, welcome and return navigation fit at ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 })
    const errors: string[] = []
    const apiRequests: string[] = []
    page.on('pageerror', error => errors.push(error.message))
    page.on('console', message => { if (message.type() === 'error' || /hydration/i.test(message.text())) errors.push(message.text()) })
    page.on('request', request => { if (request.url().includes('/api/')) apiRequests.push(request.url()) })
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Speak with the people you love.')
    await expect(page.locator('.hero-description')).toContainText('Learn Arabic for free through everyday conversations.')
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= Math.ceil(visualViewport?.width ?? innerWidth))).toBeTruthy()
    for (const portrait of await page.locator('.character-portrait').all()) {
      const size = await portrait.boundingBox()
      expect(Math.abs(size!.width - size!.height)).toBeLessThan(1)
      const ratio = await portrait.locator('img').evaluate(img => img.getBoundingClientRect().width / img.getBoundingClientRect().height)
      expect(ratio).toBeCloseTo(2, 1)
    }
    await page.screenshot({ path: testInfo.outputPath(`landing-${width}.png`), fullPage: true })
    expect(apiRequests).toEqual([])
    await page.locator('.hero-copy').getByRole('link', { name: 'Try out the app' }).click()
    await expect(page).toHaveURL(/#\/today$/)
    const dialog = page.getByRole('dialog', { name: 'Before we let you loose' })
    await expect(dialog).toBeVisible()
    await expect(dialog.getByRole('heading')).toHaveText('Start with a conversation')
    await expect(dialog.getByRole('heading')).toBeFocused()
    await expect(page.locator('.app-shell').locator('..')).toHaveAttribute('inert', '')
    for (let i = 0; i < 8; i++) {
      await page.keyboard.press('Tab')
      expect(await page.evaluate(() => Boolean(document.activeElement?.closest('dialog')))).toBeTruthy()
    }
    await dialog.getByRole('button', { name: 'Next', exact: true }).click()
    await expect(dialog.getByRole('heading')).toHaveText('Help is always here')
    await dialog.getByRole('button', { name: 'Back', exact: true }).click()
    await expect(dialog.getByRole('heading')).toHaveText('Start with a conversation')
    await dialog.getByRole('button', { name: 'Next', exact: true }).click()
    await dialog.getByRole('button', { name: 'Next', exact: true }).click()
    await expect(dialog.getByRole('heading')).toHaveText('Make yourself at home')
    expect(await dialog.evaluate(el => el.scrollWidth <= el.clientWidth)).toBeTruthy()
    await dialog.screenshot({ path: testInfo.outputPath(`welcome-${width}.png`) })
    await dialog.getByRole('button', { name: 'Let’s go', exact: true }).click()
    await expect(dialog).toHaveCount(0)
    await expect(page.locator('#main-content')).toBeFocused()
    await page.reload()
    await expect(page.getByRole('heading', { name: 'Marhaba, Guest.' })).toBeVisible()
    await expect(dialog).toHaveCount(0)
    await page.getByRole('link', { name: 'Back to landing page', exact: true }).filter({ visible: true }).click()
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Speak with the people you love.')
    expect(await page.evaluate(() => window.scrollY)).toBe(0)
    if (width <= 760) await page.getByRole('button', { name: 'Open navigation' }).click()
    await page.getByRole('navigation', { name: 'Landing navigation' }).getByRole('link', { name: 'How it works' }).click()
    await expect(page).toHaveURL(/#how-it-works$/)
    await page.reload()
    await expect(page.getByRole('heading', { name: 'One conversation. Three small steps.' })).toBeVisible()
    await page.locator('.hero-copy').getByRole('link', { name: 'Try out the app' }).click()
    await expect(page.getByRole('heading', { name: 'Marhaba, Guest.' })).toBeVisible()
    await expect(dialog).toHaveCount(0)
    expect(errors).toEqual([])
  })
}

test('direct app entry offers a skippable intro; Escape dismisses without changing progress', async ({ page }) => {
  const writes: string[] = []
  page.on('request', r => { if (r.url().includes('/api/') && r.method() !== 'GET') writes.push(r.url()) })
  await page.goto('/#/courses')
  const dialog = page.getByRole('dialog', { name: 'Before we let you loose' })
  await expect(dialog).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(dialog).toHaveCount(0)
  await expect(page.getByRole('heading', { name: 'Courses', exact: true })).toBeVisible()
  expect(writes).toEqual([])
  await page.reload()
  await expect(page.getByRole('heading', { name: 'Courses', exact: true })).toBeVisible()
  await expect(dialog).toHaveCount(0)
})

for (const width of [320, 1280]) {
  test(`return links restore landing title and focus from every learner page at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 })
    await page.goto('/#/today')
    await page.getByRole('button', { name: 'Skip intro' }).click()
    for (const route of ['today', 'courses', 'practice', 'account']) {
      await page.goto(`/#/${route}`)
      await page.getByRole('link', { name: 'Back to landing page', exact: true }).filter({ visible: true }).click()
      await expect(page.locator('#landing-main')).toBeFocused()
      await expect(page).toHaveTitle('Ismi — Speak with the people you love')
    }
  })
}

test('skip intro and logo return work without browser storage', async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => { throw new Error('Storage blocked') }
    Storage.prototype.setItem = () => { throw new Error('Storage blocked') }
  })
  await page.goto('/')
  await page.locator('.hero-copy').getByRole('link', { name: 'Try out the app' }).click()
  await page.getByRole('button', { name: 'Skip intro' }).click()
  await page.getByRole('link', { name: 'Ismi landing page', exact: true }).filter({ visible: true }).click()
  await expect(page.locator('.hero-description')).toBeVisible()
  await page.locator('.hero-copy').getByRole('link', { name: 'Try out the app' }).click()
  await expect(page.getByRole('heading', { name: 'Marhaba, Guest.' })).toBeVisible()
  await expect(page.getByRole('dialog', { name: 'Before we let you loose' })).toHaveCount(0)
})

test('landing and welcome remain usable without art/API and with enlarged text', async ({ page }) => {
  await page.route('**/api/**', r => r.abort())
  await page.route('**/landing/*.webp', r => r.abort())
  await page.route('**/characters/**', r => r.abort())
  await page.setViewportSize({ width: 390, height: 844 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await page.addStyleTag({ content: 'html { font-size: 200%; }' })
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= Math.ceil(visualViewport?.width ?? innerWidth))).toBeTruthy()
  await page.locator('.hero-copy').getByRole('link', { name: 'Try out the app' }).click()
  const dialog = page.getByRole('dialog', { name: 'Before we let you loose' })
  await expect(dialog).toBeVisible()
  expect(await dialog.evaluate(el => el.scrollWidth <= el.clientWidth)).toBeTruthy()
  await dialog.getByRole('button', { name: 'Skip intro' }).click()
  await expect(page.getByRole('heading', { name: 'Marhaba, Guest.' })).toBeVisible()
})

test('built root is readable without JavaScript, with learner PWA entry', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Speak with the people you love.')
  await expect(page.getByRole('heading', { name: 'Palestinian Levantine' })).toBeVisible()
  await expect(page.locator('.hero-copy').getByRole('link', { name: 'Try out the app' })).toHaveAttribute('href', '#/today')
  const manifest = JSON.parse(readFileSync(new URL('../dist/manifest.webmanifest', import.meta.url), 'utf8'))
  expect(manifest.start_url).toBe('/#/today')
  const sw = readFileSync(new URL('../dist/sw.js', import.meta.url), 'utf8')
  expect(sw).not.toContain('landing/hero')
  expect(sw).toContain('index.html')
  await context.close()
})

for (const width of [390, 1440]) {
  test(`reload starts at the top after scrolling or a section jump at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 })
    await page.goto('/')
    await page.locator('.landing-footer').getByRole('link', { name: 'Sign in', exact: true }).focus()
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(1000)
    await page.reload()
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Speak with the people you love.')
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0)
    if (width <= 760) await page.getByRole('button', { name: 'Open navigation' }).click()
    await page.getByRole('navigation', { name: 'Landing navigation' }).getByRole('link', { name: 'FAQ', exact: true }).click()
    await expect(page).toHaveURL(/#faq$/)
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(1000)
    await page.reload()
    await expect(page).toHaveURL('http://127.0.0.1:4173/')
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0)
  })
}

test('direct section links still work, and app reload preserves its route at the top', async ({ page }) => {
  await page.goto('/#faq')
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(1000)
  await page.goto('/#/courses')
  await page.getByRole('button', { name: 'Skip intro' }).click()
  await expect(page.getByRole('list', { name: 'Levantine course path' })).toBeVisible()
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0)
  await page.reload()
  await expect(page.getByRole('heading', { name: 'Courses', exact: true })).toBeVisible()
  await expect(page).toHaveURL(/#\/courses$/)
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0)
})
