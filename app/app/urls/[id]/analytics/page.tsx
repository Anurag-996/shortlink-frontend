"use client";

import { useEffect, useState, useCallback, use } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { AnalyticsChart } from "@/components/analytics/analytics-chart";
import { getLinkAnalytics } from "@/lib/api/analytics";
import { useAuth } from "@/lib/auth/auth-context";
import { formatNumber, formatDate, formatPublicShortUrl, truncateUrl } from "@/lib/utils/format";
import { useToast } from "@/components/ui/toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeftIcon,
  CopyIcon,
  CheckIcon,
  ExternalLinkIcon,
  BarChartIcon,
  ClockIcon,
  GlobeIcon,
  SmartphoneIcon,
  CompassIcon,
  MonitorIcon,
  SparklesIcon,
} from "@/components/ui/icons";
import type { LinkAnalyticsResponse, DistributionItem } from "@/types/analytics";

const TIME_RANGES = [
  { label: "24H", value: "24h" },
  { label: "7D", value: "7d" },
  { label: "30D", value: "30d" },
  { label: "90D", value: "90d" },
  { label: "1Y", value: "1y" },
  { label: "All", value: "all" },
];

export default function LinkAnalyticsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const urlId = resolvedParams.id;
  const { isAuthenticated, isInitializing } = useAuth();
  const { success, error: toastError } = useToast();

  const [selectedRange, setSelectedRange] = useState("30d");
  const [data, setData] = useState<LinkAnalyticsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const fetchAnalytics = useCallback(
    async (range: string) => {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const response = await getLinkAnalytics(urlId, range);
        setData(response);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Unable to load analytics right now.";
        setErrorMessage(msg);
        toastError(msg);
      } finally {
        setIsLoading(false);
      }
    },
    [urlId, toastError]
  );

  useEffect(() => {
    let ignore = false;

    if (!isInitializing && isAuthenticated) {
      const load = async () => {
        try {
          const response = await getLinkAnalytics(urlId, selectedRange);
          if (!ignore) {
            setData(response);
            setErrorMessage(null);
            setIsLoading(false);
          }
        } catch (err: unknown) {
          if (!ignore) {
            const msg = err instanceof Error ? err.message : "Unable to load analytics right now.";
            setErrorMessage(msg);
            toastError(msg);
            setIsLoading(false);
          }
        }
      };

      load();
    }

    return () => {
      ignore = true;
    };
  }, [isInitializing, isAuthenticated, urlId, selectedRange, toastError]);

  const handleCopy = () => {
    if (!data?.shortCode) return;
    const fullUrl = formatPublicShortUrl(data.shortCode);
    navigator.clipboard.writeText(fullUrl);
    setIsCopied(true);
    success("Short link copied to clipboard");
    setTimeout(() => setIsCopied(false), 2000);
  };

  if (errorMessage && !isLoading && !data) {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-950/60 dark:text-red-400">
            <BarChartIcon className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
              Unable to load analytics
            </h2>
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400 max-w-sm">
              {errorMessage}
            </p>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <Link href="/app/urls">
              <Button variant="outline" size="sm" className="text-xs">
                Back to Links
              </Button>
            </Link>
            <Button
              variant="primary"
              size="sm"
              className="text-xs"
              onClick={() => fetchAnalytics(selectedRange)}
            >
              Retry
            </Button>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-8 animate-in fade-in duration-300">
        {/* Navigation & Header */}
        <div className="space-y-4">
          <Link
            href="/app/urls"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors"
          >
            <ArrowLeftIcon className="h-3.5 w-3.5" />
            <span>Back to Links</span>
          </Link>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-neutral-200/90 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
            <div className="space-y-1.5 min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="font-mono text-lg font-bold text-neutral-900 dark:text-neutral-100">
                  /{data?.shortCode || "..."}
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1 rounded-md border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-xs font-medium text-neutral-700 hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
                >
                  {isCopied ? (
                    <>
                      <CheckIcon className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <CopyIcon className="h-3 w-3" />
                      <span>Copy link</span>
                    </>
                  )}
                </button>
                <Badge variant={data?.status === "Active" ? "default" : "danger"} size="sm">
                  {data?.status || "Active"}
                </Badge>
              </div>

              <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 truncate max-w-xl">
                <span>Destination:</span>
                <a
                  href={data?.originalUrl || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="truncate hover:underline text-neutral-700 dark:text-neutral-300 inline-flex items-center gap-1"
                >
                  <span>{data ? truncateUrl(data.originalUrl, 48) : "Loading destination..."}</span>
                  <ExternalLinkIcon className="h-3 w-3 shrink-0" />
                </a>
              </div>
            </div>

            <div className="text-xs text-neutral-400 dark:text-neutral-500 shrink-0 self-start md:self-auto">
              Created {data?.createdAt ? formatDate(data.createdAt) : "..."}
            </div>
          </div>
        </div>

        {/* 3 Top Metric Cards */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
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
                {isLoading ? "..." : formatNumber(data?.totalClicks || 0)}
              </span>
            </div>
          </div>

          {/* Unique Visitors */}
          <div className="rounded-2xl border border-neutral-200/90 bg-white p-4 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                Unique Visitors
              </span>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                <span className="text-xs font-bold font-mono">UV</span>
              </div>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 font-mono">
                {isLoading ? "..." : formatNumber(data?.uniqueVisitors || 0)}
              </span>
            </div>
          </div>

          {/* Average / Day */}
          <div className="rounded-2xl border border-neutral-200/90 bg-white p-4 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                Average / Day
              </span>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400">
                <ClockIcon className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 font-mono">
                {isLoading ? "..." : (data?.avgClicksPerDay ?? 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Primary Click Chart Section */}
        <div className="rounded-2xl border border-neutral-200/90 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                Clicks Over Time
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Click velocity and visitor trends for this link.
              </p>
            </div>

            {/* Range Filters */}
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
            data={data?.timeSeries || []}
            isLoading={isLoading}
            valueLabel="Clicks"
            height={240}
          />
        </div>

        {/* Smart Automated Insights */}
        {data?.insights && data.insights.length > 0 && (
          <div className="rounded-2xl border border-neutral-200/90 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 space-y-3">
            <div className="flex items-center gap-2">
              <SparklesIcon className="h-4 w-4 text-amber-500" />
              <h3 className="text-sm font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
                Smart Insights
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {data.insights.map((insight, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 rounded-xl border border-neutral-100 bg-neutral-50/70 p-3 text-xs text-neutral-700 dark:border-neutral-800/80 dark:bg-neutral-950/40 dark:text-neutral-300"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-neutral-900 dark:bg-neutral-100 mt-1.5 shrink-0" />
                  <span className="leading-relaxed">{insight.message}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2-Column Breakdown Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Traffic Sources */}
          <DistributionCard
            title="Traffic Sources"
            icon={<CompassIcon className="h-4 w-4" />}
            items={data?.referrers || []}
            emptyMessage="No traffic source data available yet."
            isLoading={isLoading}
          />

          {/* Device Types */}
          <DistributionCard
            title="Device Types"
            icon={<SmartphoneIcon className="h-4 w-4" />}
            items={data?.devices || []}
            emptyMessage="No device data available yet."
            isLoading={isLoading}
          />

          {/* Top Countries */}
          <DistributionCard
            title="Top Countries"
            icon={<GlobeIcon className="h-4 w-4" />}
            items={data?.topCountries || []}
            emptyMessage="No location data available yet."
            isLoading={isLoading}
          />

          {/* Browsers */}
          <DistributionCard
            title="Browsers"
            icon={<MonitorIcon className="h-4 w-4" />}
            items={data?.browsers || []}
            emptyMessage="No browser data available yet."
            isLoading={isLoading}
          />

          {/* Operating Systems */}
          <DistributionCard
            title="Operating Systems"
            icon={<MonitorIcon className="h-4 w-4" />}
            items={data?.operatingSystems || []}
            emptyMessage="No operating system data available yet."
            isLoading={isLoading}
          />

          {/* Top Cities */}
          <DistributionCard
            title="Top Cities"
            icon={<GlobeIcon className="h-4 w-4" />}
            items={data?.topCities || []}
            emptyMessage="No city location data recorded."
            isLoading={isLoading}
          />
        </div>
      </div>
    </AppShell>
  );
}

function DistributionCard({
  title,
  icon,
  items,
  emptyMessage,
  isLoading,
}: {
  title: string;
  icon: React.ReactNode;
  items: DistributionItem[];
  emptyMessage: string;
  isLoading: boolean;
}) {
  return (
    <div className="rounded-2xl border border-neutral-200/90 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 space-y-4">
      <div className="flex items-center gap-2 text-neutral-900 dark:text-neutral-100">
        <span className="text-neutral-500 dark:text-neutral-400">{icon}</span>
        <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
      </div>

      {isLoading ? (
        <div className="space-y-3 animate-pulse py-2">
          <div className="h-4 w-full rounded bg-neutral-100 dark:bg-neutral-800" />
          <div className="h-4 w-3/4 rounded bg-neutral-100 dark:bg-neutral-800" />
          <div className="h-4 w-1/2 rounded bg-neutral-100 dark:bg-neutral-800" />
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-neutral-200 bg-neutral-50/40 p-4 text-center text-xs text-neutral-500 dark:border-neutral-800 dark:bg-neutral-950/20 dark:text-neutral-400">
          {emptyMessage}
        </div>
      ) : (
        <div className="space-y-3">
          {items.slice(0, 6).map((item, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-neutral-800 dark:text-neutral-200 truncate max-w-[180px]">
                  {item.label}
                </span>
                <div className="flex items-center gap-2 font-mono text-[11px] text-neutral-500 dark:text-neutral-400 shrink-0">
                  <span>{item.count.toLocaleString()}</span>
                  <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                    {item.percentage}%
                  </span>
                </div>
              </div>
              {/* Progress bar */}
              <div className="h-1.5 w-full rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-neutral-900 dark:bg-neutral-100 transition-all duration-300"
                  style={{ width: `${Math.min(100, Math.max(2, item.percentage))}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
