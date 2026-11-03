import type { MetadataRoute } from "next";
import { categories } from "../data/menu";
import { site } from "../data/site";

export const dynamic = "force-static";

// The home page and one page per menu category (/menu is the first category, canonical to its own page, so it is left out).
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${site.url}/`, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    ...categories.map((c) => ({ url: `${site.url}/menu/c/${c.id}`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 })),
  ];
}
