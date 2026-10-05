import { test, expect } from '@restful-booker/fixtures';
import { admin } from '@restful-booker/BookingClient';

test.describe('Auth', () => {
  test('should return a token for valid credentials', async ({ bookingClient }) => {
    const response = await bookingClient.login(admin.username, admin.password);

    const body = await response.json();
    expect(body.token).toBeTruthy();
  });

  test('should return a reason instead of a token for invalid credentials', async ({
    bookingClient,
  }) => {
    // restful-booker responds 200 with a "reason" field for bad credentials, not 401
    const response = await bookingClient.login(admin.username, 'wrong_password');

    const body = await response.json();
    expect(body.reason).toBe('Bad credentials');
  });
});
