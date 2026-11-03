import { categories, findItem, fromPrice, rupees } from "./menu";

/**
 * The savoury side of the home page ("Not just dessert", and the savoury picks under the specials).
 * `photo` is the one place to add a real photograph: put a path such as "/img/menu/burger-hero.webp" there and the figure
 * appears in both places. While it is null NOTHING is rendered for it (no placeholder tile on the home page).
 * These four are Pexels stock photos (placeholder: true, credits in credits/photo-sources.md), shown with a "representative photo"
 * caption until RollOver's own shots (see "Shoot list" in NEEDS_FROM_CLIENT.md) replace them: change the path and drop `placeholder`.
 * `lead` is the dish the specials show for that category (the name must match menu.json exactly).
 */
export const savoury: { id: string; word: string; lead: string; photo: string | null; placeholder?: boolean; alt: string }[] = [
  { id: "burgers", word: "Burgers", lead: "Veg Cheese Burger", photo: "/img/savoury/burgers.webp", placeholder: true, alt: "A cheeseburger with lettuce and tomato on a wooden board (stock photo)" },
  { id: "momos", word: "Momos", lead: "Chicken Momos Fried", photo: "/img/savoury/momos.webp", placeholder: true, alt: "Steamed momos on a black plate with a dipping sauce (stock photo)" },
  { id: "munchies", word: "Munchies", lead: "Mr.Fries", photo: "/img/savoury/munchies.webp", placeholder: true, alt: "Golden French fries in paper (stock photo)" },
  { id: "sandwiches", word: "Sandwiches", lead: "Smoked Paneer Sandwich", photo: "/img/savoury/sandwiches.webp", placeholder: true, alt: "A toasted cheese sandwich, stacked (stock photo)" },
];

/** Count and starting price of each savoury category, from the menu data. */
export const savouryRows = savoury.map((s) => {
  const c = categories.find((x) => x.id === s.id)!;
  return { ...s, count: c.items.length, from: rupees(fromPrice(c)), names: c.items.slice(0, 3).map((i) => i.name).join(", ") + (c.items.length > 3 ? " and more" : ""), item: findItem(s.id, s.lead) };
});
