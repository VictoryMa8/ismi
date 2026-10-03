import { defineConfig, devices } from '@playwright/test'
import base from './playwright.config'

// Isolated disposable databases from the base config. WebKit emulation is
// supplementary evidence; it does not establish real iOS or VoiceOver support.
export default defineConfig({
  ...base,
  testDir: './pilot-tests',
  testMatch: 'first-unit.spec.ts',
  projects: [{ name: 'iphone-webkit', use: { ...devices['iPhone 13'] } }],
})
