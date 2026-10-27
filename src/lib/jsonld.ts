import type { IceCreamShop, WithContext } from "schema-dts";
import { categories } from "../data/menu";
import { HOURS_CONFIRMED, site } from "../data/site";
import { SEO } from "./seo";

const day = (d: string) => `https://schema.org/${d}` as `https://schema.org/${"Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday"}`;
const DAYS: Record<string, ReturnType<typeof day>[]> = {
  "Mon–Fri": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map(day),
  "Sat–Sun": ["Saturday", "Sunday"].map(day),
};

const prices = categories.flatMap((c) => c.items.map((i) => i.price));

/**
 * LocalBusiness structured data for the home page (typed with schema-dts, so a wrong property name or value
 * type fails the build). Deliberately NOT included:
 *  - aggregateRating / review: Google does not allow self-published ratings for local businesses.
 *  - openingHoursSpecification: only added once HOURS_CONFIRMED is true (src/data/site.ts).
 */
export function localBusinessJsonLd(): WithContext<IceCreamShop> {
  return {
    "@context": "https://schema.org",
    "@type": "IceCreamShop",
    "@id": `${site.url}/#business`,
    name: site.name,
    description: SEO.description,
    url: SEO.url,
    image: [`${site.url}${SEO.ogImage}`],
    logo: `${site.url}/icons/icon-512.png`,
    telephone: "+918688066805",
    priceRange: `₹${Math.min(...prices)}–₹${Math.max(...prices)}`,
    servesCuisine: ["Ice cream", "Desserts", "Fast food"],
    menu: `${site.url}/#menu`,
    hasMap: site.maps.placeUrl,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.line,
      addressLocality: site.address.locality,
      addressRegion: site.address.region,
      postalCode: site.address.postalCode,
      addressCountry: "IN",
    },
    geo: { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lng },
    sameAs: [site.social.instagram, site.order.swiggy, site.order.zomato],
    ...(HOURS_CONFIRMED
      ? {
          openingHoursSpecification: site.hours.map((h) => ({
            "@type": "OpeningHoursSpecification" as const,
            dayOfWeek: DAYS[h.days],
            opens: h.opens,
            closes: h.closes,
          })),
        }
      : {}),
  };
}
