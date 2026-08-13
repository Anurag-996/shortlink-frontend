"use client";

import { useState, type SyntheticEvent } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { forgotPasswordApi } from "@/lib/api/auth";
import { LinkIcon, AlertCircleIcon, KeyIcon } from "@/components/ui/icons";

export function ForgotPasswordForm() {
  const { success, error: toastError } = useToast();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) {
      setError("Please enter your email address.");
      return;
    }

    setIsLoading(true);

    try {
      await forgotPasswordApi(trimmedEmail);
      setIsSubmitted(true);
      success("Password reset link has been dispatched.");
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to request password reset.";
      setError(msg);
      toastError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="w-full max-w-[380px] rounded-2xl border border-neutral-200/90 bg-white p-8 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/90 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100">
            <KeyIcon className="h-6 w-6" />
          </div>

          <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            Check your inbox
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
            If an account matches <span className="font-medium text-neutral-800 dark:text-neutral-200">{email.trim()}</span>, we’ve sent a password reset link.
          </p>
          <p className="mt-2 text-xs text-neutral-400 dark:text-neutral-500">
            The link is valid for 1 hour.
          </p>

          <div className="mt-6 w-full space-y-3 pt-2">
            <Link href="/login" className="block w-full">
              <Button variant="primary" size="md" className="w-full text-xs">
                Back to Sign in
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[380px] rounded-2xl border border-neutral-200/90 bg-white p-8 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/90">
      {/* Wordmark Header */}
      <div className="mb-6 flex flex-col items-center text-center">
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-900 text-white shadow-xs dark:bg-neutral-100 dark:text-neutral-900">
          <LinkIcon className="h-5 w-5" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
          TinyClick
        </h1>
        <h2 className="mt-1 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
          Forgot your password?
        </h2>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Enter your email to receive reset instructions
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
            id="forgot-email"
            label="Email Address"
            type="email"
            placeholder="alex@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            autoComplete="email"
            required
          />
        </div>

        <div className="pt-2">
          <Button type="submit" className="w-full" size="md" isLoading={isLoading}>
            {isLoading ? "Sending link..." : "Send Reset Link"}
          </Button>
        </div>
      </form>

      {/* Footer Link */}
      <div className="mt-6 text-center text-xs text-neutral-500 dark:text-neutral-400">
        Remembered your password?{" "}
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
