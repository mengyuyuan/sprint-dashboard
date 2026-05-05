import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sprint Dashboard — AI Team Planning",
  description:
    "AI-powered sprint planning for engineering managers. Import your GitHub issues and let AI prioritize your team's work.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
