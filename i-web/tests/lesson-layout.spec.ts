import { readFileSync } from 'node:fs'
import { expect, test, type Locator } from '@playwright/test'
import type { LessonResponse } from '../src/types'
import { finishTeaching, responseChoices } from './lesson-helpers'

const pack = JSON.parse(readFileSync(new URL('../../content/levantine/everyday-01/revisions/guided-teaching/01-lesson.json', import.meta.url), 'utf8')) as { lesson: LessonResponse }

for (const viewport of [{ width: 1440, height: 1000 }, { width: 1024, height: 720 }, { width: 390, height: 740 }]) {
  test(`lesson frame and navigation stay visible through long and short cards at ${viewport.width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize(viewport)
    await page.route('**/api/lessons/levantine-day-01', route => route.fulfill({ json: { ...pack.lesson, id: 'levantine-day-01' } }))
    await page.goto('/#/today')
    await page.getByRole('button', { name: /Continue in Levantine/ }).click()
    const dialog = page.getByRole('dialog')
    await dialog.evaluate(async element => {
      await Promise.all(element.getAnimations().map(animation => animation.finished.catch(() => {})))
    })
    const content = dialog.getByRole('region', { name: 'Lesson content', exact: true })
    const geometry = async (target: Locator) => target.evaluate(element => {
      const box = element.getBoundingClientRect()
      return { x: box.x, y: box.y, width: box.width, height: box.height }
    })
    const frame = await geometry(dialog)
    const header = await geometry(dialog.locator('.lesson-sheet-header'))
    const stages = dialog.locator('.journey-rail:visible')
    const navigation = dialog.locator('[aria-label="Lesson navigation"]:visible')
    const stagesY = (await geometry(stages)).y
    const navigationY = (await geometry(navigation)).y
    const bodyWidth = await content.evaluate(element => element.clientWidth)
    async function stable() {
      await expect(dialog.locator('.lesson-card-enter-active, .lesson-card-leave-active')).toHaveCount(0)
      const next = await geometry(dialog)
      for (const key of ['x', 'y', 'width', 'height'] as const) expect(Math.abs(next[key] - frame[key])).toBeLessThan(1)
      expect((await geometry(dialog.locator('.lesson-sheet-header'))).y).toBe(header.y)
      expect(await content.evaluate(element => element.clientWidth)).toBe(bodyWidth)
      expect(await dialog.evaluate(element => element.scrollHeight <= element.clientHeight + 1)).toBeTruthy()
      expect((await geometry(stages)).y).toBe(stagesY)
      expect(Math.abs((await geometry(navigation)).y - navigationY)).toBeLessThanOrEqual(1)
      await expect(stages).toBeInViewport({ ratio: 1 })
      await expect(navigation).toBeInViewport({ ratio: 1 })
    }
    // The long conversation scrolls inside the frame; its header stays visible.
    expect(await content.evaluate(element => element.scrollHeight > element.clientHeight)).toBeTruthy()
    const scrollCue = dialog.getByRole('button', { name: 'Scroll for more', exact: true })
    await expect(scrollCue).toBeVisible()
    await page.screenshot({ path: testInfo.outputPath('scroll-cue-navigation.png'), scale: 'css' })
    await scrollCue.click()
    await expect.poll(() => content.evaluate(element => element.scrollTop)).toBeGreaterThan(0)
    await stable()
    await content.focus()
    await page.keyboard.press('End')
    await expect(scrollCue).toHaveCount(0)
    await stable()
    await page.screenshot({ path: testInfo.outputPath('scroll-bottom-navigation.png'), scale: 'css' })
    await dialog.getByRole('button', { name: 'Learn the phrases' }).click()
    await stable()
    expect(await content.evaluate(element => element.scrollTop)).toBe(0)
    await dialog.getByRole('button', { name: 'Try from memory' }).click()
    await stable()
    await expect(scrollCue).toHaveCount(0)
    const recallButton = await geometry(dialog.getByRole('button', { name: 'Reveal phrase' }))
    await page.screenshot({ path: testInfo.outputPath('desktop-recall.png'), scale: 'css' })
    await dialog.getByRole('button', { name: 'Reveal phrase' }).click()
    await stable()
    if (viewport.height === 1000) {
      const nextButton = await geometry(dialog.getByRole('button', { name: 'Next phrase' }))
      expect(Math.abs(nextButton.y - recallButton.y)).toBeLessThanOrEqual(1)
    }
    await page.screenshot({ path: testInfo.outputPath('desktop-revealed.png'), scale: 'css' })
    await dialog.getByRole('button', { name: 'Look back' }).click()
    await dialog.getByRole('button', { name: 'Look back' }).click()
    await finishTeaching(page, dialog)
    await stable()
    await expect(stages.locator('[aria-current="step"]')).toHaveText('Use it')
    await responseChoices(dialog)
    await stable()
    await content.focus()
    await page.keyboard.press('End')
    await expect(scrollCue).toHaveCount(0)
    await stable()
    await dialog.getByRole('button', { name: 'Review teaching', exact: true }).click()
    await stable()
    await dialog.getByRole('button', { name: 'Go to practice', exact: true }).click()
    await stable()
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await dialog.getByRole('button', { name: 'Review teaching', exact: true }).click()
    await dialog.getByRole('button', { name: 'Learn the phrases' }).click()
    await stable()
    expect(await dialog.evaluate(element => element.getAnimations({ subtree: true }).filter(animation => animation.playState === 'running').length)).toBe(0)
  })
}
