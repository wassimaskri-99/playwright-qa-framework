import { test, expect } from '@restful-booker/fixtures';

test.describe('Booking', () => {
  test('should create a booking and return a booking id', async ({ bookingClient }) => {
    const response = await bookingClient.createBooking({
      firstname: 'Jim',
      lastname: 'Brown',
      totalprice: 111,
      depositpaid: true,
      bookingdates: { checkin: '2026-01-01', checkout: '2026-01-05' },
    });

    const body = await response.json();
    expect(body.bookingid).toBeTruthy();
  });

  test('should retrieve a created booking by id', async ({ bookingClient }) => {
    const created = await bookingClient.createBooking({
      firstname: 'Jane',
      lastname: 'Smith',
      totalprice: 200,
      depositpaid: false,
      bookingdates: { checkin: '2026-02-01', checkout: '2026-02-05' },
    });
    const { bookingid } = await created.json();

    const response = await bookingClient.getBooking(bookingid);

    const body = await response.json();
    expect(body.firstname).toBe('Jane');
  });

  test('should delete a booking', async ({ bookingClient }) => {
    const token = await bookingClient.adminToken();
    const created = await bookingClient.createBooking({
      firstname: 'Delete',
      lastname: 'Me',
      totalprice: 50,
      depositpaid: true,
      bookingdates: { checkin: '2026-03-01', checkout: '2026-03-02' },
    });
    const { bookingid } = await created.json();

    // restful-booker responds 201 on a successful delete, not 200/204
    const deleteResponse = await bookingClient.deleteBooking(bookingid, token);
    expect(deleteResponse.status()).toBe(201);

    const getResponse = await bookingClient.getBooking(bookingid);
    expect(getResponse.status()).toBe(404);
  });
});
