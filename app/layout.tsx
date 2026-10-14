import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.shalomtrainingschool.co.za"; // canonical host (the bare domain redirects here)

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Shalom Training School — Accredited Artisan & Engineering College",
    template: "%s — Shalom Training School",
  },
  description:
    "MERSETA accredited practical & theoretical training in engineering, artisan, mining, computer and management courses. Rustenburg campus, North West. Apply online today.",
  keywords: [
    "Shalom Training School",
    "artisan training South Africa",
    "MERSETA accredited college",
    "engineering courses N4-N6",
    "trade test preparation",
    "mining machinery training",
    "welding courses Rustenburg",
    "computer courses Rustenburg",
    "technical college North West",
  ],
  applicationName: "Shalom Training School",
  authors: [{ name: "Shalom Training School" }],
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Shalom Training School",
    title: "Shalom Training School — Accredited Artisan & Engineering College",
    description:
      "MERSETA accredited practical & theoretical training in engineering, artisan, mining, computer and management courses. Rustenburg campus, North West.",
    locale: "en_ZA",
    // Wide card for WhatsApp / Facebook / LinkedIn link previews.
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Shalom Training School logo" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shalom Training School — Accredited Artisan & Engineering College",
    description:
      "MERSETA accredited training in engineering, artisan, mining, computer and management courses.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  // Browser-tab / Google favicon, home-screen icons: app/favicon.ico, app/icon.png, app/apple-icon.png.
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F8FAFC" },
    { media: "(prefers-color-scheme: dark)", color: "#081633" },
  ],
};

/** Sets the theme class before first paint so there is no flash. */
const themeInitScript = `(function(){try{var t=localStorage.getItem("theme");if(t==="dark"||(!t&&window.matchMedia("(prefers-color-scheme: dark)").matches)){document.documentElement.classList.add("dark")}}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
