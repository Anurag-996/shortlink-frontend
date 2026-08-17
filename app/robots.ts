import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://tinyclick.in";

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/features",
          "/faq",
          "/privacy",
          "/terms",
          "/opengraph-image",
          "/twitter-image",
          "/manifest.webmanifest",
        ],
        disallow: [
          "/app",
          "/app/*",
          "/login",
          "/register",
          "/verify-email",
          "/forgot-password",
          "/reset-password",
          "/dashboard",
          "/dashboard/*",
          "/urls",
          "/urls/*",
          "/settings",
          "/settings/*",
          "/api/",
          "/api/*",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
