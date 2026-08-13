"use client";

import { useState, type SyntheticEvent } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { registerApi, resendVerificationApi } from "@/lib/api/auth";
import { validateStrongPassword } from "@/lib/utils/password";
import {
  LinkIcon,
  EyeIcon,
  EyeOffIcon,
  AlertCircleIcon,
  CheckCircleIcon,
  MailIcon,
  RefreshCwIcon,
} from "@/components/ui/icons";

export function RegisterForm() {
  const { success, error: toastError } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const passwordValidation = validateStrongPassword(password);
  const isConfirmTouched = confirmPassword.length > 0;
  const passwordsMatch = password === confirmPassword;
  const isConfirmMismatch = isConfirmTouched && !passwordsMatch;

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedName) {
      setError("Please enter your name.");
      return;
    }
    if (!trimmedEmail) {
      setError("Please enter your email address.");
      return;
    }
    if (!passwordValidation.isValid) {
      setError(passwordValidation.errorMessage || "Please enter a strong password.");
      return;
    }
    if (!passwordsMatch) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      await registerApi({
        name: trimmedName,
        email: trimmedEmail,
        password,
        confirmPassword,
      });
      setIsSubmitted(true);
      success("Verification email sent! Please check your inbox.");
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Registration failed. Please check your details and try again.";
      setError(message);
      toastError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email.trim()) return;
    setIsResending(true);
    try {
      await resendVerificationApi(email.trim().toLowerCase());
      success("A fresh verification link has been sent to your email.");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to resend verification email.";
      toastError(message);
    } finally {
      setIsResending(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="w-full max-w-[420px] rounded-2xl border border-neutral-200/90 bg-white p-8 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/90 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
            <MailIcon className="h-6 w-6" />
          </div>

          <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            Verify your email
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
            We’ve sent a verification link to:
          </p>
          <p className="mt-1 font-mono text-xs font-semibold text-neutral-900 dark:text-neutral-100 bg-neutral-100 dark:bg-neutral-800/80 px-2.5 py-1 rounded-md">
            {email.trim().toLowerCase()}
          </p>
          <p className="mt-3 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
            Click the link inside the email to activate your TinyClick account. The link expires in 24 hours.
          </p>

          <div className="mt-6 w-full space-y-3 pt-2">
            <Button
              type="button"
              variant="outline"
              size="md"
              className="w-full text-xs"
              onClick={handleResend}
              isLoading={isResending}
              leftIcon={<RefreshCwIcon className="h-3.5 w-3.5" />}
            >
              {isResending ? "Resending link..." : "Resend verification email"}
            </Button>

            <Link href="/login" className="block w-full">
              <Button variant="secondary" size="md" className="w-full text-xs">
                Back to Sign in
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[420px] rounded-2xl border border-neutral-200/90 bg-white p-8 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/90">
      {/* Brand Header */}
      <div className="mb-6 flex flex-col items-center text-center">
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-900 text-white shadow-xs dark:bg-neutral-100 dark:text-neutral-900">
          <LinkIcon className="h-5 w-5" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
          TinyClick
        </h1>
        <h2 className="mt-1 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
          Create your account
        </h2>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Shorten links, track clicks, and customize aliases
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

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            id="register-name"
            label="Full Name"
            type="text"
            placeholder="Alex Smith"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isLoading}
            autoComplete="name"
            required
          />
        </div>

        <div>
          <Input
            id="register-email"
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

        <div>
          <Input
            id="register-password"
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="Min. 8 chars (uppercase, lowercase, number, symbol)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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

          {/* Password strength checklist hint */}
          {password.length > 0 && (
            <div className="mt-2 grid grid-cols-2 gap-1 rounded-lg border border-neutral-100 bg-neutral-50/60 p-2.5 text-[11px] dark:border-neutral-800/80 dark:bg-neutral-950/40">
              <span className={passwordValidation.hasMinLength ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-neutral-400"}>
                {passwordValidation.hasMinLength ? "✓" : "•"} At least 8 characters
              </span>
              <span className={passwordValidation.hasUppercase ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-neutral-400"}>
                {passwordValidation.hasUppercase ? "✓" : "•"} Uppercase letter (A-Z)
              </span>
              <span className={passwordValidation.hasLowercase ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-neutral-400"}>
                {passwordValidation.hasLowercase ? "✓" : "•"} Lowercase letter (a-z)
              </span>
              <span className={passwordValidation.hasDigit && passwordValidation.hasSpecialChar ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-neutral-400"}>
                {passwordValidation.hasDigit && passwordValidation.hasSpecialChar ? "✓" : "•"} Number & Symbol
              </span>
            </div>
          )}
        </div>

        <div>
          <Input
            id="register-confirm-password"
            label="Confirm Password"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Re-enter password"
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
            {isLoading ? "Creating account..." : "Sign up with Email"}
          </Button>
        </div>
      </form>

      {/* Footer Link */}
      <div className="mt-6 text-center text-xs text-neutral-500 dark:text-neutral-400">
        Already have an account?{" "}
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

