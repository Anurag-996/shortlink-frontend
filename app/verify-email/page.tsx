"use client";

import { Suspense, useEffect, useState, type SyntheticEvent } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { verifyEmailApi, resendVerificationApi } from "@/lib/api/auth";
import {
  LinkIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  MailIcon,
  RefreshCwIcon,
} from "@/components/ui/icons";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { success, error: toastError } = useToast();

  const [status, setStatus] = useState<"loading" | "success" | "error" | "idle">(() =>
    token && token.trim() ? "loading" : "idle"
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resendEmail, setResendEmail] = useState("");
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (!token || !token.trim()) {
      return;
    }

    let isMounted = true;

    const performVerification = async () => {
      try {
        await verifyEmailApi(token.trim());
        if (isMounted) {
          setStatus("success");
          success("Email verified successfully! Welcome to TinyClick.");
        }
      } catch (err: unknown) {
        if (isMounted) {
          const msg =
            err instanceof Error
              ? err.message
              : "Invalid or expired verification token. Please request a new link.";
          setErrorMessage(msg);
          setStatus("error");
          toastError(msg);
        }
      }
    };

    performVerification();

    return () => {
      isMounted = false;
    };
  }, [token, success, toastError]);

  const handleResendSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!resendEmail.trim()) return;

    setIsResending(true);
    try {
      const res = await resendVerificationApi(resendEmail.trim().toLowerCase());
      success(res.message || "If a pending registration exists, a verification link has been sent.");
      setResendEmail("");
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to resend verification email.";
      toastError(msg);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="w-full max-w-[420px] rounded-2xl border border-neutral-200/90 bg-white p-8 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/90 animate-in fade-in zoom-in-95 duration-200">
      {/* Brand Icon */}
      <div className="mb-6 flex flex-col items-center text-center">
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-900 text-white shadow-xs dark:bg-neutral-100 dark:text-neutral-900">
          <LinkIcon className="h-5 w-5" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
          TinyClick
        </h1>
        <h2 className="mt-1 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
          Email Verification
        </h2>
      </div>

      {/* State: Verifying */}
      {status === "loading" && (
        <div className="flex flex-col items-center py-6 text-center space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900 dark:border-neutral-700 dark:border-t-neutral-100" />
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Validating your verification token...
          </p>
        </div>
      )}

      {/* State: Success */}
      {status === "success" && (
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
            <CheckCircleIcon className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
              Account Activated!
            </h3>
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Your email has been verified. You can now sign in to your TinyClick account and start creating short links.
            </p>
          </div>

          <div className="w-full pt-2">
            <Link href="/login" className="block w-full">
              <Button variant="primary" size="md" className="w-full text-xs">
                Sign in to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* State: Error / Expired */}
      {status === "error" && (
        <div className="space-y-5">
          <div className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50/90 p-3 text-xs text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
            <AlertCircleIcon className="h-4 w-4 shrink-0 mt-0.5" />
            <span className="leading-snug">
              {errorMessage || "The verification token is invalid or has expired."}
            </span>
          </div>

          <div className="rounded-xl border border-neutral-100 bg-neutral-50/80 p-4 dark:border-neutral-800 dark:bg-neutral-950/40">
            <h3 className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 mb-1">
              Need a new link?
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-3">
              Enter your email address to receive a fresh verification link.
            </p>
            <form onSubmit={handleResendSubmit} className="space-y-2.5">
              <Input
                id="resend-email-input"
                type="email"
                placeholder="alex@example.com"
                value={resendEmail}
                onChange={(e) => setResendEmail(e.target.value)}
                disabled={isResending}
                required
              />
              <Button
                type="submit"
                variant="outline"
                size="sm"
                className="w-full text-xs"
                isLoading={isResending}
                leftIcon={<RefreshCwIcon className="h-3.5 w-3.5" />}
              >
                {isResending ? "Sending..." : "Resend Verification Link"}
              </Button>
            </form>
          </div>

          <div className="text-center pt-1">
            <Link
              href="/login"
              className="text-xs font-medium text-neutral-700 hover:underline dark:text-neutral-300"
            >
              Back to Sign in
            </Link>
          </div>
        </div>
      )}

      {/* State: Idle (no token in query string) */}
      {status === "idle" && (
        <div className="space-y-5">
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200">
              <MailIcon className="h-6 w-6" />
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Please click the link sent to your email address to complete verification, or enter your email below to resend.
            </p>
          </div>

          <form onSubmit={handleResendSubmit} className="space-y-3">
            <Input
              id="idle-resend-email"
              label="Email Address"
              type="email"
              placeholder="alex@example.com"
              value={resendEmail}
              onChange={(e) => setResendEmail(e.target.value)}
              disabled={isResending}
              required
            />
            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full text-xs"
              isLoading={isResending}
            >
              {isResending ? "Sending..." : "Send Verification Link"}
            </Button>
          </form>

          <div className="text-center pt-2">
            <Link
              href="/login"
              className="text-xs font-medium text-neutral-700 hover:underline dark:text-neutral-300"
            >
              Back to Sign in
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#fafafa] p-4 dark:bg-[#09090b]">
      <div className="w-full max-w-[420px] space-y-4">
        <Suspense
          fallback={
            <div className="flex justify-center p-8">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900 dark:border-neutral-700 dark:border-t-neutral-100" />
            </div>
          }
        >
          <VerifyEmailContent />
        </Suspense>

        <div className="text-center">
          <Link
            href="/"
            className="text-xs text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors"
          >
            ← Back to URL Shortener
          </Link>
        </div>
      </div>
    </div>
  );
}
