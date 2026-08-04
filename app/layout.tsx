import type { Metadata } from "next";
import { Inter, Montserrat, Roboto } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./auth-provider";
import { siteUrl } from "@/lib/site-url";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Washd — Laundry, handled.",
  description: "Fixed-day laundry membership for Kuala Lumpur residences. Drop your bag and collect it washed, folded and pressed two days later.",
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: {
    title: "Washd — Laundry, handled.",
    description: "The milkman model for laundry: fixed building collection days and a simple monthly membership.",
    type: "website",
    images: [{ url: "/og.png", width: 1680, height: 945, alt: "Washd laundry service" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Washd — Laundry, handled.",
    description: "Fixed building collection days and a simple monthly laundry membership.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${montserrat.variable} ${roboto.variable}`}><AuthProvider>{children}</AuthProvider></body>
    </html>
  );
}
