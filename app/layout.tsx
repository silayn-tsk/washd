import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const baseUrl = `${protocol}://${host}`;

  return {
    title: "Washd — Laundry, seamlessly handled",
    description: "Door-to-door laundry care in Kuala Lumpur. We collect, clean and deliver — fresh, folded and ready to wear.",
    icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
    openGraph: {
      title: "Washd — Laundry, seamlessly handled",
      description: "Door-to-door laundry care, collected and returned fresh.",
      type: "website",
      images: [{ url: `${baseUrl}/og.png`, width: 1680, height: 945, alt: "Washd laundry service" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Washd — Laundry, seamlessly handled",
      description: "Door-to-door laundry care, collected and returned fresh.",
      images: [`${baseUrl}/og.png`],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body>
    </html>
  );
}
