/**
 * Format a short code into the full public short link URL.
 */
export function formatPublicShortUrl(shortCode: string): string {
  if (typeof window !== "undefined" && window.location.origin) {
    return `${window.location.origin}/${shortCode}`;
  }
  return `http://localhost:3000/${shortCode}`;
}

/**
 * Truncate long URLs with ellipsis while keeping them readable.
 */
export function truncateUrl(url: string, maxLength: number = 48): string {
  if (!url) return "";
  if (url.length <= maxLength) return url;
  
  // Remove protocol for display brevity if needed, or keep prefix and middle ellipsis
  const cleaned = url.replace(/^https?:\/\//, "");
  if (cleaned.length <= maxLength) return cleaned;

  const start = cleaned.slice(0, Math.floor((maxLength - 3) * 0.65));
  const end = cleaned.slice(-Math.floor((maxLength - 3) * 0.35));
  return `${start}...${end}`;
}

/**
 * Format ISO datetime string into human readable format.
 */
export function formatDate(isoString: string | null | undefined): string {
  if (!isoString) return "Never";
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;

    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  } catch {
    return isoString;
  }
}

/**
 * Format ISO datetime string with time.
 */
export function formatDateTime(isoString: string | null | undefined): string {
  if (!isoString) return "Never";
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;

    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(date);
  } catch {
    return isoString;
  }
}

/**
 * Format expiry status into a concise label.
 */
export function formatExpiryStatus(expiresAt: string | null | undefined): {
  label: string;
  isExpired: boolean;
} {
  if (!expiresAt) {
    return { label: "No expiry", isExpired: false };
  }

  const expiryDate = new Date(expiresAt);
  const now = new Date();

  if (isNaN(expiryDate.getTime())) {
    return { label: expiresAt, isExpired: false };
  }

  const diffMs = expiryDate.getTime() - now.getTime();
  if (diffMs <= 0) {
    return { label: "Expired", isExpired: true };
  }

  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) {
    return { label: `Expires in ${diffDays}d`, isExpired: false };
  } else if (diffHours > 0) {
    return { label: `Expires in ${diffHours}h`, isExpired: false };
  } else {
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    return { label: `Expires in ${Math.max(1, diffMinutes)}m`, isExpired: false };
  }
}

/**
 * Format number with comma separators.
 */
export function formatNumber(num: number | null | undefined): string {
  if (num === null || num === undefined) return "0";
  return new Intl.NumberFormat("en-US").format(num);
}

/**
 * Basic URL validation.
 */
export function isValidUrl(urlString: string): boolean {
  try {
    const parsed = new URL(urlString);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}
