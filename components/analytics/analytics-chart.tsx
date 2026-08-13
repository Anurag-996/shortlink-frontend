"use client";

import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUpIcon, TrendingDownIcon, SparklesIcon } from "@/components/ui/icons";
import type { TimeSeriesPoint } from "@/types/analytics";

interface AnalyticsChartProps {
  data: TimeSeriesPoint[];
  height?: number;
  isLoading?: boolean;
  valueLabel?: string;
  showTrendBadge?: boolean;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; payload: TimeSeriesPoint }>;
  label?: string;
  valueLabel: string;
  strokeColor: string;
}

function CustomTooltip({ active, payload, label, valueLabel, strokeColor }: CustomTooltipProps) {
  if (active && payload && payload.length > 0) {
    const value = payload[0].value;
    return (
      <div className="rounded-xl border border-neutral-200/90 bg-white/95 px-3.5 py-2.5 shadow-lg backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-900/95 animate-in fade-in zoom-in-95 duration-150">
        <p className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400">
          {label}
        </p>
        <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5 mt-0.5">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: strokeColor }} />
          <span className="font-mono">{value.toLocaleString()}</span>
          <span className="text-xs font-normal text-neutral-500 dark:text-neutral-400">
            {valueLabel.toLowerCase()}
          </span>
        </p>
      </div>
    );
  }
  return null;
}

export function AnalyticsChart({
  data,
  height = 240,
  isLoading = false,
  valueLabel = "Clicks",
  showTrendBadge = true,
}: AnalyticsChartProps) {
  // Compute trend metrics (growth vs decline)
  const { total, peak, growthRate, isGrowing, isDeclining, strokeColor, gradientId } =
    useMemo(() => {
      if (!data || data.length === 0) {
        return {
          total: 0,
          peak: 0,
          growthRate: 0,
          isGrowing: false,
          isDeclining: false,
          strokeColor: "#10B981",
          gradientId: "growthGradient",
        };
      }

      let sum = 0;
      let max = 0;
      data.forEach((d) => {
        sum += d.value;
        if (d.value > max) max = d.value;
      });

      const half = Math.floor(data.length / 2);
      const firstHalf = data.slice(0, half || 1);
      const secondHalf = data.slice(half || 1);

      const firstSum = firstHalf.reduce((acc, d) => acc + d.value, 0);
      const secondSum = secondHalf.reduce((acc, d) => acc + d.value, 0);

      let rate = 0;
      if (firstSum > 0) {
        rate = ((secondSum - firstSum) / firstSum) * 100;
      } else if (secondSum > 0) {
        rate = 100;
      } else if (firstSum > 0 && secondSum === 0) {
        rate = -100;
      }

      const growing = rate > 0;
      const declining = rate < 0;

      // Vivid Emerald for Growth, Bold Crimson Red for Decline, Modern Indigo for Flat/Neutral
      const color = growing ? "#10B981" : declining ? "#EF4444" : "#6366F1";
      const gId = growing
        ? "growthGradient"
        : declining
        ? "declineGradient"
        : "neutralGradient";

      return {
        total: sum,
        peak: max,
        growthRate: Math.round(rate * 10) / 10,
        isGrowing: growing,
        isDeclining: declining,
        strokeColor: color,
        gradientId: gId,
      };
    }, [data]);

  if (isLoading) {
    return (
      <div
        style={{ height }}
        className="flex w-full items-center justify-center rounded-xl border border-neutral-200/80 bg-neutral-50/50 dark:border-neutral-800 dark:bg-neutral-900/30 animate-pulse"
      >
        <div className="flex flex-col items-center gap-2">
          <div className="h-4 w-28 rounded bg-neutral-200 dark:bg-neutral-800" />
          <div className="h-3 w-40 rounded bg-neutral-200/60 dark:bg-neutral-800/60" />
        </div>
      </div>
    );
  }

  const hasData = data && data.length > 0 && data.some((d) => d.value > 0);

  if (!hasData) {
    return (
      <div
        style={{ height }}
        className="flex w-full flex-col items-center justify-center rounded-xl border border-dashed border-neutral-200 bg-neutral-50/30 p-6 text-center dark:border-neutral-800 dark:bg-neutral-950/20"
      >
        <p className="text-xs font-medium text-neutral-600 dark:text-neutral-300">
          No click data recorded for this period
        </p>
        <p className="mt-1 text-[11px] text-neutral-400 dark:text-neutral-500">
          Share your short link to start capturing analytics.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Trend Summary Header */}
      {showTrendBadge && (
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            {isGrowing ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400 border border-emerald-500/20">
                <TrendingUpIcon className="h-3.5 w-3.5" />
                +{growthRate}% Growth
              </span>
            ) : isDeclining ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2.5 py-0.5 text-xs font-semibold text-red-600 dark:bg-red-500/15 dark:text-red-400 border border-red-500/20">
                <TrendingDownIcon className="h-3.5 w-3.5" />
                {growthRate}% Decline
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-xs font-semibold text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400 border border-indigo-500/20">
                <SparklesIcon className="h-3 w-3" />
                Steady Activity
              </span>
            )}

            <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
              {isGrowing
                ? "Activity is accelerating"
                : isDeclining
                ? "Activity is declining"
                : "Activity is consistent"}
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-neutral-500 dark:text-neutral-400 font-mono">
            <span>
              Total: <strong className="text-neutral-900 dark:text-neutral-100">{total.toLocaleString()}</strong>
            </span>
            <span>•</span>
            <span>
              Peak: <strong className="text-neutral-900 dark:text-neutral-100">{peak.toLocaleString()}</strong>
            </span>
          </div>
        </div>
      )}

      {/* Chart Canvas */}
      <div style={{ width: "100%", height }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              {/* Vibrant Emerald Growth Gradient */}
              <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
              </linearGradient>

              {/* Bold Red Decline Gradient */}
              <linearGradient id="declineGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#EF4444" stopOpacity={0.0} />
              </linearGradient>

              {/* Indigo Neutral Gradient */}
              <linearGradient id="neutralGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="4 4"
              vertical={false}
              stroke="#E4E4E7"
              className="dark:stroke-neutral-800/80"
            />

            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              stroke="#A1A1AA"
              fontSize={11}
              tickMargin={8}
              minTickGap={24}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              stroke="#A1A1AA"
              fontSize={11}
              allowDecimals={false}
            />

            <Tooltip
              content={<CustomTooltip valueLabel={valueLabel} strokeColor={strokeColor} />}
              cursor={{
                stroke: strokeColor,
                strokeWidth: 1,
                strokeDasharray: "4 4",
                strokeOpacity: 0.6,
              }}
            />

            <Area
              type="monotone"
              dataKey="value"
              stroke={strokeColor}
              strokeWidth={2.5}
              fillOpacity={1}
              fill={`url(#${gradientId})`}
              activeDot={{
                r: 5,
                stroke: strokeColor,
                strokeWidth: 2,
                fill: "#FFFFFF",
                className: "dark:fill-neutral-900",
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
