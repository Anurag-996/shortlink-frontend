"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { useAuth } from "@/lib/auth/auth-context";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast";
import {
  ShieldIcon,
  LogOutIcon,
  CheckCircleIcon,
} from "@/components/ui/icons";

export default function SettingsPage() {
  const { user, logout, logoutAll } = useAuth();
  const { success, error: toastError } = useToast();
  const [showLogoutAllDialog, setShowLogoutAllDialog] = useState(false);
  const [isLoggingOutAll, setIsLoggingOutAll] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogoutCurrent = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      success("Logged out successfully.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to log out.";
      toastError(msg);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleConfirmLogoutAll = async () => {
    setIsLoggingOutAll(true);
    try {
      await logoutAll();
      success("Successfully logged out from all active sessions.");
      setShowLogoutAllDialog(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to terminate all sessions.";
      toastError(msg);
    } finally {
      setIsLoggingOutAll(false);
    }
  };

  const gatewayUrl = process.env.NEXT_PUBLIC_GATEWAY_URL || "http://localhost:8080";

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-300">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            Settings
          </h1>
          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
            Account identity, gateway connection, and active security sessions.
          </p>
        </div>

        {/* Account Identity Card */}
        <div className="rounded-2xl border border-neutral-200/90 bg-white p-6 shadow-xs dark:border-neutral-800 dark:bg-neutral-900/90 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200">
              <ShieldIcon className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                Account Identity
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Authenticated user profile
              </p>
            </div>
          </div>

          <div className="divide-y divide-neutral-100 rounded-xl border border-neutral-100 bg-neutral-50/60 dark:divide-neutral-800 dark:border-neutral-800/80 dark:bg-neutral-950/40">
            <div className="flex items-center justify-between p-3.5 text-xs">
              <span className="text-neutral-500 dark:text-neutral-400">Email</span>
              <span className="font-mono font-medium text-neutral-900 dark:text-neutral-100">
                {user?.email || "Unknown"}
              </span>
            </div>

            <div className="flex items-center justify-between p-3.5 text-xs">
              <span className="text-neutral-500 dark:text-neutral-400">Authentication Mode</span>
              <span className="inline-flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
                <CheckCircleIcon className="h-3.5 w-3.5" />
                <span>JWT + HttpOnly Refresh</span>
              </span>
            </div>

            <div className="flex items-center justify-between p-3.5 text-xs">
              <span className="text-neutral-500 dark:text-neutral-400">API Gateway</span>
              <span className="font-mono text-neutral-700 dark:text-neutral-300">
                {gatewayUrl}
              </span>
            </div>
          </div>
        </div>

        {/* Session Management */}
        <div className="rounded-2xl border border-neutral-200/90 bg-white p-6 shadow-xs dark:border-neutral-800 dark:bg-neutral-900/90 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200">
              <LogOutIcon className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                Session Controls
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Manage active device sessions and sign out
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogoutCurrent}
              isLoading={isLoggingOut}
              leftIcon={<LogOutIcon className="h-3.5 w-3.5" />}
            >
              Sign out this device
            </Button>

            <Button
              variant="danger"
              size="sm"
              onClick={() => setShowLogoutAllDialog(true)}
              leftIcon={<ShieldIcon className="h-3.5 w-3.5" />}
            >
              Sign out all devices
            </Button>
          </div>
        </div>

        {/* Confirm Logout All Dialog */}
        <Dialog
          isOpen={showLogoutAllDialog}
          onClose={() => setShowLogoutAllDialog(false)}
          onConfirm={handleConfirmLogoutAll}
          title="Revoke All Sessions"
          description="Are you sure you want to sign out from all devices? All active refresh tokens will be revoked and you will need to sign in again everywhere."
          confirmText={isLoggingOutAll ? "Signing out..." : "Sign out everywhere"}
          confirmVariant="danger"
          isLoading={isLoggingOutAll}
        />
      </div>
    </AppShell>
  );
}
