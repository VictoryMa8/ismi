import { expect, test } from '@playwright/test'
import { freshHabits } from '../src/learningHabits'

test('weekly activities start off and saved habit choices are kept', async ({ page }) => {
  expect(freshHabits().questsEnabled).toBe(false)
  expect(freshHabits().streakEnabled).toBe(true)
  await page.goto('/#/today')
  await page.evaluate(() => localStorage.setItem('ismi-learning-habits-v1:guest', JSON.stringify({
    version: 1, timezone: 'UTC', questsEnabled: false, streakEnabled: false, week: '2026-10-12',
    tasks: [], studyDays: [], creditedIds: [], lastActivityDay: '',
  })))
  await page.reload()
  await expect(page.getByRole('link', { name: /Streak/ })).toContainText('Off')
  await expect(page.locator('.status-strip')).not.toContainText('This week')
  await page.getByRole('link', { name: 'Progress', exact: true }).click()
  await page.getByRole('checkbox', { name: 'Track my streak', exact: true }).check()
  await page.reload()
  await page.getByText('Optional weekly activities', { exact: true }).click()
  await expect(page.getByRole('checkbox', { name: 'Weekly activities', exact: true })).not.toBeChecked()
  await expect(page.getByRole('checkbox', { name: 'Track my streak', exact: true })).toBeChecked()
})

for (const width of [320, 390, 1280]) {
  test(`feature hubs stay reachable at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/#/today')
    const nav = width > 900
      ? page.getByRole('complementary', { name: 'Primary navigation' })
      : page.getByRole('navigation', { name: 'Mobile navigation' })
    for (const name of ['Today', 'Courses', 'Practice', 'Progress', 'Words']) {
      await expect(nav.getByRole('link', { name, exact: true })).toBeVisible()
    }
    await expect(page.getByRole('link', { name: /Streak/ })).toBeVisible()
    await expect(page.getByRole('button', { name: /^Review due/ })).toBeVisible()
    const badge = page.locator('.status-strip .feature-badge').first()
    const contrast = await badge.evaluate(element => {
      const style = getComputedStyle(element)
      const parse = (hex: string) => {
        const value = hex.trim()
        const channels = value.startsWith('#') ? [1, 3, 5].map(index => parseInt(value.slice(index, index + 2), 16) / 255) : value.match(/[\d.]+/g)!.slice(0, 3).map(Number).map(channel => channel > 1 ? channel / 255 : channel)
        const linear = channels.map(channel => channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4)
        return 0.2126 * linear[0]! + 0.7152 * linear[1]! + 0.0722 * linear[2]!
      }
      const lighter = Math.max(parse(style.color), parse(style.backgroundColor))
      const darker = Math.min(parse(style.color), parse(style.backgroundColor))
      return (lighter + 0.05) / (darker + 0.05)
    })
    expect(contrast).toBeGreaterThanOrEqual(4.5)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy()
    await nav.getByRole('link', { name: 'Words', exact: true }).click()
    await expect(page.getByLabel('Search words')).toBeVisible()
    await expect(page.getByLabel('Search words')).not.toBeFocused()
    await nav.getByRole('link', { name: 'Practice', exact: true }).click()
    for (const tile of await page.locator('.feature-grid .feature-copy').all()) {
      expect(await tile.evaluate(el => [...el.children].every(child => child.scrollWidth <= child.clientWidth + 1))).toBeTruthy()
    }
    await page.screenshot({ path: `/tmp/ismi-practice-${width}.png`, fullPage: true })
    const review = page.getByRole('link', { name: /^Review,/ })
    await expect(review).toContainText('due')
    await review.click()
    await expect(page).toHaveURL(/#\/practice\/review$/)
    await expect(nav.getByRole('link', { name: 'Practice', exact: true })).toHaveAttribute('aria-current', 'page')
    await page.getByRole('link', { name: 'Back to Practice', exact: true }).click()
    await page.getByRole('link', { name: /^Checkpoints,/ }).click()
    await expect(page.getByRole('region', { name: 'Checkpoints' })).toBeVisible()
    await page.getByRole('link', { name: 'Back to Practice', exact: true }).click()
    await page.getByRole('link', { name: /^Write a response,/ }).click()
    await expect(page.getByRole('region', { name: 'Write a response' })).toBeVisible()
    await page.getByRole('link', { name: 'Back to Practice', exact: true }).focus()
    await nav.getByRole('link', { name: 'Progress', exact: true }).click()
    await expect(page.getByRole('region', { name: 'Streak' })).toBeVisible()
    await expect(page.getByRole('region', { name: 'Weekly activities' })).not.toBeVisible()
    await expect(page.getByRole('region', { name: 'What you can do' })).toBeVisible()
    expect(await page.locator('.feature-panel').first().evaluate(element => element.getAnimations().length)).toBe(0)
    await page.addStyleTag({ content: 'html { font-size: 200%; }' })
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBeTruthy()
  })
}

test('Today uses its main card to resume a different started lesson', async ({ page, context }, testInfo) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/#/practice/lessons')
  const selected = page.locator('.practice-item').nth(1)
  const title = (await selected.locator('strong').textContent())!
  await selected.click()
  const dialog = page.getByRole('dialog')
  await dialog.getByRole('button', { name: 'Learn the phrases' }).click()
  await dialog.getByRole('button', { name: 'Close lesson', exact: true }).click()
  await page.getByRole('link', { name: 'Today', exact: true }).click()
  const card = page.locator('.primary-lesson-card')
  await expect(card).toContainText(title)
  await expect(card.getByRole('button', { name: `Resume ${title}`, exact: true })).toHaveText('Resume lesson')
  await expect(page.locator('.resume-course')).toHaveCount(0)
  await expect(page.locator('.status-strip')).not.toContainText(/grace|This week/i)
  await page.screenshot({ path: testInfo.outputPath('today-resume.png'), fullPage: true })
  await page.evaluate(async () => { await navigator.serviceWorker.ready })
  await context.setOffline(true)
  await page.reload()
  await expect(card).toContainText(title)
  await card.getByRole('button', { name: `Resume ${title}`, exact: true }).click()
  await expect(dialog.getByRole('button', { name: 'Try from memory', exact: true })).toBeVisible()
})
