import type { MetadataRoute } from "next";
import { site } from "../data/site";

export const dynamic = "force-static";

// One page today. Add new routes here when the site grows.
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: `${site.url}/`, lastModified: new Date(), changeFrequency: "monthly", priority: 1 }];
}
