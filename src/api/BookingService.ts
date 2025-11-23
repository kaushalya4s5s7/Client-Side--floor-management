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
  async searchAvailability(params: AvailabilitySearchParams): Promise<AvailableRoom[]> {
    // POST /api/v1/availability/search
    const response = await httpClient.post<ApiResponse<AvailableRoom[]>>(
      '/api/v1/availability/search',
      params
    );
    return response.data.data;
  }

  async createBooking(roomId: string, payload: CreateBookingPayload): Promise<Booking> {
    // POST /api/v1/rooms/:roomId/bookings
    // SECURITY NOTE: Backend extracts user_id from httpOnly cookie
    // Frontend should NOT send created_by in request (prevents impersonation)
    // Convert to snake_case for API
    const apiPayload = {
      room_id: roomId,
      description: payload.description || payload.title,
      start_time: payload.startTime,
      end_time: payload.endTime,
    };

    await httpClient.post<ApiResponse<{ success: boolean; message: string }>>(
      `/api/v1/rooms/${roomId}/bookings`,
      apiPayload
    );

    // Response only returns success/message, not the booking object
    // Return a minimal booking object for immediate feedback
    return {
      id: '',
      roomId,
      userId: '', // Will be populated when fetching bookings
      title: payload.title,
      description: payload.description,
      startTime: payload.startTime,
      endTime: payload.endTime,
      capacity: payload.capacity,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Booking;
  }

  async getBookingsByUser(userId: string): Promise<Booking[]> {
    // GET /api/v1/bookings/:userId (userId in URL, not query param)
    const response = await httpClient.get<ApiResponse<Array<{
      id: string;
      room_name: string;
      description: string;
      start_time: string;
      end_time: string;
    }>>>(
      `/api/v1/bookings/${userId}`
    );

    // Convert snake_case response to camelCase
    return response.data.data.map(booking => ({
      id: booking.id,
      roomId: '', // Not provided in response
      userId,
      title: booking.description,
      description: booking.description,
      startTime: booking.start_time,
      endTime: booking.end_time,
      capacity: 1,
      status: 'confirmed',
      createdAt: '',
      updatedAt: '',
      room: {
        id: '',
        name: booking.room_name,
        description: '',
        capacity: 1,
        features: [],
      }
    } as Booking));
  }

  async getBookingById(bookingId: string): Promise<Booking> {
    const response = await httpClient.get<ApiResponse<Booking>>(
      `/api/v1/bookings/${bookingId}`
    );
    return response.data.data;
  }

  async updateBooking(bookingId: string, payload: UpdateBookingPayload): Promise<Booking> {
    // PUT /api/v1/bookings/:id
    // Convert to snake_case
    const apiPayload: Record<string, any> = {};
    if (payload.description) apiPayload.description = payload.description;
    if (payload.startTime) apiPayload.start_time = payload.startTime;
    if (payload.endTime) apiPayload.end_time = payload.endTime;

    await httpClient.put<ApiResponse<{ success: boolean; message: string }>>(
      `/api/v1/bookings/${bookingId}`,
      apiPayload
    );

    // Response only returns success/message
    // Return updated booking for immediate feedback
    return {
      id: bookingId,
      ...payload,
    } as Booking;
  }

  async cancelBooking(bookingId: string): Promise<void> {
    // DELETE /api/v1/bookings/:id
    await httpClient.delete(`/api/v1/bookings/${bookingId}`);
  }
}

export const bookingService = new BookingService();
