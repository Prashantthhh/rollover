export type Review = { name: string; text: string; rating?: number; when?: string };

/**
 * Real guest reviews. Add 3–4 here (name, their words, optionally the star rating and a date such as
 * "Sep 2026"). The review cards stay hidden while this list is empty; the rating and the Google link still show.
 * Do not paste reviews from the old site's commented-out code, and never write one by hand.
 */
export const reviews: Review[] = [];
