import { test, expect, APIRequestContext } from '@playwright/test';

async function getAuthToken(request: APIRequestContext): Promise<string> {
  const response = await request.post('/auth', {
    data: { username: 'admin', password: 'password123' },
  });
  const body = await response.json();
  return body.token;
}

test.describe('Booking', () => {
  test('should create a booking and return a booking id', async ({ request }) => {
    const response = await request.post('/booking', {
      data: {
        firstname: 'Jim',
        lastname: 'Brown',
        totalprice: 111,
        depositpaid: true,
        bookingdates: { checkin: '2026-01-01', checkout: '2026-01-05' },
      },
    });

    const body = await response.json();
    expect(body.bookingid).toBeTruthy();
  });

  test('should retrieve a created booking by id', async ({ request }) => {
    const created = await request.post('/booking', {
      data: {
        firstname: 'Jane',
        lastname: 'Smith',
        totalprice: 200,
        depositpaid: false,
        bookingdates: { checkin: '2026-02-01', checkout: '2026-02-05' },
      },
    });
    const { bookingid } = await created.json();

    const response = await request.get(`/booking/${bookingid}`);

    const body = await response.json();
    expect(body.firstname).toBe('Jane');
  });

  test('should delete a booking', async ({ request }) => {
    const token = await getAuthToken(request);
    const created = await request.post('/booking', {
      data: {
        firstname: 'Delete',
        lastname: 'Me',
        totalprice: 50,
        depositpaid: true,
        bookingdates: { checkin: '2026-03-01', checkout: '2026-03-02' },
      },
    });
    const { bookingid } = await created.json();

    // restful-booker responds 201 on a successful delete, not 200/204
    const deleteResponse = await request.delete(`/booking/${bookingid}`, {
      headers: { Cookie: `token=${token}` },
    });
    expect(deleteResponse.status()).toBe(201);

    const getResponse = await request.get(`/booking/${bookingid}`);
    expect(getResponse.status()).toBe(404);
  });
});
