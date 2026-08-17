"use client";

import { useState } from "react";
import Link from "next/link";
import { UrlCreator } from "@/components/urls/url-creator";
import { formatPublicShortUrl, truncateUrl } from "@/lib/utils/format";
import { useToast } from "@/components/ui/toast";
import { useAuth } from "@/lib/auth/auth-context";
import { Button } from "@/components/ui/button";
import {
  CopyIcon,
  CheckIcon,
  ExternalLinkIcon,
  LinkIcon,
  UserIcon,
  SparklesIcon,
  BarChartIcon,
  CalendarIcon,
  GlobeIcon,
  EditIcon,
  ShieldIcon,
  ArrowRightIcon,
} from "@/components/ui/icons";
import type { ShortUrlResponse } from "@/types/api";

export default function HomePage() {
  const { success } = useToast();
  const { isAuthenticated, isInitializing } = useAuth();
  const [createdLinks, setCreatedLinks] = useState<ShortUrlResponse[]>([]);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const handleCreated = (newUrl: ShortUrlResponse) => {
    setCreatedLinks((prev) => [
      newUrl,
      ...prev.filter((u) => u.id !== newUrl.id),
    ]);
  };

  const handleCopy = async (id: number, shortCode: string) => {
    const fullUrl = formatPublicShortUrl(shortCode);
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopiedId(id);
      success("Copied to clipboard!");
      setTimeout(() => {
        setCopiedId((current) => (current === id ? null : current));
      }, 2000);
    } catch {
      // fallback
    }
  };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://tinyclick.in";

  const faqItems = [
    {
      q: "What is TinyClick and how does it work?",
      a: "TinyClick is a fast, privacy-friendly URL shortener that converts long web links into compact, trackable short URLs (like tinyclick.in/launch). When someone clicks your short link, our high-speed gateway instantly performs a 302 redirect to the destination URL while tracking visitor analytics.",
    },
    {
      q: "Is TinyClick completely free?",
      a: "Yes! TinyClick is 100% free to use. You can shorten links instantly on the homepage without an account, or create a free account to access custom aliases, link expiration controls, and detailed click analytics.",
    },
    {
      q: "How do custom link aliases work?",
      a: "A custom alias allows you to choose your own branded short link ending (e.g. tinyclick.in/my-sale instead of random characters). You can choose any available alphanumeric slug between 3 and 16 characters.",
    },
    {
      q: "Can I set an expiration date on my short links?",
      a: "Yes. When creating a link, you can set a specific date and time for it to expire. Once expired, visitors see a clean notification page rather than accessing obsolete or outdated content.",
    },
    {
      q: "What analytics are tracked for each short link?",
      a: "TinyClick provides real-time click counts, visitor geographic distribution (countries and regions), referrer sources (Twitter, LinkedIn, Google, Direct), device breakdown (Mobile, Desktop, Tablet), and hourly click performance.",
    },
    {
      q: "Does TinyClick show full-page ads or captcha delays?",
      a: "Never. TinyClick does not use interstitial ads, countdown timers, or popups. Redirects are direct, seamless, and lightning fast.",
    },
    {
      q: "How does TinyClick protect against spam, phishing, and abuse?",
      a: "TinyClick enforces strict input protocol validation (http/https only, blocking executable schemes), Redis token-bucket rate limiting against automated bots, zero interstitial ad payloads, and administrative tools for immediate revocation and cache eviction of reported links.",
    },
  ];

  const webAppJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "TinyClick",
    url: siteUrl,
    description:
      "Free, fast, and privacy-friendly URL shortener with custom branded aliases, real-time analytics, editable destinations, and link expiration.",
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "Custom URL Aliases",
      "Real-Time Click Analytics",
      "Link Expiration & Scheduling",
      "Editable Destination URLs",
      "Sub-millisecond Edge Redirection",
      "Zero Interstitial Ads",
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  const features = [
    {
      icon: <SparklesIcon className="h-5 w-5 text-blue-500" />,
      title: "Custom Branded Aliases",
      description:
        "Replace random gibberish with memorable, branded slugs like tinyclick.in/sale to increase trust and boost click-through rates.",
    },
    {
      icon: <BarChartIcon className="h-5 w-5 text-emerald-500" />,
      title: "Real-Time Deep Analytics",
      description:
        "Monitor live clicks, geographic regions, referrer sources (social, search, direct), and device types across all your campaigns.",
    },
    {
      icon: <CalendarIcon className="h-5 w-5 text-amber-500" />,
      title: "Link Expiration Controls",
      description:
        "Schedule links to automatically deactivate after a specific date or campaign end time with clean expiration status messages.",
    },
    {
      icon: <GlobeIcon className="h-5 w-5 text-purple-500" />,
      title: "Ultra-Low Latency Redirection",
      description:
        "Built on high-throughput gateway infrastructure delivering sub-millisecond 302 redirects with 99.9% uptime worldwide.",
    },
    {
      icon: <EditIcon className="h-5 w-5 text-cyan-500" />,
      title: "Editable Destination URLs",
      description:
        "Easily update where your short links redirect at any time from your dashboard without breaking active links or losing stats.",
    },
    {
      icon: <ShieldIcon className="h-5 w-5 text-rose-500" />,
      title: "Privacy First & Ad-Free",
      description:
        "Zero interstitial ad screens, no intrusive tracking beacons, and no affiliate injection. Pure, fast, and secure link redirection.",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Paste Your Destination URL",
      description:
        "Enter any long web address (articles, affiliate links, portfolios, products, or docs) into the shortener input.",
    },
    {
      number: "02",
      title: "Customize Alias & Expiration",
      description:
        "Optionally specify a custom branded link slug or set an automated expiration date for limited-time promotions.",
    },
    {
      number: "03",
      title: "Share & Track Live Clicks",
      description:
        "Copy your short link, distribute it across social media, email campaigns, or chat messages, and watch real-time metrics roll in.",
    },
  ];

  const useCases = [
    {
      title: "Social Media & Creators",
      description:
        "Keep your Instagram bio, X (Twitter) threads, YouTube video descriptions, and TikTok links clean and easy to remember.",
      tag: "Social Growth",
    },
    {
      title: "Marketing & E-Commerce",
      description:
        "Track campaign attribution, promotional banners, and social ads with live geographic and referrer metrics.",
      tag: "Campaign ROI",
    },
    {
      title: "Developers & Tech Teams",
      description:
        "Share readable documentation links, GitHub release shortcuts, and API endpoints with fast, zero-delay redirects.",
      tag: "Developer Tools",
    },
    {
      title: "Communities & Educators",
      description:
        "Distribute concise resource links in Discord, Slack channels, presentation slides, and classroom handouts.",
      tag: "Education",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa] dark:bg-[#09090b] text-neutral-900 dark:text-neutral-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Top Navbar */}
      <header className="border-b border-neutral-200/60 dark:border-neutral-800/60 bg-white/70 dark:bg-neutral-950/70 backdrop-blur-md sticky top-0 z-30">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900 text-white shadow-xs dark:bg-neutral-100 dark:text-neutral-900">
              <LinkIcon className="h-4 w-4" />
            </div>
            <span className="text-sm font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
              TinyClick
            </span>
          </Link>

          <nav className="flex items-center gap-4 text-xs font-medium text-neutral-600 dark:text-neutral-300">
            <Link
              href="/features"
              className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors hidden sm:inline"
            >
              Features
            </Link>
            <Link
              href="/faq"
              className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors hidden sm:inline"
            >
              FAQ
            </Link>

            <div className="flex items-center gap-2 min-h-[32px]">
              {isInitializing ? (
                <div className="h-8 w-20 rounded-lg bg-neutral-200/60 dark:bg-neutral-800/60 animate-pulse" />
              ) : isAuthenticated ? (
                <Link href="/app/dashboard">
                  <Button variant="primary" size="sm" className="text-xs">
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" size="sm" className="text-xs">
                      Sign in
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button
                      variant="primary"
                      size="sm"
                      className="text-xs"
                      leftIcon={<UserIcon className="h-3.5 w-3.5" />}
                    >
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8 pt-16 pb-12 space-y-8 flex flex-col justify-center">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300">
              <SparklesIcon className="h-3.5 w-3.5 text-blue-500" />
              <span>Free, Fast & Privacy-Friendly URL Shortener</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 leading-tight">
              Shorten Long Links into Clean, Trackable URLs
            </h1>
            <p className="max-w-2xl mx-auto text-sm sm:text-base text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Create memorable short links with custom aliases, real-time analytics, editable destinations, and link expiration. 100% free with zero advertisements.
            </p>
          </div>

          {/* Prominent URL Shortener Form */}
          <div className="max-w-2xl mx-auto w-full">
            <UrlCreator onCreated={handleCreated} />
          </div>

          {/* Session Links Created */}
          {createdLinks.length > 0 && (
            <div className="max-w-2xl mx-auto w-full space-y-3 animate-in fade-in duration-200">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                Links Created in this Session
              </h2>

              <div className="space-y-2">
                {createdLinks.map((item) => {
                  const isCopied = copiedId === item.id;
                  const publicUrl = formatPublicShortUrl(item.shortCode);

                  return (
                    <div
                      key={item.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-neutral-200/90 bg-white p-4 shadow-xs dark:border-neutral-800 dark:bg-neutral-900"
                    >
                      <div className="min-w-0 space-y-1">
                        <span className="font-mono text-sm font-semibold text-neutral-900 dark:text-neutral-100 block">
                          {publicUrl}
                        </span>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate max-w-sm">
                          {truncateUrl(item.originalUrl, 50)}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Button
                          variant={isCopied ? "secondary" : "outline"}
                          size="sm"
                          onClick={() => handleCopy(item.id, item.shortCode)}
                          leftIcon={
                            isCopied ? (
                              <CheckIcon className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                            ) : (
                              <CopyIcon className="h-3.5 w-3.5" />
                            )
                          }
                        >
                          {isCopied ? "Copied ✓" : "Copy"}
                        </Button>

                        <a
                          href={publicUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium text-neutral-800 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800 transition-colors"
                        >
                          <ExternalLinkIcon className="h-3.5 w-3.5" />
                          <span>Open</span>
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quick Trust Indicators */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs text-neutral-500 dark:text-neutral-400 border-t border-neutral-200/60 dark:border-neutral-800/60">
            <span className="flex items-center gap-1.5">⚡ Instant Redirects</span>
            <span className="flex items-center gap-1.5">🎯 Custom Aliases</span>
            <span className="flex items-center gap-1.5">📊 Live Analytics</span>
            <span className="flex items-center gap-1.5">🔒 Privacy First</span>
            <span className="flex items-center gap-1.5">💸 100% Free</span>
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section className="bg-neutral-100/60 dark:bg-neutral-900/40 border-y border-neutral-200/60 dark:border-neutral-800/60 py-16">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                How to Shorten a URL in 3 Simple Steps
              </h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                TinyClick makes link management simple, frictionless, and instant.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {steps.map((s, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-neutral-200/90 bg-white p-6 shadow-xs dark:border-neutral-800 dark:bg-neutral-900/90 space-y-3"
                >
                  <span className="font-mono text-2xl font-bold text-neutral-400 dark:text-neutral-500">
                    {s.number}
                  </span>
                  <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                    {s.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                    {s.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURES GRID SECTION */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-20 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
              Powerful Features Designed for Modern Link Sharing
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Everything you need to create, customize, and analyze short URLs without complexity.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-xs dark:border-neutral-800 dark:bg-neutral-900/80 space-y-3 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 dark:bg-neutral-800">
                  {f.icon}
                </div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                  {f.title}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  {f.description}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center pt-2">
            <Link
              href="/features"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-900 dark:text-neutral-100 hover:underline"
            >
              <span>Explore all detailed features & technical specs</span>
              <ArrowRightIcon className="h-3.5 w-3.5" />
            </Link>
          </div>
        </section>

        {/* AUDIENCE USE CASES SECTION */}
        <section className="bg-neutral-100/60 dark:bg-neutral-900/40 border-y border-neutral-200/60 dark:border-neutral-800/60 py-16">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                The Smart Link Shortener for Every Workflow
              </h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Built to elevate brand presence and streamline link distribution across any channel.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {useCases.map((u, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-neutral-200/90 bg-white p-6 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                      {u.tag}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                    {u.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                    {u.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* COMPARISON TABLE */}
        <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-20 space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
              Why Choose TinyClick?
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              See how TinyClick compares against traditional, ad-heavy URL shorteners.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/50">
                <tr>
                  <th className="py-3.5 px-4 font-semibold text-neutral-900 dark:text-neutral-100">Feature</th>
                  <th className="py-3.5 px-4 font-semibold text-neutral-900 dark:text-neutral-100 text-center">TinyClick</th>
                  <th className="py-3.5 px-4 font-semibold text-neutral-400 text-center">Generic Shorteners</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                <tr>
                  <td className="py-3 px-4 font-medium">Custom Branded Aliases</td>
                  <td className="py-3 px-4 text-center font-bold text-emerald-600 dark:text-emerald-400">100% Free</td>
                  <td className="py-3 px-4 text-center text-neutral-400">Paid Tier Only</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">Interstitial Ads & Delays</td>
                  <td className="py-3 px-4 text-center font-bold text-emerald-600 dark:text-emerald-400">Zero Ads (0s delay)</td>
                  <td className="py-3 px-4 text-center text-neutral-400">5-10s countdown ads</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">Real-Time Click Analytics</td>
                  <td className="py-3 px-4 text-center font-bold text-emerald-600 dark:text-emerald-400">Included Free</td>
                  <td className="py-3 px-4 text-center text-neutral-400">Limited / Paywalled</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">Link Expiration Scheduling</td>
                  <td className="py-3 px-4 text-center font-bold text-emerald-600 dark:text-emerald-400">Included Free</td>
                  <td className="py-3 px-4 text-center text-neutral-400">Enterprise only</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">Cross-Site Privacy Tracking</td>
                  <td className="py-3 px-4 text-center font-bold text-emerald-600 dark:text-emerald-400">No Tracking Cookies</td>
                  <td className="py-3 px-4 text-center text-neutral-400">Ad networks & profiling</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* INTERACTIVE FAQ ACCORDION SECTION */}
        <section className="bg-neutral-100/60 dark:bg-neutral-900/40 border-y border-neutral-200/60 dark:border-neutral-800/60 py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="text-center space-y-3">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                Frequently Asked Questions
              </h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Common questions about shortening links, custom aliases, and analytics.
              </p>
            </div>

            <div className="space-y-3">
              {faqItems.map((item, idx) => (
                <details
                  key={idx}
                  className="group rounded-xl border border-neutral-200/90 bg-white p-4.5 dark:border-neutral-800 dark:bg-neutral-900/80 transition-all duration-200 [&_summary::-webkit-details-marker]:hidden"
                  open={idx === 0}
                >
                  <summary className="flex cursor-pointer items-center justify-between gap-4 font-semibold text-sm text-neutral-900 dark:text-neutral-100 select-none">
                    <span>{item.q}</span>
                    <span className="text-neutral-400 transition-transform duration-200 group-open:rotate-180 shrink-0">
                      ▼
                    </span>
                  </summary>
                  <div className="mt-3 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed border-t border-neutral-100 dark:border-neutral-800/80 pt-3">
                    {item.a}
                  </div>
                </details>
              ))}
            </div>

            <div className="text-center pt-2">
              <Link
                href="/faq"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-900 dark:text-neutral-100 hover:underline"
              >
                <span>View full FAQ & Knowledge Base</span>
                <ArrowRightIcon className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* CTA BANNER */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="rounded-2xl border border-neutral-200 bg-neutral-900 text-white p-8 sm:p-12 text-center space-y-6 dark:border-neutral-800 dark:bg-neutral-950">
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight">
              Start Shortening and Tracking Links Today
            </h2>
            <p className="text-sm text-neutral-400 max-w-xl mx-auto">
              Join thousands of creators, developers, and businesses using TinyClick for fast, clean, and privacy-first URL shortening.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/register">
                <Button size="lg" className="bg-white text-neutral-900 hover:bg-neutral-100 font-medium">
                  Create Free Account
                </Button>
              </Link>
              <Link href="/features">
                <Button variant="secondary" size="lg" className="border border-neutral-700 bg-transparent text-white hover:bg-neutral-800">
                  Explore Features
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* SEO FOOTER */}
      <footer className="border-t border-neutral-200/60 dark:border-neutral-800/60 bg-white/50 dark:bg-neutral-950/50 py-12 text-xs text-neutral-500 dark:text-neutral-400">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="space-y-3 col-span-2 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900">
                <LinkIcon className="h-3.5 w-3.5" />
              </div>
              <span className="font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                TinyClick
              </span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Fast, privacy-friendly URL shortener with custom aliases, editable destinations, and real-time click analytics.
            </p>
          </div>

          <div className="space-y-2.5">
            <span className="font-semibold text-neutral-900 dark:text-neutral-100">
              Product
            </span>
            <ul className="space-y-1.5">
              <li>
                <Link href="/" className="hover:underline">
                  URL Shortener
                </Link>
              </li>
              <li>
                <Link href="/features" className="hover:underline">
                  Features & Capabilities
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:underline">
                  Frequently Asked Questions
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-2.5">
            <span className="font-semibold text-neutral-900 dark:text-neutral-100">
              Legal & Trust
            </span>
            <ul className="space-y-1.5">
              <li>
                <Link href="/privacy" className="hover:underline">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:underline">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-2.5">
            <span className="font-semibold text-neutral-900 dark:text-neutral-100">
              Account
            </span>
            <ul className="space-y-1.5">
              <li>
                <Link href="/login" className="hover:underline">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:underline">
                  Get Started Free
                </Link>
              </li>
              <li>
                <Link href="/app/dashboard" className="hover:underline">
                  User Dashboard
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mx-auto max-w-5xl px-4 sm:px-6 pt-8 mt-8 border-t border-neutral-200/60 dark:border-neutral-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-neutral-400">
          <span>© {new Date().getFullYear()} TinyClick. All rights reserved.</span>
          <span>Fast, Clean & Privacy-First URL Shortening</span>
        </div>
      </footer>
    </div>
  );
}
