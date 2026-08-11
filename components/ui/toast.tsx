"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircleIcon, AlertCircleIcon, XIcon } from "./icons";

export type ToastType = "success" | "error" | "info";

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
  success: (message: string) => void;
  error: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = "info") => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, message, type }]);

      setTimeout(() => {
        removeToast(id);
      }, 3000);
    },
    [removeToast]
  );

  const success = useCallback(
    (message: string) => showToast(message, "success"),
    [showToast]
  );

  const error = useCallback(
    (message: string) => showToast(message, "error"),
    [showToast]
  );

  return (
    <ToastContext.Provider value={{ showToast, success, error }}>
      {children}
      <div
        aria-live="polite"
        className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 rounded-lg border px-4 py-3 text-xs font-medium shadow-md transition-all animate-in slide-in-from-bottom-2 duration-200 ${
              toast.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-800/80 dark:bg-emerald-950/90 dark:text-emerald-200"
                : toast.type === "error"
                ? "border-red-200 bg-red-50 text-red-900 dark:border-red-800/80 dark:bg-red-950/90 dark:text-red-200"
                : "border-neutral-200 bg-white text-neutral-900 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100"
            }`}
          >
            <div className="flex items-center gap-2">
              {toast.type === "success" && (
                <CheckCircleIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              )}
              {toast.type === "error" && (
                <AlertCircleIcon className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
              )}
              <span>{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer p-0.5"
              aria-label="Dismiss notification"
            >
              <XIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
