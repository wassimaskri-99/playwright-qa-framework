import { test, expect } from '@fixtures/pages.fixture';
import { users } from '@fixtures/users';

test.describe('Login', () => {
  test('should log in successfully with valid credentials', async ({ page, loginPage }) => {
    await loginPage.goto();

    await loginPage.login(users.standard.username, users.standard.password);

    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('should display error when password is incorrect', async ({ loginPage }) => {
    await loginPage.goto();

    await loginPage.login(users.standard.username, 'wrong_password');

    await expect(loginPage.errorMessage).toContainText('Username and password do not match');
  });

  test('should display error when logging in with a locked out account', async ({ loginPage }) => {
    await loginPage.goto();

    await loginPage.login(users.lockedOut.username, users.lockedOut.password);

    await expect(loginPage.errorMessage).toContainText('Sorry, this user has been locked out');
  });
});
