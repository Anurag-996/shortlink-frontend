"use client";

import { useState, type SyntheticEvent } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { resetPasswordApi } from "@/lib/api/auth";
import { validateStrongPassword } from "@/lib/utils/password";
import {
  EyeIcon,
  EyeOffIcon,
  AlertCircleIcon,
  LockIcon,
  CheckCircleIcon,
} from "@/components/ui/icons";

interface ResetPasswordFormProps {
  token: string;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const { success, error: toastError } = useToast();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const passwordValidation = validateStrongPassword(newPassword);
  const isConfirmTouched = confirmPassword.length > 0;
  const passwordsMatch = newPassword === confirmPassword;
  const isConfirmMismatch = isConfirmTouched && !passwordsMatch;

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!passwordValidation.isValid) {
      setError(passwordValidation.errorMessage || "Please enter a strong password.");
      return;
    }

    if (!passwordsMatch) {
      setError("Passwords do not match.");
      return;
    }

    if (!token || !token.trim()) {
      setError("Invalid or missing reset token. Please request a new reset link.");
      return;
    }

    setIsLoading(true);

    try {
      await resetPasswordApi({
        token: token.trim(),
        newPassword,
        confirmPassword,
      });
      setIsSuccess(true);
      success("Password reset successfully! You can now log in.");
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to reset password. The link may have expired.";
      setError(msg);
      toastError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="w-full max-w-[380px] rounded-2xl border border-neutral-200/90 bg-white p-8 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/90 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
            <CheckCircleIcon className="h-6 w-6" />
          </div>

          <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            Password updated!
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
            Your password has been changed successfully. You can now sign in with your new credentials.
          </p>

          <div className="mt-6 w-full pt-2">
            <Link href="/login" className="block w-full">
              <Button variant="primary" size="md" className="w-full text-xs">
                Sign in to TinyClick
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[380px] rounded-2xl border border-neutral-200/90 bg-white p-8 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/90">
      {/* Header */}
      <div className="mb-6 flex flex-col items-center text-center">
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-900 text-white shadow-xs dark:bg-neutral-100 dark:text-neutral-900">
          <LockIcon className="h-5 w-5" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
          Reset password
        </h1>
        <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
          Choose a strong, secure new password
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div
          role="alert"
          className="mb-5 flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50/90 p-3 text-xs text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300"
        >
          <AlertCircleIcon className="h-4 w-4 shrink-0 mt-0.5" />
          <span className="leading-snug whitespace-pre-line">{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            id="reset-new-password"
            label="New Password"
            type={showPassword ? "text" : "password"}
            placeholder="Min. 8 chars (uppercase, lowercase, number, symbol)"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={isLoading}
            autoComplete="new-password"
            required
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 cursor-pointer p-1"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeIcon className="h-4 w-4" /> : <EyeOffIcon className="h-4 w-4" />}
              </button>
            }
          />

          {/* Strength checklist */}
          {newPassword.length > 0 && (
            <div className="mt-2 grid grid-cols-2 gap-1 rounded-lg border border-neutral-100 bg-neutral-50/60 p-2.5 text-[11px] dark:border-neutral-800/80 dark:bg-neutral-950/40">
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
        </div>

        <div>
          <Input
            id="reset-confirm-password"
            label="Confirm New Password"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Re-enter new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={isLoading}
            autoComplete="new-password"
            error={isConfirmMismatch ? "Passwords do not match" : undefined}
            required
            rightIcon={
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 cursor-pointer p-1"
                aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
              >
                {showConfirmPassword ? (
                  <EyeIcon className="h-4 w-4" />
                ) : (
                  <EyeOffIcon className="h-4 w-4" />
                )}
              </button>
            }
          />
          {isConfirmTouched && passwordsMatch && (
            <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <CheckCircleIcon className="h-3.5 w-3.5" />
              <span>Passwords match</span>
            </p>
          )}
        </div>

        <div className="pt-2">
          <Button type="submit" className="w-full" size="md" isLoading={isLoading}>
            {isLoading ? "Updating password..." : "Set New Password"}
          </Button>
        </div>
      </form>

      {/* Footer Link */}
      <div className="mt-6 text-center text-xs text-neutral-500 dark:text-neutral-400">
        Back to{" "}
        <Link
          href="/login"
          className="font-medium text-neutral-900 hover:underline dark:text-neutral-100"
        >
          Sign in
        </Link>
      </div>
    </div>
  );
}

