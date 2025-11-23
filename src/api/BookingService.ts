import { httpClient } from './httpClient';
import type {
  AvailabilitySearchParams,
  AvailableRoom,
  Booking,
  CreateBookingPayload,
  UpdateBookingPayload,
  ApiResponse,
} from '@/types';

class BookingService {
  private readonly availabilityUrl = '/availability';
  private readonly roomsUrl = '/rooms';
  private readonly bookingsUrl = '/bookings';

  async searchAvailability(params: AvailabilitySearchParams): Promise<AvailableRoom[]> {
    const response = await httpClient.post<ApiResponse<AvailableRoom[]>>(
      `${this.availabilityUrl}/search`,
      params
    );
    return response.data.data;
  }

  async createBooking(roomId: string, payload: CreateBookingPayload): Promise<Booking> {
    const response = await httpClient.post<ApiResponse<Booking>>(
      `${this.roomsUrl}/${roomId}/bookings`,
      payload
    );
    return response.data.data;
  }

  async getBookingsByUser(userId: string): Promise<Booking[]> {
    const response = await httpClient.get<ApiResponse<Booking[]>>(
      `${this.bookingsUrl}`,
      {
        params: { userId }
      }
    );
    return response.data.data;
  }

  async getBookingById(bookingId: string): Promise<Booking> {
    const response = await httpClient.get<ApiResponse<Booking>>(
      `${this.bookingsUrl}/${bookingId}`
    );
    return response.data.data;
  }

  async updateBooking(bookingId: string, payload: UpdateBookingPayload): Promise<Booking> {
    const response = await httpClient.put<ApiResponse<Booking>>(
      `${this.bookingsUrl}/${bookingId}`,
      payload
    );
    return response.data.data;
  }

  async cancelBooking(bookingId: string): Promise<void> {
    await httpClient.delete(`${this.bookingsUrl}/${bookingId}`);
  }
}

export const bookingService = new BookingService();
