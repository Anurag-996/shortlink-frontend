import type { Metadata } from "next";
import Link from "next/link";
import { LinkIcon, ShieldCheckIcon } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://tinyclick.in";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn about TinyClick's strict privacy policy, data practices, anonymous click metrics, cookie policies, and user data protections.",
  alternates: {
    canonical: "/privacy",
  },
  openGraph: {
    title: "Privacy Policy | TinyClick",
    description:
      "Learn about TinyClick's strict privacy policy, data practices, anonymous click metrics, cookie policies, and user data protections.",
    url: "/privacy",
  },
};

export default function PrivacyPolicyPage() {
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
        name: "Privacy Policy",
        item: `${siteUrl}/privacy`,
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa] dark:bg-[#09090b] text-neutral-900 dark:text-neutral-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
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
              className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
            >
              Features
            </Link>
            <Link
              href="/faq"
              className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
            >
              FAQ
            </Link>
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-xs">
                Sign in
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8 py-16 space-y-10">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="text-xs text-neutral-400">
          <ol className="flex items-center gap-2">
            <li>
              <Link href="/" className="hover:underline hover:text-neutral-700 dark:hover:text-neutral-200">
                Home
              </Link>
            </li>
            <li>/</li>
            <li className="text-neutral-700 dark:text-neutral-300 font-medium">Privacy Policy</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="space-y-3 border-b border-neutral-200 dark:border-neutral-800 pb-6">
          <div className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            <ShieldCheckIcon className="h-4 w-4" />
            <span>Privacy-First Commitment</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            Privacy Policy
          </h1>
          <p className="text-xs text-neutral-400">
            Last Updated: August 2026 • Effective Immediately
          </p>
        </div>

        {/* Policy Body */}
        <article className="prose prose-neutral dark:prose-invert max-w-none text-sm leading-relaxed space-y-8 text-neutral-700 dark:text-neutral-300">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">1. Introduction</h2>
            <p>
              At TinyClick (accessible via <strong>tinyclick.in</strong>), your privacy is our top priority. We believe in building transparent, high-performance web utilities without compromising your personal information or tracking your internet behavior across the web.
            </p>
            <p>
              This Privacy Policy explains how information is collected, processed, and safeguarded when you use the TinyClick URL shortening service, dashboard, and public redirection gateway.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">2. Information We Collect</h2>
            <p>
              We collect only the minimum necessary information required to operate a reliable and secure URL shortening platform:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Link Creation Data:</strong> When you shorten a link, we store the original destination URL, generated short code, optional custom alias, creation timestamp, and expiration date (if provided).
              </li>
              <li>
                <strong>Account Information (Registered Users):</strong> If you register for an account, we store your email address and a cryptographically hashed password (using secure bcrypt hashing).
              </li>
              <li>
                <strong>Aggregated Click Analytics:</strong> When a short link is visited, our gateway processes the HTTP request to aggregate anonymous metrics: rough geographic location (country/city derived from IP without storing raw IP alongside user identities), HTTP referrer (e.g. twitter.com), user-agent (device category and browser family), and click timestamp.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">3. How We Use Information</h2>
            <p>We use the data collected strictly for the following purposes:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>To execute instantaneous, reliable HTTP 302/301 redirects to your target destination URL.</li>
              <li>To calculate high-level aggregate click statistics for link creators in their analytics dashboard.</li>
              <li>To detect, prevent, and mitigate abusive activity, including phishing, malware dissemination, automated spam, and DDoS attacks.</li>
              <li>To authenticate registered users and persist dashboard settings.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">4. Zero Data Selling & Third-Party Sharing</h2>
            <p>
              <strong>We do not sell, rent, monetize, or trade your personal data with any third-party advertisers, data brokers, or marketing networks.</strong>
            </p>
            <p>
              TinyClick contains zero interstitial advertising, zero cross-site behavioral tracking beacons, and zero affiliate redirection injection.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">5. Cookies and Local Storage</h2>
            <p>
              TinyClick uses essential session tokens (HTTP cookies or LocalStorage) solely to authenticate registered users on the dashboard. We do not use third-party advertising cookies or cross-site tracking cookies.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">6. Data Security & Encryption</h2>
            <p>
              All traffic between your browser and TinyClick is encrypted using industry-standard Transport Layer Security (HTTPS/TLS). Passwords are never stored in plaintext and are protected with salted cryptographic hashing algorithms.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">7. Contact and Inquiries</h2>
            <p>
              If you have any questions regarding this Privacy Policy or wish to request link de-indexing or account removal, please reach out via our contact channels or open an issue on our official repository.
            </p>
          </section>
        </article>
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
              <li><Link href="/faq" className="hover:underline">FAQ</Link></li>
            </ul>
          </div>

          <div className="space-y-2.5">
            <span className="font-semibold text-neutral-900 dark:text-neutral-100">Legal</span>
            <ul className="space-y-1.5">
              <li><Link href="/privacy" className="hover:underline font-medium text-neutral-800 dark:text-neutral-200">Privacy Policy</Link></li>
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
