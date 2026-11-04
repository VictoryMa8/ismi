import { expect, test, type BrowserContext, type Page } from '@playwright/test'

const password = 'long test password'
async function post(context: BrowserContext, path: string, data: object) {
  const csrf = await (await context.request.get('/api/auth/csrf')).json()
  return context.request.post(path, { data, headers: { 'X-CSRF-TOKEN': csrf.token } })
}
async function account(page: Page) {
  const email = `delete-${crypto.randomUUID()}@example.test`
  const registration = await post(page.context(), '/api/auth/register', { displayName: 'Deletion test', email, password })
  expect(registration.ok()).toBeTruthy()
  const session = await registration.json()
  await page.goto('/#/account')
  await expect(page.getByRole('button', { name: 'Delete my account', exact: true })).toBeEnabled()
  await expect.poll(async () => page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>((resolve, reject) => { const r = indexedDB.open('ismi-offline'); r.onsuccess = () => resolve(r.result); r.onerror = () => reject(r.error) })
    return new Promise<boolean>(resolve => {
      const tx = db.transaction('snapshots'); const r = tx.objectStore('snapshots').getAllKeys()
      tx.oncomplete = () => { db.close(); resolve(r.result.some(key => String(key).startsWith('account-state:user:'))) }
    })
  })).toBe(true)
  return { email, scope: `user:${session.userId}` }
}
async function seed(page: Page, scope: string) {
  await page.evaluate(async scope => {
    const db = await new Promise<IDBDatabase>((resolve, reject) => { const r = indexedDB.open('ismi-offline'); r.onsuccess = () => resolve(r.result); r.onerror = () => reject(r.error) })
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(['snapshots', 'pending-completions', 'review-history'], 'readwrite')
      for (const identity of [scope, 'guest', 'user:other-account']) {
        for (const prefix of ['started-lesson-v1', 'reading-comfort-v1', 'study-settings', 'placement-v1', 'recall-evidence-v1', 'recall-reports-v1', 'story-progress-v1', 'alphabet-session-v1', 'alphabet-evidence-v1'])
          tx.objectStore('snapshots').put({ key: `${prefix}:${identity}:test`, value: { private: true } })
        tx.objectStore('pending-completions').put({ completionId: `pending-${identity}`, scope: identity, lessonId: 'levantine-day-01', completedAt: new Date().toISOString(), estimatedMinutes: 5 })
        tx.objectStore('review-history').put({ key: `review-${identity}`, scope: identity, lessonId: 'levantine-day-01' })
      }
      tx.objectStore('snapshots').put({ key: 'shared-curriculum-test', value: 'keep' })
      tx.oncomplete = () => { db.close(); resolve() }; tx.onabort = () => reject(tx.error)
    })
    localStorage.setItem(`ismi-learning-habits-v1:${scope}`, 'private-history')
    localStorage.setItem('ismi-learning-habits-v1:guest', 'guest-history')
  }, scope)
}
async function records(page: Page, scope: string) {
  return page.evaluate(async scope => {
    const db = await new Promise<IDBDatabase>((resolve, reject) => { const r = indexedDB.open('ismi-offline'); r.onsuccess = () => resolve(r.result); r.onerror = () => reject(r.error) })
    const all: Record<string, Array<{ key?: string; scope?: string; id?: string }>> = {}
    await new Promise<void>(resolve => {
      const tx = db.transaction(['snapshots', 'pending-completions', 'review-history', 'lessons'])
      for (const name of ['snapshots', 'pending-completions', 'review-history', 'lessons']) {
        const r = tx.objectStore(name).getAll(); r.onsuccess = () => { all[name] = r.result }
      }
      tx.oncomplete = () => { db.close(); resolve() }
    })
    return {
      owned: all.snapshots!.filter(r => r.key?.includes(scope) && !r.key.startsWith('deleted-account:')).length +
        [...all['pending-completions']!, ...all['review-history']!].filter(r => r.scope === scope).length,
      guest: all.snapshots!.filter(r => r.key?.includes(':guest:')).length,
      other: all.snapshots!.filter(r => r.key?.includes(':user:other-account:')).length,
      shared: all.snapshots!.some(r => r.key === 'shared-curriculum-test'),
      lessons: all.lessons!.map(item => item.id),
      habits: localStorage.getItem(`ismi-learning-habits-v1:${scope}`),
      guestHabits: localStorage.getItem('ismi-learning-habits-v1:guest'),
    }
  }, scope)
}
async function confirm(page: Page) {
  await page.getByRole('button', { name: 'Delete my account', exact: true }).click()
  await page.getByLabel('Type DELETE to confirm').fill('DELETE')
  await page.getByRole('button', { name: 'Permanently delete account', exact: true }).click()
}

test('permanent deletion clears owned records and preserves guest, other accounts and shared downloads', async ({ page }, testInfo) => {
  const { scope } = await account(page)
  await seed(page, scope)
  const before = await records(page, scope)
  await expect(page.locator('.account-legal')).toContainText('Beta 0.0.18')
  await page.getByRole('button', { name: 'Delete my account', exact: true }).click()
  await page.getByLabel('Type DELETE to confirm').fill('DELETE')
  await page.locator('.account-deletion').screenshot({ path: testInfo.outputPath('deletion-confirmation-mobile.png') })
  expect(await page.locator('body').evaluate(body => body.scrollWidth <= window.innerWidth)).toBe(true)
  await page.getByRole('button', { name: 'Permanently delete account', exact: true }).click()
  await expect(page.getByRole('status').filter({ hasText: 'permanently deleted' })).toBeVisible()
  await expect(page.locator('#deletion-notice')).toBeFocused()
  await expect(page.getByRole('button', { name: 'Continue as guest' })).toBeVisible()
  const after = await records(page, scope)
  expect(after.owned).toBe(0)
  expect(after.habits).toBeNull()
  expect(after.guest).toBe(before.guest)
  expect(after.other).toBe(before.other)
  expect(after.shared).toBe(true)
  expect(after.lessons).toEqual(expect.arrayContaining(before.lessons))
  expect(after.guestHabits).toBe('guest-history')
  await page.reload()
  await expect(page.getByRole('button', { name: 'Continue as guest' })).toBeVisible()
  expect((await records(page, scope)).owned).toBe(0)
})

test('confirmation is explicit, cancellation restores focus, and failures preserve data', async ({ page }) => {
  const { scope } = await account(page)
  await seed(page, scope)
  await page.getByRole('button', { name: 'Delete my account', exact: true }).click()
  await expect(page.getByLabel('Type DELETE to confirm')).toBeFocused()
  await expect(page.getByRole('button', { name: 'Permanently delete account', exact: true })).toBeDisabled()
  await page.getByRole('button', { name: 'Cancel', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Delete my account', exact: true })).toBeFocused()
  await page.route('**/api/auth/delete-account', route => route.fulfill({ status: 403, json: { message: 'Sign out and sign in again, then delete your account within 10 minutes.' } }))
  await confirm(page)
  await expect(page.getByRole('alert')).toContainText('Sign out and sign in again')
  expect((await records(page, scope)).owned).toBeGreaterThan(0)
  await page.route('**/api/auth/delete-account', route => route.fulfill({ status: 503, json: { message: 'Your account could not be deleted. Try again shortly.' } }))
  await page.getByRole('button', { name: 'Permanently delete account', exact: true }).click()
  await expect(page.getByRole('alert')).toContainText('could not be deleted')
  expect((await records(page, scope)).owned).toBeGreaterThan(0)
})

test('lost deletion response is recovered using the account receipt', async ({ page }) => {
  const { scope } = await account(page)
  await seed(page, scope)
  await page.route('**/api/auth/delete-account', async route => { expect((await route.fetch()).status()).toBe(204); await route.abort() })
  await confirm(page)
  await expect(page.locator('#deletion-notice')).toContainText('permanently deleted')
  expect((await records(page, scope)).owned).toBe(0)
})

test('offline second browser clears data after reconnect even without its old login cookie', async ({ page, browser }) => {
  const { scope, email } = await account(page)
  const context = await browser.newContext({ baseURL: 'http://127.0.0.1:4173', serviceWorkers: 'allow' })
  try {
    expect((await post(context, '/api/auth/login', { email, password, rememberMe: false })).ok()).toBeTruthy()
    const second = await context.newPage()
    await second.addInitScript(() => localStorage.setItem('ismi-welcome-v1', 'done'))
    await second.goto('/#/account')
    await expect(second.getByRole('button', { name: 'Delete my account', exact: true })).toBeEnabled()
    await expect.poll(() => records(second, scope).then(r => r.owned)).toBeGreaterThan(0)
    // Prime the app's CSRF token while signed in; reconnection must refresh it
    // after another device deletes this account and its cookie becomes invalid.
    await second.getByLabel('10 min', { exact: true }).check()
    await second.getByRole('button', { name: 'Save study settings', exact: true }).click()
    await expect(second.getByRole('button', { name: 'Save study settings', exact: true })).toBeEnabled()
    await seed(second, scope)
    await context.setOffline(true)
    await confirm(page)
    await expect(page.locator('#deletion-notice')).toContainText('permanently deleted')
    expect((await records(second, scope)).owned).toBeGreaterThan(0)
    await context.clearCookies()
    await context.setOffline(false)
    await expect(second.locator('#deletion-notice')).toContainText('cleared from this browser')
    expect((await records(second, scope)).owned).toBe(0)
    await expect(second.getByRole('button', { name: 'Continue as guest' })).toBeVisible()
  } finally { await context.close() }
})

test('device cleanup failure retains a retry receipt and finishes on reload', async ({ page }) => {
  const { scope } = await account(page)
  await seed(page, scope)
  await page.evaluate(scope => {
    const original = Storage.prototype.removeItem
    Storage.prototype.removeItem = function (key) {
      if (key === `ismi-learning-habits-v1:${scope}`) throw new Error('Device storage is unavailable; reload to retry cleanup.')
      return original.call(this, key)
    }
  }, scope)
  await confirm(page)
  await expect(page.getByRole('alert')).toContainText('reload to retry cleanup')
  expect((await records(page, scope)).owned).toBeGreaterThan(0)
  await page.reload()
  await expect(page.locator('#deletion-notice')).toContainText('cleared from this browser')
  expect((await records(page, scope)).owned).toBe(0)
})

test('confirmation reflows at 320px and deletion resets another open tab', async ({ page, context }, testInfo) => {
  const { scope } = await account(page)
  const second = await context.newPage()
  await second.goto('/#/account')
  await expect(second.getByRole('button', { name: 'Delete my account', exact: true })).toBeEnabled()
  await page.setViewportSize({ width: 320, height: 740 })
  await page.addStyleTag({ content: 'html { font-size: 200%; scroll-behavior: auto !important; }' })
  await page.getByRole('button', { name: 'Delete my account', exact: true }).click()
  expect(await page.locator('body').evaluate(body => body.scrollWidth <= window.innerWidth)).toBe(true)
  await page.getByLabel('Type DELETE to confirm').blur()
  await page.screenshot({ path: testInfo.outputPath('deletion-confirmation-320.png'), fullPage: true })
  await page.setViewportSize({ width: 1280, height: 900 })
  await page.addStyleTag({ content: 'html { font-size: 100%; }' })
  await page.locator('.account-deletion').scrollIntoViewIfNeeded()
  await page.screenshot({ path: testInfo.outputPath('deletion-confirmation-desktop.png') })
  await page.getByLabel('Type DELETE to confirm').fill('DELETE')
  await page.getByRole('button', { name: 'Permanently delete account', exact: true }).click()
  await expect(page.locator('#deletion-notice')).toContainText('permanently deleted')
  await expect(second.getByRole('button', { name: 'Continue as guest' })).toBeVisible()
  expect((await records(second, scope)).owned).toBe(0)
})
