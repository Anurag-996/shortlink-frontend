const API_BASE_URL = process.env.NEXT_PUBLIC_GATEWAY_URL || "";

export interface BackendErrorPayload {
  message?: string;
  error?: string;
  detail?: string;
  errors?: Record<string, string> | string[];
}

// In-memory access token storage (never persisted to localStorage or cookies)
let currentToken: string | null = null;
let refreshPromise: Promise<string | null> | null = null;

export function setApiAuthToken(token: string | null) {
  currentToken = token;
}

export function getApiAuthToken(): string | null {
  return currentToken;
}

export class ApiException extends Error {
  status: number;
  errors?: Record<string, string> | string[];

  constructor(status: number, message: string, errors?: Record<string, string> | string[]) {
    super(message);
    this.name = "ApiException";
    this.status = status;
    this.errors = errors;
  }
}

function getErrorMessage(status: number, backendMessage?: string): string {
  if (backendMessage && backendMessage.trim().length > 0 && !backendMessage.startsWith("Internal Server Error")) {
    return backendMessage;
  }

  switch (status) {
    case 400:
      return "Please check the information you entered.";
    case 401:
      return "Your session has expired. Please sign in again.";
    case 403:
      return "You do not have permission to perform this action.";
    case 404:
      return "The requested resource could not be found.";
    case 409:
      return "This custom alias is already in use. Please choose another.";
    case 429:
      return "Too many requests. Please try again shortly.";
    case 500:
    case 502:
    case 503:
      return "Something went wrong on our end. Please try again.";
    default:
      return "An unexpected error occurred. Please try again.";
  }
}

// Atomic refresh helper that deduplicates concurrent 401 / initialization refresh calls
export async function executeTokenRefresh(): Promise<string | null> {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      const url = `${API_BASE_URL}/api/auth/refresh`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Browser automatically sends HttpOnly refresh token cookie
      });

      if (!response.ok) {
        setApiAuthToken(null);
        return null;
      }

      const data = await response.json();
      if (data && data.accessToken) {
        setApiAuthToken(data.accessToken);
        return data.accessToken as string;
      }
      setApiAuthToken(null);
      return null;
    } catch {
      setApiAuthToken(null);
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {},
  isRetry: boolean = false
): Promise<T> {
  const url = endpoint.startsWith("http") ? endpoint : `${API_BASE_URL}${endpoint}`;

  const headers = new Headers(options.headers || {});
  
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (currentToken && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${currentToken}`);
  }

  const config: RequestInit = {
    ...options,
    headers,
    credentials: "include", // Required for HttpOnly refresh token cookie
  };

  let response: Response;
  try {
    response = await fetch(url, config);
  } catch {
    throw new ApiException(
      0,
      "Unable to connect to the server. Please check your connection."
    );
  }

  // Handle 401 with single token refresh attempt (skip for auth endpoints to prevent loops)
  const isAuthEndpoint = endpoint.includes("/api/auth/");
  if (response.status === 401 && !isRetry && !isAuthEndpoint) {
    const newToken = await executeTokenRefresh();
    if (newToken) {
      // Retry original request once with new in-memory access token
      const retryHeaders = new Headers(options.headers || {});
      if (!retryHeaders.has("Content-Type") && !(options.body instanceof FormData)) {
        retryHeaders.set("Content-Type", "application/json");
      }
      retryHeaders.set("Authorization", `Bearer ${newToken}`);

      return apiClient<T>(
        endpoint,
        {
          ...options,
          headers: retryHeaders,
        },
        true
      );
    }

    // Refresh failed or revoked -> clear state and notify application
    setApiAuthToken(null);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("shortlink:unauthorized"));
    }
  }

  if (!response.ok) {
    let errorData: BackendErrorPayload | null = null;
    try {
      const parsed = await response.json();
      if (parsed && typeof parsed === "object") {
        errorData = parsed as BackendErrorPayload;
      }
    } catch {
      // Body may not be JSON
    }

    const backendMsg = errorData?.message || errorData?.error || errorData?.detail;
    const errors = errorData?.errors;
    let message = getErrorMessage(response.status, backendMsg);

    // If specific field validation errors exist, extract or combine error messages for the client
    if (errors && typeof errors === "object" && !Array.isArray(errors)) {
      const fieldErrors = Object.values(errors)
        .filter((val): val is string => typeof val === "string" && val.trim().length > 0);

      if (fieldErrors.length === 1) {
        message = fieldErrors[0];
      } else if (fieldErrors.length > 1) {
        message = fieldErrors.join("\n");
      }
    }

    throw new ApiException(response.status, message, errors);
  }

  if (response.status === 204) {
    return {} as T;
  }

  try {
    return (await response.json()) as T;
  } catch {
    return {} as T;
  }
}
