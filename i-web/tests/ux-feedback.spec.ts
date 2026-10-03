import { expect, test } from '@playwright/test'
import { finishTeaching, responseChoices } from './lesson-helpers'

type SoundProbe = Window & {
  toneCount: number
  audioProbe?: AnalyserNode
}

test('friendly sounds start after interaction, stay quiet, mute persistently, and work offline', async ({ page, context }, testInfo) => {
  await page.addInitScript(() => {
    const probe = window as SoundProbe
    probe.toneCount = 0
    const start = OscillatorNode.prototype.start
    OscillatorNode.prototype.start = function (when?: number) {
      probe.toneCount++
      return start.call(this, when)
    }
    const connect = AudioNode.prototype.connect
    AudioNode.prototype.connect = function (...args: Parameters<AudioNode['connect']>) {
      if (args[0] instanceof AudioDestinationNode) {
        const analyser = this.context.createAnalyser()
        analyser.fftSize = 256
        probe.audioProbe = analyser
        // Measure the actual final audio signal alongside the normal destination.
        Reflect.apply(connect, this, [analyser])
      }
      return Reflect.apply(connect, this, args)
    } as AudioNode['connect']
  })
  await page.goto('/#/today')
  await expect(page.getByRole('button', { name: /Continue in Levantine/ })).toBeVisible()
  expect(await page.evaluate(() => (window as SoundProbe).toneCount)).toBe(0)
  const sound = page.locator('.mobile-header').getByRole('button', { name: 'Interface sounds', exact: true })
  await expect(sound).toHaveAttribute('aria-pressed', 'true')
  await sound.click()
  await expect(sound).toHaveAttribute('aria-pressed', 'false')
  await page.getByRole('link', { name: 'Practice', exact: true }).click()
  expect(await page.evaluate(() => (window as SoundProbe).toneCount)).toBe(0)
  await page.reload()
  await expect(sound).toHaveAttribute('aria-pressed', 'false')
  await sound.click()
  await expect.poll(() => page.evaluate(() => (window as SoundProbe).toneCount)).toBeGreaterThan(0)
  await page.getByRole('button', { name: /Answer a friend’s check-in/ }).click()
  const dialog = page.getByRole('dialog')
  await finishTeaching(page, dialog)
  await responseChoices(dialog)
  await dialog.locator('.answer-option').first().click()
  const before = await page.evaluate(() => (window as SoundProbe).toneCount)
  await dialog.getByRole('button', { name: 'Check answer', exact: true }).click()
  await expect(dialog.locator('.feedback-panel.positive')).toBeVisible()
  await expect.poll(() => page.evaluate(() => (window as SoundProbe).toneCount)).toBeGreaterThan(before)
  // Confirm audible synthesis without clipping or an unexpectedly loud burst.
  await expect.poll(() => page.evaluate(() => {
    const analyser = (window as SoundProbe).audioProbe
    if (!analyser) return 0
    const samples = new Float32Array(analyser.fftSize)
    analyser.getFloatTimeDomainData(samples)
    return Math.max(...samples.map(Math.abs))
  }), { intervals: [10, 20, 30], timeout: 1500 }).toBeGreaterThan(.001)
  const peak = await page.evaluate(() => {
    const analyser = (window as SoundProbe).audioProbe!
    const samples = new Float32Array(analyser.fftSize)
    analyser.getFloatTimeDomainData(samples)
    return Math.max(...samples.map(Math.abs))
  })
  expect(peak).toBeLessThan(.3)
  await page.screenshot({ path: testInfo.outputPath('friendly-feedback.png') })
  await dialog.getByRole('button', { name: 'Complete lesson', exact: true }).click()
  await expect(dialog.getByText('Conversation complete', { exact: true })).toBeVisible()
  await dialog.getByRole('button', { name: 'Back to practice', exact: true }).click()
  await page.evaluate(async () => { await navigator.serviceWorker.ready })
  await context.setOffline(true)
  await page.reload()
  await expect(sound).toHaveAttribute('aria-pressed', 'true')
  expect(await page.evaluate(() => (window as SoundProbe).toneCount)).toBe(0)
  await page.getByRole('link', { name: 'Courses', exact: true }).click()
  await expect.poll(() => page.evaluate(() => (window as SoundProbe).toneCount)).toBeGreaterThan(0)
  await sound.click()
  const muted = await page.evaluate(() => (window as SoundProbe).toneCount)
  await page.getByRole('link', { name: 'Today', exact: true }).click()
  expect(await page.evaluate(() => (window as SoundProbe).toneCount)).toBe(muted)
})

test('missing audio support and reduced motion never block lessons', async ({ page }) => {
  await page.addInitScript(() => { Object.defineProperty(window, 'AudioContext', { value: undefined }) })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/#/practice')
  await page.getByRole('button', { name: /Answer a friend’s check-in/ }).click()
  const dialog = page.getByRole('dialog')
  await finishTeaching(page, dialog)
  await responseChoices(dialog)
  await dialog.locator('.answer-option').first().click()
  await dialog.getByRole('button', { name: 'Check answer', exact: true }).click()
  await expect(dialog.locator('.feedback-panel.positive')).toBeVisible()
  expect(await dialog.locator('.practice-page').evaluate(element => element.getAnimations({ subtree: true }).filter(animation => animation.playState === 'running').length)).toBe(0)
  await dialog.getByRole('button', { name: 'Complete lesson', exact: true }).click()
  await expect(dialog.getByText('Conversation complete', { exact: true })).toBeVisible()
})
