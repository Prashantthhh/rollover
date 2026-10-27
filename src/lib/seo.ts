import { site } from "../data/site";

// Keep the title under 60 characters and the description under 155 (both are checked by scripts/check-seo.mjs).
export const SEO = {
  title: "RollOver Warangal | Rolled Ice Cream & Snacks, Hanamkonda",
  description:
    "Hand-rolled ice cream, shakes, momos and munchies in Hanamkonda, Warangal. Board games, a family-friendly space, and online ordering on Swiggy and Zomato.",
  url: `${site.url}/`,
  ogImage: "/og-image.png",
  ogImageAlt: "RollOver Warangal: hand-rolled ice cream, rolled fresh and eaten happy",
} as const;
