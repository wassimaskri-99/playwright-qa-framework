import { test, expect } from '@fixtures/pages.fixture';
import { users } from '@fixtures/users';

test.describe('Cart', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(users.standard.username, users.standard.password);
  });

  test('should add a product to the cart', async ({ inventoryPage }) => {
    await inventoryPage.addProductToCart('Sauce Labs Backpack');

    await expect(inventoryPage.cartBadge).toHaveText('1');
  });

  test('should display the added product on the cart page', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.goToCart();

    await expect(cartPage.productNames()).toHaveText(['Sauce Labs Backpack']);
  });

  test('should remove a product from the cart', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.goToCart();

    await cartPage.removeProduct('Sauce Labs Backpack');

    await expect(cartPage.cartItems).toHaveCount(0);
  });
});
