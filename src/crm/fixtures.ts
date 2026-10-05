import { test as base } from '@playwright/test';
import { CrmLoginPage } from './pages/CrmLoginPage';
import { CrmLayout } from './pages/CrmLayout';

export const test = base.extend<{ crmLoginPage: CrmLoginPage; crmLayout: CrmLayout }>({
  crmLoginPage: async ({ page }, use) => {
    await use(new CrmLoginPage(page));
  },
  crmLayout: async ({ page }, use) => {
    await use(new CrmLayout(page));
  },
});

export { expect } from '@playwright/test';
