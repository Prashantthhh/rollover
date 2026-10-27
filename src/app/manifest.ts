import type { MetadataRoute } from "next";
import { SEO } from "../lib/seo";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "RollOver Warangal",
    short_name: "RollOver",
    description: SEO.description,
    start_url: "/",
    display: "standalone",
    background_color: "#fef2f3",
    theme_color: "#eb3592",
    lang: "en-IN",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
