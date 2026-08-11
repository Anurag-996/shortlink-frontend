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

export interface UserSession {
  email: string;
  token: string;
  tokenType: string;
  expiresAt: number; // timestamp in ms
}
