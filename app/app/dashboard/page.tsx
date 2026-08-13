"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { UrlCreator } from "@/components/urls/url-creator";
import { UrlListView } from "@/components/urls/url-list-view";
import { AnalyticsChart } from "@/components/analytics/analytics-chart";
import { getAllUrls, deleteUrl } from "@/lib/api/urls";
import { getDashboardAnalytics, getDashboardClickTimeSeries } from "@/lib/api/analytics";
import { useAuth } from "@/lib/auth/auth-context";
import { formatNumber } from "@/lib/utils/format";
import {
  ArrowRightIcon,
  LinkIcon,
  BarChartIcon,
  CheckCircleIcon,
} from "@/components/ui/icons";
import type { ShortUrlResponse, PageResponse } from "@/types/api";
import type { AnalyticsOverviewResponse, TimeSeriesPoint } from "@/types/analytics";

const TIME_RANGES = [
  { label: "7D", value: "7d" },
  { label: "30D", value: "30d" },
  { label: "90D", value: "90d" },
  { label: "1Y", value: "1y" },
];

export default function AppDashboardPage() {
  const { isAuthenticated, isInitializing } = useAuth();
  const [urls, setUrls] = useState<ShortUrlResponse[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoadingUrls, setIsLoadingUrls] = useState(true);

  // Analytics state
  const [selectedRange, setSelectedRange] = useState("30d");
  const [overview, setOverview] = useState<AnalyticsOverviewResponse | null>(null);
  const [timeSeries, setTimeSeries] = useState<TimeSeriesPoint[]>([]);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(true);

  const loadUrls = useCallback(async () => {
    setIsLoadingUrls(true);
    try {
      const response: PageResponse<ShortUrlResponse> = await getAllUrls(0, 5, "createdAt", "desc");
      setUrls(response.content || []);
      setTotalElements(response.totalElements || 0);
    } catch (e) {
      console.error("Failed to load URLs", e);
    } finally {
      setIsLoadingUrls(false);
    }
  }, []);

  const loadAnalytics = useCallback(async (range: string) => {
    setIsLoadingAnalytics(true);
    try {
      const [overviewData, timeSeriesData] = await Promise.all([
        getDashboardAnalytics(range),
        getDashboardClickTimeSeries(range),
      ]);
      setOverview(overviewData);
      setTimeSeries(timeSeriesData);
    } catch (e) {
      console.error("Failed to load dashboard analytics", e);
    } finally {
      setIsLoadingAnalytics(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;

    if (!isInitializing && isAuthenticated) {
      const fetchUrls = async () => {
        try {
          const response: PageResponse<ShortUrlResponse> = await getAllUrls(0, 5, "createdAt", "desc");
          if (!ignore) {
            setUrls(response.content || []);
            setTotalElements(response.totalElements || 0);
            setIsLoadingUrls(false);
          }
        } catch (e) {
          if (!ignore) {
            console.error("Failed to load URLs", e);
            setIsLoadingUrls(false);
          }
        }
      };

      fetchUrls();
    }

    return () => {
      ignore = true;
    };
  }, [isInitializing, isAuthenticated]);

  useEffect(() => {
    let ignore = false;

    if (!isInitializing && isAuthenticated) {
      const fetchAnalytics = async () => {
        try {
          const [overviewData, timeSeriesData] = await Promise.all([
            getDashboardAnalytics(selectedRange),
            getDashboardClickTimeSeries(selectedRange),
          ]);
          if (!ignore) {
            setOverview(overviewData);
            setTimeSeries(timeSeriesData);
            setIsLoadingAnalytics(false);
          }
        } catch (e) {
          if (!ignore) {
            console.error("Failed to load dashboard analytics", e);
            setIsLoadingAnalytics(false);
          }
        }
      };

      fetchAnalytics();
    }

    return () => {
      ignore = true;
    };
  }, [isInitializing, isAuthenticated, selectedRange]);

  const handleCreated = (newUrl: ShortUrlResponse) => {
    setUrls((prev) => [newUrl, ...prev.slice(0, 4)]);
    setTotalElements((prev) => prev + 1);
    loadAnalytics(selectedRange);
  };

  const handleDelete = async (id: number) => {
    await deleteUrl(id);
    loadUrls();
    loadAnalytics(selectedRange);
  };

  return (
    <AppShell>
      <div className="space-y-8 animate-in fade-in duration-300">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
              Dashboard Overview
            </h1>
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
              Track link performance and manage your shortened URLs in real time.
            </p>
          </div>
        </div>

        {/* 4 Top Metric Cards */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {/* Card 1: Total Links */}
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
                {isLoadingAnalytics ? "..." : formatNumber(overview?.totalLinks || totalElements)}
              </span>
            </div>
          </div>

          {/* Card 2: Total Clicks */}
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
                {isLoadingAnalytics ? "..." : formatNumber(overview?.totalClicks || 0)}
              </span>
            </div>
          </div>

          {/* Card 3: Unique Visitors */}
          <div className="rounded-2xl border border-neutral-200/90 bg-white p-4 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                Unique Visitors
              </span>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                <span className="text-xs font-bold">UV</span>
              </div>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 font-mono">
                {isLoadingAnalytics ? "..." : formatNumber(overview?.uniqueVisitors || 0)}
              </span>
            </div>
          </div>

          {/* Card 4: Active Links */}
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
                {isLoadingAnalytics ? "..." : formatNumber(overview?.activeLinks || 0)}
              </span>
            </div>
          </div>
        </div>

        {/* Primary URL Creation Form */}
        <UrlCreator onCreated={handleCreated} />

        {/* Clicks Overview Chart Section */}
        <div className="rounded-2xl border border-neutral-200/90 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                Clicks Overview
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Aggregated daily engagement across all your short links.
              </p>
            </div>

            {/* Time Range Pills */}
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
            data={timeSeries}
            isLoading={isLoadingAnalytics}
            valueLabel="Clicks"
            height={220}
          />
        </div>

        {/* Recent Links Section */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
              Recent Links
            </h2>
            {totalElements > 5 && (
              <Link
                href="/app/urls"
                className="inline-flex items-center gap-1 text-xs font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors"
              >
                <span>View all ({formatNumber(totalElements)})</span>
                <ArrowRightIcon className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>

          <UrlListView
            urls={urls}
            isLoading={isLoadingUrls}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </AppShell>
  );
}
