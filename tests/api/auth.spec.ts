import { test, expect } from '@playwright/test';

test.describe('Auth', () => {
  test('should return a token for valid credentials', async ({ request }) => {
    const response = await request.post('/auth', {
      data: { username: 'admin', password: 'password123' },
    });

    const body = await response.json();
    expect(body.token).toBeTruthy();
  });

  test('should return a reason instead of a token for invalid credentials', async ({ request }) => {
    // restful-booker responds 200 with a "reason" field for bad credentials, not 401
    const response = await request.post('/auth', {
      data: { username: 'admin', password: 'wrong_password' },
    });

    const body = await response.json();
    expect(body.reason).toBe('Bad credentials');
  });
});
