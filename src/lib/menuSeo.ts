import type { Metadata } from "next";
import { categories, categoryBySlug, fromPrice } from "../data/menu";
import { site } from "../data/site";

const clip = (s: string, n: number) => (s.length <= n ? s : s.slice(0, s.lastIndexOf(" ", n - 1)).replace(/[,;:]$/, "") + "…");

/** Per-category title (< 60 chars), description (< 155) and canonical for /menu/c/<slug>; checked by scripts/check-seo.mjs. */
export function categoryMetadata(slug: string): Metadata {
  const { category: c } = categoryBySlug(slug)!;
  const title = `${c.title} Menu | RollOver Warangal`;
  const names = c.items.slice(0, 3).map((i) => i.name).join(", ");
  const description = clip(`${c.items.length} ${c.title.toLowerCase()} at RollOver Warangal, Hanamkonda, from ₹${fromPrice(c)}: ${names} and more. Veg and non-veg.`, 154);
  const url = `${site.url}/menu/c/${c.id}`;
  return {
    title, description, alternates: { canonical: url },
    openGraph: { type: "website", url, siteName: site.name, locale: "en_IN", title, description, images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "RollOver Warangal" }] },
    twitter: { card: "summary_large_image", title, description, images: ["/og-image.png"] },
  };
}

/** /menu shows the first category, so its canonical is that category's own page (no duplicate content). */
export function menuIndexMetadata(): Metadata {
  return { ...categoryMetadata(categories[0].id), alternates: { canonical: `${site.url}/menu/c/${categories[0].id}` } };
}
