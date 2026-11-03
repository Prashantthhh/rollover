import type { IceCreamShop, Menu, MenuSection, WithContext } from "schema-dts";
import { categories, type MenuCategory } from "../data/menu";
import { HOURS_CONFIRMED, site } from "../data/site";
import { SEO } from "./seo";

const day = (d: string) => `https://schema.org/${d}` as `https://schema.org/${"Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday"}`;
const DAYS: Record<string, ReturnType<typeof day>[]> = {
  "Mon–Fri": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map(day),
  "Sat–Sun": ["Saturday", "Sunday"].map(day),
};

const prices = categories.flatMap((c) => c.items.map((i) => i.price));

/** One menu section with its dishes: name, description (when there is one), price in rupees, and the vegetarian diet marker on veg dishes. */
function menuSection(c: MenuCategory): MenuSection {
  return {
    "@type": "MenuSection",
    name: c.title,
    url: `${site.url}/menu/c/${c.id}`,
    hasMenuItem: c.items.map((i) => ({
      "@type": "MenuItem" as const,
      name: i.name,
      ...(i.desc ? { description: i.desc } : {}),
      offers: { "@type": "Offer" as const, price: i.price, priceCurrency: "INR" },
      ...(i.veg ? { suitableForDiet: "https://schema.org/VegetarianDiet" as const } : {}),
    })),
  };
}

const fullMenu: Menu = { "@type": "Menu", name: `${site.name} menu`, url: `${site.url}/menu`, inLanguage: "en-IN", hasMenuSection: categories.map(menuSection) };

/** Structured data for /menu/c/<slug>: the same business (by @id) with just that category as its menu section. */
export function menuCategoryJsonLd(c: MenuCategory): WithContext<IceCreamShop> {
  return {
    "@context": "https://schema.org",
    "@type": "IceCreamShop",
    "@id": `${site.url}/#business`,
    name: site.name,
    url: `${site.url}/`,
    hasMenu: { "@type": "Menu", name: `${c.title} · ${site.name} menu`, url: `${site.url}/menu/c/${c.id}`, inLanguage: "en-IN", hasMenuSection: [menuSection(c)] },
  };
}

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
    menu: `${site.url}/menu`,
    hasMenu: fullMenu,
    hasMap: site.maps.placeUrl,
    disambiguatingDescription: site.address.landmark,
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
