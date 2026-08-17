import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import { LinkIcon, AlertCircleIcon } from "@/components/ui/icons";

interface ShortCodePageProps {
  params: Promise<{
    shortCode: string;
  }>;
}

const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL || "http://localhost:8080";

export async function generateMetadata({
  params,
}: ShortCodePageProps): Promise<Metadata> {
  const { shortCode } = await params;
  return {
    title: `Redirecting /${shortCode}`,
    description: `Redirecting to destination URL for short link /${shortCode}.`,
    robots: {
      index: false,
      follow: false,
    },
  };
}

async function resolveShortCode(
  shortCode: string,
  forwardHeaders: Record<string, string>
): Promise<{ status: number; location: string | null }> {
  try {
    const res = await fetch(`${GATEWAY_URL}/${encodeURIComponent(shortCode)}`, {
      method: "GET",
      headers: forwardHeaders,
      redirect: "manual",
      cache: "no-store",
    });

    return {
      status: res.status,
      location: res.headers.get("Location"),
    };
  } catch (error) {
    console.error("Short link redirect error:", error);
    return { status: 500, location: null };
  }
}

export default async function ShortCodeRedirectPage({ params }: ShortCodePageProps) {
  const { shortCode } = await params;
  const headerList = await headers();

  const forwardHeaders: Record<string, string> = {};
  const headerNames = [
    "x-forwarded-for",
    "x-real-ip",
    "user-agent",
    "referer",
    "x-vercel-ip-country",
    "x-vercel-ip-country-region",
    "x-vercel-ip-city",
    "x-vercel-ip-timezone",
    "cf-ipcountry",
    "cf-region",
    "cf-ipcity",
    "cf-timezone",
    "x-country-code",
    "x-country",
    "x-region",
    "x-city",
    "accept-language",
  ];

  for (const name of headerNames) {
    const val = headerList.get(name);
    if (val) {
      forwardHeaders[name] = val;
    }
  }

  const { status, location } = await resolveShortCode(
    shortCode,
    forwardHeaders
  );

  // 1. If valid short URL (302 Found), redirect directly to destination
  if ((status === 302 || status === 301 || status === 307) && location) {
    redirect(location);
  }

  // 2. If expired (410 Gone), display styled Link Expired page
  if (status === 410) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#fafafa] p-4 text-neutral-900 dark:bg-[#09090b] dark:text-neutral-100">
        <div className="w-full max-w-md text-center space-y-4 rounded-2xl border border-neutral-200/90 bg-white p-8 shadow-xs dark:border-neutral-800 dark:bg-neutral-900/90 animate-in fade-in duration-200">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <AlertCircleIcon className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">Link Expired</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            The short link <span className="font-mono font-semibold text-neutral-800 dark:text-neutral-200">/{shortCode}</span> has expired and is no longer active.
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex h-10 items-center justify-center rounded-xl bg-neutral-900 px-5 text-xs font-medium text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-white transition-colors"
            >
              Create a new short link
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 3. If invalid short link (404 Not Found), render branded Not Found page
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#fafafa] p-4 text-neutral-900 dark:bg-[#09090b] dark:text-neutral-100">
      <div className="w-full max-w-md text-center space-y-4 rounded-2xl border border-neutral-200/90 bg-white p-8 shadow-xs dark:border-neutral-800 dark:bg-neutral-900/90 animate-in fade-in duration-200">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-600 dark:text-red-400">
          <LinkIcon className="h-6 w-6" />
        </div>
        <h1 className="text-xl font-bold tracking-tight">Short Link Not Found</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          The link <span className="font-mono font-semibold text-neutral-800 dark:text-neutral-200">/{shortCode}</span> does not exist or may have been deleted.
        </p>
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex h-10 items-center justify-center rounded-xl bg-neutral-900 px-5 text-xs font-medium text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-white transition-colors"
          >
            Go to URL Shortener
          </Link>
        </div>
      </div>
    </div>
  );
}
