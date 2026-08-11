"use client";

import React, { useState } from "react";
import { UrlCreator } from "@/components/urls/url-creator";
import { formatPublicShortUrl, truncateUrl } from "@/lib/utils/format";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { CopyIcon, CheckIcon, ExternalLinkIcon, LinkIcon } from "@/components/ui/icons";
import type { ShortUrlResponse } from "@/types/api";

export default function HomePage() {
  const { success } = useToast();
  const [createdLinks, setCreatedLinks] = useState<ShortUrlResponse[]>([]);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const handleCreated = (newUrl: ShortUrlResponse) => {
    setCreatedLinks((prev) => [newUrl, ...prev.filter((u) => u.id !== newUrl.id)]);
  };

  const handleCopy = async (id: number, shortCode: string) => {
    const fullUrl = formatPublicShortUrl(shortCode);
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopiedId(id);
      success("Copied to clipboard!");
      setTimeout(() => {
        setCopiedId((current) => (current === id ? null : current));
      }, 2000);
    } catch {
      // fallback
    }
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "TinyClick",
    url: "https://tinyclick.in",
    description: "Fast, minimal URL shortener with real-time analytics and custom aliases.",
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa] dark:bg-[#09090b] text-neutral-900 dark:text-neutral-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="flex-1 mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8 py-16 space-y-10 flex flex-col justify-center">
        {/* Public Brand & Hero Heading */}
        <div className="text-center space-y-4">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-900 text-white shadow-xs dark:bg-neutral-100 dark:text-neutral-900 mb-1">
            <LinkIcon className="h-5 w-5" />
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            Shorten a URL
          </h1>
          <p className="max-w-lg mx-auto text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
            Paste your long destination link below to generate a fast, reliable short URL instantly.
          </p>
        </div>

        {/* Prominent URL Shortener Form */}
        <div className="max-w-2xl mx-auto w-full">
          <UrlCreator onCreated={handleCreated} />
        </div>

        {/* Links Created in Current Session */}
        {createdLinks.length > 0 && (
          <div className="max-w-2xl mx-auto w-full space-y-3 animate-in fade-in duration-200">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Links Created in this Session
            </h2>

            <div className="space-y-2">
              {createdLinks.map((item) => {
                const isCopied = copiedId === item.id;
                const publicUrl = formatPublicShortUrl(item.shortCode);

                return (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-neutral-200/90 bg-white p-4 shadow-xs dark:border-neutral-800 dark:bg-neutral-900"
                  >
                    <div className="min-w-0 space-y-1">
                      <span className="font-mono text-sm font-semibold text-neutral-900 dark:text-neutral-100 block">
                        {publicUrl}
                      </span>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate max-w-sm">
                        {truncateUrl(item.originalUrl, 50)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        variant={isCopied ? "secondary" : "outline"}
                        size="sm"
                        onClick={() => handleCopy(item.id, item.shortCode)}
                        leftIcon={
                          isCopied ? (
                            <CheckIcon className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                          ) : (
                            <CopyIcon className="h-3.5 w-3.5" />
                          )
                        }
                      >
                        {isCopied ? "Copied ✓" : "Copy"}
                      </Button>

                      <a
                        href={publicUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium text-neutral-800 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800 transition-colors"
                      >
                        <ExternalLinkIcon className="h-3.5 w-3.5" />
                        <span>Open</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-neutral-200/60 dark:border-neutral-800/60 py-6 text-center text-xs text-neutral-400">
        <div className="mx-auto max-w-5xl px-4 flex items-center justify-between">
          <span className="tracking-tight">TinyClick</span>
          <span>© {new Date().getFullYear()} TinyClick</span>
        </div>
      </footer>
    </div>
  );
}
