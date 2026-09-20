import { Given, When, Then } from '@fixtures/bdd';
import { expect } from '@playwright/test';

Given('I start the checkout', async ({ cartPage }) => {
  await cartPage.checkout();
});

When(
  'I fill in my checkout information as {string}, {string}, {string}',
  async ({ checkoutPage }, firstName: string, lastName: string, postalCode: string) => {
    await checkoutPage.fillInfo(firstName, lastName, postalCode);
  },
);

When('I continue to the overview', async ({ checkoutPage }) => {
  await checkoutPage.continueToOverview();
});

When('I finish the order', async ({ checkoutPage }) => {
  await checkoutPage.finishOrder();
});

Then('I should see the order confirmation', async ({ checkoutPage }) => {
  await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
});
