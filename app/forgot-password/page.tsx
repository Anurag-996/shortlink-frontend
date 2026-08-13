"use client";

import Link from "next/link";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#fafafa] p-4 dark:bg-[#09090b]">
      <div className="w-full max-w-[380px] space-y-4">
        <ForgotPasswordForm />
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
