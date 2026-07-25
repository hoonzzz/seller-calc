const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests/E2E',
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    baseURL: process.env.APP_URL || 'http://localhost:8080',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  projects: [
    {
      name: 'mobile-chromium',
      use: {
        ...devices['iPhone 13'],
        viewport: { width: 390, height: 844 }
      }
    },
    {
      name: 'desktop-chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 900 }
      }
    }
  ],
  webServer: process.env.PLAYWRIGHT_SKIP_WEBSERVER
    ? undefined
    : {
        command: 'docker compose up --wait',
        url: 'http://localhost:8080/health',
        reuseExistingServer: !process.env.CI,
        timeout: 120000
      }
});
