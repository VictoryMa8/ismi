import { expect, test } from '@playwright/test'
import { finishTeaching, responseChoices } from './lesson-helpers'

for (const width of [320, 390, 768, 1280]) {
  test(`focused pages and navigation fit at ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 844 })
    await page.goto('/')
    await expect(page.getByRole('button', { name: /Continue in Levantine/ })).toBeVisible()
    if (width === 390) await page.screenshot({ path: testInfo.outputPath('today.png'), scale: 'css' })
    await expect(page.getByRole('list', { name: 'Levantine course path' })).toHaveCount(0)
    const nav = page.getByRole('navigation', { name: width > 900 ? 'Primary navigation' : 'Mobile navigation' })
    // Desktop uses an aside landmark containing its navigation.
    const links = width > 900 ? page.getByRole('complementary', { name: 'Primary navigation' }) : nav
    for (const name of ['Courses', 'Practice', 'Account', 'Today']) {
      await links.getByRole('link', { name, exact: true }).click()
      await expect(page).toHaveURL(new RegExp(`#/${name.toLowerCase()}$`))
      await expect(links.getByRole('link', { name, exact: true })).toHaveAttribute('aria-current', 'page')
      await expect(page.locator('#main-content')).toBeFocused()
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy()
      if (name === 'Courses') {
        await expect(page.getByRole('list', { name: 'Levantine course path' })).toBeVisible()
        // Accessible button names must not become visible duplicate labels.
        expect(await page.locator('.course-path .sr-only').first().evaluate(element => element.getBoundingClientRect().width)).toBeLessThanOrEqual(1)
        expect(await page.locator('.course-path-copy').first().evaluate(element => element.getBoundingClientRect().width)).toBeGreaterThan(120)
      }
      if (name === 'Account') await expect(page.getByLabel('Email', { exact: true })).toBeVisible()
    }
    await page.goBack()
    await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible()
    await page.reload()
    await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible()
    await page.goForward()
    await expect(page.getByRole('heading', { name: 'Marhaba, Guest.' })).toBeVisible()
  })
}

test('practice is repeatable without completing an unstudied course lesson', async ({ page }) => {
  await page.goto('/#/practice')
  await page.getByRole('button', { name: /Answer a friend’s check-in/ }).click()
  const dialog = page.getByRole('dialog')
  await finishTeaching(page, dialog)
  await responseChoices(dialog)
  await page.locator('.answer-option').first().click()
  await page.getByRole('button', { name: 'Check answer' }).click()
  await page.getByRole('button', { name: 'Complete lesson' }).click()
  await page.getByRole('button', { name: 'Back to practice' }).click()
  await page.getByRole('link', { name: 'Courses', exact: true }).click()
  await expect(page.getByText('0 of 6 lessons complete', { exact: true })).toBeVisible()
})
