import { BAND_VIDEO } from "../data/art";
import LoopVideo from "./LoopVideo";
import { site } from "../data/site";
import menu from "../data/menu.json";

const rollsFrom = Math.min(...menu.categories.find((c) => c.id === "ice-cream-rolls")!.items.map((i) => i.price));

/**
 * A full-width muted video loop between the menu and the vibe section, with one line of type. The clip is set in
 * src/data/art.ts (BAND_VIDEO). This band also carries the ONE sticker left on the whole page.
 */
export default function PhotoBand() {
  return (
    <section aria-label="Photo" className="relative h-[64svh] min-h-[22rem] w-full overflow-hidden border-y-[3px] border-maroon bg-maroon">
      <LoopVideo src={BAND_VIDEO.src} poster={BAND_VIDEO.poster} label={BAND_VIDEO.alt} className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: BAND_VIDEO.position }} />
      <p className="absolute bottom-0 left-0 max-w-[88%] bg-maroon px-5 py-3 font-display text-[2rem] leading-[1.05] text-cream sm:max-w-[70%] sm:px-8 sm:py-5 sm:text-5xl lg:text-6xl">
        Hot day in Hanamkonda? Sorted.
      </p>
      {/* ONE STICKER: the only sticker on the page. */}
      <div className="absolute right-4 top-5 flex h-28 w-28 -rotate-6 flex-col items-center justify-center rounded-full border-[3px] border-maroon bg-pink text-center text-maroon shadow-[6px_6px_0_var(--color-maroon)] sm:bottom-10 sm:right-12 sm:top-auto sm:h-40 sm:w-40">
        <span className="text-xs font-extrabold uppercase tracking-[0.1em] sm:text-sm">Rolls from</span>
        <span className="font-display text-4xl leading-none sm:text-5xl">₹{rollsFrom}</span>
      </div>
      <span className="sr-only">{site.name}</span>
    </section>
  );
}
