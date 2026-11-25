import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30000,
  use: { baseURL: 'http://127.0.0.1:4321', trace:'on-first-retry' },
  projects: [{ name:'chromium', use:{...devices['Desktop Chrome']} }, {name:'mobile', use:{...devices['iPhone 13'], browserName:'chromium'}}],
  webServer: { command:'npm.cmd run dev', url:'http://127.0.0.1:4321', reuseExistingServer:true, timeout:120000 }
});
