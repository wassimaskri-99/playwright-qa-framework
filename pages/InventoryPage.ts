import { Page, Locator } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;
  readonly sortSelect: Locator;
  readonly productNames: Locator;
  readonly productPrices: Locator;
  readonly productImages: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.cartLink = page.locator('.shopping_cart_link');
    this.sortSelect = page.locator('[data-test="product-sort-container"]');
    this.productNames = page.locator('[data-test="inventory-item-name"]');
    this.productPrices = page.locator('[data-test="inventory-item-price"]');
    this.productImages = page.locator('[data-test="inventory-list"] img');
  }

  async sortBy(
    option: 'Name (A to Z)' | 'Name (Z to A)' | 'Price (low to high)' | 'Price (high to low)',
  ) {
    await this.sortSelect.selectOption({ label: option });
  }

  productButton(productName: string): Locator {
    return this.page
      .locator('.inventory_item')
      .filter({ hasText: productName })
      .locator('button');
  }

  async openProduct(productName: string) {
    await this.productNames.filter({ hasText: productName }).click();
    // The SPA updates the URL before swapping the list for the detail view,
    // so wait for a detail-page-only element to avoid racing the transition.
    await this.page.locator('[data-test="back-to-products"]').waitFor();
  }

  async logout() {
    await this.page.locator('#react-burger-menu-btn').click();
    await this.page.locator('#logout_sidebar_link').click();
  }

  async resetAppState() {
    await this.page.locator('#react-burger-menu-btn').click();
    await this.page.locator('#reset_sidebar_link').click();
  }

  async addProductToCart(productName: string) {
    await this.page
      .locator('.inventory_item')
      .filter({ hasText: productName })
      .getByRole('button', { name: 'Add to cart' })
      .click();
  }

  async goToCart() {
    await this.cartLink.click();
  }
}
