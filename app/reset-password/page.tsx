"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { Button } from "@/components/ui/button";
import { AlertCircleIcon } from "@/components/ui/icons";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  if (!token || !token.trim()) {
    return (
      <div className="w-full max-w-[380px] rounded-2xl border border-neutral-200/90 bg-white p-8 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/90 text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-950/60 dark:text-red-400 mx-auto">
          <AlertCircleIcon className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
          Invalid Reset Link
        </h2>
        <p className="mt-2 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
          No password reset token was found in the URL. Please request a new password reset link.
        </p>
        <div className="mt-6">
          <Link href="/forgot-password" className="block w-full">
            <Button variant="primary" size="md" className="w-full text-xs">
              Request Reset Link
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return <ResetPasswordForm token={token.trim()} />;
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#fafafa] p-4 dark:bg-[#09090b]">
      <div className="w-full max-w-[380px] space-y-4">
        <Suspense
          fallback={
            <div className="flex justify-center p-8">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900 dark:border-neutral-700 dark:border-t-neutral-100" />
            </div>
          }
        >
          <ResetPasswordContent />
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
