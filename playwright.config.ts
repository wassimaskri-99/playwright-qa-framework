import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

const bddTestDir = defineBddConfig({
  features: 'features/*.feature',
  steps: ['steps/*.steps.ts', 'fixtures/pages.fixture.ts'],
});

// Four independent projects: UI flows against SauceDemo, API contract tests
// against Restful-Booker, the Cucumber/Gherkin scenarios compiled by
// playwright-bdd, and the AI shopping assistant (local LLM via Ollama).
// Kept separate so `npm run test:api` never spins up a browser and CI can
// shard them if the suite grows.
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
  webServer: {
    command: 'node ai-assistant/server.ts',
    url: 'http://localhost:3100/health',
    reuseExistingServer: !process.env.CI,
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
    {
      name: 'ai',
      testDir: './tests/ai',
      // A small model on a CPU-only CI runner can take a few seconds per answer.
      timeout: 60_000,
      use: {
        baseURL: 'http://localhost:3100',
      },
    },
  ],
});
