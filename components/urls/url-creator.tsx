"use client";

import { useState, type SyntheticEvent } from "react";
import { createShortUrl } from "@/lib/api/urls";
import { formatPublicShortUrl, truncateUrl } from "@/lib/utils/format";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  LinkIcon,
  CopyIcon,
  CheckIcon,
  ExternalLinkIcon,
  AlertCircleIcon,
  CalendarIcon,
} from "@/components/ui/icons";
import { isReservedAlias } from "@/lib/utils/constants";
import type { ShortUrlResponse } from "@/types/api";

interface UrlCreatorProps {
  onCreated?: (url: ShortUrlResponse) => void;
  className?: string;
}

export function UrlCreator({ onCreated, className = "" }: UrlCreatorProps) {
  const { success, error: toastError } = useToast();
  const [originalUrl, setOriginalUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Result state
  const [createdUrl, setCreatedUrl] = useState<ShortUrlResponse | null>(null);
  const [hasCopied, setHasCopied] = useState(false);

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    let trimmedUrl = originalUrl.trim();
    if (!trimmedUrl) {
      setErrorMessage("Please enter a destination URL to shorten.");
      return;
    }

    // Auto prepend protocol if user omitted it (http for localhost, https for domains)
    if (!/^https?:\/\//i.test(trimmedUrl)) {
      if (/^(localhost|127\.\d+\.\d+\.\d+)(:\d+)?(\/.*)?$/i.test(trimmedUrl)) {
        trimmedUrl = `http://${trimmedUrl}`;
      } else {
        trimmedUrl = `https://${trimmedUrl}`;
      }
    }

    try {
      const parsedUrl = new URL(trimmedUrl);
      if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
        setErrorMessage("URL must start with http:// or https://");
        return;
      }

      const hostname = parsedUrl.hostname;
      const isLocalhost = hostname === "localhost" || /^127(\.\d+){3}$/.test(hostname);
      const isIpAddress = /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname);
      const hasValidTld = /\.[a-z0-9-]{2,}$/i.test(hostname);

      if (!isLocalhost && !isIpAddress && !hasValidTld) {
        setErrorMessage("Please enter a valid domain (e.g. example.com, mysite.live).");
        return;
      }
    } catch {
      setErrorMessage("Please enter a valid URL (e.g. https://example.com).");
      return;
    }

    if (customAlias.trim()) {
      const alias = customAlias.trim();
      if (alias.length < 3 || alias.length > 16) {
        setErrorMessage("Custom alias must be between 3 and 16 characters.");
        return;
      }
      if (!/^[a-zA-Z0-9_-]+$/.test(alias)) {
        setErrorMessage("Custom alias can only contain letters, numbers, hyphens, and underscores.");
        return;
      }
      if (isReservedAlias(alias)) {
        setErrorMessage(`The custom alias '${alias}' is a reserved keyword and cannot be used.`);
        return;
      }
    }

    if (expiresAt) {
      const expiryDate = new Date(expiresAt);
      if (isNaN(expiryDate.getTime()) || expiryDate.getTime() <= Date.now()) {
        setErrorMessage("Expiration time must be in the future.");
        return;
      }
    }

    setIsLoading(true);

    try {
      const payload = {
        originalUrl: trimmedUrl,
        customAlias: customAlias.trim() ? customAlias.trim() : undefined,
        expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
      };

      const result = await createShortUrl(payload);
      setCreatedUrl(result);
      setOriginalUrl("");
      setCustomAlias("");
      setExpiresAt("");
      setShowOptions(false);
      success("Short link created successfully!");

      if (onCreated) {
        onCreated(result);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create short link. Please try again.";
      setErrorMessage(msg);
      toastError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async (urlToCopy: string) => {
    try {
      await navigator.clipboard.writeText(urlToCopy);
      setHasCopied(true);
      success("Copied to clipboard!");
      setTimeout(() => setHasCopied(false), 2500);
    } catch {
      toastError("Failed to copy link.");
    }
  };

  const handleReset = () => {
    setCreatedUrl(null);
    setErrorMessage(null);
  };

  return (
    <div
      className={`rounded-2xl border border-neutral-200/90 bg-white p-6 shadow-xs dark:border-neutral-800 dark:bg-neutral-900/90 ${className}`}
    >
      {/* Creation Result View */}
      {createdUrl ? (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Your Short URL
            </span>
            <button
              onClick={handleReset}
              className="text-xs text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 font-medium cursor-pointer"
            >
              + Shorten another
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-950/60">
            <div className="min-w-0 space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-base font-semibold text-neutral-900 dark:text-neutral-100 break-all">
                  {formatPublicShortUrl(createdUrl.shortCode)}
                </span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate max-w-md">
                Redirects to: <span className="font-mono">{truncateUrl(createdUrl.originalUrl, 60)}</span>
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0">
              <Button
                variant={hasCopied ? "secondary" : "primary"}
                size="sm"
                onClick={() => handleCopy(formatPublicShortUrl(createdUrl.shortCode))}
                leftIcon={
                  hasCopied ? (
                    <CheckIcon className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <CopyIcon className="h-3.5 w-3.5" />
                  )
                }
              >
                {hasCopied ? "Copied ✓" : "Copy"}
              </Button>

              <a
                href={formatPublicShortUrl(createdUrl.shortCode)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium text-neutral-800 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800 transition-colors"
              >
                <ExternalLinkIcon className="h-3.5 w-3.5" />
                <span>Open</span>
              </a>
            </div>
          </div>
        </div>
      ) : (
        /* Form View */
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <div className="relative flex-1">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400">
                <LinkIcon className="h-4 w-4" />
              </div>
              <input
                type="text"
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                placeholder="Paste your long URL (e.g. https://github.com/...)"
                disabled={isLoading}
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50/50 py-3 pl-10 pr-4 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:border-neutral-800 dark:bg-neutral-950/50 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-neutral-100 dark:focus:bg-neutral-900"
                required
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className="h-11 px-6 font-medium shrink-0"
              isLoading={isLoading}
            >
              {isLoading ? "Shortening..." : "Shorten"}
            </Button>
          </div>

          {/* Inline error */}
          {errorMessage && (
            <div className="flex items-center gap-2 text-xs text-red-600 dark:text-red-400 font-medium">
              <AlertCircleIcon className="h-3.5 w-3.5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Expandable options */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setShowOptions(!showOptions)}
              className="inline-flex items-center gap-1 text-xs font-medium text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors cursor-pointer"
            >
              <span>{showOptions ? "Hide options" : "Custom alias & expiry"}</span>
              <span className="text-[10px]">{showOptions ? "▲" : "▼"}</span>
            </button>

            {showOptions && (
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-xl border border-neutral-100 bg-neutral-50/70 p-3.5 dark:border-neutral-800/80 dark:bg-neutral-950/40 animate-in fade-in duration-150">
                <Input
                  label="Custom Alias (optional)"
                  placeholder="my-custom-link"
                  value={customAlias}
                  onChange={(e) => setCustomAlias(e.target.value)}
                  disabled={isLoading}
                  hint="3–16 letters, numbers, hyphens"
                />

                <Input
                  label="Expiration Date (optional)"
                  type="datetime-local"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  disabled={isLoading}
                  hint="Link will expire after this time"
                  min={(() => {
                    const now = new Date();
                    const year = now.getFullYear();
                    const month = String(now.getMonth() + 1).padStart(2, "0");
                    const day = String(now.getDate()).padStart(2, "0");
                    const hours = String(now.getHours()).padStart(2, "0");
                    const minutes = String(now.getMinutes()).padStart(2, "0");
                    return `${year}-${month}-${day}T${hours}:${minutes}`;
                  })()}
                  leftIcon={<CalendarIcon className="h-4 w-4 text-neutral-400 dark:text-neutral-200" />}
                />
              </div>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
