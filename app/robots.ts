import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.shalomtrainingschool.co.za"; // canonical host (the bare domain redirects here)

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/admin", "/api", "/dashboard"] },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
