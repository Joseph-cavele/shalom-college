import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://shalomtrainingschool.co.za";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Shalom Training School — Accredited Artisan & Engineering College",
    template: "%s — Shalom Training School",
  },
  description:
    "MERSETA accredited practical & theoretical training in engineering, artisan, mining, computer and management courses. Rustenburg & Brits campuses. Apply online today.",
  keywords: [
    "Shalom Training School",
    "artisan training South Africa",
    "MERSETA accredited college",
    "engineering courses N4-N6",
    "trade test preparation",
    "mining machinery training",
    "welding courses Rustenburg",
    "computer courses Brits",
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
      "MERSETA accredited practical & theoretical training in engineering, artisan, mining, computer and management courses. Rustenburg & Brits campuses.",
    locale: "en_ZA",
    images: [{ url: "/logo.png", width: 512, height: 512, alt: "Shalom Training School logo" }],
  },
  twitter: {
    card: "summary",
    title: "Shalom Training School — Accredited Artisan & Engineering College",
    description:
      "MERSETA accredited training in engineering, artisan, mining, computer and management courses.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  icons: { icon: "/logo.png" },
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
