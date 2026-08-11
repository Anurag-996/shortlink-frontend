import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings",
  description: "Account profile, gateway connection, and active security sessions.",
};

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
