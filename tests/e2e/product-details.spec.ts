import { test, expect } from '@fixtures/pages.fixture';
import { users } from '@fixtures/users';

test.describe('Product details', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(users.standard.username, users.standard.password);
  });

  test('should show the product name and price', async ({ inventoryPage, productPage }) => {
    await inventoryPage.openProduct('Sauce Labs Bike Light');

    await expect(productPage.name).toHaveText('Sauce Labs Bike Light');
    await expect(productPage.price).toHaveText('$9.99');
  });

  test('should keep the cart after going back to the products', async ({
    inventoryPage,
    productPage,
  }) => {
    await inventoryPage.openProduct('Sauce Labs Bike Light');
    await productPage.addToCartButton.click();

    await productPage.backButton.click();

    await expect(inventoryPage.cartBadge).toHaveText('1');
    await expect(inventoryPage.productButton('Sauce Labs Bike Light')).toHaveText('Remove');
  });
});
