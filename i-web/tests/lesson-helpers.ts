import { expect, type Locator, type Page } from '@playwright/test'
export async function finishTeaching(page: Page, dialog: Locator) {
  await dialog.getByRole('button', { name: 'Learn the phrases' }).click()
  for (let i = 0; i < 12; i++) {
    await dialog.getByRole('button', { name: 'Try from memory' }).click()
    await dialog.getByRole('button', { name: 'Reveal phrase' }).click()
    // The next card keeps one button; wait for the transition before deciding.
    const next = dialog.getByRole('button', { name: /^(Next phrase|Notice the pattern)$/ })
    await expect(next).toBeVisible()
    const last = await next.textContent()
    await next.click()
    if (last?.includes('Notice the pattern')) break
  }
  await dialog.getByRole('button', { name: 'Start practice' }).click()
}
export async function responseChoices(dialog: Locator, stepId?: string) {
  if (stepId) await expect(dialog.locator(`.practice-page[data-step-id="${stepId}"]`)).toBeVisible()
  await expect(dialog.locator('.lesson-card-enter-active, .lesson-card-leave-active')).toHaveCount(0)
  const recall = dialog.getByRole('button', { name: 'Show response choices', exact: true })
  const builder = dialog.getByRole('button', { name: 'Use response choices instead', exact: true })
  await expect(dialog.locator('.practice-instruction')).toBeVisible()
  if (await recall.isVisible()) await recall.click()
  else if (await builder.isVisible()) await builder.click()
  await expect(dialog.locator('.answer-option').first()).toBeVisible()
}
