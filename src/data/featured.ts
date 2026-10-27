import { findItem } from "./menu";

/**
 * Specials shown on the home page. Rolls first. These are editorial picks (the old site had no sales data),
 * so swap the names below to whatever the cafe wants to push. Names must match menu.json exactly.
 */
export const featured = [
  findItem("ice-cream-rolls", "Choco Chip Cookie Dough"),
  findItem("ice-cream-rolls", "Pista Nuts"),
  findItem("ice-cream-rolls", "Brownie Bomb"),
  findItem("gourmet-plates", "Choco Lava Therapy"),
  findItem("gourmet-plates", "Strawberry Paradise"),
  findItem("shakes", "Ferrero Rocher Shake"),
];

/** Photo strip. Same rule: names must match menu.json. */
export const stripPhotos = [
  findItem("ice-cream-rolls", "Choco Chip Cookie Dough"),
  findItem("shakes", "Ferrero Rocher Shake"),
  findItem("gourmet-plates", "Choco Lava Therapy"),
  findItem("signatures", "Rollover's Chocolate Karma"),
  findItem("sundaes", "Hot Chocolate Fudge"),
  findItem("gourmet-plates", "Strawberry Paradise"),
  findItem("signatures", "Rollover Skillet Cake"),
  findItem("waffle-cones", "Dry Fruit"),
  findItem("gourmet-plates", "Mango Madness"),
  findItem("shakes", "Kit kat"),
  findItem("gourmet-plates", "Lychee Rush"),
  findItem("signatures", "Sizzling Brownie"),
];
