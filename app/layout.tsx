import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/lib/auth/auth-context";
import { ToastProvider } from "@/components/ui/toast";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "TinyClick",
    template: "%s | TinyClick",
  },
  description:
    "Free, fast, and privacy-friendly URL shortener. Shorten long destination URLs with custom aliases, expiration dates, and real-time click analytics.",
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  keywords: [
    "tinyclick",
    "url shortener",
    "link shortener",
    "short link",
    "custom url alias",
    "click analytics",
    "free url shortener",
  ],
  authors: [{ name: "TinyClick Team" }],
  creator: "TinyClick",
  publisher: "TinyClick",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://tinyclick.in"
  ),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "TinyClick",
    title: "TinyClick",
    description:
      "Transform long URLs into clean, fast, and trackable short links with custom aliases and real-time analytics.",
  },
  twitter: {
    card: "summary_large_image",
    title: "TinyClick",
    description:
      "Transform long URLs into clean, fast, and trackable short links with custom aliases and real-time analytics.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <AuthProvider>
          <ToastProvider>
            {children}
            <Analytics />
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
