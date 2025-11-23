// MOCK MODE: API calls are disabled for frontend testing
// To enable real API calls, uncomment the code in the "REAL API" sections
// and comment out the "MOCK API" sections

// import { httpClient } from './httpClient';
import type {
  Floor,
  FloorRoom,
  CreateFloorRoomPayload,
  UpdateFloorRoomPayload,
  // ApiResponse,
} from '@/types';
import { mockFloors, mockFloorRooms, simulateDelay } from './mockData';

class FloorService {
  // private readonly floorsUrl = '/api/v1/floors';
  // private readonly roomsUrl = '/api/v1/rooms';

  // Local storage for mock floor rooms (simulates database)
  private mockFloorRoomStorage: FloorRoom[] = [...mockFloorRooms];

  // ========== MOCK API ==========

  // GET all floors
  async getAllFloors(): Promise<Floor[]> {
    console.log('🔧 MOCK MODE: Get all floors called');
    await simulateDelay(800);
    return mockFloors;
  }

  // GET rooms by floor ID
  async getRoomsByFloorId(floorId: string): Promise<FloorRoom[]> {
    console.log('🔧 MOCK MODE: Get rooms by floor ID', floorId);
    await simulateDelay(1000);

    const rooms = this.mockFloorRoomStorage.filter((room) => room.floorId === floorId);
    return rooms;
  }

  // POST create room for a floor
  async createFloorRoom(payload: CreateFloorRoomPayload): Promise<FloorRoom> {
    console.log('🔧 MOCK MODE: Create floor room called', payload);
    await simulateDelay(1200);

    const newRoom: FloorRoom = {
      id: `room-${Date.now()}`,
      floorId: payload.floor_id,
      name: payload.name,
      capacity: payload.capacity,
      features: payload.features,
      createdBy: 'mock-admin-456',
      updatedBy: 'mock-admin-456',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.mockFloorRoomStorage.push(newRoom);
    return newRoom;
  }

  // PUT update room
  async updateFloorRoom(roomId: string, payload: UpdateFloorRoomPayload): Promise<FloorRoom> {
    console.log('🔧 MOCK MODE: Update floor room called', { roomId, payload });
    await simulateDelay(1000);

    const roomIndex = this.mockFloorRoomStorage.findIndex((room) => room.id === roomId);
    if (roomIndex === -1) {
      throw new Error('Room not found');
    }

    const updatedRoom: FloorRoom = {
      ...this.mockFloorRoomStorage[roomIndex],
      ...payload,
      updatedBy: 'mock-admin-456',
      updatedAt: new Date().toISOString(),
    };

    this.mockFloorRoomStorage[roomIndex] = updatedRoom;
    return updatedRoom;
  }

  // DELETE room
  async deleteFloorRoom(roomId: string): Promise<void> {
    console.log('🔧 MOCK MODE: Delete floor room called', roomId);
    await simulateDelay(800);

    const roomIndex = this.mockFloorRoomStorage.findIndex((room) => room.id === roomId);
    if (roomIndex !== -1) {
      this.mockFloorRoomStorage.splice(roomIndex, 1);
    }
  }

  // ========== END MOCK API ==========

  /* ========== REAL API (Currently Disabled) ==========

  async getAllFloors(): Promise<Floor[]> {
    const response = await httpClient.get<ApiResponse<Floor[]>>(
      '/api/v1/floors'
    );
    return response.data.data;
  }

  async getRoomsByFloorId(floorId: string): Promise<FloorRoom[]> {
    const response = await httpClient.get<ApiResponse<FloorRoom[]>>(
      `/api/v1/floors/${floorId}/rooms`
    );
    return response.data.data;
  }

  async createFloorRoom(payload: CreateFloorRoomPayload): Promise<FloorRoom> {
    const response = await httpClient.post<ApiResponse<FloorRoom>>(
      `/api/v1/floors/${payload.floor_id}/rooms`,
      {
        floor_id: payload.floor_id,
        name: payload.name,
        capacity: payload.capacity,
        features: payload.features,
      }
    );
    return response.data.data;
  }

  async updateFloorRoom(roomId: string, payload: UpdateFloorRoomPayload): Promise<FloorRoom> {
    const response = await httpClient.put<ApiResponse<FloorRoom>>(
      `/api/v1/rooms/${roomId}`,
      payload
    );
    return response.data.data;
  }

  async deleteFloorRoom(roomId: string): Promise<void> {
    await httpClient.delete(`/api/v1/rooms/${roomId}`);
  }

  ========== END REAL API ========== */
}

export const floorService = new FloorService();
