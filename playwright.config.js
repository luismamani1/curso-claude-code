const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  globalSetup: './tests/global-setup.js',
  testDir: './tests/e2e',
  timeout: 30000,
  retries: 0,
  use: {
    baseURL: 'http://localhost:3000',
    headless: true,
    viewport: { width: 1280, height: 720 },
  },
  webServer: {
    command: 'node src/server.js',
    url: 'http://localhost:3000',
    reuseExistingServer: false,
    timeout: 10000,
    env: {
      PORT: '3000',
      JWT_SECRET: 'test_secret_kohi_playwright',
    },
  },
});
