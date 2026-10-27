/**
 * Slots for hand-made assets. To use one, drop the file into public/art/ and put its path below.
 * Nothing else needs to change. Until a file is set, a simple placeholder is drawn.
 *
 *   heroLettering  hand-lettered hero headline, SVG, ideally transparent, about 3:1 (e.g. "Rolled while you watch.")
 *   doodles.*      small hand-drawn doodles, SVG, transparent, single colour (maroon #3d0b21 or pink #eb3592)
 *
 * Photos: put originals in source-assets/ and run `npm run optimize-media` (see HANDOFF.md). The hero video and
 * its poster are public/video/hero.mp4 and hero-poster.webp.
 */
/**
 * Print-style treatment for the hero video and poster, baked into the files by scripts/bake-hero.mjs so the browser
 * does no extra work (CSS blend modes were tried first: fine on phones, but 44 fps / 24 fps on a 4x-throttled desktop):
 *   "duotone"  greyscale footage mapped to maroon (shadows) and pink (highlights)
 *   "halftone" the same, broken into a 45-degree dot screen like a printed poster (960x540, 12 fps to stay under 2 MB)
 *   "none"     the raw footage
 */
export const HERO_TREATMENT: "duotone" | "halftone" | "none" = "duotone";

/** Full-width photo band between the menu and the vibe section. Swap for a new photo when one arrives. */
export const BAND_PHOTO = { src: "/img/vibe/death-by-chocolate-2.webp", alt: "Chocolate sauce being poured over a dessert in a glass bowl", position: "50% 38%" };

export const SHOW_SLOT_HINTS = true; // draws a dashed placeholder where an asset is missing; set false before launch

export const art: {
  heroLettering: string | null;
  doodles: Record<"heroTop" | "heroArch" | "menuBoard" | "vibeGames", string | null>;
} = {
  heroLettering: null, // "/art/lettering/hero.svg"
  doodles: {
    heroTop: null, // "/art/doodles/spoon.svg": near the headline
    heroArch: null, // "/art/doodles/cone.svg": beside the arched video window
    menuBoard: null, // "/art/doodles/scoop.svg": beside the menu board heading
    vibeGames: null, // "/art/doodles/dice.svg": on the board-games tile in the vibe collage
  },
};
