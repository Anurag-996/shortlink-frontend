"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import {
  LinkIcon,
  LogOutIcon,
  MenuIcon,
  XIcon,
} from "@/components/ui/icons";

export function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const navLinks = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "URLs", href: "/urls" },
    { label: "Settings", href: "/settings" },
  ];

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200/80 bg-white/80 backdrop-blur-md dark:border-neutral-800/80 dark:bg-neutral-950/80">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo & Wordmark */}
        <div className="flex items-center gap-8">
          <Link
            href={isAuthenticated ? "/dashboard" : "/"}
            className="flex items-center gap-2 text-sm font-semibold tracking-tight text-neutral-900 dark:text-neutral-100"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900">
              <LinkIcon className="h-3.5 w-3.5" />
            </div>
            <span>TinyClick</span>
          </Link>

          {/* Desktop Navigation Links (Authenticated Admin) */}
          {isAuthenticated && (
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                      isActive
                        ? "bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100"
                        : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-neutral-200"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          )}
        </div>

        {/* Right side area */}
        {isAuthenticated && (
          <div className="hidden md:flex items-center gap-3">
            {user?.email && (
              <div className="flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span className="max-w-[160px] truncate">{user.email}</span>
              </div>
            )}

            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-colors disabled:opacity-50 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100 cursor-pointer"
              title="Log out"
            >
              <LogOutIcon className="h-3.5 w-3.5" />
              <span>{isLoggingOut ? "..." : "Logout"}</span>
            </button>
          </div>
        )}

        {/* Mobile menu button */}
        {isAuthenticated && (
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg p-1.5 text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <XIcon className="h-5 w-5" />
              ) : (
                <MenuIcon className="h-5 w-5" />
              )}
            </button>
          </div>
        )}
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && isAuthenticated && (
        <div className="md:hidden border-t border-neutral-200 bg-white px-4 py-3 dark:border-neutral-800 dark:bg-neutral-950 animate-in slide-in-from-top-2">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100"
                      : "text-neutral-600 hover:bg-neutral-50 dark:text-neutral-400 dark:hover:bg-neutral-900"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-3 border-t border-neutral-100 pt-3 dark:border-neutral-800 flex items-center justify-between">
            {user?.email && (
              <span className="text-xs text-neutral-500 dark:text-neutral-400 truncate max-w-[200px]">
                {user.email}
              </span>
            )}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleLogout();
              }}
              disabled={isLoggingOut}
              className="flex items-center gap-1 text-xs font-medium text-red-600 dark:text-red-400 cursor-pointer"
            >
              <LogOutIcon className="h-3.5 w-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
