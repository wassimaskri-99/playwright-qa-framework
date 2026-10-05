import { APIRequestContext, APIResponse } from '@playwright/test';

export type Booking = {
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: { checkin: string; checkout: string };
};

export const admin = { username: 'admin', password: 'password123' };

// Thin wrapper around the restful-booker endpoints. Methods return the raw
// response so tests can still assert on status codes.
export class BookingClient {
  constructor(private readonly request: APIRequestContext) {}

  login(username: string, password: string): Promise<APIResponse> {
    return this.request.post('/auth', { data: { username, password } });
  }

  async adminToken(): Promise<string> {
    const response = await this.login(admin.username, admin.password);
    return (await response.json()).token;
  }

  createBooking(booking: Booking): Promise<APIResponse> {
    return this.request.post('/booking', { data: booking });
  }

  getBooking(id: number): Promise<APIResponse> {
    return this.request.get(`/booking/${id}`);
  }

  deleteBooking(id: number, token: string): Promise<APIResponse> {
    return this.request.delete(`/booking/${id}`, { headers: { Cookie: `token=${token}` } });
  }
}
