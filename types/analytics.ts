export interface AnalyticsOverviewResponse {
  totalLinks: number;
  totalClicks: number;
  uniqueVisitors: number;
  activeLinks: number;
}

export interface TimeSeriesPoint {
  date: string;
  value: number;
}

export interface DistributionItem {
  label: string;
  count: number;
  percentage: number;
}

export interface TimeOfDayDistribution {
  hour: string;
  count: number;
  percentage: number;
}

export interface DayOfWeekDistribution {
  day: string;
  count: number;
  percentage: number;
}

export interface InsightItem {
  type: "trend" | "device" | "location" | "source" | "info" | string;
  message: string;
}

export interface LinkAnalyticsResponse {
  id: number;
  shortCode: string;
  originalUrl: string;
  createdAt: string;
  expiresAt: string | null;
  status: "Active" | "Expired" | string;

  totalClicks: number;
  uniqueVisitors: number;
  avgClicksPerDay: number;

  timeSeries: TimeSeriesPoint[];
  topCountries: DistributionItem[];
  topCities: DistributionItem[];
  devices: DistributionItem[];
  browsers: DistributionItem[];
  operatingSystems: DistributionItem[];
  referrers: DistributionItem[];
  hourlyDistribution: TimeOfDayDistribution[];
  dayOfWeekDistribution: DayOfWeekDistribution[];
  insights: InsightItem[];
}

export interface AdminOverviewResponse {
  totalUsers: number;
  totalLinks: number;
  totalClicks: number;
  activeLinks: number;
  newUsers: number;
  newLinks: number;
  clicksToday: number;
}

export interface AdminGrowthPoint {
  date: string;
  value: number;
}

export interface AdminTopLinkResponse {
  rank: number;
  id: number;
  shortCode: string;
  originalUrl: string;
  clicks: number;
  owner: string;
  createdAt: string;
  status: string;
}

export interface AdminTopUserResponse {
  rank: number;
  userId: number;
  name: string;
  email: string;
  links: number;
  totalClicks: number;
}

export interface AdminRecentActivityResponse {
  id: string;
  type: "USER_REGISTERED" | "URL_CREATED" | "URL_MILESTONE" | "USER_VERIFIED" | "ACCOUNT_DELETION" | string;
  title: string;
  description: string;
  timestamp: string;
}
