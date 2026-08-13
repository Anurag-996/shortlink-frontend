import { apiClient } from "./client";
import type { PageResponse, ApiResponse } from "@/types/api";
import type { AdminUserResponse, AdminUserStatsResponse } from "@/types/admin-user";

export async function getAdminUsers(
  page: number = 0,
  size: number = 10,
  search?: string,
  sortBy: string = "createdAt",
  direction: string = "desc"
): Promise<PageResponse<AdminUserResponse>> {
  const query = new URLSearchParams({
    page: String(page),
    size: String(size),
    sortBy,
    direction,
  });
  if (search && search.trim()) {
    query.set("search", search.trim());
  }

  return apiClient<PageResponse<AdminUserResponse>>(`/api/admin/users?${query.toString()}`, {
    method: "GET",
  });
}

export async function getAdminUserStats(): Promise<AdminUserStatsResponse> {
  return apiClient<AdminUserStatsResponse>("/api/admin/users/stats", {
    method: "GET",
  });
}

export async function updateAdminUserStatus(
  userId: number,
  enabled: boolean
): Promise<AdminUserResponse> {
  return apiClient<AdminUserResponse>(`/api/admin/users/${userId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ enabled }),
  });
}

export async function updateAdminUserRole(
  userId: number,
  role: "USER" | "ADMIN"
): Promise<AdminUserResponse> {
  return apiClient<AdminUserResponse>(`/api/admin/users/${userId}/role`, {
    method: "PATCH",
    body: JSON.stringify({ role }),
  });
}

export async function deleteAdminUser(userId: number): Promise<ApiResponse> {
  return apiClient<ApiResponse>(`/api/admin/users/${userId}`, {
    method: "DELETE",
  });
}
