"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import { Button } from "@/components/ui/button";
import {
  LinkIcon,
  SparklesIcon,
  InfoIcon,
  ShieldIcon,
  MenuIcon,
  XIcon,
  ArrowRightIcon,
} from "@/components/ui/icons";

interface NavItem {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const PUBLIC_NAV_LINKS: NavItem[] = [
  { label: "Shortener", href: "/", icon: LinkIcon },
  { label: "Features", href: "/features", icon: SparklesIcon, badge: "New" },
  { label: "FAQ", href: "/faq", icon: InfoIcon },
];

export function PublicNavbar() {
  const pathname = usePathname();
  const { isAuthenticated, isInitializing } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <header className="border-b border-neutral-200/60 dark:border-neutral-800/60 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md sticky top-0 z-40 transition-colors">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Brand Logo & Wordmark */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-neutral-100 rounded-lg"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900 text-white shadow-xs group-hover:scale-105 transition-transform dark:bg-neutral-100 dark:text-neutral-900">
            <LinkIcon className="h-4 w-4" />
          </div>
          <span className="text-sm font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            TinyClick
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {PUBLIC_NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                  isActive
                    ? "text-neutral-900 dark:text-neutral-100 bg-neutral-100/90 dark:bg-neutral-900 font-semibold"
                    : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 dark:text-neutral-400 dark:hover:text-neutral-200 dark:hover:bg-neutral-900/60"
                }`}
              >
                <span>{link.label}</span>
                {link.badge && (
                  <span className="rounded-full bg-amber-500/15 px-1.5 py-0.2 text-[9px] font-bold text-amber-700 dark:text-amber-300">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-2">
          {isInitializing ? (
            <div className="h-8 w-20 rounded-lg bg-neutral-200/60 dark:bg-neutral-800/60 animate-pulse" />
          ) : isAuthenticated ? (
            <Link href="/app/dashboard">
              <Button variant="primary" size="sm" className="text-xs h-8 px-3.5">
                Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/login" className="hidden sm:inline-flex">
                <Button variant="ghost" size="sm" className="text-xs h-8 px-3">
                  Sign in
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="primary" size="sm" className="text-xs h-8 px-3.5 shadow-xs">
                  Get Started
                </Button>
              </Link>
            </>
          )}

          {/* Mobile Hamburger Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-neutral-100 dark:hover:bg-neutral-800 transition-colors focus:outline-none"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <XIcon className="h-5 w-5" />
            ) : (
              <MenuIcon className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay & Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-14 bottom-0 z-50 bg-neutral-950/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 shadow-xl px-4 py-5 space-y-4 animate-in slide-in-from-top-3 duration-200">
            {/* Primary Navigation Links */}
            <div className="space-y-1">
              <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                Menu
              </span>
              <div className="mt-1 space-y-1">
                {PUBLIC_NAV_LINKS.map((link) => {
                  const isActive = pathname === link.href;
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 font-semibold"
                          : "text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900/60"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {Icon && (
                          <div
                            className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                              isActive
                                ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900"
                                : "bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400"
                            }`}
                          >
                            <Icon className="h-4 w-4" />
                          </div>
                        )}
                        <span>{link.label}</span>
                      </div>
                      {link.badge ? (
                        <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-300">
                          {link.badge}
                        </span>
                      ) : (
                        <ArrowRightIcon className="h-3.5 w-3.5 text-neutral-400" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Legal & Info Links */}
            <div className="border-t border-neutral-100 dark:border-neutral-850 pt-3 space-y-1">
              <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                Information
              </span>
              <div className="grid grid-cols-2 gap-1 pt-1">
                <Link
                  href="/privacy"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200"
                >
                  <ShieldIcon className="h-3.5 w-3.5" />
                  <span>Privacy Policy</span>
                </Link>
                <Link
                  href="/terms"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200"
                >
                  <InfoIcon className="h-3.5 w-3.5" />
                  <span>Terms of Service</span>
                </Link>
              </div>
            </div>

            {/* Action Buttons for Mobile */}
            <div className="border-t border-neutral-100 dark:border-neutral-850 pt-4">
              {isAuthenticated ? (
                <Link href="/app/dashboard" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" size="lg" className="w-full justify-center text-sm font-semibold">
                    Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="primary" size="lg" className="w-full justify-center text-sm font-semibold shadow-xs">
                      Get Started Free
                    </Button>
                  </Link>
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" size="lg" className="w-full justify-center text-sm font-medium">
                      Sign in to your account
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
