import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Real-time overview of short links, click counts, and traffic analytics.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
