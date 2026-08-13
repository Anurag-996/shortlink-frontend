export interface AdminUserResponse {
  id: number;
  name: string | null;
  email: string;
  role: "USER" | "ADMIN";
  enabled: boolean;
  deletionPending: boolean;
  createdAt: string;
  totalLinks: number;
  totalClicks: number;
}

export interface AdminUserStatsResponse {
  totalUsers: number;
  activeUsers: number;
  disabledUsers: number;
  adminUsers: number;
  deletionPendingUsers: number;
}
