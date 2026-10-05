import { test as base } from '@playwright/test';
import { CrmLoginPage } from '@pages/crm/CrmLoginPage';
import { CrmLayout } from '@pages/crm/CrmLayout';

export const crmUser = { email: 'jheart@dx-email.com', password: 'password' };

export const test = base.extend<{ crmLoginPage: CrmLoginPage; crmLayout: CrmLayout }>({
  crmLoginPage: async ({ page }, use) => {
    await use(new CrmLoginPage(page));
  },
  crmLayout: async ({ page }, use) => {
    await use(new CrmLayout(page));
  },
});

export { expect } from '@playwright/test';
