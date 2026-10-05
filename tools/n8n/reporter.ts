import { stripVTControlCharacters } from 'node:util';
import type { FullResult, Reporter, Suite } from '@playwright/test/reporter';

// Sends a summary of the run to an n8n webhook, which forwards it to Telegram.
// Does nothing unless N8N_WEBHOOK_URL is set, so local runs and forks are
// unaffected.
export default class N8nReporter implements Reporter {
  private suite!: Suite;

  onBegin(_config: unknown, suite: Suite) {
    this.suite = suite;
  }

  async onEnd(result: FullResult) {
    const url = process.env.N8N_WEBHOOK_URL;
    if (!url) return;

    const tests = this.suite.allTests();
    const count = (outcome: string) => tests.filter((t) => t.outcome() === outcome).length;
    const failures = tests
      .filter((t) => t.outcome() === 'unexpected')
      .map((t) => ({
        title: t.titlePath().slice(3).join(' › '),
        project: t.parent.project()?.name,
        error: stripVTControlCharacters(t.results.at(-1)?.error?.message ?? '')
          .split('\n')[0]
          .slice(0, 200),
      }));

    const summary = {
      status: result.status,
      passed: count('expected'),
      failed: count('unexpected'),
      flaky: count('flaky'),
      skipped: count('skipped'),
      durationSeconds: Math.round(result.duration / 1000),
      failures,
      branch: process.env.GITHUB_REF_NAME ?? 'local',
      runUrl: process.env.GITHUB_RUN_ID
        ? `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
        : undefined,
      reportUrl: 'https://wassimaskri-99.github.io/playwright-qa-framework/',
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(summary),
      });
      if (!response.ok) console.warn(`n8n webhook returned ${response.status}`);
    } catch (error) {
      // A notification problem should never fail the test run.
      console.warn(`Could not reach n8n: ${error}`);
    }
  }
}
