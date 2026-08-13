export interface CreateShortUrlRequest {
  originalUrl: string;
  customAlias?: string;
  expiresAt?: string | null;
}

export interface ShortUrlResponse {
  id: number;
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
  clickCount: number;
  expiresAt: string | null;
  createdAt: string;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface EmailRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
}

export interface ApiResponse {
  success: boolean;
  message: string;
}

export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string> | string[];
}

export interface UserProfileResponse {
  id: number;
  name: string;
  email: string;
  role: string;
  enabled: boolean;
}

export interface UpdateProfileRequest {
  name: string;
}

export interface UserSession {
  email: string;
  name?: string;
  role?: string;
  enabled?: boolean;
  token: string;
  tokenType: string;
  expiresAt: number; // timestamp in ms
}


