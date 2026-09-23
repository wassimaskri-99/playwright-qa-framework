import { Given, When, Then } from '@fixtures/bdd';
import { expect } from '@playwright/test';
import { users } from '@fixtures/users';

Given('I am logged in as a standard user', async ({ loginPage }) => {
  await loginPage.goto();
  await loginPage.login(users.standard.username, users.standard.password);
});

Given('I add {string} to the cart', async ({ inventoryPage }, productName: string) => {
  await inventoryPage.addProductToCart(productName);
});

Given('I go to the cart', async ({ inventoryPage }) => {
  await inventoryPage.goToCart();
});

When('I remove {string} from the cart', async ({ cartPage }, productName: string) => {
  await cartPage.removeProduct(productName);
});

Then('the cart badge should show {string}', async ({ inventoryPage }, count: string) => {
  await expect(inventoryPage.cartBadge).toHaveText(count);
});

Then('the cart should contain {string}', async ({ cartPage }, productName: string) => {
  await expect(cartPage.productNames()).toHaveText([productName]);
});

Then('the cart should be empty', async ({ cartPage }) => {
  await expect(cartPage.cartItems).toHaveCount(0);
});
