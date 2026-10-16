import { defineConfig, devices } from '@playwright/test'
import base from './playwright.config'

// Supplemental WebKit checks. These do not replace real iPhone/VoiceOver evidence.
export default defineConfig({
  ...base,
  testMatch: /multi-language\.spec\.ts/,
  projects: [
    { name: 'desktop-webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'mobile-webkit', use: { ...devices['iPhone 13'] } },
  ],
})
