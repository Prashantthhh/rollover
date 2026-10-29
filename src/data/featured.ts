import { findItem } from "./menu";

/**
 * Specials shown on the home page (bento grid; the first one is the big tile). Clean photos only. These are editorial picks (the old site had no sales data),
 * so swap the names below to whatever the cafe wants to push. Names must match menu.json exactly.
 */
export const featured = [
  findItem("ice-cream-rolls", "Choco Chip Cookie Dough"),
  findItem("ice-cream-rolls", "Pista Nuts"),
  findItem("ice-cream-rolls", "Fruit & nut"),
  findItem("ice-cream-rolls", "Guava Chilli"),
  findItem("ice-cream-rolls", "Brownie Bomb"),
  findItem("shakes", "Granola blueberry"),
];


/**
 * Photo strip: clean food photos only (no promo text, logos, script fonts or graphic backgrounds, no other accounts' marks).
 * Menu photos are looked up by name (must match menu.json); the rest are 4:5 crops of the cafe's own video (scripts/bake-clips.mjs).
 */
const clip = (name: string, image: string) => ({ name, image });
export const stripPhotos = [
  clip("Chocolate-chip ice cream rolls on a white plate", "/img/strip/frame-plated-chips.webp"),
  findItem("ice-cream-rolls", "Choco Chip Cookie Dough"),
  clip("Rolled ice cream on a freezing tray", "/img/strip/frame-rolls-on-tray.webp"),
  findItem("ice-cream-rolls", "Pista Nuts"),
  clip("Rolls with hot chocolate sauce and a lava scoop", "/img/strip/frame-lava-and-rolls.webp"),
  findItem("ice-cream-rolls", "Brownie Bomb"),
  clip("Rolls topped with nuts and chocolate, with a shot of sauce", "/img/strip/frame-plated-nuts.webp"),
  findItem("ice-cream-rolls", "Fruit & nut"),
  clip("A banana slice placed on chocolate-drizzled rolls", "/img/strip/frame-plating-banana.webp"),
  findItem("ice-cream-rolls", "Guava Chilli"),
  findItem("shakes", "Granola blueberry"),
];
