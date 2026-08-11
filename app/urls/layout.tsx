import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "URLs",
  description: "Manage, search, copy, and delete your created short URLs.",
};

export default function UrlsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
