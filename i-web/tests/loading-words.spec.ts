import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { expect, test } from '@playwright/test'
import words from '../src/content/loading-words.json' with { type: 'json' }
import catalog from '../src/content/glossary-catalog.json' with { type: 'json' }

test('loading words match pinned approved glossary text and source packages', () => {
  for (const word of words) {
    const lesson = catalog.find(record => record.lessonId === word.lessonId)!
    const entry = lesson.cards.flatMap(card => card.entries).find(entry => entry.id === word.id)!
    expect([word.arabizi, word.arabic, word.meaning, word.sourceLocators]).toEqual([entry.arabizi, entry.arabic, entry.meaning, entry.sourceLocators])
    expect(createHash('sha256').update(readFileSync(new URL(`../../${word.packagePath}`, import.meta.url))).digest('hex')).toBe(word.packageSha256)
  }
})

test.describe('loading word reel', () => {
  test.use({ serviceWorkers: 'block' })

  test('cycles through all forms into the next word, pauses, and never delays the ready dashboard', async ({ page }, testInfo) => {
    let release!: () => void
    const gate = new Promise<void>(resolve => { release = resolve })
    await page.route('**/api/dashboard', async route => { await gate; await route.continue() })
    const time = new Date('2026-10-12T12:00:00Z')
    await page.clock.install({ time })
    await page.clock.pauseAt(new Date(time.getTime() + 1000))
    await page.goto('/#/today')
    const face = page.locator('.word-reel-face:not(.word-roll-leave-active)')
    await expect(face).toHaveText('shukran')
    const bounds = await page.locator('.dashboard-loading').boundingBox()
    await page.screenshot({ path: testInfo.outputPath('word-reel-transliteration.png') })
    await page.clock.runFor(1600)
    await expect(face).toHaveText('شكراً')
    await page.clock.runFor(500)
    await expect(face).toHaveAttribute('lang', 'ar')
    await expect(face).toHaveAttribute('dir', 'rtl')
    const arabicBounds = await page.locator('.dashboard-loading').boundingBox()
    expect(arabicBounds!.height).toBeCloseTo(bounds!.height, 0)
    await expect(page.locator('.word-roll-enter-active, .word-roll-leave-active')).toHaveCount(0)
    await page.screenshot({ path: testInfo.outputPath('word-reel-arabic.png') })
    await page.clock.runFor(1100)
    await expect(face).toHaveText('thank you')
    await page.clock.runFor(1600)
    await expect(face).toHaveText('shāy')
    await page.getByRole('button', { name: 'Pause word animation' }).focus()
    await page.keyboard.press('Enter')
    await page.clock.runFor(10000)
    await expect(face).toHaveText('shāy')
    await expect(page.getByRole('status')).toHaveText('Loading your study plan…')
    await page.getByRole('button', { name: 'Resume word animation' }).click()
    await page.clock.runFor(1600)
    await expect(face).toHaveText('شاي')
    await page.evaluate(() => {
      Object.defineProperty(document, 'hidden', { configurable: true, value: true });
      document.dispatchEvent(new Event('visibilitychange'));
    })
    await page.clock.runFor(10000)
    await expect(face).toHaveText('شاي')
    await page.evaluate(() => {
      Object.defineProperty(document, 'hidden', { configurable: true, value: false });
      document.dispatchEvent(new Event('visibilitychange'));
    })
    await page.clock.runFor(1600)
    await expect(face).toHaveText('tea')
    release()
    await expect(page.getByRole('button', { name: /Continue in Levantine/ })).toBeVisible()
    await expect(page.locator('.dashboard-loading')).toHaveCount(0)
  })

  test('rolling text settles fully readable in real time', async ({ page }, testInfo) => {
    await page.route('**/api/dashboard', () => new Promise(() => {}))
    await page.goto('/#/today')
    const face = page.locator('.word-reel-face:not(.word-roll-leave-active)')
    await expect(face).toHaveText('شكراً')
    await expect.poll(() => face.evaluate(el => getComputedStyle(el).opacity)).toBe('1')
    await expect.poll(() => face.evaluate(el => getComputedStyle(el).transform)).toBe('none')
    await page.screenshot({ path: testInfo.outputPath('word-reel-readable.png') })
  })

  test('reduced motion shows a still triplet and responds to preference changes; layout fits doubled text', async ({ page }, testInfo) => {
    await page.route('**/api/dashboard', () => new Promise(() => {}))
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/#/today')
    const still = page.locator('.loading-word-still')
    await expect(still).toContainText('shukran')
    await expect(still).toContainText('شكراً')
    await expect(still).toContainText('thank you')
    await expect(page.getByRole('button', { name: /word animation/ })).toHaveCount(0)
    await expect(page.locator('.word-reel-face')).toHaveCount(0)
    await page.screenshot({ path: testInfo.outputPath('word-reel-reduced-motion.png') })
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await expect(page.getByRole('button', { name: 'Pause word animation' })).toBeVisible()
    await page.getByRole('button', { name: 'Pause word animation' }).click()
    for (const width of [320, 390, 1280]) {
      await page.setViewportSize({ width, height: 900 })
      expect(await page.locator('.dashboard-loading').evaluate(el => el.scrollWidth <= el.clientWidth)).toBeTruthy()
    }
    await page.setViewportSize({ width: 390, height: 844 })
    await page.evaluate(() => { document.documentElement.style.fontSize = '200%' })
    expect(await page.locator('.dashboard-loading').evaluate(el => el.scrollWidth <= el.clientWidth)).toBeTruthy()
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await expect(still).toBeVisible()
    await page.screenshot({ path: testInfo.outputPath('word-reel-enlarged.png') })
  })
})
