import type { Metadata } from "next";
import Link from "next/link";
import { LinkIcon, SparklesIcon } from "@/components/ui/icons";
import { FaqClient, type FaqItem } from "@/components/faq/faq-client";
import { PublicNavbar } from "@/components/layout/public-navbar";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://tinyclick.in";

export const metadata: Metadata = {
  title: "Frequently Asked Questions (FAQ)",
  description:
    "Find answers to common questions about TinyClick URL shortener, custom aliases, link tracking, editable destinations, link expiration, and privacy policies.",
  alternates: {
    canonical: "/faq",
  },
  openGraph: {
    title: "Frequently Asked Questions (FAQ) | TinyClick",
    description:
      "Find answers to common questions about TinyClick URL shortener, custom aliases, link tracking, editable destinations, link expiration, and privacy policies.",
    url: "/faq",
  },
};

const FAQ_ITEMS: FaqItem[] = [
  {
    id: "what-is-tinyclick",
    category: "General",
    q: "What is TinyClick and how does it work?",
    a: "TinyClick is a fast, reliable, and privacy-friendly URL shortener that converts long destination URLs into clean, memorable, and trackable links (such as tinyclick.in/launch). When a visitor accesses your short URL, our edge redirection gateway resolves the target in sub-milliseconds and executes an immediate HTTP 302 redirect while aggregating anonymous click metrics.",
  },
  {
    id: "is-tinyclick-free",
    category: "General",
    q: "Is TinyClick completely free to use?",
    a: "Yes! TinyClick is 100% free with no paywalls or surprise subscriptions. You can shorten links directly on the homepage without creating an account, or register for a free account to manage custom aliases, view real-time click telemetry, and schedule link expiration dates.",
  },
  {
    id: "need-account",
    category: "General",
    q: "Do I need an account to shorten URLs?",
    a: "No account is required to generate short links on the homepage. However, creating a free account unlocks persistent link management, editable destinations, and access to deep analytics dashboards.",
  },
  {
    id: "custom-aliases",
    category: "Custom Aliases",
    q: "How do custom URL aliases work?",
    a: "A custom alias lets you replace random characters with a branded word or phrase (e.g. tinyclick.in/my-product). You can choose any available slug from 3 to 16 alphanumeric characters, hyphens, and underscores. Custom links build trust and increase click-through rates by up to 39%.",
  },
  {
    id: "edit-destination",
    category: "Custom Aliases",
    q: "Can I edit the destination URL of a short link after creation?",
    a: "Yes! Registered users can update destination URLs and adjust expiration settings at any time directly from the TinyClick user dashboard. The short link itself remains unchanged, and the update takes effect immediately worldwide with instant cache synchronization.",
  },
  {
    id: "link-expiration",
    category: "Custom Aliases",
    q: "How does link expiration work?",
    a: "When shortening a link, you can optionally specify a future expiration timestamp. Once the expiration time passes, the link automatically deactivates and late visitors see a clean 'Link Expired' notice (HTTP 410 Gone), preventing unwanted traffic to expired promotions.",
  },
  {
    id: "analytics-metrics",
    category: "Analytics",
    q: "What analytics metrics does TinyClick track?",
    a: "TinyClick tracks total and unique click counts, visitor geographic distribution (countries and regions), HTTP referrer sources (Twitter/X, LinkedIn, Reddit, Google, Direct), device family breakdown (Mobile, Desktop, Tablet), and click velocity over time.",
  },
  {
    id: "realtime-analytics",
    category: "Analytics",
    q: "Are click analytics updated in real time?",
    a: "Yes. Click metrics are ingested, processed, and visualized instantaneously in your dashboard as visits occur with zero batch processing delay.",
  },
  {
    id: "link-management",
    category: "Analytics",
    q: "Can I manage, search, and delete my short links?",
    a: "Yes! Registered users have a comprehensive dashboard where they can search, paginate, sort, edit destinations, and delete short links with immediate database and Redis cache purging.",
  },
  {
    id: "ads-and-interstitials",
    category: "Security & Privacy",
    q: "Does TinyClick display interstitial ads or delay timers?",
    a: "Never. Unlike legacy URL shorteners that force users to wait through 5-second countdown timers or full-page banner ads, TinyClick performs direct, pure 302 redirects with 0-second delay.",
  },
  {
    id: "malicious-links",
    category: "Security & Privacy",
    q: "How does TinyClick protect against spam, phishing, and abuse?",
    a: "TinyClick enforces multi-layered safeguards: (1) Strict Protocol Validation — only valid http:// and https:// destinations are permitted, blocking executable script schemes (such as javascript: or data:); (2) Redis Token-Bucket Rate Limiting — throttles automated spam generation, bot scripts, and denial-of-service abuse; (3) Admin Oversight & Instant Eviction — malicious or reported links are immediately disabled and evicted across both database and Redis cache layers; and (4) Zero Interstitial Ads — clean 302 redirects ensure visitors are never exposed to deceptive popups or third-party ad network payloads.",
  },
  {
    id: "user-privacy",
    category: "Security & Privacy",
    q: "Does TinyClick sell personal data or track users across the web?",
    a: "No. We never sell, rent, or monetize your data with third-party advertisers. We do not use cross-site behavioral tracking cookies. Analytics are strictly aggregated at the link performance level.",
  },
];

const CATEGORIES = ["General", "Custom Aliases", "Analytics", "Security & Privacy"];

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "FAQ",
        item: `${siteUrl}/faq`,
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa] dark:bg-[#09090b] text-neutral-900 dark:text-neutral-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Top Navbar */}
      <PublicNavbar />

      {/* Main Content */}
      <main className="flex-1 mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8 py-14 sm:py-20 space-y-12">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="text-xs text-neutral-400">
          <ol className="flex items-center gap-2">
            <li>
              <Link href="/" className="hover:underline hover:text-neutral-700 dark:hover:text-neutral-200">
                Home
              </Link>
            </li>
            <li>/</li>
            <li className="text-neutral-700 dark:text-neutral-300 font-medium">FAQ</li>
          </ol>
        </nav>

        {/* Hero Section */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-100/80 px-3.5 py-1 text-xs font-medium text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300">
            <SparklesIcon className="h-3.5 w-3.5 text-amber-500" />
            <span>Help Center & Knowledge Base</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 leading-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-sm sm:text-base text-neutral-500 dark:text-neutral-400 leading-relaxed">
            Find answers to common questions regarding URL shortening, custom link aliases, real-time analytics, editable destinations, and security.
          </p>
        </div>

        {/* Interactive FAQ Client (Search, Filters, Accordions) */}
        <FaqClient categories={CATEGORIES} faqs={FAQ_ITEMS} />
      </main>

      {/* SEO Footer */}
      <footer className="border-t border-neutral-200/60 dark:border-neutral-800/60 bg-white/50 dark:bg-neutral-950/50 py-12 text-xs text-neutral-500 dark:text-neutral-400">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="space-y-3 col-span-2 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900">
                <LinkIcon className="h-3.5 w-3.5" />
              </div>
              <span className="font-bold tracking-tight text-neutral-900 dark:text-neutral-100">TinyClick</span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Fast, privacy-friendly URL shortener with custom aliases and real-time analytics.
            </p>
          </div>

          <div className="space-y-2.5">
            <span className="font-semibold text-neutral-900 dark:text-neutral-100">Product</span>
            <ul className="space-y-1.5">
              <li><Link href="/" className="hover:underline">URL Shortener</Link></li>
              <li><Link href="/features" className="hover:underline">Features</Link></li>
              <li><Link href="/faq" className="hover:underline font-medium text-neutral-800 dark:text-neutral-200">FAQ</Link></li>
            </ul>
          </div>

          <div className="space-y-2.5">
            <span className="font-semibold text-neutral-900 dark:text-neutral-100">Legal</span>
            <ul className="space-y-1.5">
              <li><Link href="/privacy" className="hover:underline">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:underline">Terms of Service</Link></li>
            </ul>
          </div>

          <div className="space-y-2.5">
            <span className="font-semibold text-neutral-900 dark:text-neutral-100">Account</span>
            <ul className="space-y-1.5">
              <li><Link href="/login" className="hover:underline">Sign In</Link></li>
              <li><Link href="/register" className="hover:underline">Get Started</Link></li>
              <li><Link href="/app/dashboard" className="hover:underline">Dashboard</Link></li>
            </ul>
          </div>
        </div>

        <div className="mx-auto max-w-5xl px-4 sm:px-6 pt-8 mt-8 border-t border-neutral-200/60 dark:border-neutral-800/60 flex items-center justify-between text-neutral-400">
          <span>© {new Date().getFullYear()} TinyClick. All rights reserved.</span>
          <span>Fast, Privacy-First URL Shortening</span>
        </div>
      </footer>
    </div>
  );
}
