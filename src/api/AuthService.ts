import { httpClient } from './httpClient';
import type {
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
  ApiResponse
} from '@/types';

class AuthService {
  private readonly baseUrl = '/auth';

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await httpClient.post<ApiResponse<AuthResponse>>(
      `${this.baseUrl}/login`,
      credentials
    );
    return response.data.data;
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await httpClient.post<ApiResponse<AuthResponse>>(
      `${this.baseUrl}/register`,
      credentials
    );
    return response.data.data;
  }

  async logout(): Promise<void> {
    await httpClient.post(`${this.baseUrl}/logout`);
  }

  async getCurrentUser(): Promise<AuthResponse> {
    const response = await httpClient.get<ApiResponse<AuthResponse>>(
      `${this.baseUrl}/me`
    );
    return response.data.data;
  }
}

export const authService = new AuthService();
