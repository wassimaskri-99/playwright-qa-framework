import { test as base } from '@playwright/test';
import { BookingClient } from './BookingClient';

export const test = base.extend<{ bookingClient: BookingClient }>({
  bookingClient: async ({ request }, use) => {
    await use(new BookingClient(request));
  },
});

export { expect } from '@playwright/test';
