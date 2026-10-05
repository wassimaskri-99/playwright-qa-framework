import { test, expect } from '@fixtures/pages.fixture';
import { users } from '@fixtures/users';

// problem_user is SauceDemo's intentionally broken account. Each bug below was
// seen in the browser and is kept as test.fail() so it stays documented.
test.describe('Problem user', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(users.problem.username, users.problem.password);
  });

  test('should show a different image for each product', async ({ inventoryPage }) => {
    // Known bug: all six products show the same "404" image.
    test.fail();

    const images = await inventoryPage.productImages.evaluateAll((imgs) =>
      imgs.map((img) => img.getAttribute('src')),
    );

    expect(new Set(images).size).toBe(6);
  });

  test('should sort products by name from Z to A', async ({ inventoryPage }) => {
    // Known bug: picking a sort option does nothing.
    test.fail();

    await inventoryPage.sortBy('Name (Z to A)');

    await expect(inventoryPage.productNames.first()).toHaveText(
      'Test.allTheThings() T-Shirt (Red)',
      { timeout: 3000 },
    );
  });

  test('should keep the last name typed at checkout', async ({
    inventoryPage,
    cartPage,
    checkoutPage,
  }) => {
    // Known bug: typing the last name overwrites the first name field.
    test.fail();

    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.goToCart();
    await cartPage.checkout();

    await checkoutPage.fillInfo('John', 'Doe', '12345');

    await expect(checkoutPage.lastNameInput).toHaveValue('Doe', { timeout: 3000 });
  });
});
