import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  retries: 0,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'mobile-chromium',
      use: { ...devices['Pixel 7'] },
    },
  ],
  webServer: [
    {
      command: 'dotnet run --project ../i-api --no-launch-profile --urls http://127.0.0.1:5063',
      url: 'http://127.0.0.1:5063/api/health',
      reuseExistingServer: false,
      timeout: 120_000,
      env: {
        ...process.env,
        ASPNETCORE_ENVIRONMENT: 'Development',
        Database__Path: '/private/tmp/ismi-playwright.db',
      },
    },
    {
      command: 'npm run build && npm run preview -- --host 127.0.0.1 --port 4173',
      url: 'http://127.0.0.1:4173',
      reuseExistingServer: false,
      timeout: 120_000,
      env: {
        ...process.env,
        ISMI_API_PROXY_TARGET: 'http://127.0.0.1:5063',
      },
    },
  ],
})
