/**
 * next/image loader for the static export (no image server). scripts/optimize-media.mjs writes every image
 * twice: `name.webp` (full size) and `name-sm.webp` (480 px wide). Anything requested at 640 px or less
 * (a phone showing a card at ~180 px, even at 2x) gets the small file.
 */
export default function imageLoader({ src, width }: { src: string; width: number }) {
  if (width <= 640 && src.endsWith(".webp") && !src.endsWith("-sm.webp")) return src.replace(/\.webp$/, "-sm.webp");
  return src;
}
