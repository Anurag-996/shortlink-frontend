"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  SearchIcon,
  SparklesIcon,
  ChevronRightIcon,
} from "@/components/ui/icons";
import { Button } from "@/components/ui/button";

export interface FaqItem {
  id: string;
  category: string;
  q: string;
  a: string;
}

interface FaqClientProps {
  categories: string[];
  faqs: FaqItem[];
}

export function FaqClient({ categories, faqs }: FaqClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [openIds, setOpenIds] = useState<Set<string>>(new Set([faqs[0]?.id || ""]));

  const toggleItem = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const filteredFaqs = useMemo(() => {
    return faqs.filter((item) => {
      const matchesCategory =
        selectedCategory === "All" || item.category === selectedCategory;
      const matchesSearch =
        !searchQuery.trim() ||
        item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.a.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [faqs, selectedCategory, searchQuery]);

  return (
    <div className="space-y-10">
      {/* Search & Filter Controls */}
      <div className="space-y-4 max-w-2xl mx-auto">
        <div className="relative">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400">
            <SearchIcon className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions (e.g. custom alias, analytics, free, expiry)..."
            className="w-full rounded-xl border border-neutral-200 bg-white py-3 pl-10 pr-4 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 shadow-xs focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-neutral-100 dark:focus:ring-neutral-100"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar sm:justify-center">
          {["All", ...categories].map((cat) => {
            const isActive = selectedCategory === cat;
            const count =
              cat === "All"
                ? faqs.length
                : faqs.filter((f) => f.category === cat).length;

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors shrink-0 cursor-pointer ${
                  isActive
                    ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 shadow-xs"
                    : "bg-neutral-100/80 text-neutral-600 hover:bg-neutral-200/80 dark:bg-neutral-800/80 dark:text-neutral-400 dark:hover:bg-neutral-700"
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${
                    isActive
                      ? "bg-neutral-700 text-white dark:bg-neutral-300 dark:text-neutral-900"
                      : "bg-neutral-200/80 text-neutral-500 dark:bg-neutral-700 dark:text-neutral-400"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* FAQ Accordion List */}
      {filteredFaqs.length > 0 ? (
        <div className="space-y-3 max-w-3xl mx-auto">
          {filteredFaqs.map((item) => {
            const isOpen = openIds.has(item.id);

            return (
              <div
                key={item.id}
                className="rounded-2xl border border-neutral-200/80 bg-white dark:border-neutral-800 dark:bg-neutral-900/80 overflow-hidden shadow-xs transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => toggleItem(item.id)}
                  className="w-full flex items-center justify-between p-5 text-left gap-4 hover:bg-neutral-50/50 dark:hover:bg-neutral-950/40 transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <div className="space-y-1 pr-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider font-semibold text-blue-600 dark:text-blue-400 block">
                      {item.category}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                      {item.q}
                    </h3>
                  </div>
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 transition-transform duration-200 ${
                      isOpen ? "rotate-90" : ""
                    }`}
                  >
                    <ChevronRightIcon className="h-3.5 w-3.5" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed border-t border-neutral-100 dark:border-neutral-800/60 animate-in fade-in duration-150 space-y-3">
                    <p>{item.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-800 p-12 text-center space-y-3 max-w-xl mx-auto">
          <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            No questions found matching &ldquo;{searchQuery}&rdquo;
          </p>
          <p className="text-xs text-neutral-400">
            Try searching for terms like &ldquo;alias&rdquo;, &ldquo;analytics&rdquo;, &ldquo;edit&rdquo;, or &ldquo;expiration&rdquo;.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
            }}
          >
            Reset Filters
          </Button>
        </div>
      )}

      {/* Support / Help Card */}
      <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 sm:p-8 text-center space-y-4 max-w-3xl mx-auto dark:border-neutral-800 dark:bg-neutral-900/80 shadow-xs">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200">
          <SparklesIcon className="h-5 w-5 text-blue-500" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
            Need more information or custom support?
          </h3>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 max-w-md mx-auto">
            Explore our feature specifications or create your first short link on the homepage in seconds.
          </p>
        </div>
        <div className="pt-2 flex flex-wrap justify-center gap-3">
          <Link href="/">
            <Button size="sm">Create Short Link</Button>
          </Link>
          <Link href="/features">
            <Button variant="outline" size="sm">
              View All Features
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
