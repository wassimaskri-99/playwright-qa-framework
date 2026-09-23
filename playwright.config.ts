import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

const bddTestDir = defineBddConfig({
  features: 'features/*.feature',
  steps: ['steps/*.steps.ts', 'fixtures/pages.fixture.ts'],
});

// Three independent projects: UI flows against SauceDemo, API contract tests
// against Restful-Booker, and the Cucumber/Gherkin scenarios compiled by
// playwright-bdd. Kept separate so `npm run test:api` never spins up
// a browser and CI can shard them if the suite grows.
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'e2e',
      testDir: './tests/e2e',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'https://www.saucedemo.com',
      },
    },
    {
      name: 'api',
      testDir: './tests/api',
      use: {
        baseURL: 'https://restful-booker.herokuapp.com',
      },
    },
    {
      name: 'bdd',
      testDir: bddTestDir,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'https://www.saucedemo.com',
      },
    },
  ],
});
