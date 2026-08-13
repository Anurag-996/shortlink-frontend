"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { CheckCircleIcon, AlertCircleIcon, InfoIcon, XIcon } from "./icons";

export type ToastType = "success" | "error" | "info";

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = "info", duration = 4000) => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, message, type }]);

      setTimeout(() => {
        removeToast(id);
      }, duration);
    },
    [removeToast]
  );

  const success = useCallback(
    (message: string, duration?: number) => showToast(message, "success", duration),
    [showToast]
  );

  const error = useCallback(
    (message: string, duration?: number) => showToast(message, "error", duration),
    [showToast]
  );

  return (
    <ToastContext.Provider value={{ showToast, success, error }}>
      {children}
      <div
        aria-live="polite"
        className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 pointer-events-none w-[calc(100%-2rem)] sm:w-auto sm:max-w-md max-w-full"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role={toast.type === "error" ? "alert" : "status"}
            className={`pointer-events-auto flex items-start justify-between gap-3 w-full sm:min-w-[320px] rounded-xl border px-3.5 py-3 text-xs sm:text-sm font-medium shadow-lg backdrop-blur-md transition-all duration-200 animate-in fade-in slide-in-from-bottom-3 ${
              toast.type === "success"
                ? "border-emerald-200/80 bg-emerald-50/95 text-emerald-950 dark:border-emerald-800/80 dark:bg-emerald-950/95 dark:text-emerald-200 shadow-emerald-900/10"
                : toast.type === "error"
                ? "border-red-200/80 bg-red-50/95 text-red-950 dark:border-red-800/80 dark:bg-red-950/95 dark:text-red-200 shadow-red-900/10"
                : "border-neutral-200/80 bg-white/95 text-neutral-900 dark:border-neutral-800 dark:bg-neutral-900/95 dark:text-neutral-100 shadow-neutral-900/10"
            }`}
          >
            <div className="flex items-start gap-2.5 min-w-0 flex-1">
              {toast.type === "success" && (
                <CheckCircleIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              )}
              {toast.type === "error" && (
                <AlertCircleIcon className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
              )}
              {toast.type === "info" && (
                <InfoIcon className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              )}
              <span className="min-w-0 flex-1 break-words whitespace-normal leading-snug text-left">
                {toast.message}
              </span>
            </div>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 cursor-pointer p-0.5 shrink-0 rounded transition-colors -mr-1 -mt-0.5"
              aria-label="Dismiss notification"
            >
              <XIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
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
