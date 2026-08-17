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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://tinyclick.in";

export const metadata: Metadata = {
  title: {
    default: "TinyClick | Free Fast URL Shortener & Link Analytics",
    template: "%s | TinyClick",
  },
  description:
    "Free, fast, and privacy-friendly URL shortener. Shorten long links with custom aliases, editable destinations, expiration dates, and real-time click analytics. Zero ads, instant 302 redirects.",
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  keywords: [
    "tinyclick",
    "url shortener",
    "link shortener",
    "short link generator",
    "free url shortener",
    "custom url alias",
    "click analytics",
    "trackable links",
    "editable destination urls",
    "link expiration",
    "privacy link shortener",
    "fast url redirection",
    "link management platform",
    "bitly alternative",
    "shorten url free",
    "tiny url",
  ],
  authors: [{ name: "TinyClick Team", url: siteUrl }],
  creator: "TinyClick",
  publisher: "TinyClick",
  applicationName: "TinyClick",
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "TinyClick",
    title: "TinyClick | Free Fast URL Shortener & Link Analytics",
    description:
      "Transform long URLs into clean, fast, and trackable short links with custom aliases, editable destinations, and real-time analytics.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "TinyClick - Free Fast URL Shortener with Custom Links & Analytics",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TinyClick | Free Fast URL Shortener & Link Analytics",
    description:
      "Transform long URLs into clean, fast, and trackable short links with custom aliases, editable destinations, and real-time analytics.",
    images: ["/twitter-image"],
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
  category: "technology",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const globalStructuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "TinyClick",
        url: siteUrl,
        logo: `${siteUrl}/icon.png`,
        description:
          "Fast, privacy-friendly URL shortener and link analytics platform.",
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "TinyClick",
        publisher: {
          "@id": `${siteUrl}/#organization`,
        },
        description:
          "Free, fast, and privacy-friendly URL shortener with real-time analytics and custom aliases.",
        inLanguage: "en-US",
      },
    ],
  };

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(globalStructuredData),
          }}
        />
      </head>
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
