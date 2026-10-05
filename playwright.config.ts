import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

// Picks up N8N_WEBHOOK_URL (and anything else) from a local .env, if there is one.
try {
  process.loadEnvFile();
} catch {
  // no .env file
}

const bddTestDir = defineBddConfig({
  features: 'features/*.feature',
  steps: ['steps/*.steps.ts', 'fixtures/pages.fixture.ts'],
});

// Five independent projects: UI flows against SauceDemo, API contract tests
// against Restful-Booker, the Cucumber/Gherkin scenarios compiled by
// playwright-bdd, the DevExtreme CRM app (crm-app/), and the AI shopping
// assistant (local LLM via Ollama).
// Kept separate so `npm run test:api` never spins up a browser and CI can
// shard them if the suite grows.
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [['html', { open: 'never' }], ['list'], ['./reporters/n8n-reporter.ts']],
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    // e.g. `SLOWMO=500 npm run test:headed` to watch each browser action.
    launchOptions: { slowMo: Number(process.env.SLOWMO ?? 0) },
  },
  webServer: [
    {
      command: 'node ai-assistant/server.ts',
      url: 'http://localhost:3100/health',
      reuseExistingServer: !process.env.CI,
    },
    {
      // DevExtreme CRM template (crm-app/). 4300 so it doesn't clash with
      // another Angular app on the default 4200.
      command: 'npm --prefix crm-app start -- --port 4300',
      url: 'http://localhost:4300',
      reuseExistingServer: !process.env.CI,
      timeout: 180_000,
    },
  ],
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
      name: 'crm',
      testDir: './tests/crm',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:4300',
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
