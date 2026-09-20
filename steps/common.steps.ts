import { Then } from '@fixtures/bdd';
import { expect } from '@playwright/test';

Then('I should see the error {string}', async ({ page }, message: string) => {
  await expect(page.locator('[data-test="error"]')).toContainText(message);
});
