"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { AnalyticsChart } from "@/components/analytics/analytics-chart";
import { useAuth } from "@/lib/auth/auth-context";
import {
  getAdminOverview,
  getAdminGrowth,
  getAdminTopLinks,
  getAdminTopUsers,
  getAdminGeography,
  getAdminDevices,
  getAdminActivity,
} from "@/lib/api/analytics";
import { formatNumber, formatDate } from "@/lib/utils/format";
import {
  UsersIcon,
  LinkIcon,
  BarChartIcon,
  CheckCircleIcon,
  GlobeIcon,
  SmartphoneIcon,
  ExternalLinkIcon,
  ClockIcon,
} from "@/components/ui/icons";
import type {
  AdminOverviewResponse,
  AdminGrowthPoint,
  AdminTopLinkResponse,
  AdminTopUserResponse,
  AdminRecentActivityResponse,
  DistributionItem,
} from "@/types/analytics";

const TIME_RANGES = [
  { label: "7D", value: "7d" },
  { label: "30D", value: "30d" },
  { label: "90D", value: "90d" },
  { label: "1Y", value: "1y" },
];

export default function AdminAnalyticsPage() {
  const { user, isInitializing } = useAuth();

  const [selectedRange, setSelectedRange] = useState("30d");
  const [selectedMetric, setSelectedMetric] = useState<"clicks" | "users" | "links">("clicks");

  const [overview, setOverview] = useState<AdminOverviewResponse | null>(null);
  const [growthData, setGrowthData] = useState<AdminGrowthPoint[]>([]);
  const [topLinks, setTopLinks] = useState<AdminTopLinkResponse[]>([]);
  const [topUsers, setTopUsers] = useState<AdminTopUserResponse[]>([]);
  const [geography, setGeography] = useState<DistributionItem[]>([]);
  const [devices, setDevices] = useState<DistributionItem[]>([]);
  const [activity, setActivity] = useState<AdminRecentActivityResponse[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isGrowthLoading, setIsGrowthLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    if (!isInitializing && user?.role === "ADMIN") {
      const fetchData = async () => {
        try {
          const [overviewRes, topLinksRes, topUsersRes, geoRes, devRes, actRes] =
            await Promise.all([
              getAdminOverview(selectedRange),
              getAdminTopLinks(10),
              getAdminTopUsers(10),
              getAdminGeography(selectedRange),
              getAdminDevices(selectedRange),
              getAdminActivity(),
            ]);

          if (!ignore) {
            setOverview(overviewRes);
            setTopLinks(topLinksRes);
            setTopUsers(topUsersRes);
            setGeography(geoRes);
            setDevices(devRes);
            setActivity(actRes);
            setIsLoading(false);
          }
        } catch (e) {
          if (!ignore) {
            console.error("Failed to load admin analytics", e);
            setIsLoading(false);
          }
        }
      };

      fetchData();
    }

    return () => {
      ignore = true;
    };
  }, [isInitializing, user, selectedRange]);

  useEffect(() => {
    let ignore = false;

    if (!isInitializing && user?.role === "ADMIN") {
      const fetchGrowth = async () => {
        try {
          const growth = await getAdminGrowth(selectedRange, selectedMetric);
          if (!ignore) {
            setGrowthData(growth);
            setIsGrowthLoading(false);
          }
        } catch (e) {
          if (!ignore) {
            console.error("Failed to load admin growth data", e);
            setIsGrowthLoading(false);
          }
        }
      };

      fetchGrowth();
    }

    return () => {
      ignore = true;
    };
  }, [isInitializing, user, selectedRange, selectedMetric]);

  // Access check
  if (user && user.role !== "ADMIN") {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-950/60 dark:text-red-400">
            <span className="text-xl font-bold">!</span>
          </div>
          <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
            Access Restricted
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm">
            Platform-wide administrative analytics are only accessible by users with the ADMIN role.
          </p>
          <Link
            href="/app/dashboard"
            className="mt-2 text-xs font-medium text-neutral-900 underline dark:text-neutral-100"
          >
            Back to Dashboard
          </Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-8 animate-in fade-in duration-300">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                Platform Analytics
              </h1>
              <span className="rounded-md bg-neutral-900 px-2 py-0.5 font-mono text-[10px] font-semibold text-white dark:bg-neutral-100 dark:text-neutral-900">
                ADMIN
              </span>
            </div>
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
              Complete platform performance, link velocity, and user activity metrics.
            </p>
          </div>
        </div>

        {/* Primary 4 Metric Cards */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {/* Total Users */}
          <div className="rounded-2xl border border-neutral-200/90 bg-white p-4 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                Total Users
              </span>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                <UsersIcon className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 font-mono">
                {isLoading ? "..." : formatNumber(overview?.totalUsers || 0)}
              </span>
            </div>
          </div>

          {/* Total Links */}
          <div className="rounded-2xl border border-neutral-200/90 bg-white p-4 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                Total Links
              </span>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                <LinkIcon className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 font-mono">
                {isLoading ? "..." : formatNumber(overview?.totalLinks || 0)}
              </span>
            </div>
          </div>

          {/* Total Clicks */}
          <div className="rounded-2xl border border-neutral-200/90 bg-white p-4 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                Total Clicks
              </span>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                <BarChartIcon className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 font-mono">
                {isLoading ? "..." : formatNumber(overview?.totalClicks || 0)}
              </span>
            </div>
          </div>

          {/* Active Links */}
          <div className="rounded-2xl border border-neutral-200/90 bg-white p-4 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                Active Links
              </span>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400">
                <CheckCircleIcon className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 font-mono">
                {isLoading ? "..." : formatNumber(overview?.activeLinks || 0)}
              </span>
            </div>
          </div>
        </div>

        {/* Secondary 3 Metric Cards */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
          <div className="rounded-2xl border border-neutral-200/90 bg-neutral-50/50 p-4 dark:border-neutral-800 dark:bg-neutral-900/40">
            <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              New Users ({selectedRange.toUpperCase()})
            </span>
            <div className="mt-1 text-xl font-bold text-neutral-900 dark:text-neutral-100 font-mono">
              +{isLoading ? "..." : formatNumber(overview?.newUsers || 0)}
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-200/90 bg-neutral-50/50 p-4 dark:border-neutral-800 dark:bg-neutral-900/40">
            <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              New Links ({selectedRange.toUpperCase()})
            </span>
            <div className="mt-1 text-xl font-bold text-neutral-900 dark:text-neutral-100 font-mono">
              +{isLoading ? "..." : formatNumber(overview?.newLinks || 0)}
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-200/90 bg-neutral-50/50 p-4 dark:border-neutral-800 dark:bg-neutral-900/40">
            <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Clicks Today
            </span>
            <div className="mt-1 text-xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">
              {isLoading ? "..." : formatNumber(overview?.clicksToday || 0)}
            </div>
          </div>
        </div>

        {/* Platform Growth Chart Section */}
        <div className="rounded-2xl border border-neutral-200/90 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <h2 className="text-sm font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                Platform Activity
              </h2>

              {/* Metric Selector Dropdown */}
              <select
                value={selectedMetric}
                onChange={(e) =>
                  setSelectedMetric(e.target.value as "clicks" | "users" | "links")
                }
                className="rounded-lg border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-xs font-semibold text-neutral-900 dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-100 cursor-pointer"
              >
                <option value="clicks">Clicks</option>
                <option value="users">New Users</option>
                <option value="links">New Links</option>
              </select>
            </div>

            {/* Timeframe Filter Buttons */}
            <div className="flex items-center rounded-lg border border-neutral-200 bg-neutral-100/80 p-0.5 dark:border-neutral-800 dark:bg-neutral-950 self-start sm:self-auto">
              {TIME_RANGES.map((range) => {
                const isActive = selectedRange === range.value;
                return (
                  <button
                    key={range.value}
                    type="button"
                    onClick={() => setSelectedRange(range.value)}
                    className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer ${
                      isActive
                        ? "bg-white text-neutral-900 shadow-xs dark:bg-neutral-800 dark:text-neutral-100"
                        : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200"
                    }`}
                  >
                    {range.label}
                  </button>
                );
              })}
            </div>
          </div>

          <AnalyticsChart
            data={growthData}
            isLoading={isGrowthLoading}
            valueLabel={
              selectedMetric === "clicks"
                ? "Clicks"
                : selectedMetric === "users"
                ? "New Users"
                : "New Links"
            }
            height={240}
          />
        </div>

        {/* Top Links & Top Users Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Links Leaderboard */}
          <div className="rounded-2xl border border-neutral-200/90 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                Top Performing Links
              </h3>
              <span className="text-xs text-neutral-400">By total clicks</span>
            </div>

            {isLoading ? (
              <div className="space-y-3 py-2 animate-pulse">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-8 rounded bg-neutral-100 dark:bg-neutral-800" />
                ))}
              </div>
            ) : topLinks.length === 0 ? (
              <p className="text-xs text-neutral-500 dark:text-neutral-400 text-center py-4">
                No links created yet.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-neutral-100 text-neutral-400 dark:border-neutral-800/80">
                      <th className="pb-2 font-medium w-8">#</th>
                      <th className="pb-2 font-medium">Link</th>
                      <th className="pb-2 font-medium">Owner</th>
                      <th className="pb-2 font-medium text-right">Clicks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60 font-mono">
                    {topLinks.map((link) => (
                      <tr key={link.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/40">
                        <td className="py-2.5 text-neutral-400 font-semibold">{link.rank}</td>
                        <td className="py-2.5">
                          <Link
                            href={`/app/urls/${link.id}/analytics`}
                            className="font-bold text-neutral-900 hover:underline dark:text-neutral-100 inline-flex items-center gap-1"
                          >
                            <span>/{link.shortCode}</span>
                            <ExternalLinkIcon className="h-3 w-3 opacity-60" />
                          </Link>
                        </td>
                        <td className="py-2.5 text-neutral-500 dark:text-neutral-400 truncate max-w-[140px]">
                          {link.owner}
                        </td>
                        <td className="py-2.5 text-right font-bold text-neutral-900 dark:text-neutral-100">
                          {link.clicks.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Top Users Leaderboard */}
          <div className="rounded-2xl border border-neutral-200/90 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                Top Active Users
              </h3>
              <span className="text-xs text-neutral-400">By link engagement</span>
            </div>

            {isLoading ? (
              <div className="space-y-3 py-2 animate-pulse">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-8 rounded bg-neutral-100 dark:bg-neutral-800" />
                ))}
              </div>
            ) : topUsers.length === 0 ? (
              <p className="text-xs text-neutral-500 dark:text-neutral-400 text-center py-4">
                No active users found.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-neutral-100 text-neutral-400 dark:border-neutral-800/80">
                      <th className="pb-2 font-medium w-8">#</th>
                      <th className="pb-2 font-medium">User</th>
                      <th className="pb-2 font-medium text-center">Links</th>
                      <th className="pb-2 font-medium text-right">Clicks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60 font-mono">
                    {topUsers.map((userStat) => (
                      <tr key={userStat.userId} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/40">
                        <td className="py-2.5 text-neutral-400 font-semibold">{userStat.rank}</td>
                        <td className="py-2.5 truncate max-w-[160px] font-sans">
                          <p className="font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                            {userStat.name}
                          </p>
                          <p className="text-[11px] text-neutral-400 truncate">{userStat.email}</p>
                        </td>
                        <td className="py-2.5 text-center text-neutral-600 dark:text-neutral-400">
                          {userStat.links}
                        </td>
                        <td className="py-2.5 text-right font-bold text-neutral-900 dark:text-neutral-100">
                          {userStat.totalClicks.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Geographic & Device Distribution Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Visitor Countries */}
          <div className="rounded-2xl border border-neutral-200/90 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 space-y-4">
            <div className="flex items-center gap-2">
              <GlobeIcon className="h-4 w-4 text-neutral-500" />
              <h3 className="text-sm font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                Visitor Countries
              </h3>
            </div>

            {isLoading ? (
              <div className="space-y-3 py-2 animate-pulse">
                <div className="h-4 rounded bg-neutral-100 dark:bg-neutral-800" />
                <div className="h-4 rounded bg-neutral-100 dark:bg-neutral-800" />
              </div>
            ) : geography.length === 0 ? (
              <p className="text-xs text-neutral-400 text-center py-4">
                No location data available yet.
              </p>
            ) : (
              <div className="space-y-3">
                {geography.slice(0, 6).map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-neutral-800 dark:text-neutral-200">
                        {item.label}
                      </span>
                      <span className="font-mono text-[11px] text-neutral-500">
                        {item.count.toLocaleString()} ({item.percentage}%)
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-neutral-900 dark:bg-neutral-100"
                        style={{ width: `${Math.min(100, Math.max(2, item.percentage))}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Device Overview */}
          <div className="rounded-2xl border border-neutral-200/90 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 space-y-4">
            <div className="flex items-center gap-2">
              <SmartphoneIcon className="h-4 w-4 text-neutral-500" />
              <h3 className="text-sm font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                Device Overview
              </h3>
            </div>

            {isLoading ? (
              <div className="space-y-3 py-2 animate-pulse">
                <div className="h-4 rounded bg-neutral-100 dark:bg-neutral-800" />
                <div className="h-4 rounded bg-neutral-100 dark:bg-neutral-800" />
              </div>
            ) : devices.length === 0 ? (
              <p className="text-xs text-neutral-400 text-center py-4">
                No device data recorded.
              </p>
            ) : (
              <div className="space-y-3">
                {devices.slice(0, 4).map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-neutral-800 dark:text-neutral-200">
                        {item.label}
                      </span>
                      <span className="font-mono text-[11px] text-neutral-500">
                        {item.count.toLocaleString()} ({item.percentage}%)
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-neutral-900 dark:bg-neutral-100"
                        style={{ width: `${Math.min(100, Math.max(2, item.percentage))}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="rounded-2xl border border-neutral-200/90 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 space-y-4">
          <div className="flex items-center gap-2">
            <ClockIcon className="h-4 w-4 text-neutral-500" />
            <h3 className="text-sm font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
              Recent Platform Activity
            </h3>
          </div>

          {isLoading ? (
            <div className="space-y-3 py-2 animate-pulse">
              <div className="h-8 rounded bg-neutral-100 dark:bg-neutral-800" />
              <div className="h-8 rounded bg-neutral-100 dark:bg-neutral-800" />
            </div>
          ) : activity.length === 0 ? (
            <p className="text-xs text-neutral-400 text-center py-4">
              No recent platform activity.
            </p>
          ) : (
            <div className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
              {activity.map((act) => (
                <div key={act.id} className="flex items-start justify-between py-3 gap-3">
                  <div className="space-y-0.5">
                    <p className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                      {act.title}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      {act.description}
                    </p>
                  </div>
                  <span className="text-[11px] font-mono text-neutral-400 shrink-0">
                    {act.timestamp ? formatDate(act.timestamp) : ""}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
