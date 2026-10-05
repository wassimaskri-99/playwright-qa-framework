import { test, expect } from '@saucedemo/fixtures';
import { users } from '@saucedemo/users';

test.describe('Sorting', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(users.standard.username, users.standard.password);
  });

  test('should sort products by name from Z to A', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('Name (Z to A)');

    await expect(inventoryPage.productNames.first()).toHaveText(
      'Test.allTheThings() T-Shirt (Red)',
    );
    await expect(inventoryPage.productNames.last()).toHaveText('Sauce Labs Backpack');
  });

  test('should sort products by price from low to high', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('Price (low to high)');

    await expect(inventoryPage.productPrices).toHaveText([
      '$7.99',
      '$9.99',
      '$15.99',
      '$15.99',
      '$29.99',
      '$49.99',
    ]);
  });
});
