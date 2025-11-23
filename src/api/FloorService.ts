import { httpClient } from './httpClient';
import type {
  Floor,
  FloorRoom,
  CreateFloorRoomPayload,
  UpdateFloorRoomPayload,
  ApiResponse,
} from '@/types';

class FloorService {
  async getAllFloors(): Promise<Floor[]> {
    // GET /api/v1/floors
    const response = await httpClient.get<ApiResponse<Floor[]>>(
      '/api/v1/floors'
    );
    return response.data.data;
  }

  async getRoomsByFloorId(floorId: string): Promise<FloorRoom[]> {
    // GET /api/v1/floors/:floorId/rooms
    const response = await httpClient.get<ApiResponse<FloorRoom[]>>(
      `/api/v1/floors/${floorId}/rooms`
    );
    return response.data.data;
  }

  async createFloorRoom(payload: CreateFloorRoomPayload): Promise<FloorRoom> {
    // POST /api/v1/floors/:floorId/rooms
    // SECURITY NOTE: Backend should extract created_by from httpOnly cookie
    // and verify admin role before creating room
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
    // PUT /api/v1/rooms/:id
    // SECURITY NOTE: Backend should extract updated_by from httpOnly cookie
    // and verify admin role before updating room
    const response = await httpClient.put<ApiResponse<FloorRoom>>(
      `/api/v1/rooms/${roomId}`,
      payload
    );
    return response.data.data;
  }

  async deleteFloorRoom(roomId: string): Promise<void> {
    // DELETE /api/v1/rooms/:id
    // SECURITY NOTE: Backend should verify admin role from httpOnly cookie
    await httpClient.delete(`/api/v1/rooms/${roomId}`);
  }
}

export const floorService = new FloorService();
