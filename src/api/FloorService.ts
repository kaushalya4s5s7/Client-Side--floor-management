import { httpClient } from './httpClient';
import type {
  Floor,
  FloorRoom,
  CreateFloorRoomPayload,
  UpdateFloorRoomPayload,
  CreateFloorPayload,
  ApiResponse,
} from '@/types';

class FloorService {
  async getAllFloors(): Promise<Floor[]> {
    // GET /api/v1/floors
    // Backend returns: { message, floors: [], count }
    const response = await httpClient.get<{ message: string; floors: any[]; count: number }>(
      '/api/v1/floors'
    );

    // Handle empty or missing floors array
    if (!response.data.floors || !Array.isArray(response.data.floors)) {
      return [];
    }

    // Map backend response to frontend Floor type
    return response.data.floors.map((floor: any) => ({
      id: floor._id,
      name: floor.floorName || `Floor ${floor.floorNumber}`,
      description: floor.floorDescription,
    }));
  }

  async createFloor(payload: CreateFloorPayload): Promise<Floor> {
    // POST /api/v1/floors
    // SECURITY NOTE: Backend should verify Admin role from httpOnly cookie
    const response = await httpClient.post<{ message: string; floor: any }>(
      '/api/v1/floors',
      payload
    );

    const floor = response.data.floor;
    return {
      id: floor._id,
      name: floor.floorName || `Floor ${floor.floorNumber}`,
      description: floor.floorDescription,
    };
  }

  async getRoomsByFloorId(floorId: string): Promise<FloorRoom[]> {
    // GET /api/v1/floors/:floorId/rooms
    // Backend returns: { message, rooms: [] }
    const response = await httpClient.get<{ message: string; rooms: any[] }>(
      `/api/v1/floors/${floorId}/rooms`
    );

    // Handle empty or missing rooms array
    if (!response.data.rooms || !Array.isArray(response.data.rooms)) {
      return [];
    }

    // Map backend response to frontend FloorRoom type
    return response.data.rooms.map((room: any) => ({
      id: room._id,
      floorId: room.floorId,
      name: room.roomName,
      capacity: room.capacity,
      features: room.roomFeatures || [],
      createdBy: room.createdBy,
      updatedBy: room.updatedBy,
      createdAt: room.createdAt,
      updatedAt: room.updatedAt,
    }));
  }

  async createFloorRoom(payload: CreateFloorRoomPayload): Promise<FloorRoom> {
    // POST /api/v1/floors/:floorId/rooms
    // SECURITY NOTE: Backend should extract created_by from httpOnly cookie
    // and verify Admin role before creating room
    const response = await httpClient.post<ApiResponse<FloorRoom>>(
      `/api/v1/floors/${payload.floor_id}/rooms`,
      {
        roomId: payload.roomId,
        roomName: payload.roomName,
        capacity: payload.capacity,
        roomFeatures: payload.roomFeatures,
        floorId: payload.floor_id,
        // createdBy is extracted from httpOnly cookie by backend
      }
    );
    return response.data.data;
  }

  async updateFloorRoom(roomId: string, payload: UpdateFloorRoomPayload): Promise<FloorRoom> {
    // PUT /api/v1/rooms/:id
    // SECURITY NOTE: Backend should extract updated_by from httpOnly cookie
    // and verify Admin role before updating room

    // Map frontend payload to backend expected format
    const backendPayload: any = {};
    if (payload.name !== undefined) backendPayload.roomName = payload.name;
    if (payload.capacity !== undefined) backendPayload.capacity = payload.capacity;
    if (payload.features !== undefined) backendPayload.roomFeatures = payload.features;

    const response = await httpClient.put<{ message: string; room: any }>(
      `/api/v1/rooms/${roomId}`,
      backendPayload
    );

    // Map backend response to frontend FloorRoom type
    const room = response.data.room;
    return {
      id: room._id,
      floorId: room.floorId,
      name: room.roomName,
      capacity: room.capacity,
      features: room.roomFeatures || [],
      createdBy: room.createdBy,
      updatedBy: room.updatedBy,
      createdAt: room.createdAt,
      updatedAt: room.updatedAt,
    };
  }

  async deleteFloorRoom(roomId: string): Promise<void> {
    // DELETE /api/v1/rooms/:id
    // SECURITY NOTE: Backend should verify Admin role from httpOnly cookie
    await httpClient.delete(`/api/v1/rooms/${roomId}`);
  }
}

export const floorService = new FloorService();
