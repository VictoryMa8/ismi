import { expect, test } from '@playwright/test'

test.describe('dashboard loading feedback', () => {
  test.use({ serviceWorkers: 'block' })

  test('startup stays visible through delayed session and dashboard requests without false empty/offline states', async ({ page }, testInfo) => {
    let releaseSession!: () => void
    let releaseDashboard!: () => void
    const sessionGate = new Promise<void>(resolve => { releaseSession = resolve })
    const dashboardGate = new Promise<void>(resolve => { releaseDashboard = resolve })
    await page.route('**/api/auth/me', async route => { await sessionGate; await route.continue() })
    await page.route('**/api/dashboard', async route => { await dashboardGate; await route.continue() })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/#/today')
    await expect(page.getByRole('status')).toContainText('Loading your study plan…')
    await expect(page.getByText(/No new lessons are available/)).toHaveCount(0)
    await expect(page.getByText('Offline · progress stays on this device')).toHaveCount(0)
    await expect(page.getByRole('heading', { name: /Marhaba/ })).toHaveCount(0)
    expect(await page.locator('.loading-spinner').evaluate(el => getComputedStyle(el).animationName)).toBe('none')
    await page.screenshot({ path: testInfo.outputPath('loading-mobile.png') })
    await page.setViewportSize({ width: 1280, height: 900 })
    await expect(page.getByRole('status')).toContainText('Loading your study plan…')
    await page.screenshot({ path: testInfo.outputPath('loading-desktop.png') })
    await page.setViewportSize({ width: 390, height: 844 })
    await page.getByRole('link', { name: 'Courses', exact: true }).click()
    await expect(page.getByRole('status')).toContainText('Loading your study plan…')
    await expect(page.getByRole('list', { name: 'Levantine course path' })).toHaveCount(0)
    releaseSession()
    await page.getByRole('link', { name: 'Today', exact: true }).click()
    await expect(page.getByRole('status')).toContainText('Loading your study plan…')
    releaseDashboard()
    await expect(page.getByRole('button', { name: /Continue in Levantine/ })).toBeVisible()
    await expect(page.locator('.dashboard-loading')).toHaveCount(0)
  })

  test('uncached failure shows retry and recovers; refresh keeps the existing plan usable', async ({ page }) => {
    let failed = true
    let releaseRefresh!: () => void
    const refreshGate = new Promise<void>(resolve => { releaseRefresh = resolve })
    let holdRefresh = false
    await page.route('**/api/dashboard', async route => {
      if (failed) await route.abort()
      else { if (holdRefresh) await refreshGate; await route.continue() }
    })
    await page.goto('/#/today')
    await expect(page.getByRole('heading', { name: 'Your study plan couldn’t load' })).toBeVisible()
    await expect(page.locator('.dashboard-loading')).toHaveCount(0)
    await expect(page.getByText(/No new lessons are available/)).toHaveCount(0)
    failed = false
    await page.getByRole('button', { name: 'Try again', exact: true }).click()
    await expect(page.getByRole('button', { name: /Continue in Levantine/ })).toBeVisible()
    await expect(page.locator('.dashboard-error')).toHaveCount(0)
    holdRefresh = true
    await page.evaluate(() => window.dispatchEvent(new Event('online')))
    await expect(page.getByRole('status')).toContainText('Updating your study plan…')
    await expect(page.getByRole('button', { name: /Continue in Levantine/ })).toBeEnabled()
    releaseRefresh()
    await expect(page.locator('.dashboard-loading')).toHaveCount(0)
  })
})

test('cached offline reload settles into the downloaded plan', async ({ page, context }) => {
  await page.goto('/#/today')
  await expect(page.getByRole('button', { name: /Continue in Levantine/ })).toBeVisible()
  await page.evaluate(async () => { await navigator.serviceWorker.ready })
  await context.setOffline(true)
  await page.reload()
  await expect(page.getByRole('button', { name: /Continue in Levantine/ })).toBeVisible()
  await expect(page.locator('.dashboard-loading, .dashboard-error')).toHaveCount(0)
  await expect(page.getByText('Offline · progress stays on this device')).toBeVisible()
})
