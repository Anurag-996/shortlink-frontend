import { apiClient } from "./client";
import type {
  CreateShortUrlRequest,
  UpdateUrlRequest,
  ShortUrlResponse,
  PageResponse,
} from "@/types/api";

export async function createShortUrl(
  data: CreateShortUrlRequest
): Promise<ShortUrlResponse> {
  return apiClient<ShortUrlResponse>("/api/v1/urls", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateUrl(
  id: number,
  data: UpdateUrlRequest
): Promise<ShortUrlResponse> {
  return apiClient<ShortUrlResponse>(`/api/v1/urls/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function getAllUrls(
  page: number = 0,
  size: number = 10,
  sortBy: string = "createdAt",
  direction: string = "desc"
): Promise<PageResponse<ShortUrlResponse>> {
  const query = new URLSearchParams({
    page: String(page),
    size: String(size),
    sortBy,
    direction,
  });

  return apiClient<PageResponse<ShortUrlResponse>>(`/api/v1/urls?${query.toString()}`, {
    method: "GET",
  });
}

export async function getUrlDetails(
  shortCode: string
): Promise<ShortUrlResponse> {
  return apiClient<ShortUrlResponse>(`/api/v1/urls/${encodeURIComponent(shortCode)}`, {
    method: "GET",
  });
}

export async function deleteUrl(id: number): Promise<void> {
  return apiClient<void>(`/api/v1/urls/${id}`, {
    method: "DELETE",
  });
}
