import { categories, findItem, fromPrice, rupees } from "./menu";

/**
 * The savoury side of the home page ("Not just dessert", and the savoury picks under the specials).
 * `photo` is the one place to add a real photograph: put a path such as "/img/menu/burger-hero.webp" there and the figure
 * appears in both places. While it is null NOTHING is rendered for it (no placeholder tile on the home page).
 * Only real RollOver photographs of the dish go here, never stock or AI images. See "Shoot list" in NEEDS_FROM_CLIENT.md.
 * `lead` is the dish the specials show for that category (the name must match menu.json exactly).
 */
export const savoury: { id: string; word: string; lead: string; photo: string | null; alt: string }[] = [
  { id: "burgers", word: "Burgers", lead: "Veg Cheese Burger", photo: null, alt: "A RollOver burger on the table" },
  { id: "momos", word: "Momos", lead: "Chicken Momos Fried", photo: null, alt: "A plate of RollOver momos with chutney" },
  { id: "munchies", word: "Munchies", lead: "Mr.Fries", photo: null, alt: "Fries and fried snacks on the table" },
  { id: "sandwiches", word: "Sandwiches", lead: "Smoked Paneer Sandwich", photo: null, alt: "A toasted RollOver sandwich, cut in half" },
];

/** Count and starting price of each savoury category, from the menu data. */
export const savouryRows = savoury.map((s) => {
  const c = categories.find((x) => x.id === s.id)!;
  return { ...s, count: c.items.length, from: rupees(fromPrice(c)), names: c.items.slice(0, 3).map((i) => i.name).join(", ") + (c.items.length > 3 ? " and more" : ""), item: findItem(s.id, s.lead) };
});
