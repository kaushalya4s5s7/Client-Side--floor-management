// MOCK MODE: API calls are disabled for frontend testing
// To enable real API calls, uncomment the code in the "REAL API" sections
// and comment out the "MOCK API" sections

// import { httpClient } from './httpClient';
import type {
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
  // ApiResponse
} from '@/types';
import { mockUser, mockAdminUser, simulateDelay } from './mockData';

class AuthService {
  // private readonly baseUrl = '/api/v1/user';

  // ========== MOCK API ==========
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    console.log('🔧 MOCK MODE: Login called with', credentials);
    await simulateDelay(1000);

    // Check if admin email
    const isAdmin = credentials.email.toLowerCase().includes('admin');

    // Simulate login success with role based on email
    return {
      user: isAdmin ? mockAdminUser : mockUser,
      message: `Login successful (MOCK) - Role: ${isAdmin ? 'admin' : 'user'}`,
    };
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    console.log('🔧 MOCK MODE: Register called with', credentials);
    await simulateDelay(1000);

    // Simulate registration success
    return {
      user: {
        ...mockUser,
        email: credentials.email,
        name: credentials.name || 'New User',
      },
      message: 'Registration successful (MOCK)',
    };
  }

  async logout(): Promise<void> {
    console.log('🔧 MOCK MODE: Logout called');
    await simulateDelay(500);
    // Simulate logout success
  }

  async getCurrentUser(): Promise<AuthResponse> {
    console.log('🔧 MOCK MODE: Get current user called');
    await simulateDelay(500);
    return {
      user: mockUser,
    };
  }
  // ========== END MOCK API ==========

  /* ========== REAL API (Currently Disabled) ==========
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // POST /api/v1/user/login
    const response = await httpClient.post<ApiResponse<{ success: boolean; message: string }>>(
      '/api/v1/user/login',
      credentials
    );

    // Backend sets httpOnly cookie with {_id, email, role}
    // We need to extract user info from cookie or make a separate call
    // For now, we'll extract from cookie after successful login
    const user = this.extractUserFromCookie();

    return {
      user,
      message: response.data.message,
    };
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    // POST /api/v1/user/signup
    const response = await httpClient.post<ApiResponse<{ success: boolean; message: string }>>(
      '/api/v1/user/signup',
      credentials
    );

    // Backend sets httpOnly cookie with {_id, email, role}
    const user = this.extractUserFromCookie();

    return {
      user,
      message: response.data.message,
    };
  }

  async logout(): Promise<void> {
    // CLIENT-SIDE ONLY - No API call
    // Clear cookies manually
    document.cookie = '_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'email=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  }

  private extractUserFromCookie(): User {
    // Helper to extract user data from httpOnly cookie
    // This assumes the cookie is accessible or we get it from response headers
    // In production, backend should include user data in login/signup response
    const cookies = document.cookie.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split('=');
      acc[key] = value;
      return acc;
    }, {} as Record<string, string>);

    return {
      id: cookies._id || '',
      email: cookies.email || '',
      role: (cookies.role as 'admin' | 'user') || 'user',
    };
  }
  ========== END REAL API ========== */
}

export const authService = new AuthService();
