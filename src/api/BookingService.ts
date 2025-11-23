// MOCK MODE: API calls are disabled for frontend testing
// To enable real API calls, uncomment the code in the "REAL API" sections
// and comment out the "MOCK API" sections

// import { httpClient } from './httpClient';
import type {
  AvailabilitySearchParams,
  AvailableRoom,
  Booking,
  CreateBookingPayload,
  UpdateBookingPayload,
  // ApiResponse,
} from '@/types';
import { mockRooms, mockBookings, simulateDelay } from './mockData';

class BookingService {
  // Endpoints following API_INTEGRATION.md specification
  // private readonly availabilityUrl = '/api/v1/availability';
  // private readonly roomsUrl = '/api/v1/rooms';
  // private readonly bookingsUrl = '/api/v1/bookings';

  // Local storage for mock bookings (simulates database)
  private mockBookingStorage: Booking[] = [...mockBookings];

  // ========== MOCK API ==========
  async searchAvailability(params: AvailabilitySearchParams): Promise<AvailableRoom[]> {
    console.log('🔧 MOCK MODE: Search availability called with', params);
    await simulateDelay(1200);

    // Filter rooms based on capacity (simple mock logic)
    const filteredRooms = mockRooms.filter(
      (room) => room.capacity >= params.capacity
    );

    return filteredRooms;
  }

  async createBooking(roomId: string, payload: CreateBookingPayload): Promise<Booking> {
    console.log('🔧 MOCK MODE: Create booking called', { roomId, payload });
    await simulateDelay(1000);

    // Find the room
    const room = mockRooms.find((r) => r.id === roomId);

    // Create new booking
    const newBooking: Booking = {
      id: `booking-${Date.now()}`,
      roomId,
      userId: 'mock-user-123',
      title: payload.title,
      description: payload.description,
      startTime: payload.startTime,
      endTime: payload.endTime,
      bufferBefore: payload.bufferBefore,
      bufferAfter: payload.bufferAfter,
      capacity: payload.capacity,
      participants: payload.participants,
      recurrence: payload.recurrence,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      room: room ? {
        id: room.id,
        name: room.name,
        description: room.description,
        capacity: room.capacity,
        features: room.features,
      } : undefined,
    };

    // Add to mock storage
    this.mockBookingStorage.push(newBooking);

    return newBooking;
  }

  async getBookingsByUser(userId: string): Promise<Booking[]> {
    console.log('🔧 MOCK MODE: Get bookings by user', userId);
    await simulateDelay(800);

    // Return mock bookings + any created ones
    return this.mockBookingStorage.filter((b) => b.userId === userId);
  }

  async getBookingById(bookingId: string): Promise<Booking> {
    console.log('🔧 MOCK MODE: Get booking by ID', bookingId);
    await simulateDelay(500);

    const booking = this.mockBookingStorage.find((b) => b.id === bookingId);
    if (!booking) {
      throw new Error('Booking not found');
    }

    return booking;
  }

  async updateBooking(bookingId: string, payload: UpdateBookingPayload): Promise<Booking> {
    console.log('🔧 MOCK MODE: Update booking', { bookingId, payload });
    await simulateDelay(1000);

    const bookingIndex = this.mockBookingStorage.findIndex((b) => b.id === bookingId);
    if (bookingIndex === -1) {
      throw new Error('Booking not found');
    }

    // Update booking
    const updatedBooking = {
      ...this.mockBookingStorage[bookingIndex],
      ...payload,
      updatedAt: new Date().toISOString(),
    };

    this.mockBookingStorage[bookingIndex] = updatedBooking;

    return updatedBooking;
  }

  async cancelBooking(bookingId: string): Promise<void> {
    console.log('🔧 MOCK MODE: Cancel booking', bookingId);
    await simulateDelay(800);

    // Remove from mock storage (or set status to cancelled)
    const bookingIndex = this.mockBookingStorage.findIndex((b) => b.id === bookingId);
    if (bookingIndex !== -1) {
      this.mockBookingStorage.splice(bookingIndex, 1);
    }
  }
  // ========== END MOCK API ==========

  /* ========== REAL API (Currently Disabled) ==========
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
    // Convert to snake_case for API
    const apiPayload = {
      room_id: roomId,
      created_by: payload.userId || '', // Get from auth cookie
      description: payload.description || payload.title,
      start_time: payload.startTime,
      end_time: payload.endTime,
    };

    const response = await httpClient.post<ApiResponse<{ success: boolean; message: string }>>(
      `/api/v1/rooms/${roomId}/bookings`,
      apiPayload
    );

    // Response only returns success/message, not the booking object
    // Return a minimal booking object or refetch
    return {
      id: '',
      roomId,
      userId: payload.userId || '',
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

    const response = await httpClient.put<ApiResponse<{ success: boolean; message: string }>>(
      `/api/v1/bookings/${bookingId}`,
      apiPayload
    );

    // Response only returns success/message
    return {
      id: bookingId,
      ...payload,
    } as Booking;
  }

  async cancelBooking(bookingId: string): Promise<void> {
    // DELETE /api/v1/bookings/:id
    await httpClient.delete(`/api/v1/bookings/${bookingId}`);
  }
  ========== END REAL API ========== */
}

export const bookingService = new BookingService();
