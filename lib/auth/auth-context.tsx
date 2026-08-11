"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { loginApi, refreshApi, logoutApi, logoutAllApi } from "@/lib/api/auth";
import { setApiAuthToken } from "@/lib/api/client";
import type { LoginRequest } from "@/types/api";

interface User {
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitializing: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  logoutAll: () => Promise<void>;
  refreshSession: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to decode user email from JWT payload in memory without persistent storage
function parseJwtSubject(token: string): string | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const decoded = JSON.parse(jsonPayload);
    return decoded.sub || null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Automatic session restoration on application startup / page refresh (F5)
  useEffect(() => {
    let isMounted = true;

    const restoreSession = async () => {
      try {
        const response = await refreshApi();
        if (isMounted && response.accessToken) {
          const email = parseJwtSubject(response.accessToken) || "admin";
          setToken(response.accessToken);
          setUser({ email });
          setApiAuthToken(response.accessToken);
        }
      } catch {
        // No valid HttpOnly refresh cookie present -> stay unauthenticated
        if (isMounted) {
          setToken(null);
          setUser(null);
          setApiAuthToken(null);
        }
      } finally {
        if (isMounted) {
          setIsInitializing(false);
        }
      }
    };

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, []);

  // Listen for unauthorized 401 events and perform clean logout
  const handleUnauthorized = useCallback(() => {
    setToken(null);
    setUser(null);
    setApiAuthToken(null);

    // Invalidate backend cookie asynchronously
    logoutApi().catch(() => {});

    const isProtectedRoute =
      pathname.startsWith("/dashboard") ||
      pathname.startsWith("/urls") ||
      pathname.startsWith("/settings");

    if (isProtectedRoute) {
      router.push("/admin");
    }
  }, [pathname, router]);

  useEffect(() => {
    window.addEventListener("shortlink:unauthorized", handleUnauthorized);
    return () => {
      window.removeEventListener("shortlink:unauthorized", handleUnauthorized);
    };
  }, [handleUnauthorized]);

  const login = async (credentials: LoginRequest) => {
    const response = await loginApi(credentials);
    const accessToken = response.accessToken;

    setToken(accessToken);
    setUser({ email: credentials.email });
    setApiAuthToken(accessToken);

    router.push("/dashboard");
  };

  const logout = async () => {
    try {
      await logoutApi();
    } catch (e) {
      console.error("Logout error", e);
    } finally {
      setToken(null);
      setUser(null);
      setApiAuthToken(null);
      router.push("/admin");
    }
  };

  const logoutAll = async () => {
    try {
      await logoutAllApi();
    } catch (e) {
      console.error("Logout-all error", e);
    } finally {
      setToken(null);
      setUser(null);
      setApiAuthToken(null);
      router.push("/admin");
    }
  };

  const refreshSession = async (): Promise<boolean> => {
    try {
      const response = await refreshApi();
      if (response.accessToken) {
        const email = parseJwtSubject(response.accessToken) || user?.email || "admin";
        setToken(response.accessToken);
        setUser({ email });
        setApiAuthToken(response.accessToken);
        return true;
      }
      return false;
    } catch {
      setToken(null);
      setUser(null);
      setApiAuthToken(null);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading: isInitializing,
        isInitializing,
        login,
        logout,
        logoutAll,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
