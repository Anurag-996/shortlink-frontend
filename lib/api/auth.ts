import { apiClient, setApiAuthToken, executeTokenRefresh } from "./client";
import type {
  ApiResponse,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  EmailRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
} from "@/types/api";

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

export async function registerApi(data: RegisterRequest): Promise<ApiResponse> {
  return await apiClient<ApiResponse>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function verifyEmailApi(token: string): Promise<ApiResponse> {
  return await apiClient<ApiResponse>(`/api/auth/verify-email?token=${encodeURIComponent(token)}`, {
    method: "GET",
  });
}

export async function resendVerificationApi(email: string): Promise<ApiResponse> {
  const payload: EmailRequest = { email };
  return await apiClient<ApiResponse>("/api/auth/resend-verification", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function forgotPasswordApi(email: string): Promise<ApiResponse> {
  const payload: EmailRequest = { email };
  return await apiClient<ApiResponse>("/api/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function resetPasswordApi(data: ResetPasswordRequest): Promise<ApiResponse> {
  return await apiClient<ApiResponse>("/api/auth/reset-password", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function changePasswordApi(data: ChangePasswordRequest): Promise<ApiResponse> {
  return await apiClient<ApiResponse>("/api/auth/change-password", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function getProfileApi() {
  return await apiClient<{ id: number; name: string; email: string; role: string; enabled: boolean }>("/api/auth/me", {
    method: "GET",
  });
}

export async function updateProfileApi(name: string) {
  return await apiClient<{ id: number; name: string; email: string; role: string; enabled: boolean }>("/api/auth/profile", {
    method: "PUT",
    body: JSON.stringify({ name }),
  });
}

export async function requestAccountDeletionApi(): Promise<ApiResponse> {
  try {
    return await apiClient<ApiResponse>("/api/auth/request-deletion", {
      method: "POST",
    });
  } finally {
    setApiAuthToken(null);
  }
}

export async function refreshApi(): Promise<AuthResponse> {
  const token = await executeTokenRefresh();
  if (!token) {
    throw new Error("No active session");
  }
  return {
    accessToken: token,
    tokenType: "Bearer",
    expiresIn: 900,
  };
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

