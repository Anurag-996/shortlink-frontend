import type { Metadata } from "next";
import Link from "next/link";
import {
  LinkIcon,
  SparklesIcon,
  CheckIcon,
  BarChartIcon,
  ClockIcon,
  EditIcon,
  ZapIcon,
  ShieldCheckIcon,
  TrendingUpIcon,
  CalendarIcon,
} from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PublicNavbar } from "@/components/layout/public-navbar";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://tinyclick.in";

export const metadata: Metadata = {
  title: "Features & Capabilities",
  description:
    "Explore TinyClick's high-speed link shortening features: custom branded aliases, real-time analytics, editable destination URLs, link expiration, and privacy protection.",
  alternates: {
    canonical: "/features",
  },
  openGraph: {
    title: "Features & Capabilities | TinyClick",
    description:
      "Explore TinyClick's high-speed link shortening features: custom branded aliases, real-time analytics, editable destination URLs, link expiration, and privacy protection.",
    url: "/features",
  },
};

export default function FeaturesPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "TinyClick Features",
    url: `${siteUrl}/features`,
    description:
      "Complete feature overview of TinyClick: Custom aliases, real-time analytics, editable destination URLs, link expiration, and fast edge redirection.",
    breadcrumb: {
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
          name: "Features",
          item: `${siteUrl}/features`,
        },
      ],
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa] dark:bg-[#09090b] text-neutral-900 dark:text-neutral-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Top Navbar */}
      <PublicNavbar />

      {/* Main Content */}
      <main className="flex-1 mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8 py-14 sm:py-20 space-y-20">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="text-xs text-neutral-400">
          <ol className="flex items-center gap-2">
            <li>
              <Link href="/" className="hover:underline hover:text-neutral-700 dark:hover:text-neutral-200">
                Home
              </Link>
            </li>
            <li>/</li>
            <li className="text-neutral-700 dark:text-neutral-300 font-medium">Features</li>
          </ol>
        </nav>

        {/* Hero Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-100/80 px-3.5 py-1 text-xs font-medium text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300">
            <SparklesIcon className="h-3.5 w-3.5 text-blue-500" />
            <span>High-Speed Link Infrastructure</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 leading-tight">
            Engineered for Fast, Reliable & Measurable Links
          </h1>
          <p className="text-sm sm:text-base text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-2xl mx-auto">
            Everything you need to turn cumbersome URLs into high-converting assets with custom branding, real-time analytics, and automated expiration controls.
          </p>

          {/* Quick metric chips */}
          <div className="pt-4 flex flex-wrap justify-center gap-2 sm:gap-3">
            <Badge variant="default" className="text-xs py-1 px-3">
              ⚡ Sub-millisecond 302 Redirects
            </Badge>
            <Badge variant="success" className="text-xs py-1 px-3">
              🎯 100% Free Custom Aliases
            </Badge>
            <Badge variant="default" className="text-xs py-1 px-3">
              📊 Real-Time Telemetry
            </Badge>
            <Badge variant="neutral" className="text-xs py-1 px-3">
              🔒 Zero Interstitial Ads
            </Badge>
          </div>
        </div>

        {/* FEATURE 1: Custom Branded Aliases */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center rounded-2xl border border-neutral-200/80 bg-white p-6 sm:p-8 shadow-xs dark:border-neutral-800 dark:bg-neutral-900/80">
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                <LinkIcon className="h-4.5 w-4.5" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Branding & Trust
              </span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
              Custom Branded Link Aliases
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Replace cryptic random characters with memorable, branded slugs like <span className="font-mono text-xs font-semibold text-neutral-800 dark:text-neutral-200">tinyclick.in/launch2026</span>. Custom short links dramatically boost click-through rates by establishing instant brand recognition and user trust.
            </p>
            <ul className="space-y-2 pt-2 text-xs text-neutral-600 dark:text-neutral-300">
              <li className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Choose 3–16 alphanumeric characters, hyphens, and underscores</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Instant real-time alias availability validation</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>100% free with no forced upgrades or paywalled slugs</span>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-xl border border-neutral-200 bg-neutral-50/80 p-5 dark:border-neutral-800 dark:bg-neutral-950/80 space-y-3 font-mono text-xs shadow-inner">
              <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                Interactive Preview
              </div>
              <div className="space-y-2">
                <div className="text-neutral-400 text-[11px] truncate">
                  Original: <span className="text-neutral-600 dark:text-neutral-300">https://store.com/summer-sale?utm_source=twitter</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-emerald-700 dark:text-emerald-300 font-semibold">
                  <span className="truncate">tinyclick.in/summer26</span>
                  <Badge variant="success" size="sm">Available ✓</Badge>
                </div>
              </div>
              <div className="pt-1 flex items-center justify-between text-[11px] text-neutral-400">
                <span>+39% average CTR increase</span>
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                  <TrendingUpIcon className="h-3 w-3" /> High Trust
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* FEATURE 2: Real-Time Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center rounded-2xl border border-neutral-200/80 bg-white p-6 sm:p-8 shadow-xs dark:border-neutral-800 dark:bg-neutral-900/80">
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="rounded-xl border border-neutral-200 bg-neutral-50/80 p-5 dark:border-neutral-800 dark:bg-neutral-950/80 space-y-4 shadow-inner">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-semibold text-neutral-400">Total Engagement</span>
                  <div className="text-xl font-bold font-mono text-neutral-900 dark:text-neutral-100">
                    2,842 Clicks
                  </div>
                </div>
                <Badge variant="success" size="sm">
                  <TrendingUpIcon className="h-3 w-3" /> +34.8%
                </Badge>
              </div>

              {/* Referrer breakdown mini bar */}
              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between text-neutral-500 dark:text-neutral-400">
                  <span>Top Referrers</span>
                  <span>Share</span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between font-mono bg-white dark:bg-neutral-900 p-1.5 rounded border border-neutral-200/60 dark:border-neutral-800/60">
                    <span>X (Twitter)</span>
                    <span className="font-semibold text-neutral-900 dark:text-neutral-100">48%</span>
                  </div>
                  <div className="flex items-center justify-between font-mono bg-white dark:bg-neutral-900 p-1.5 rounded border border-neutral-200/60 dark:border-neutral-800/60">
                    <span>LinkedIn</span>
                    <span className="font-semibold text-neutral-900 dark:text-neutral-100">28%</span>
                  </div>
                  <div className="flex items-center justify-between font-mono bg-white dark:bg-neutral-900 p-1.5 rounded border border-neutral-200/60 dark:border-neutral-800/60">
                    <span>Direct / SMS</span>
                    <span className="font-semibold text-neutral-900 dark:text-neutral-100">24%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4 order-1 lg:order-2">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <BarChartIcon className="h-4.5 w-4.5" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Data & Insights
              </span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
              Real-Time Click Analytics & Telemetry
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Gain deep visibility into your audience with aggregated link telemetry. Understand traffic velocity, device breakdown, top referrer domains, and geographic regions as clicks occur.
            </p>
            <ul className="space-y-2 pt-2 text-xs text-neutral-600 dark:text-neutral-300">
              <li className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Immediate click ingestion with zero lag or caching delays</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Device family distribution (Mobile, Desktop, Tablet)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>100% privacy-compliant analytics without storing invasive user PII</span>
              </li>
            </ul>
          </div>
        </div>

        {/* FEATURE 3: Link Expiration Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center rounded-2xl border border-neutral-200/80 bg-white p-6 sm:p-8 shadow-xs dark:border-neutral-800 dark:bg-neutral-900/80">
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                <ClockIcon className="h-4.5 w-4.5" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Lifecycle & Automation
              </span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
              Automated Link Expiration Controls
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Schedule your short URLs to automatically deactivate at a specific future date and time. Eliminate dead links from outdated flash sales, limited discount promotions, and private file sharing.
            </p>
            <ul className="space-y-2 pt-2 text-xs text-neutral-600 dark:text-neutral-300">
              <li className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Precise date and time picker support</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Graceful HTTP 410 (Gone / Expired) message for late visitors</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Update destination URLs and adjust expiration settings anytime from your dashboard</span>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-xl border border-neutral-200 bg-neutral-50/80 p-5 dark:border-neutral-800 dark:bg-neutral-950/80 space-y-3 font-mono text-xs shadow-inner">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-neutral-400 uppercase">Status Monitor</span>
                <Badge variant="warning" size="sm">
                  <CalendarIcon className="h-3 w-3" /> Scheduled
                </Badge>
              </div>
              <div className="space-y-2 text-neutral-700 dark:text-neutral-300">
                <div className="flex justify-between border-b border-neutral-200/60 dark:border-neutral-800/60 pb-1.5">
                  <span className="text-neutral-400">Target Link:</span>
                  <span>tinyclick.in/promo26</span>
                </div>
                <div className="flex justify-between border-b border-neutral-200/60 dark:border-neutral-800/60 pb-1.5">
                  <span className="text-neutral-400">Expires At:</span>
                  <span className="text-amber-600 dark:text-amber-400">2026-08-31 23:59 UTC</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">On Expiry:</span>
                  <span className="text-neutral-900 dark:text-neutral-100 font-semibold">HTTP 410 Clean Notice</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FEATURE 4: Editable Destination URLs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center rounded-2xl border border-neutral-200/80 bg-white p-6 sm:p-8 shadow-xs dark:border-neutral-800 dark:bg-neutral-900/80">
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="rounded-xl border border-neutral-200 bg-neutral-50/80 p-5 dark:border-neutral-800 dark:bg-neutral-950/80 space-y-3 font-mono text-xs shadow-inner">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-neutral-400 uppercase">Destination Manager</span>
                <Badge variant="success" size="sm">
                  <CheckIcon className="h-3 w-3" /> Live Synced
                </Badge>
              </div>

              <div className="space-y-2 text-neutral-700 dark:text-neutral-300">
                <div className="space-y-1">
                  <span className="text-[11px] text-neutral-400">Short Link:</span>
                  <div className="font-semibold text-neutral-900 dark:text-neutral-100 bg-white dark:bg-neutral-900 p-2 rounded border border-neutral-200/60 dark:border-neutral-800/60">
                    tinyclick.in/summer-sale
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] text-neutral-400">Updated Target:</span>
                  <div className="text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 p-2 rounded border border-emerald-500/20 truncate">
                    https://mysite.com/autumn-collection
                  </div>
                </div>

                <div className="pt-1 flex items-center justify-between text-[11px] text-neutral-400">
                  <span>Cache Invalidation:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">&lt; 5ms</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4 order-1 lg:order-2">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                <EditIcon className="h-4.5 w-4.5" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                Flexibility & Control
              </span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
              Editable Destination URLs
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Never lose traffic or discard marketing assets due to typos or changed web addresses. Registered users can update where their short links redirect at any time directly from the dashboard without modifying the short link itself.
            </p>
            <ul className="space-y-2 pt-2 text-xs text-neutral-600 dark:text-neutral-300">
              <li className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Update destination targets anytime while preserving your short URL</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Immediate global propagation via automated Redis cache eviction</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Protect existing social posts, marketing collateral, and slide decks</span>
              </li>
            </ul>
          </div>
        </div>

        {/* FEATURE 5 & 6: Speed & Privacy Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 sm:p-8 shadow-xs dark:border-neutral-800 dark:bg-neutral-900/80 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                <ZapIcon className="h-4.5 w-4.5" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                Ultra-Low Latency
              </span>
            </div>
            <h3 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
              Sub-Millisecond 302 Redirection Gateway
            </h3>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Designed on high-throughput backend architecture that resolves destination URLs and executes HTTP 302/301 redirects with sub-millisecond overhead. Visitors never experience lag or buffering.
            </p>
            <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-800 dark:bg-neutral-950 font-mono text-xs flex items-center justify-between">
              <span className="text-neutral-500">Gateway Response Time:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">&lt; 1ms</span>
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 sm:p-8 shadow-xs dark:border-neutral-800 dark:bg-neutral-900/80 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                <ShieldCheckIcon className="h-4.5 w-4.5" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                Security & Ethics
              </span>
            </div>
            <h3 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
              Zero Interstitial Ads & Strict Privacy
            </h3>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
              We never show annoying 5-second countdown timers, full-screen interstitial ads, or cross-site tracking cookies. Your visitors reach their destination cleanly and securely without risk of phishing.
            </p>
            <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-800 dark:bg-neutral-950 font-mono text-xs flex items-center justify-between">
              <span className="text-neutral-500">Ad / Tracker Footprint:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">0% Ad-Free</span>
            </div>
          </div>
        </div>

        {/* CTA Card */}
        <div className="rounded-2xl border border-neutral-200 bg-neutral-900 text-white p-8 sm:p-12 text-center space-y-6 dark:border-neutral-800 dark:bg-neutral-950">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Ready to experience next-generation link shortening?
          </h2>
          <p className="text-sm text-neutral-400 max-w-xl mx-auto leading-relaxed">
            Create your first short link with custom alias, expiration date, and instant telemetry in seconds.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/">
              <Button size="lg" className="bg-white text-neutral-900 hover:bg-neutral-100 font-medium">
                Shorten a Link Now
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="secondary" size="lg" className="border border-neutral-700 bg-transparent text-white hover:bg-neutral-800">
                Create Free Account
              </Button>
            </Link>
          </div>
        </div>
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
              Fast, privacy-friendly URL shortener with custom aliases, editable destinations, and real-time analytics.
            </p>
          </div>

          <div className="space-y-2.5">
            <span className="font-semibold text-neutral-900 dark:text-neutral-100">Product</span>
            <ul className="space-y-1.5">
              <li><Link href="/" className="hover:underline">URL Shortener</Link></li>
              <li><Link href="/features" className="hover:underline font-medium text-neutral-800 dark:text-neutral-200">Features</Link></li>
              <li><Link href="/faq" className="hover:underline">FAQ</Link></li>
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
