import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

// Picks up N8N_WEBHOOK_URL (and anything else) from a local .env, if there is one.
try {
  process.loadEnvFile();
} catch {
  // no .env file
}

const bddTestDir = defineBddConfig({
  features: 'tests/saucedemo/bdd/features/*.feature',
  steps: ['tests/saucedemo/bdd/steps/*.steps.ts', 'src/saucedemo/fixtures.ts'],
});

// One project per application under test. Each name matches its folders:
// tests/<name>/ for the specs, src/<name>/ for page objects and clients,
// and apps/<name>/ when we run the app ourselves.
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [['html', { open: 'never' }], ['list'], ['./tools/n8n/reporter.ts']],
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    // e.g. `SLOWMO=500 npm run test:headed` to watch each browser action.
    launchOptions: { slowMo: Number(process.env.SLOWMO ?? 0) },
  },
  webServer: [
    {
      command: 'node apps/ai-assistant/server.ts',
      url: 'http://localhost:3100/health',
      reuseExistingServer: !process.env.CI,
    },
    {
      // Port 4300 so it doesn't clash with another Angular app on 4200.
      command: 'npm --prefix apps/crm start -- --port 4300',
      url: 'http://localhost:4300',
      reuseExistingServer: !process.env.CI,
      timeout: 180_000,
    },
  ],
  projects: [
    {
      name: 'saucedemo',
      testDir: './tests/saucedemo',
      testIgnore: '**/bdd/**',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'https://www.saucedemo.com',
      },
    },
    {
      name: 'restful-booker',
      testDir: './tests/restful-booker',
      use: {
        baseURL: 'https://restful-booker.herokuapp.com',
      },
    },
    {
      name: 'saucedemo-bdd',
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
      name: 'ai-assistant',
      testDir: './tests/ai-assistant',
      // A small model on a CPU-only CI runner can take a few seconds per answer.
      timeout: 60_000,
      use: {
        baseURL: 'http://localhost:3100',
      },
    },
  ],
});
