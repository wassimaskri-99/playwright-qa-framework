import { test, expect } from '@saucedemo/fixtures';
import { users } from '@saucedemo/users';

test.describe('Menu', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(users.standard.username, users.standard.password);
  });

  test('should log out and block the products page', async ({ page, inventoryPage, loginPage }) => {
    await inventoryPage.logout();

    await page.goto('/inventory.html');

    await expect(loginPage.errorMessage).toContainText('when you are logged in');
  });

  test('should empty the cart when resetting the app state', async ({ inventoryPage }) => {
    await inventoryPage.addProductToCart('Sauce Labs Backpack');

    await inventoryPage.resetAppState();

    await expect(inventoryPage.cartBadge).toBeHidden();
  });

  test('should show "Add to cart" again after resetting the app state', async ({
    inventoryPage,
  }) => {
    // Known bug: the cart is emptied but the button keeps saying "Remove" until a reload.
    test.fail();

    await inventoryPage.addProductToCart('Sauce Labs Backpack');

    await inventoryPage.resetAppState();

    await expect(inventoryPage.productButton('Sauce Labs Backpack')).toHaveText('Add to cart', {
      timeout: 3000,
    });
  });
});
