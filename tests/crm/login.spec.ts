import { test, expect, crmUser } from '@fixtures/crm.fixture';

test.describe('CRM login', () => {
  test('should send a logged-out user to the sign-in page', async ({ page }) => {
    await page.goto('/#/crm-contact-list');

    await expect(page).toHaveURL(/#\/auth\/sign-in/);
  });

  test('should log in with the demo account', async ({ page, crmLoginPage }) => {
    await crmLoginPage.goto();

    await crmLoginPage.login(crmUser.email, crmUser.password);

    await expect(page).toHaveURL(/#\/crm-contact-list/);
    await expect(page.getByText('Contacts', { exact: true })).toBeVisible();
  });

  test('should show an error with a wrong password', async ({ page, crmLoginPage }) => {
    await crmLoginPage.goto();

    await crmLoginPage.login(crmUser.email, 'wrong-password');

    await expect(crmLoginPage.toast).toHaveText('Invalid email or password');
    await expect(page).toHaveURL(/#\/auth\/sign-in/);
  });

  test('should require the email and the password', async ({ crmLoginPage }) => {
    await crmLoginPage.goto();

    await crmLoginPage.signInButton.click();

    await expect(crmLoginPage.emailInput).toHaveAccessibleDescription('Email is required');
    await expect(crmLoginPage.passwordInput).toHaveAccessibleDescription('Password is required');
  });

  test('should reject an email with the wrong format', async ({ crmLoginPage }) => {
    await crmLoginPage.goto();

    await crmLoginPage.login('not-an-email', crmUser.password);

    await expect(crmLoginPage.emailInput).toHaveAccessibleDescription('Email is invalid');
  });

  test('should stay logged in after a page reload', async ({ page, crmLoginPage }) => {
    await crmLoginPage.goto();
    await crmLoginPage.login(crmUser.email, crmUser.password);
    await expect(page).toHaveURL(/#\/crm-contact-list/);

    await page.reload();

    await expect(page).toHaveURL(/#\/crm-contact-list/);
  });

  test('should log out and block the protected pages', async ({
    page,
    crmLoginPage,
    crmLayout,
  }) => {
    await crmLoginPage.goto();
    await crmLoginPage.login(crmUser.email, crmUser.password);
    await expect(page).toHaveURL(/#\/crm-contact-list/);

    await crmLayout.logout();
    await page.goto('/#/analytics-dashboard');

    await expect(page).toHaveURL(/#\/auth\/sign-in/);
  });
});
