import { expect, test } from '@playwright/test'

function silentWave() {
  const bytes = Buffer.alloc(32044)
  bytes.write('RIFF'); bytes.writeUInt32LE(bytes.length - 8, 4); bytes.write('WAVEfmt ', 8)
  bytes.writeUInt32LE(16, 16); bytes.writeUInt16LE(1, 20); bytes.writeUInt16LE(1, 22)
  bytes.writeUInt32LE(8000, 24); bytes.writeUInt32LE(16000, 28)
  bytes.writeUInt16LE(2, 32); bytes.writeUInt16LE(16, 34)
  bytes.write('data', 36); bytes.writeUInt32LE(32000, 40)
  return bytes
}

test('console recording publication downloads audio and plays after offline reload', async ({ page, context }, testInfo) => {
  const csrf = await (await page.request.get('/api/auth/csrf')).json()
  const registration = await page.request.post('/api/auth/register', {
    headers: { 'X-CSRF-TOKEN': csrf.token },
    data: { displayName: 'Owner', email: 'owner@example.test', password: 'long test password' },
  })
  expect(registration.ok()).toBeTruthy()
  const originalVersions = await (await page.request.get('/api/admin/curriculum/versions')).json()
  const original = originalVersions.find((version: { lessonId: string }) => version.lessonId === 'levantine-day-01')

  try {
    await page.setViewportSize({ width: 1440, height: 1000 })
    await page.goto('/')
    await page.getByRole('button', { name: 'Account synced' }).click()
    await page.getByRole('button', { name: 'Open curriculum console' }).click()
    await page.getByRole('button', { name: /Answer a friend’s check-in/ }).click()
    await page.getByRole('button', { name: 'New draft from selected' }).click()
    await expect(page.getByRole('button', { name: 'Save draft' })).toBeVisible()
    await page.getByLabel(/Upload recording for/).setInputFiles({ name: 'transport-fixture.wav', mimeType: 'audio/wav', buffer: silentWave() })
    await expect(page.getByText('Recording attached locally.', { exact: false })).toBeVisible()
    await page.getByLabel('Speaker', { exact: true }).fill('Transport test fixture')
    await page.getByLabel('Review notes').fill('Silent test fixture only; not curriculum or reviewed speech.')
    await page.getByLabel('Rights / permission').last().fill('Generated test signal. Playback and offline distribution permitted.')
    await expect(page.getByRole('button', { name: 'Approve', exact: true })).toBeDisabled()
    await page.getByRole('heading', { name: 'Prompt recordings' }).scrollIntoViewIfNeeded()
    await page.screenshot({ path: testInfo.outputPath('recording-console.png') })
    await page.getByRole('button', { name: 'Save draft' }).click()
    await page.getByRole('button', { name: 'Validate', exact: true }).click()
    await expect(page.getByText('Ready for approval')).toBeVisible()
    await page.getByRole('button', { name: 'Approve', exact: true }).click()
    await page.getByRole('button', { name: 'Publish', exact: true }).click()
    await expect(page.getByText('Published. Learners now receive this version from the API.')).toBeVisible()
    await page.getByRole('button', { name: 'Back to learner app' }).click()
    await page.setViewportSize({ width: 393, height: 851 })
    await page.reload()
    await expect.poll(() => page.evaluate(async () => {
      const db = await new Promise<IDBDatabase>((resolve, reject) => {
        const request = indexedDB.open('ismi-offline')
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
      })
      return new Promise<boolean>(resolve => {
        const transaction = db.transaction(['lessons', 'recordings'], 'readonly')
        const request = transaction.objectStore('lessons').get('levantine-day-01')
        request.onsuccess = () => {
          const url = request.result?.steps[0].prompt.audioUrl
          if (!url) { resolve(false); return }
          const audio = transaction.objectStore('recordings').get(url)
          audio.onsuccess = () => resolve(audio.result?.blob.size === 32044)
        }
        transaction.oncomplete = () => db.close()
      })
    })).toBe(true)

    await page.evaluate(async () => { await navigator.serviceWorker.ready })
    await context.setOffline(true)
    await page.reload()
    await page.getByRole('button', { name: /Continue in Levantine/i }).click()
    await expect(page.getByText('Recorded · Transport test fixture · Urban Palestinian')).toBeVisible()
    await page.getByText('Recording transcript and source').click()
    await expect(page.locator('details p[lang="ar"]')).toBeVisible()
    expect(await page.locator('.scenario-panel > div').evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true)
    await page.screenshot({ path: testInfo.outputPath('recording-offline.png') })
    // Observe the actual media element; no playback stub. The source must be a local blob.
    await page.evaluate(() => {
      const NativeAudio = window.Audio
      ;(window as unknown as { testAudio: HTMLAudioElement | null }).testAudio = null
      window.Audio = function(src?: string) {
        const audio = new NativeAudio(src)
        ;(window as unknown as { testAudio: HTMLAudioElement }).testAudio = audio
        return audio
      } as typeof Audio
    })
    await page.getByRole('button', { name: 'Play the recorded Arabic prompt' }).click()
    await expect.poll(() => page.evaluate(() => {
      const audio = (window as unknown as { testAudio: HTMLAudioElement }).testAudio
      return audio?.src.startsWith('blob:') && audio.currentTime > 0
    })).toBe(true)
    await page.getByRole('button', { name: 'Close lesson' }).click()
    expect(await page.evaluate(() => (window as unknown as { testAudio: HTMLAudioElement }).testAudio.paused)).toBe(true)
  } finally {
    await context.setOffline(false)
    const token = await (await page.request.get('/api/auth/csrf')).json()
    await page.request.post('/api/admin/curriculum/lessons/levantine-day-01/rollback', {
      headers: { 'X-CSRF-TOKEN': token.token }, data: { targetVersionId: original.id },
    })
  }
})

for (const failure of ['missing', 'corrupt'] as const) {
  test(`a ${failure} recording preserves the previous offline lesson package`, async ({ page }) => {
    await page.goto('/')
    await expect.poll(() => page.evaluate(async () => {
      const database = await new Promise<IDBDatabase>((resolve, reject) => {
        const request = indexedDB.open('ismi-offline')
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
      })
      return new Promise<number>(resolve => {
        const transaction = database.transaction('lessons', 'readonly')
        const request = transaction.objectStore('lessons').count()
        request.onsuccess = () => resolve(request.result)
        transaction.oncomplete = () => database.close()
      })
    })).toBeGreaterThanOrEqual(3)
    const original = await (await page.request.get('/api/lessons/levantine-day-01')).json()
    const url = `/api/recordings/${'0'.repeat(64)}.wav`
    await page.route('**/api/lessons/levantine-day-01', route => route.fulfill({
      json: {
        ...original, version: 'failed-download-version',
        steps: original.steps.map((step: { prompt: object }) => ({ ...step, prompt: { ...step.prompt, audioUrl: url } })),
      },
    }))
    await page.route(`**${url}`, route => route.fulfill({
      status: failure === 'missing' ? 404 : 200,
      contentType: 'audio/wav', body: silentWave(),
    }))
    await page.reload()
    await expect(page.getByText('Some lesson downloads could not finish.', { exact: false })).toBeVisible()
    const saved = await page.evaluate(async () => {
      const database = await new Promise<IDBDatabase>(resolve => {
        const request = indexedDB.open('ismi-offline')
        request.onsuccess = () => resolve(request.result)
      })
      return new Promise<{ version: string; count: number }>(resolve => {
        const transaction = database.transaction(['lessons', 'recordings'], 'readonly')
        const lesson = transaction.objectStore('lessons').get('levantine-day-01')
        const recordings = transaction.objectStore('recordings').count()
        transaction.oncomplete = () => {
          database.close(); resolve({ version: lesson.result.version, count: recordings.result })
        }
      })
    })
    expect(saved.version).toBe(original.version)
    expect(saved.count).toBe(0)
  })
}
