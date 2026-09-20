import { Given, When, Then } from '@fixtures/bdd';
import { expect } from '@playwright/test';
import { users } from '@fixtures/users';

Given('I am on the login page', async ({ loginPage }) => {
  await loginPage.goto();
});

When('I log in with valid credentials', async ({ loginPage }) => {
  await loginPage.login(users.standard.username, users.standard.password);
});

When('I log in with password {string}', async ({ loginPage }, password: string) => {
  await loginPage.login(users.standard.username, password);
});

When('I log in as a locked out user', async ({ loginPage }) => {
  await loginPage.login(users.lockedOut.username, users.lockedOut.password);
});

Then('I should be redirected to the inventory page', async ({ page }) => {
  await expect(page).toHaveURL(/inventory\.html/);
});
