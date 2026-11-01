import { expect, test } from '@playwright/test'

test('email-code form handles delivery, retry, verification and changing email', async ({ page }) => {
  await page.route('**/api/auth/options', route => route.fulfill({ json: { googleClientId: null, emailCode: true } }))
  let sendCount = 0
  await page.route('**/api/auth/email-code/request', async route => {
    sendCount++
    await route.fulfill(sendCount === 2
      ? { status: 429, json: { message: 'Wait one minute before requesting another code.' } }
      : { json: { challengeId: 'browser-test-challenge' } })
  })
  await page.route('**/api/auth/email-code/verify', route => route.fulfill({ status: 400, json: { message: 'That sign-in could not be verified. Request a new code or try again.' } }))
  await page.goto('/#/account')
  const options = page.getByRole('region', { name: 'Sign-in options' })
  await options.getByLabel('Email', { exact: true }).fill('nadia@example.test')
  await options.getByRole('button', { name: 'Email me a sign-in code' }).click()
  await expect(options.getByRole('status')).toContainText('Code sent to nadia@example.test')
  await expect(options.getByLabel('8-digit code')).toBeFocused()
  await options.getByRole('button', { name: 'Send a new code' }).click()
  await expect(options.getByRole('alert')).toContainText('Wait one minute')
  await options.getByLabel('8-digit code').fill('12345678')
  await options.getByRole('button', { name: 'Verify and sign in' }).click()
  await expect(options.getByRole('alert')).toContainText('could not be verified')
  await options.getByRole('button', { name: 'Use another email' }).click()
  await expect(options.getByLabel('Email', { exact: true })).toHaveValue('nadia@example.test')
  await expect(page.getByRole('button', { name: 'Sign in', exact: true }).last()).toBeVisible()
  await expect(page.getByRole('button', { name: 'Continue as guest' })).toBeVisible()
})

test('provider setup failure preserves password and guest access', async ({ page }) => {
  await page.route('**/api/auth/options', route => route.fulfill({ status: 503, json: { message: 'Unavailable' } }))
  await page.goto('/#/account')
  await expect(page.getByLabel('Password', { exact: true })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Continue as guest' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Continue with Google', exact: true })).toHaveCount(0)
})

test('Google loads only after explicit selection and loading errors are recoverable', async ({ page }) => {
  await page.route('**/api/auth/options', route => route.fulfill({ json: { googleClientId: 'test.apps.googleusercontent.com', emailCode: false } }))
  let googleLoads = 0
  await page.route('https://accounts.google.com/gsi/client', route => { googleLoads++; return route.abort() })
  await page.goto('/#/account')
  const button = page.getByRole('button', { name: 'Continue with Google', exact: true })
  await expect(button).toBeVisible()
  expect(googleLoads).toBe(0)
  await button.click()
  await expect(page.getByRole('alert')).toContainText('Google could not load')
  await expect(button).toBeEnabled()
  expect(googleLoads).toBe(1)
})
