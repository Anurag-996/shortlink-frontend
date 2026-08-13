"use client";

import { useEffect, useState, useCallback } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { UrlListView, SortField, SortDirection } from "@/components/urls/url-list-view";
import { UrlCreator } from "@/components/urls/url-creator";
import { getAllUrls, deleteUrl } from "@/lib/api/urls";
import { useAuth } from "@/lib/auth/auth-context";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@/components/ui/icons";
import type { ShortUrlResponse, PageResponse } from "@/types/api";

export default function AppUrlsPage() {
  const { isAuthenticated, isInitializing } = useAuth();
  const [urls, setUrls] = useState<ShortUrlResponse[]>([]);
  const [pagination, setPagination] = useState<{
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
  }>({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
  });
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [isLoading, setIsLoading] = useState(true);
  const [showCreator, setShowCreator] = useState(false);

  const fetchData = useCallback(
    async (
      page: number = pagination.page,
      size: number = pagination.size,
      sort: SortField = sortField,
      dir: SortDirection = sortDirection
    ) => {
      setIsLoading(true);
      try {
        const response: PageResponse<ShortUrlResponse> = await getAllUrls(
          page,
          size,
          sort,
          dir
        );
        setUrls(response.content || []);
        setPagination({
          page: response.page,
          size: response.size,
          totalElements: response.totalElements,
          totalPages: response.totalPages,
        });
      } catch (e) {
        console.error("Failed to load URLs", e);
      } finally {
        setIsLoading(false);
      }
    },
    [pagination.page, pagination.size, sortField, sortDirection]
  );

  useEffect(() => {
    let ignore = false;

    if (!isInitializing && isAuthenticated) {
      const load = async () => {
        try {
          const response: PageResponse<ShortUrlResponse> = await getAllUrls(0, 10, "createdAt", "desc");
          if (!ignore) {
            setUrls(response.content || []);
            setPagination({
              page: response.page,
              size: response.size,
              totalElements: response.totalElements,
              totalPages: response.totalPages,
            });
            setIsLoading(false);
          }
        } catch (e) {
          if (!ignore) {
            console.error("Failed to load URLs", e);
            setIsLoading(false);
          }
        }
      };

      load();
    }

    return () => {
      ignore = true;
    };
  }, [isInitializing, isAuthenticated]);

  const handlePageChange = (newPage: number) => {
    fetchData(newPage, pagination.size, sortField, sortDirection);
  };

  const handlePageSizeChange = (newSize: number) => {
    fetchData(0, newSize, sortField, sortDirection);
  };

  const handleSortChange = (field: SortField, dir: SortDirection) => {
    setSortField(field);
    setSortDirection(dir);
    fetchData(0, pagination.size, field, dir);
  };

  const handleCreated = () => {
    setShowCreator(false);
    fetchData(0, pagination.size, "createdAt", "desc");
  };

  const handleDelete = async (id: number) => {
    await deleteUrl(id);
    fetchData(pagination.page, pagination.size, sortField, sortDirection);
  };

  return (
    <AppShell>
      <div className="space-y-6 animate-in fade-in duration-300">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
              Links
            </h1>
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
              Manage, search, and monitor all your active short links with fast server-side pagination.
            </p>
          </div>

          <Button
            variant={showCreator ? "secondary" : "primary"}
            size="sm"
            onClick={() => setShowCreator(!showCreator)}
            leftIcon={<PlusIcon className="h-3.5 w-3.5" />}
          >
            {showCreator ? "Close Creator" : "New Link"}
          </Button>
        </div>

        {/* Optional Collapsible Creator */}
        {showCreator && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-200">
            <UrlCreator onCreated={handleCreated} />
          </div>
        )}

        {/* Full Paginated URL List with Search and Filter */}
        <UrlListView
          urls={urls}
          isLoading={isLoading}
          onDelete={handleDelete}
          showSearch={true}
          onEmptyAction={() => setShowCreator(true)}
          pagination={pagination}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          sortField={sortField}
          sortDirection={sortDirection}
          onSortChange={handleSortChange}
        />
      </div>
    </AppShell>
  );
}
