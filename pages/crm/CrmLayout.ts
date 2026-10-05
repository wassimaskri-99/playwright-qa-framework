import { Page, Locator } from '@playwright/test';

// The header and side menu shared by every page once logged in.
export class CrmLayout {
  readonly page: Page;
  readonly userPanel: Locator;

  constructor(page: Page) {
    this.page = page;
    this.userPanel = page.locator('user-panel').filter({ visible: true });
  }

  async logout() {
    await this.userPanel.click();
    await this.page.getByText('Logout', { exact: true }).click();
  }
}
