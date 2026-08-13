"use client";

import { useState, type SyntheticEvent } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { useAuth } from "@/lib/auth/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast";
import { changePasswordApi, requestAccountDeletionApi } from "@/lib/api/auth";
import { validateStrongPassword } from "@/lib/utils/password";
import {
  ShieldIcon,
  LogOutIcon,
  CheckCircleIcon,
  LockIcon,
  TrashIcon,
  AlertTriangleIcon,
  EyeIcon,
  EyeOffIcon,
} from "@/components/ui/icons";

export default function AppSettingsPage() {
  const { user, logout, logoutAll, updateProfileName } = useAuth();
  const { success, error: toastError } = useToast();

  // Name editing state
  const [name, setName] = useState(user?.name || "");
  const [prevUserName, setPrevUserName] = useState(user?.name);
  const [isUpdatingName, setIsUpdatingName] = useState(false);

  // Sync state during render when user.name updates asynchronously
  if (user?.name !== prevUserName) {
    setPrevUserName(user?.name);
    setName(user?.name || "");
  }

  const handleUpdateName = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      toastError("Name cannot be empty.");
      return;
    }

    setIsUpdatingName(true);
    try {
      await updateProfileName(trimmedName);
      success("Display name updated successfully!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update display name.";
      toastError(msg);
    } finally {
      setIsUpdatingName(false);
    }
  };

  // Session state
  const [showLogoutAllDialog, setShowLogoutAllDialog] = useState(false);
  const [isLoggingOutAll, setIsLoggingOutAll] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Change Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Account Deletion state
  const [showDeleteAccountDialog, setShowDeleteAccountDialog] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState("");
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const passwordValidation = validateStrongPassword(newPassword);
  const isConfirmTouched = confirmPassword.length > 0;
  const passwordsMatch = newPassword === confirmPassword;
  const isConfirmMismatch = isConfirmTouched && !passwordsMatch;

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

  const handleChangePassword = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!currentPassword) {
      toastError("Please enter your current password.");
      return;
    }
    if (!passwordValidation.isValid) {
      toastError(passwordValidation.errorMessage || "Please enter a strong new password.");
      return;
    }
    if (!passwordsMatch) {
      toastError("New passwords do not match.");
      return;
    }
    if (currentPassword === newPassword) {
      toastError("New password must be different from your current password.");
      return;
    }

    setIsChangingPassword(true);
    try {
      await changePasswordApi({
        currentPassword,
        newPassword,
        confirmPassword,
      });
      success("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to change password.";
      toastError(msg);
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleConfirmDeleteAccount = async () => {
    if (user?.role === "ADMIN") {
      toastError("Admin accounts cannot be deleted directly. Please demote or transfer role first.");
      return;
    }

    if (deleteConfirmationText.trim().toUpperCase() !== "DELETE MY ACCOUNT") {
      toastError('Please type "DELETE MY ACCOUNT" to confirm deletion.');
      return;
    }

    setIsDeletingAccount(true);
    try {
      const res = await requestAccountDeletionApi();
      success(res.message || "Account deletion scheduled. You have been logged out.");
      setShowDeleteAccountDialog(false);
      await logout();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to request account deletion.";
      toastError(msg);
    } finally {
      setIsDeletingAccount(false);
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
            Account identity, password security, session controls, and account lifecycle.
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
              <span className="text-neutral-500 dark:text-neutral-400">Role & Status</span>
              <span className="inline-flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
                <span className="rounded-md bg-neutral-200/80 px-2 py-0.5 font-mono text-[10px] text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200">
                  {user?.role || "USER"}
                </span>
                <CheckCircleIcon className="h-3.5 w-3.5" />
                <span>Verified Active</span>
              </span>
            </div>

            {user?.role === "ADMIN" && (
              <div className="flex items-center justify-between p-3.5 text-xs">
                <span className="text-neutral-500 dark:text-neutral-400">API Gateway</span>
                <span className="font-mono text-neutral-700 dark:text-neutral-300">
                  {gatewayUrl}
                </span>
              </div>
            )}
          </div>

          {/* Edit Display Name Form */}
          <form onSubmit={handleUpdateName} className="pt-2 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-end gap-3">
              <div className="flex-1">
                <Input
                  id="display-name-input"
                  label="Display Name"
                  type="text"
                  placeholder="Enter full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isUpdatingName}
                  required
                />
              </div>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                isLoading={isUpdatingName}
                className="shrink-0 h-10"
              >
                {isUpdatingName ? "Saving..." : "Save Name"}
              </Button>
            </div>
          </form>
        </div>

        {/* Change Password Card */}
        <div className="rounded-2xl border border-neutral-200/90 bg-white p-6 shadow-xs dark:border-neutral-800 dark:bg-neutral-900/90 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200">
              <LockIcon className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                Security & Password
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Update your account password with strong security requirements
              </p>
            </div>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-3.5 pt-2">
            <div>
              <Input
                id="current-password-input"
                label="Current Password"
                type={showCurrentPassword ? "text" : "password"}
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                disabled={isChangingPassword}
                required
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 cursor-pointer p-1"
                    aria-label={showCurrentPassword ? "Hide password" : "Show password"}
                  >
                    {showCurrentPassword ? <EyeIcon className="h-4 w-4" /> : <EyeOffIcon className="h-4 w-4" />}
                  </button>
                }
              />
            </div>

            <div className="space-y-3">
              <Input
                id="new-password-input"
                label="New Password"
                type={showNewPassword ? "text" : "password"}
                placeholder="Min. 8 chars (uppercase, lowercase, number, symbol)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={isChangingPassword}
                required
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 cursor-pointer p-1"
                    aria-label={showNewPassword ? "Hide password" : "Show password"}
                  >
                    {showNewPassword ? <EyeIcon className="h-4 w-4" /> : <EyeOffIcon className="h-4 w-4" />}
                  </button>
                }
              />

              {newPassword.length > 0 && (
                <div className="grid grid-cols-2 gap-1 rounded-lg border border-neutral-100 bg-neutral-50/60 p-2.5 text-[11px] dark:border-neutral-800/80 dark:bg-neutral-950/40">
                  <span className={passwordValidation.hasMinLength ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-neutral-400"}>
                    {passwordValidation.hasMinLength ? "✓" : "•"} At least 8 characters
                  </span>
                  <span className={passwordValidation.hasUppercase ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-neutral-400"}>
                    {passwordValidation.hasUppercase ? "✓" : "•"} Uppercase (A-Z)
                  </span>
                  <span className={passwordValidation.hasLowercase ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-neutral-400"}>
                    {passwordValidation.hasLowercase ? "✓" : "•"} Lowercase (a-z)
                  </span>
                  <span className={passwordValidation.hasDigit && passwordValidation.hasSpecialChar ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-neutral-400"}>
                    {passwordValidation.hasDigit && passwordValidation.hasSpecialChar ? "✓" : "•"} Number & Symbol
                  </span>
                </div>
              )}

              <div>
                <Input
                  id="confirm-new-password-input"
                  label="Confirm New Password"
                  type="password"
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isChangingPassword}
                  error={isConfirmMismatch ? "New passwords do not match" : undefined}
                  required
                />
                {isConfirmTouched && passwordsMatch && (
                  <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    <CheckCircleIcon className="h-3.5 w-3.5" />
                    <span>Passwords match</span>
                  </p>
                )}
              </div>
            </div>

            <div className="pt-1">
              <Button
                type="submit"
                variant="primary"
                size="sm"
                isLoading={isChangingPassword}
              >
                {isChangingPassword ? "Updating..." : "Update Password"}
              </Button>
            </div>
          </form>
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
              variant="secondary"
              size="sm"
              onClick={() => setShowLogoutAllDialog(true)}
              leftIcon={<ShieldIcon className="h-3.5 w-3.5" />}
            >
              Sign out all devices
            </Button>
          </div>
        </div>

        {/* Danger Zone: Account Deletion */}
        <div className="rounded-2xl border border-red-200/80 bg-red-50/30 p-6 shadow-xs dark:border-red-900/40 dark:bg-red-950/20 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-100 text-red-700 dark:bg-red-900/60 dark:text-red-300">
              <AlertTriangleIcon className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-red-900 dark:text-red-200">
                Danger Zone: Account Deletion
              </h2>
              <p className="text-xs text-red-700/80 dark:text-red-400/80">
                Request permanent removal of your account
              </p>
            </div>
          </div>

          {user?.role === "ADMIN" ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-3.5 text-xs text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-300">
              <div className="flex items-center gap-2 font-semibold">
                <ShieldIcon className="h-4 w-4" />
                <span>Admin Account Protection</span>
              </div>
              <p className="mt-1 text-[11px] leading-relaxed text-amber-700 dark:text-amber-400">
                Administrator accounts cannot be self-deleted. To remove or manage admin accounts, use the Admin User Management dashboard or transfer privileges first.
              </p>
            </div>
          ) : (
            <>
              <p className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
                Requesting account deletion will immediately disable your account and revoke all active sessions. After a <strong>7-day grace period</strong>, your user profile, all short links created under your account, and their analytics metrics will be permanently and irreversibly deleted.
              </p>

              <div className="pt-1">
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => {
                    setDeleteConfirmationText("");
                    setShowDeleteAccountDialog(true);
                  }}
                  leftIcon={<TrashIcon className="h-3.5 w-3.5" />}
                >
                  Request Account Deletion (7-day queue)
                </Button>
              </div>
            </>
          )}
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

        {/* Confirm Account Deletion Custom Modal */}
        {showDeleteAccountDialog && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          >
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
              onClick={() => {
                if (!isDeletingAccount) setShowDeleteAccountDialog(false);
              }}
            />

            {/* Modal Box */}
            <div className="relative z-10 w-full max-w-lg rounded-3xl border border-red-200/90 bg-white p-6 sm:p-8 shadow-2xl dark:border-red-900/50 dark:bg-neutral-950 space-y-6 animate-in zoom-in-95 fade-in duration-200">
              {/* Header with Icon */}
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:bg-red-500/15 dark:text-red-400 shrink-0">
                  <AlertTriangleIcon className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                    Delete Your Account
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                    Permanent deletion request with a 7-day safety recovery window.
                  </p>
                </div>
              </div>

              {/* Warning Notice Card */}
              <div className="rounded-2xl border border-red-100 bg-red-50/50 p-4.5 dark:border-red-950/80 dark:bg-red-950/30 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-red-900 dark:text-red-300">
                  <span>What happens next:</span>
                </div>
                <ul className="text-xs space-y-2 text-neutral-600 dark:text-neutral-300 leading-relaxed list-disc list-inside">
                  <li>
                    <strong>Immediate Logout</strong>: All active sessions will be terminated right now.
                  </li>
                  <li>
                    <strong>7-Day Queue</strong>: Your shortened URLs and analytics remain disabled for 7 days.
                  </li>
                  <li>
                    <strong>Permanent Purge</strong>: After 7 days, your account data and redirect links are permanently erased.
                  </li>
                </ul>
              </div>

              {/* Confirmation Input Section */}
              <div className="space-y-3 pt-1">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                    To confirm this action, please type:
                  </label>
                  <div className="py-1">
                    <span className="inline-block font-mono text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-lg border border-red-200 dark:bg-red-950/60 dark:border-red-800 dark:text-red-400 select-all">
                      DELETE MY ACCOUNT
                    </span>
                  </div>
                </div>

                <Input
                  id="delete-account-confirmation-input"
                  type="text"
                  placeholder="Type DELETE MY ACCOUNT to confirm"
                  value={deleteConfirmationText}
                  onChange={(e) => setDeleteConfirmationText(e.target.value)}
                  disabled={isDeletingAccount}
                  className="font-mono text-xs h-10 tracking-wide"
                  autoFocus
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-3 border-t border-neutral-100 dark:border-neutral-800/80">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={() => setShowDeleteAccountDialog(false)}
                  disabled={isDeletingAccount}
                  className="w-full sm:w-auto h-10 px-5 text-xs font-medium"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="danger"
                  size="md"
                  onClick={handleConfirmDeleteAccount}
                  isLoading={isDeletingAccount}
                  disabled={
                    deleteConfirmationText.trim().toUpperCase() !== "DELETE MY ACCOUNT" ||
                    isDeletingAccount
                  }
                  className="w-full sm:w-auto h-10 px-5 text-xs font-semibold"
                >
                  {isDeletingAccount ? "Scheduling Deletion..." : "Permanently Delete Account"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
