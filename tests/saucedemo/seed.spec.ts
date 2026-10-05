import { test, expect } from '@saucedemo/fixtures';
import { users } from '@saucedemo/users';

// Starting point for the Playwright test agents (planner, generator, healer):
// a standard user logged in on the products page.
test.describe('Seed', () => {
  test('seed', async ({ page, loginPage }) => {
    await loginPage.goto();
    await loginPage.login(users.standard.username, users.standard.password);

    await expect(page).toHaveURL(/inventory\.html/);
  });
});
