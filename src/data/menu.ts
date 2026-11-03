import raw from "./menu.json";

/** `placeholder: true` marks a stock photo (Pexels, see credits/photo-sources.md) standing in until RollOver's own photo replaces it. */
export type MenuItem = { name: string; price: number; veg: boolean; desc: string; image: string | null; placeholder?: boolean };
/**
 * `id` is also the URL slug (/menu/c/<id>) and matches the old rolloverwarangal.com slugs, so existing links keep working.
 * `short` is the label in the category row; `tagline` is the italic line under the heading (taglineConfirmed false = the
 * line is ours and shows a [CONFIRM] tag until the cafe signs it off).
 */
export type MenuCategory = { id: string; title: string; short: string; tagline: string; taglineConfirmed: boolean; hidden: boolean; items: MenuItem[] };

/** Categories shown on the site, in tab order (a category with hidden:true in menu.json is left out). */
export const categories = (raw.categories as unknown as MenuCategory[]).filter((c) => !c.hidden);

export const rupees = (n: number) => `₹${n}`;

export const fromPrice = (c: MenuCategory) => Math.min(...c.items.map((i) => i.price));

export function categoryBySlug(slug: string) {
  const index = categories.findIndex((c) => c.id === slug);
  return index < 0 ? null : { category: categories[index], index, prev: categories[(index + categories.length - 1) % categories.length], next: categories[(index + 1) % categories.length] };
}

/** Running figure numbers, so each photo caption is unique across the whole menu. */
export const figureOffsets = (() => { let n = 11; return categories.map((c) => { const o = n; n += c.items.length; return o; }); })();

export function findItem(categoryId: string, name: string) {
  const category = categories.find((c) => c.id === categoryId);
  const item = category?.items.find((i) => i.name === name);
  if (!category || !item) throw new Error(`Menu item not found: ${categoryId} / ${name}`);
  return { ...item, category: category.title };
}
