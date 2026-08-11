"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/auth/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LinkIcon, EyeIcon, EyeOffIcon, AlertCircleIcon } from "@/components/ui/icons";

export function LoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    // Basic client-side validation
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
          Sign in to continue
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div
          role="alert"
          className="mb-5 flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50/90 p-3 text-xs text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300"
        >
          <AlertCircleIcon className="h-4 w-4 shrink-0 mt-0.5" />
          <span className="leading-snug">{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            id="email-input"
            label="Email"
            type="email"
            placeholder="admin@shortlink.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            autoComplete="email"
            required
          />
        </div>

        <div>
          <Input
            id="password-input"
            label="Password"
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
    </div>
  );
}
