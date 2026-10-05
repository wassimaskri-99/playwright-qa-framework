import { test as base } from '@playwright/test';
import { AssistantClient } from './AssistantClient';

export const test = base.extend<{ assistant: AssistantClient }>({
  assistant: async ({ request }, use) => {
    await use(new AssistantClient(request));
  },
});

export { expect } from '@playwright/test';
