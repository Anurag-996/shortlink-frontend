"use client";

import React, { useState } from "react";
import type { ShortUrlResponse } from "@/types/api";
import {
  formatPublicShortUrl,
  truncateUrl,
  formatDate,
  formatExpiryStatus,
  formatNumber,
} from "@/lib/utils/format";
import { useToast } from "@/components/ui/toast";
import { Dialog } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "./empty-state";
import {
  CopyIcon,
  CheckIcon,
  ExternalLinkIcon,
  TrashIcon,
  SearchIcon,
  ClockIcon,
  BarChartIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@/components/ui/icons";

export type SortField = "createdAt" | "expiresAt" | "clickCount";
export type SortDirection = "asc" | "desc";

interface UrlListViewProps {
  urls: ShortUrlResponse[];
  isLoading?: boolean;
  onDelete?: (id: number) => Promise<void>;
  showSearch?: boolean;
  onEmptyAction?: () => void;
  // Pagination & Server Sorting props
  pagination?: {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  sortField?: SortField;
  sortDirection?: SortDirection;
  onSortChange?: (field: SortField, direction: SortDirection) => void;
}

export function UrlListView({
  urls,
  isLoading = false,
  onDelete,
  showSearch = false,
  onEmptyAction,
  pagination,
  onPageChange,
  onPageSizeChange,
  sortField = "createdAt",
  sortDirection = "desc",
  onSortChange,
}: UrlListViewProps) {
  const { success, error: toastError } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [urlToDelete, setUrlToDelete] = useState<ShortUrlResponse | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  // Filter URLs based on search query
  const filteredUrls = urls.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      item.shortCode.toLowerCase().includes(q) ||
      item.originalUrl.toLowerCase().includes(q)
    );
  });

  const handleSortClick = (field: SortField) => {
    if (!onSortChange) return;
    if (sortField === field) {
      onSortChange(field, sortDirection === "asc" ? "desc" : "asc");
    } else {
      onSortChange(field, field === "clickCount" ? "desc" : "desc");
    }
  };

  const handleCopy = async (id: number, shortCode: string) => {
    const fullUrl = formatPublicShortUrl(shortCode);
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopiedId(id);
      success("Copied short link!");
      setTimeout(() => {
        setCopiedId((current) => (current === id ? null : current));
      }, 2000);
    } catch {
      toastError("Failed to copy URL.");
    }
  };

  const handleConfirmDelete = async () => {
    if (!urlToDelete || !onDelete) return;
    setIsDeleting(true);
    try {
      await onDelete(urlToDelete.id);
      success("Short link deleted.");
      setUrlToDelete(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete URL.";
      toastError(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading && urls.length === 0) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="h-16 w-full animate-pulse rounded-xl border border-neutral-200/80 bg-neutral-100/60 dark:border-neutral-800 dark:bg-neutral-900/50"
          />
        ))}
      </div>
    );
  }

  if (urls.length === 0 && !searchQuery) {
    return <EmptyState onAction={onEmptyAction} />;
  }

  // Calculate item range for pagination display
  const currentPage = pagination ? pagination.page : 0;
  const pageSize = pagination ? pagination.size : urls.length;
  const totalElements = pagination ? pagination.totalElements : urls.length;
  const totalPages = pagination ? pagination.totalPages : 1;
  const startItem = totalElements === 0 ? 0 : currentPage * pageSize + 1;
  const endItem = Math.min((currentPage + 1) * pageSize, totalElements);

  return (
    <div className="space-y-4">
      {/* Search & Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {showSearch && (
          <div className="relative max-w-sm w-full">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
              <SearchIcon className="h-4 w-4" />
            </div>
            <input
              type="text"
              placeholder="Search in current page..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-neutral-200 bg-white py-2 pl-9 pr-3 text-xs text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-neutral-100"
            />
          </div>
        )}

        {/* Mobile sort toggles */}
        <div className="flex md:hidden items-center gap-1.5 overflow-x-auto text-[11px]">
          <span className="text-neutral-400">Sort:</span>
          <button
            onClick={() => handleSortClick("createdAt")}
            className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
              sortField === "createdAt"
                ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-medium"
                : "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
            }`}
          >
            Created {sortField === "createdAt" && (sortDirection === "asc" ? "↑" : "↓")}
          </button>
          <button
            onClick={() => handleSortClick("expiresAt")}
            className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
              sortField === "expiresAt"
                ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-medium"
                : "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
            }`}
          >
            Expiry {sortField === "expiresAt" && (sortDirection === "asc" ? "↑" : "↓")}
          </button>
          <button
            onClick={() => handleSortClick("clickCount")}
            className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
              sortField === "clickCount"
                ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-medium"
                : "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
            }`}
          >
            Clicks {sortField === "clickCount" && (sortDirection === "asc" ? "↑" : "↓")}
          </button>
        </div>
      </div>

      {/* No search results */}
      {filteredUrls.length === 0 && searchQuery && (
        <div className="rounded-xl border border-neutral-200 py-8 text-center text-xs text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
          No short links match &quot;{searchQuery}&quot;
        </div>
      )}

      {/* Desktop Table View */}
      {filteredUrls.length > 0 && (
        <div className="hidden md:block overflow-hidden rounded-xl border border-neutral-200/90 bg-white shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-200/80 bg-neutral-50/70 text-[11px] font-medium uppercase tracking-wider text-neutral-500 dark:border-neutral-800 dark:bg-neutral-950/40 dark:text-neutral-400 select-none">
                <th className="py-3 px-4">Short Link</th>
                <th className="py-3 px-4">Destination</th>
                
                {/* Sortable: Created */}
                <th className="py-3 px-4">
                  <button
                    type="button"
                    onClick={() => handleSortClick("createdAt")}
                    className="inline-flex items-center gap-1.5 font-medium hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors cursor-pointer group"
                    title="Click to sort by creation date"
                  >
                    <span>Created</span>
                    {sortField === "createdAt" ? (
                      <span className="font-bold text-neutral-900 dark:text-neutral-100">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    ) : (
                      <span className="text-neutral-300 dark:text-neutral-600 group-hover:text-neutral-500 transition-colors">
                        ↕
                      </span>
                    )}
                  </button>
                </th>

                {/* Sortable: Status / Expiry */}
                <th className="py-3 px-4">
                  <button
                    type="button"
                    onClick={() => handleSortClick("expiresAt")}
                    className="inline-flex items-center gap-1.5 font-medium hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors cursor-pointer group"
                    title="Click to sort by expiration status"
                  >
                    <span>Status / Expiry</span>
                    {sortField === "expiresAt" ? (
                      <span className="font-bold text-neutral-900 dark:text-neutral-100">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    ) : (
                      <span className="text-neutral-300 dark:text-neutral-600 group-hover:text-neutral-500 transition-colors">
                        ↕
                      </span>
                    )}
                  </button>
                </th>

                {/* Sortable: Clicks */}
                <th className="py-3 px-4 text-center">
                  <button
                    type="button"
                    onClick={() => handleSortClick("clickCount")}
                    className="inline-flex items-center gap-1.5 font-medium hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors cursor-pointer group mx-auto"
                    title="Click to sort by click count"
                  >
                    <span>Clicks</span>
                    {sortField === "clickCount" ? (
                      <span className="font-bold text-neutral-900 dark:text-neutral-100">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    ) : (
                      <span className="text-neutral-300 dark:text-neutral-600 group-hover:text-neutral-500 transition-colors">
                        ↕
                      </span>
                    )}
                  </button>
                </th>

                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
              {filteredUrls.map((item) => {
                const isCopied = copiedId === item.id;
                const expiryInfo = formatExpiryStatus(item.expiresAt);
                const publicUrl = formatPublicShortUrl(item.shortCode);

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-neutral-50/60 dark:hover:bg-neutral-800/40 transition-colors"
                  >
                    {/* Short Link */}
                    <td className="py-3.5 px-4 font-mono font-medium text-neutral-900 dark:text-neutral-100">
                      <span className="text-neutral-400 text-[11px]">/</span>
                      <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                        {item.shortCode}
                      </span>
                    </td>

                    {/* Original URL */}
                    <td className="py-3.5 px-4 text-neutral-600 dark:text-neutral-400 max-w-[260px]">
                      <a
                        href={item.originalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="truncate block hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors"
                        title={item.originalUrl}
                      >
                        {truncateUrl(item.originalUrl, 42)}
                      </a>
                    </td>

                    {/* Created Date */}
                    <td className="py-3.5 px-4 text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
                      {formatDate(item.createdAt)}
                    </td>

                    {/* Expiry */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {item.expiresAt ? (
                        <Badge
                          variant={expiryInfo.isExpired ? "danger" : "warning"}
                          size="sm"
                        >
                          <ClockIcon className="h-3 w-3" />
                          <span>{expiryInfo.label}</span>
                        </Badge>
                      ) : (
                        <span className="text-neutral-400 dark:text-neutral-500">
                          Active
                        </span>
                      )}
                    </td>

                    {/* Clicks */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 rounded-md bg-neutral-100 px-2 py-0.5 font-mono text-[11px] font-medium text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                        {formatNumber(item.clickCount)}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleCopy(item.id, item.shortCode)}
                          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100 transition-colors cursor-pointer"
                          title="Copy short link"
                        >
                          {isCopied ? (
                            <>
                              <CheckIcon className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                              <span className="text-emerald-600 dark:text-emerald-400">Copied ✓</span>
                            </>
                          ) : (
                            <>
                              <CopyIcon className="h-3.5 w-3.5" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>

                        <a
                          href={publicUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-md p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-200 transition-colors"
                          title="Open link"
                        >
                          <ExternalLinkIcon className="h-3.5 w-3.5" />
                        </a>

                        {onDelete && (
                          <button
                            onClick={() => setUrlToDelete(item)}
                            className="rounded-md p-1 text-neutral-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 dark:hover:text-red-400 transition-colors cursor-pointer"
                            title="Delete link"
                          >
                            <TrashIcon className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Mobile Stacked List View */}
      {filteredUrls.length > 0 && (
        <div className="block md:hidden space-y-2.5">
          {filteredUrls.map((item) => {
            const isCopied = copiedId === item.id;
            const expiryInfo = formatExpiryStatus(item.expiresAt);
            const publicUrl = formatPublicShortUrl(item.shortCode);

            return (
              <div
                key={item.id}
                className="rounded-xl border border-neutral-200/90 bg-white p-3.5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 space-y-2.5"
              >
                {/* Header: Short code & clicks */}
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                    /{item.shortCode}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-md bg-neutral-100 px-2 py-0.5 font-mono text-[11px] font-medium text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                    <BarChartIcon className="h-3 w-3" />
                    <span>{formatNumber(item.clickCount)} clicks</span>
                  </span>
                </div>

                {/* Original URL */}
                <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                  {item.originalUrl}
                </p>

                {/* Meta: date & expiry */}
                <div className="flex items-center gap-2 text-[11px] text-neutral-400 dark:text-neutral-500">
                  <span>{formatDate(item.createdAt)}</span>
                  {item.expiresAt && (
                    <>
                      <span>•</span>
                      <span className={expiryInfo.isExpired ? "text-red-500" : "text-amber-500"}>
                        {expiryInfo.label}
                      </span>
                    </>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between border-t border-neutral-100 pt-2.5 dark:border-neutral-800/80">
                  <button
                    onClick={() => handleCopy(item.id, item.shortCode)}
                    className="inline-flex items-center gap-1 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
                  >
                    {isCopied ? (
                      <>
                        <CheckIcon className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Copied ✓</span>
                      </>
                    ) : (
                      <>
                        <CopyIcon className="h-3.5 w-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-2">
                    <a
                      href={publicUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200"
                    >
                      <ExternalLinkIcon className="h-3.5 w-3.5" />
                      <span>Open</span>
                    </a>

                    {onDelete && (
                      <button
                        onClick={() => setUrlToDelete(item)}
                        className="p-1 text-neutral-400 hover:text-red-600 dark:hover:text-red-400 cursor-pointer"
                        title="Delete URL"
                      >
                        <TrashIcon className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Bar */}
      {pagination && totalPages > 1 && onPageChange && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2 text-xs text-neutral-500 dark:text-neutral-400 border-t border-neutral-100 dark:border-neutral-800/80">
          <div className="flex items-center gap-2">
            <span>
              Showing <span className="font-semibold text-neutral-900 dark:text-neutral-100">{startItem}</span>–<span className="font-semibold text-neutral-900 dark:text-neutral-100">{endItem}</span> of <span className="font-semibold text-neutral-900 dark:text-neutral-100">{formatNumber(totalElements)}</span> links
            </span>

            {onPageSizeChange && (
              <div className="hidden sm:flex items-center gap-1.5 ml-4">
                <span>Per page:</span>
                <select
                  value={pageSize}
                  onChange={(e) => onPageSizeChange(Number(e.target.value))}
                  className="rounded border border-neutral-200 bg-white px-2 py-1 text-xs text-neutral-900 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 0}
              className="inline-flex items-center gap-1 rounded-lg border border-neutral-200 bg-white px-2.5 py-1 text-xs font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              <ChevronLeftIcon className="h-3.5 w-3.5" />
              <span>Previous</span>
            </button>

            {/* Page number indicators */}
            <div className="flex items-center gap-1 px-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, idx) => {
                let pageNum = idx;
                if (totalPages > 5) {
                  if (currentPage > 2 && currentPage < totalPages - 2) {
                    pageNum = currentPage - 2 + idx;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 5 + idx;
                  }
                }
                const isActive = pageNum === currentPage;
                return (
                  <button
                    key={pageNum}
                    onClick={() => onPageChange(pageNum)}
                    className={`h-7 w-7 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      isActive
                        ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900"
                        : "hover:bg-neutral-100 text-neutral-600 dark:text-neutral-400 dark:hover:bg-neutral-800"
                    }`}
                  >
                    {pageNum + 1}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages - 1}
              className="inline-flex items-center gap-1 rounded-lg border border-neutral-200 bg-white px-2.5 py-1 text-xs font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              <span>Next</span>
              <ChevronRightIcon className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        isOpen={!!urlToDelete}
        onClose={() => setUrlToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Short Link"
        description={`Are you sure you want to delete "/${urlToDelete?.shortCode}"? This short link will immediately stop redirecting and cannot be restored.`}
        confirmText={isDeleting ? "Deleting..." : "Delete"}
        confirmVariant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}
