"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { UrlCreator } from "@/components/urls/url-creator";
import { UrlListView } from "@/components/urls/url-list-view";
import { getAllUrls, deleteUrl } from "@/lib/api/urls";
import { formatNumber } from "@/lib/utils/format";
import { ArrowRightIcon, LinkIcon, BarChartIcon } from "@/components/ui/icons";
import type { ShortUrlResponse, PageResponse } from "@/types/api";

export default function DashboardPage() {
  const [urls, setUrls] = useState<ShortUrlResponse[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Fetch latest 5 links for dashboard overview
      const response: PageResponse<ShortUrlResponse> = await getAllUrls(0, 5, "createdAt", "desc");
      setUrls(response.content || []);
      setTotalElements(response.totalElements || 0);
    } catch (e) {
      console.error("Failed to load URLs", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const response = await getAllUrls(0, 5, "createdAt", "desc");
        if (isMounted) {
          setUrls(response.content || []);
          setTotalElements(response.totalElements || 0);
        }
      } catch (e) {
        console.error("Failed to load URLs", e);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleCreated = (newUrl: ShortUrlResponse) => {
    setUrls((prev) => [newUrl, ...prev.slice(0, 4)]);
    setTotalElements((prev) => prev + 1);
  };

  const handleDelete = async (id: number) => {
    await deleteUrl(id);
    loadData();
  };

  const totalClicks = urls.reduce((sum, u) => sum + (u.clickCount || 0), 0);

  return (
    <AppShell>
      <div className="space-y-8 animate-in fade-in duration-300">
        {/* Top Header & Greeting */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
              Shorten a URL
            </h1>
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
              Transform long destinations into fast, trackable short links.
            </p>
          </div>

          {/* Quick Metrics */}
          {!isLoading && totalElements > 0 && (
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-400">
                <LinkIcon className="h-3.5 w-3.5 text-neutral-400" />
                <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                  {formatNumber(totalElements)}
                </span>
                <span>{totalElements === 1 ? "link" : "links"}</span>
              </div>
              <span className="text-neutral-300 dark:text-neutral-700">•</span>
              <div className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-400">
                <BarChartIcon className="h-3.5 w-3.5 text-neutral-400" />
                <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                  {formatNumber(totalClicks)}
                </span>
                <span>clicks in view</span>
              </div>
            </div>
          )}
        </div>

        {/* Primary URL Creation Section */}
        <UrlCreator onCreated={handleCreated} />

        {/* Recent Links Section */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
              Recent Links
            </h2>
            {totalElements > 5 && (
              <Link
                href="/urls"
                className="inline-flex items-center gap-1 text-xs font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors"
              >
                <span>View all ({formatNumber(totalElements)})</span>
                <ArrowRightIcon className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>

          <UrlListView
            urls={urls}
            isLoading={isLoading}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </AppShell>
  );
}
