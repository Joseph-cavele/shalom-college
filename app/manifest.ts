import type { MetadataRoute } from "next";

/** Lets phones "Add to Home Screen" with the school logo and colours. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Shalom Training School",
    short_name: "Shalom",
    description: "MERSETA accredited artisan, engineering, mining, computer and management training in Rustenburg.",
    start_url: "/",
    display: "standalone",
    background_color: "#F8FAFC",
    theme_color: "#0B1F45",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/logo.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
