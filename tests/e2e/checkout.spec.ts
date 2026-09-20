import { test, expect } from '@fixtures/pages.fixture';
import { users } from '@fixtures/users';

test.describe('Checkout', () => {
  test.beforeEach(async ({ loginPage, inventoryPage }) => {
    await loginPage.goto();
    await loginPage.login(users.standard.username, users.standard.password);
    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.goToCart();
  });

  test('should complete checkout with valid information', async ({ cartPage, checkoutPage }) => {
    await cartPage.checkout();
    await checkoutPage.fillInfo('John', 'Doe', '12345');
    await checkoutPage.continueToOverview();

    await checkoutPage.finishOrder();

    await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
  });

  test('should display error when first name is missing', async ({ cartPage, checkoutPage }) => {
    await cartPage.checkout();
    await checkoutPage.fillInfo('', 'Doe', '12345');

    await checkoutPage.continueToOverview();

    await expect(checkoutPage.errorMessage).toContainText('First Name is required');
  });
});
