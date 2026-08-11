import { apiClient, setApiAuthToken } from "./client";
import type { ApiResponse, AuthResponse, LoginRequest } from "@/types/api";

export async function loginApi(credentials: LoginRequest): Promise<AuthResponse> {
  const response = await apiClient<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });

  if (response.accessToken) {
    setApiAuthToken(response.accessToken);
  }

  return response;
}

export async function refreshApi(): Promise<AuthResponse> {
  const response = await apiClient<AuthResponse>("/api/auth/refresh", {
    method: "POST",
  });

  if (response.accessToken) {
    setApiAuthToken(response.accessToken);
  }

  return response;
}

export async function logoutApi(): Promise<ApiResponse> {
  try {
    const response = await apiClient<ApiResponse>("/api/auth/logout", {
      method: "POST",
    });
    return response;
  } finally {
    setApiAuthToken(null);
  }
}

export async function logoutAllApi(): Promise<ApiResponse> {
  try {
    const response = await apiClient<ApiResponse>("/api/auth/logout-all", {
      method: "POST",
    });
    return response;
  } finally {
    setApiAuthToken(null);
  }
}
