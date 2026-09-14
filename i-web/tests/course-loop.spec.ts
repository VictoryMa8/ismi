import { expect, test, type Page } from '@playwright/test'

async function waitForOfflinePackage(page: Page) {
  await expect.poll(async () => page.evaluate(async () => {
    const database = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('ismi-offline')
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
    const count = await new Promise<number>((resolve, reject) => {
      const transaction = database.transaction('lessons', 'readonly')
      const request = transaction.objectStore('lessons').count()
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
      transaction.oncomplete = () => database.close()
    })
    return count
  })).toBeGreaterThanOrEqual(3)
}

test('download, offline completion, and exactly-once reconnection advance the course', async ({ page, context }) => {
  await page.goto('/')
  await expect(page.getByRole('list', { name: 'Week one Levantine course path' }).getByRole('listitem')).toHaveCount(6)
  await expect(page.getByText('0 of 6 lessons complete')).toBeVisible()
  await waitForOfflinePackage(page)

  await page.evaluate(async () => {
    await navigator.serviceWorker.ready
    if (!navigator.serviceWorker.controller) location.reload()
  })
  await page.waitForLoadState('domcontentloaded')
  await context.setOffline(true)
  await page.reload()

  await expect(page.getByText('Offline · progress stays on this device')).toBeVisible()
  await page.getByRole('button', { name: /Continue in Levantine/i }).click()
  const lessonDialog = page.getByRole('dialog', { name: 'Answer a friend’s check-in' })
  await expect(lessonDialog.getByRole('heading', { name: 'Answer a friend’s check-in' })).toBeVisible()
  await page.locator('.answer-option').first().click()
  await page.getByRole('button', { name: 'Check answer' }).click()
  await page.getByRole('button', { name: 'Complete lesson' }).click()
  await expect(page.getByText('Saved on this device. Ismi will sync it when you reconnect.')).toBeVisible()
  await page.getByRole('button', { name: 'Back to today' }).click()
  await expect(page.getByText('1 of 6 lessons complete')).toBeVisible()
  await expect(page.getByRole('listitem').filter({ hasText: 'Say what you did today' })).toContainText('Up next')

  await context.setOffline(false)
  await page.evaluate(() => window.dispatchEvent(new Event('online')))
  await expect(page.getByText('Progress synced')).toBeVisible()
  await expect(page.getByRole('heading', { name: '5 of 15 minutes' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Say what you did today' })).toBeVisible()

  await context.setOffline(true)
  await context.setOffline(false)
  await page.evaluate(() => window.dispatchEvent(new Event('online')))
  await expect(page.getByRole('heading', { name: '5 of 15 minutes' })).toBeVisible()
})

test('core course controls expose names and remain keyboard reachable', async ({ page }) => {
  await page.goto('/')
  await page.keyboard.press('Tab')
  await expect(page.getByRole('link', { name: 'Skip to today’s lesson' })).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.locator('#main-content')).toBeFocused()

  const continueButton = page.getByRole('button', { name: /Continue in Levantine/i })
  await continueButton.focus()
  await page.keyboard.press('Enter')
  const dialog = page.getByRole('dialog', { name: 'Answer a friend’s check-in' })
  await expect(dialog).toBeVisible()
  await expect(dialog.getByRole('button', { name: 'Close lesson' })).toBeFocused()
  await expect(page.locator('fieldset').getByRole('button')).toHaveCount(3)
})
