"use client";

import { useState, type SyntheticEvent } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { resendVerificationApi } from "@/lib/api/auth";
import { useToast } from "@/components/ui/toast";
import { LinkIcon, EyeIcon, EyeOffIcon, AlertCircleIcon, RefreshCwIcon } from "@/components/ui/icons";

export function LoginForm() {
  const { login } = useAuth();
  const { success, error: toastError } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    if (!password.trim()) {
      setError("Please enter your password.");
      return;
    }

    setIsLoading(true);

    try {
      await login({ email: email.trim(), password });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Invalid credentials. Please check your email and password.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) {
      setError("Please enter your email address above to resend the verification link.");
      return;
    }

    setIsResending(true);
    try {
      await resendVerificationApi(trimmedEmail);
      success("Verification link sent! Please check your inbox.");
      setError(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to resend verification email.";
      toastError(msg);
    } finally {
      setIsResending(false);
    }
  };

  const UNVERIFIED_ERROR_MSG = "Please verify your email address before logging in";
  const isUnverifiedError = error === UNVERIFIED_ERROR_MSG || error === "User account is disabled";

  return (
    <div className="w-full max-w-[380px] rounded-2xl border border-neutral-200/90 bg-white p-8 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/90">
      {/* Wordmark & Brand Header */}
      <div className="mb-6 flex flex-col items-center text-center">
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-900 text-white shadow-xs dark:bg-neutral-100 dark:text-neutral-900">
          <LinkIcon className="h-5 w-5" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
          TinyClick
        </h1>
        <h2 className="mt-1 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
          Welcome back
        </h2>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Sign in to your account
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div
          role="alert"
          className="mb-5 space-y-2 rounded-lg border border-red-200 bg-red-50/90 p-3 text-xs text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300"
        >
          <div className="flex items-start gap-2.5">
            <AlertCircleIcon className="h-4 w-4 shrink-0 mt-0.5" />
            <span className="leading-snug whitespace-pre-line">{error}</span>
          </div>

          {isUnverifiedError && (
            <div className="pt-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full text-xs bg-white dark:bg-neutral-900"
                onClick={handleResendVerification}
                isLoading={isResending}
                leftIcon={<RefreshCwIcon className="h-3.5 w-3.5" />}
              >
                {isResending ? "Resending..." : "Resend Verification Email"}
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            id="email-input"
            label="Email"
            type="email"
            placeholder="alex@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            autoComplete="email"
            required
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="password-input"
              className="text-xs font-medium text-neutral-700 dark:text-neutral-300"
            >
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            id="password-input"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            autoComplete="current-password"
            required
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 cursor-pointer p-1"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeIcon className="h-4 w-4" />
                ) : (
                  <EyeOffIcon className="h-4 w-4" />
                )}
              </button>
            }
          />
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            className="w-full"
            size="md"
            isLoading={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        </div>
      </form>

      {/* Footer Link to Register */}
      <div className="mt-6 text-center text-xs text-neutral-500 dark:text-neutral-400">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-medium text-neutral-900 hover:underline dark:text-neutral-100"
        >
          Sign up
        </Link>
      </div>
    </div>
  );
}

