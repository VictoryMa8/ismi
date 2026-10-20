import { expect, test } from '@playwright/test'

function luminance(color: string) {
  const channels = color.match(/\d+/g)!.slice(0, 3).map(c => {
    const v = Number(c) / 255
    return v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4
  })
  return channels[0]! * .2126 + channels[1]! * .7152 + channels[2]! * .0722
}
for (const width of [320, 1280]) test(`language cards have distinct stable palettes and readable controls at ${width}px`, async ({ page }, info) => {
  await page.setViewportSize({ width, height: 1100 })
  await page.goto('/')
  const cards = page.locator('.tracks-grid article')
  await expect(cards).toHaveCount(4)
  const colors = await cards.evaluateAll(items => items.map(item => {
    const elements = [item.querySelector('h3')!, item.querySelector('p')!, item.querySelector('.track-planned')!, item.querySelector('a')!]
    return { id: item.getAttribute('data-course'), background: getComputedStyle(item).backgroundColor,
      foreground: elements.map(el => getComputedStyle(el).color) }
  }))
  expect(new Set(colors.map(c => c.background)).size).toBe(4)
  for (const card of colors) for (const text of card.foreground) {
    const a = luminance(card.background), b = luminance(text)
    expect((Math.max(a, b) + .05) / (Math.min(a, b) + .05), `${card.id} contrast`).toBeGreaterThanOrEqual(4.5)
  }
  await page.getByRole('heading', { name: 'Languages', exact: true }).scrollIntoViewIfNeeded()
  await expect(cards.locator('a').first()).toBeVisible()
  await cards.locator('a').first().focus()
  await expect(cards.locator('a').first()).toBeFocused()
  expect(await page.locator('body').evaluate(el => el.scrollWidth <= innerWidth)).toBeTruthy()
  await page.screenshot({ path: info.outputPath(`languages-${width}.png`), fullPage: true })
  // Reordering future cards must not change any palette (no :last-child rules).
  await cards.last().evaluate(el => el.parentElement!.prepend(el))
  const reordered = await cards.evaluateAll(items => Object.fromEntries(items.map(item => [item.getAttribute('data-course'), getComputedStyle(item).backgroundColor])))
  for (const card of colors) expect(reordered[card.id!]).toBe(card.background)
})
