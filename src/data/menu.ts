import raw from "./menu.json";

export type MenuItem = { name: string; price: number; veg: boolean; desc: string; image: string | null };
export type MenuCategory = { id: string; title: string; blurb?: string; hidden: boolean; items: MenuItem[] };

/** Categories shown on the site (the hidden Beverages category stays in menu.json until it has real content). */
export const categories = (raw.categories as unknown as MenuCategory[]).filter((c) => !c.hidden);

export const rupees = (n: number) => `₹${n}`;

export function findItem(categoryId: string, name: string) {
  const category = categories.find((c) => c.id === categoryId);
  const item = category?.items.find((i) => i.name === name);
  if (!category || !item) throw new Error(`Menu item not found: ${categoryId} / ${name}`);
  return { ...item, category: category.title };
}
