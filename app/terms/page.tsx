import type { Metadata } from "next";
import Link from "next/link";
import { LinkIcon } from "@/components/ui/icons";
import { PublicNavbar } from "@/components/layout/public-navbar";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://tinyclick.in";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Review TinyClick's Terms of Service, Acceptable Use Policy, anti-spam guidelines, link deletion policies, and user agreements.",
  alternates: {
    canonical: "/terms",
  },
  openGraph: {
    title: "Terms of Service | TinyClick",
    description:
      "Review TinyClick's Terms of Service, Acceptable Use Policy, anti-spam guidelines, link deletion policies, and user agreements.",
    url: "/terms",
  },
};

export default function TermsOfServicePage() {
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
        name: "Terms of Service",
        item: `${siteUrl}/terms`,
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
      <PublicNavbar />

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
            <li className="text-neutral-700 dark:text-neutral-300 font-medium">Terms of Service</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="space-y-3 border-b border-neutral-200 dark:border-neutral-800 pb-6">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            Terms of Service
          </h1>
          <p className="text-xs text-neutral-400">
            Last Updated: August 2026 • Effective Immediately
          </p>
        </div>

        {/* Terms Body */}
        <article className="prose prose-neutral dark:prose-invert max-w-none text-sm leading-relaxed space-y-8 text-neutral-700 dark:text-neutral-300">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">1. Acceptance of Terms</h2>
            <p>
              By accessing, browsing, or using TinyClick (accessible at <strong>tinyclick.in</strong>) and its associated redirection infrastructure, API, and user interfaces, you agree to be legally bound by these Terms of Service. If you do not agree to these terms, please do not use the service.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">2. Acceptable Use Policy & Zero-Tolerance Abuse Rules</h2>
            <p>
              TinyClick is provided to shorten legitimate, safe URLs. You agree NOT to use TinyClick to create, host, or distribute short links that redirect to or promote:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Phishing & Fraud:</strong> Deceptive websites attempting to steal credentials, credit card details, or personal data.</li>
              <li><strong>Malware & Exploits:</strong> Direct links to malicious executables, viruses, ransomware, trojans, or exploit kits.</li>
              <li><strong>Spam & Unsolicited Messaging:</strong> Mass unsolicited SMS, spam emails, or automated forum spamming.</li>
              <li><strong>Illegal Content:</strong> Content that violates intellectual property laws, distributes illicit goods, or breaches local or international laws.</li>
              <li><strong>Abusive Redirection Loops:</strong> Chained redirects designed to bypass security filters or overwhelm destination servers.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">3. Link Monitoring, Disabling & Removal</h2>
            <p>
              TinyClick reserves the unrestricted right to investigate and immediately disable, blacklist, or delete any short link or user account that violates our Acceptable Use Policy without prior notice.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">4. Custom Aliases & Trademark Rights</h2>
            <p>
              Custom aliases are assigned on a first-come, first-served basis. However, TinyClick reserves the right to reclaim or reassign any alias that infringes on trademark rights, impersonates established brands, or uses derogatory or offensive language.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">5. Service Availability and Disclaimer of Warranties</h2>
            <p>
              TinyClick is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis. While we strive for 99.9% uptime and ultra-low latency, TinyClick makes no express or implied warranties that the service will be entirely uninterrupted, error-free, or immune from hardware or network failures.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">6. Limitation of Liability</h2>
            <p>
              In no event shall TinyClick, its maintainers, or contributors be held liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service, including data loss, loss of traffic, or downtime.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">7. Changes to Terms</h2>
            <p>
              We may periodically update these Terms of Service. Continued use of TinyClick following any modifications signifies your acceptance of the revised terms.
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
              <li><Link href="/privacy" className="hover:underline">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:underline font-medium text-neutral-800 dark:text-neutral-200">Terms of Service</Link></li>
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
