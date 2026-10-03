import { test, expect } from '@fixtures/pages.fixture';
import { users } from '@fixtures/users';

// Starting point for the Playwright test agents (planner, generator, healer):
// a standard user logged in on the products page.
test.describe('Seed', () => {
  test('seed', async ({ page, loginPage }) => {
    await loginPage.goto();
    await loginPage.login(users.standard.username, users.standard.password);

    await expect(page).toHaveURL(/inventory\.html/);
  });
});
