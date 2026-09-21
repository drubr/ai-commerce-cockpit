import type { Metadata } from "next";
import "@fontsource/source-sans-pro/latin-400.css";
import "@fontsource/source-sans-pro/latin-600.css";
import "@fontsource/source-sans-pro/latin-700.css";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "mediawave · Commerce Cockpit",
    template: "%s · Commerce Cockpit",
  },
  description: "Your catalog, connected. Manage your commerce workspace.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
