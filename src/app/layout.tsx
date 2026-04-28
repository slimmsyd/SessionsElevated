import type { Metadata } from "next";
import { Cormorant_Garamond, Newsreader, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const SITE_URL = "https://sessionselevated.com";
const SITE_TITLE = "Elevated Sessions - Stillness, held in community";
const SITE_DESCRIPTION =
  "A wellness series designed for the culture - meditation, breathwork, and sound healing in rhythm with the seasons. Spring Awakening, May 24, 2026.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s · Elevated Sessions",
  },
  description: SITE_DESCRIPTION,
  applicationName: "Elevated Sessions",
  keywords: [
    "Elevated Sessions",
    "wellness retreat",
    "meditation",
    "breathwork",
    "sound healing",
    "Spring Awakening",
    "Black wellness",
    "EventNoire",
  ],
  authors: [{ name: "Elevated Sessions" }],
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Elevated Sessions",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${newsreader.variable} ${jetbrains.variable}`}
      style={
        {
          "--font-display": "var(--font-cormorant), 'GT Sectra', Georgia, serif",
          "--font-body": "var(--font-newsreader), Georgia, serif",
          "--font-mono": "var(--font-jetbrains), ui-monospace, monospace",
        } as React.CSSProperties
      }
    >
      <body>{children}</body>
    </html>
  );
}
