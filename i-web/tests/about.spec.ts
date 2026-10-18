import { expect, test } from '@playwright/test'

for (const width of [320, 1440]) {
  test(`About page navigation, reload and FAQ at ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 })
    const errors: string[] = []
    page.on('pageerror', error => errors.push(error.message))
    await page.goto('/')
    await page.locator('.landing-footer').getByRole('link', { name: 'About & FAQ' }).click()
    await expect(page.getByRole('heading', { name: 'About Ismi', exact: true })).toBeFocused()
    await expect(page).toHaveTitle('About — Ismi')
    await expect(page.locator('.landing-page')).toHaveCount(0)
    await expect(page.locator('.about-header')).toContainText('Beta 0.0.2')
    await expect(page.getByText('Native-speaker review and human recordings', { exact: false })).toBeVisible()
    const faq = page.getByText('Who creates and checks the lessons?', { exact: true })
    await faq.focus()
    await page.keyboard.press('Enter')
    await expect(page.getByText('Native-speaker review is still planned', { exact: false })).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy()
    await page.screenshot({ path: testInfo.outputPath(`about-${width}.png`), fullPage: true })
    await page.reload()
    await expect(page).toHaveURL(/#\/about$/)
    await expect(page.getByRole('heading', { name: 'About Ismi', exact: true })).toBeFocused()
    await page.getByRole('link', { name: 'Account', exact: true }).click()
    await expect(page.locator('.account-page')).toBeVisible()
    await page.locator('.account-legal').getByRole('link', { name: 'About & FAQ' }).click()
    await expect(page.getByRole('heading', { name: 'About Ismi', exact: true })).toBeVisible()
    await page.getByRole('link', { name: 'Landing page', exact: true }).click()
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Speak with the people you love.')
    expect(errors).toEqual([])
  })
}
