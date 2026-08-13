import { apiClient } from "@/lib/api/client";
import type {
  AnalyticsOverviewResponse,
  TimeSeriesPoint,
  DistributionItem,
  LinkAnalyticsResponse,
  AdminOverviewResponse,
  AdminGrowthPoint,
  AdminTopLinkResponse,
  AdminTopUserResponse,
  AdminRecentActivityResponse,
} from "@/types/analytics";

// --- User Dashboard Analytics ---

export async function getDashboardAnalytics(range = "30d"): Promise<AnalyticsOverviewResponse> {
  return apiClient<AnalyticsOverviewResponse>(`/api/analytics/overview?range=${encodeURIComponent(range)}`, {
    method: "GET",
  });
}

export async function getDashboardClickTimeSeries(range = "30d"): Promise<TimeSeriesPoint[]> {
  return apiClient<TimeSeriesPoint[]>(`/api/analytics/clicks?range=${encodeURIComponent(range)}`, {
    method: "GET",
  });
}

// --- Individual Link Analytics ---

export async function getLinkAnalytics(
  id: number | string,
  range = "30d"
): Promise<LinkAnalyticsResponse> {
  return apiClient<LinkAnalyticsResponse>(
    `/api/analytics/urls/${encodeURIComponent(id)}?range=${encodeURIComponent(range)}`,
    {
      method: "GET",
    }
  );
}

export async function getLinkClickTimeSeries(
  id: number | string,
  range = "30d"
): Promise<TimeSeriesPoint[]> {
  return apiClient<TimeSeriesPoint[]>(
    `/api/analytics/urls/${encodeURIComponent(id)}/clicks?range=${encodeURIComponent(range)}`,
    {
      method: "GET",
    }
  );
}

export async function getLinkGeography(
  id: number | string,
  range = "30d"
): Promise<DistributionItem[]> {
  return apiClient<DistributionItem[]>(
    `/api/analytics/urls/${encodeURIComponent(id)}/geography?range=${encodeURIComponent(range)}`,
    {
      method: "GET",
    }
  );
}

export async function getLinkDevices(
  id: number | string,
  range = "30d"
): Promise<DistributionItem[]> {
  return apiClient<DistributionItem[]>(
    `/api/analytics/urls/${encodeURIComponent(id)}/devices?range=${encodeURIComponent(range)}`,
    {
      method: "GET",
    }
  );
}

export async function getLinkBrowsers(
  id: number | string,
  range = "30d"
): Promise<DistributionItem[]> {
  return apiClient<DistributionItem[]>(
    `/api/analytics/urls/${encodeURIComponent(id)}/browsers?range=${encodeURIComponent(range)}`,
    {
      method: "GET",
    }
  );
}

export async function getLinkReferrers(
  id: number | string,
  range = "30d"
): Promise<DistributionItem[]> {
  return apiClient<DistributionItem[]>(
    `/api/analytics/urls/${encodeURIComponent(id)}/referrers?range=${encodeURIComponent(range)}`,
    {
      method: "GET",
    }
  );
}

// --- Platform Admin Analytics ---

export async function getAdminOverview(range = "30d"): Promise<AdminOverviewResponse> {
  return apiClient<AdminOverviewResponse>(`/api/admin/analytics/overview?range=${encodeURIComponent(range)}`, {
    method: "GET",
  });
}

export async function getAdminGrowth(
  range = "30d",
  metric: "clicks" | "users" | "links" = "clicks"
): Promise<AdminGrowthPoint[]> {
  return apiClient<AdminGrowthPoint[]>(
    `/api/admin/analytics/growth?range=${encodeURIComponent(range)}&metric=${encodeURIComponent(metric)}`,
    {
      method: "GET",
    }
  );
}

export async function getAdminTopLinks(limit = 10): Promise<AdminTopLinkResponse[]> {
  return apiClient<AdminTopLinkResponse[]>(`/api/admin/analytics/top-links?limit=${limit}`, {
    method: "GET",
  });
}

export async function getAdminTopUsers(limit = 10): Promise<AdminTopUserResponse[]> {
  return apiClient<AdminTopUserResponse[]>(`/api/admin/analytics/top-users?limit=${limit}`, {
    method: "GET",
  });
}

export async function getAdminGeography(range = "30d"): Promise<DistributionItem[]> {
  return apiClient<DistributionItem[]>(`/api/admin/analytics/geography?range=${encodeURIComponent(range)}`, {
    method: "GET",
  });
}

export async function getAdminDevices(range = "30d"): Promise<DistributionItem[]> {
  return apiClient<DistributionItem[]>(`/api/admin/analytics/devices?range=${encodeURIComponent(range)}`, {
    method: "GET",
  });
}

export async function getAdminActivity(): Promise<AdminRecentActivityResponse[]> {
  return apiClient<AdminRecentActivityResponse[]>("/api/admin/analytics/activity", {
    method: "GET",
  });
}
