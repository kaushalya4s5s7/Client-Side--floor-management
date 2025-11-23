// MOCK MODE: API calls are disabled for frontend testing
// To enable real API calls, uncomment the code in the "REAL API" sections
// and comment out the "MOCK API" sections

// import { httpClient } from './httpClient';
import type { Room } from '@/types';
import { mockRooms, simulateDelay } from './mockData';

class RoomService {
  // private readonly baseUrl = '/rooms';

  // ========== MOCK API ==========
  async getRooms(): Promise<Room[]> {
    console.log('🔧 MOCK MODE: Get rooms called');
    await simulateDelay(800);

    return mockRooms;
  }

  async getRoomById(roomId: string): Promise<Room> {
    console.log('🔧 MOCK MODE: Get room by ID', roomId);
    await simulateDelay(500);

    const room = mockRooms.find((r) => r.id === roomId);
    if (!room) {
      throw new Error('Room not found');
    }

    return room;
  }
  // ========== END MOCK API ==========

  /* ========== REAL API (Currently Disabled) ==========
  async getRooms(): Promise<Room[]> {
    const response = await httpClient.get<ApiResponse<Room[]>>(this.baseUrl);
    return response.data.data;
  }

  async getRoomById(roomId: string): Promise<Room> {
    const response = await httpClient.get<ApiResponse<Room>>(
      `${this.baseUrl}/${roomId}`
    );
    return response.data.data;
  }
  ========== END REAL API ========== */
}

export const roomService = new RoomService();
