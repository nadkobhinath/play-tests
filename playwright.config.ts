import { defineConfig, devices } from '@playwright/test';
import { EnvConfig } from './utils/env';

export default defineConfig({
  testDir: './tests',
  timeout: 30 * 1000,
  retries: 1,
  reporter: [['html', { outputFolder: 'playwright-report', open: 'never' }]],
  use: {
    baseURL: EnvConfig.baseUrl,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'UI - Chromium',
      testDir: './tests/ui',
      use: {
        ...devices['Desktop Chrome'],
        headless: true,
        screenshot: 'only-on-failure',
        video: 'on-first-retry',
      },
    },
    {
      name: 'UI - Firefox',
      testDir: './tests/ui',
      use: {
        ...devices['Desktop Firefox'],
        headless: true,
      },
    },
    {
      name: 'UI - WebKit',
      testDir: './tests/ui',
      use: {
        ...devices['Desktop Safari'],
        headless: true,
      },
    },
    {
      name: 'API',
      testDir: './tests/api',
      use: {
        baseURL: '',
      },
    },
  ],
});
