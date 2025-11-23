// Auth Types
export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name?: string;
}

export interface AuthResponse {
  user: User;
  message?: string;
}

// Room Types
export interface Room {
  id: string;
  name: string;
  description: string;
  capacity: number;
  features: string[];
  imageUrl?: string;
}

export interface RoomFeature {
  id: string;
  name: string;
  icon?: string;
}

// Booking Types
export interface Booking {
  id: string;
  roomId: string;
  userId: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  bufferBefore?: number;
  bufferAfter?: number;
  capacity: number;
  participants?: string[];
  recurrence?: RecurrenceRule;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  room?: Room;
}

export interface RecurrenceRule {
  frequency: 'daily' | 'weekly' | 'monthly';
  interval: number;
  endDate?: string;
  count?: number;
}

export interface CreateBookingPayload {
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  bufferBefore?: number;
  bufferAfter?: number;
  capacity: number;
  participants?: string[];
  recurrence?: RecurrenceRule;
}

export interface UpdateBookingPayload extends Partial<CreateBookingPayload> {
  status?: 'pending' | 'confirmed' | 'cancelled';
}

// Availability Types
export interface AvailabilitySearchParams {
  windowStart: string;
  windowEnd: string;
  duration: number;
  capacity: number;
  features?: string[];
}

export interface AvailableRoom extends Room {
  availableSlots?: TimeSlot[];
}

export interface TimeSlot {
  start: string;
  end: string;
}

// UI Types
export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

export interface ModalState {
  isOpen: boolean;
  type?: string;
  data?: any;
}

// API Response Types
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
