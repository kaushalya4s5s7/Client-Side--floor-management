import { httpClient } from './httpClient';
import type { Room, ApiResponse } from '@/types';

class RoomService {
  private readonly baseUrl = '/rooms';

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
}

export const roomService = new RoomService();
