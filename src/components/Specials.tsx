import Image from "next/image";
import { featured } from "../data/featured";
import { rupees } from "../data/menu";
import menuData from "../data/menu.json";
import Reveal from "./Reveal";
import SplitHeading from "./SplitHeading";
import VegMark from "./VegMark";

const rollsFrom = Math.min(...menuData.categories.find((c) => c.id === "ice-cream-rolls")!.items.map((i) => i.price));

type Item = (typeof featured)[number];

/** Name + category chip and a price pill, sitting on top of a photo tile. */
function Caption({ it, className = "" }: { it: Item; className?: string }) {
  return (
    <div className={`absolute inset-x-3 bottom-3 flex items-end justify-between gap-2 sm:inset-x-4 sm:bottom-4 ${className}`}>
      <div className="min-w-0 rounded-[20px] bg-white px-4 py-2.5">
        <h3 className="truncate font-display text-lg leading-tight sm:text-xl">{it.name}</h3>
        <p className="flex items-center gap-1.5 text-xs font-bold text-ink/70"><VegMark veg={it.veg} />{it.category}</p>
      </div>
      <span className="pill shrink-0 !bg-pink">{rupees(it.price)}</span>
    </div>
  );
}

function PhotoTile({ it, className }: { it: Item; className: string }) {
  return (
    <Reveal className={`relative min-h-[14rem] overflow-hidden rounded-[28px] bg-white ${className}`}>
      <div className="scroll-zoom absolute inset-0">
        {it.image && <Image src={it.image} alt={`${it.name}, ${it.category.toLowerCase()}`} fill sizes="(min-width: 1024px) 25vw, 50vw" fetchPriority="low" className="object-cover" />}
      </div>
      <Caption it={it} />
    </Reveal>
  );
}

/**
 * Specials as a bento grid: tiles of different sizes and colours, big photos, price as a small pill.
 * 12 columns on desktop, 2 on phones. The big pink tile is the first featured item with its cut-out; the accent
 * tile carries the "rolls from" line. Photos are the old menu photos (small files), so they sit in tiles no bigger than ~420px.
 */
export default function Specials() {
  const [lead, b, c, d, e, f] = featured;
  return (
    <section id="specials" className="cv relative bg-cream">
      <div className="mx-auto max-w-[1600px] px-4 py-20 sm:px-8 sm:py-28">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6 sm:mb-14">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] sm:text-base">Rolls from {rupees(rollsFrom)}</p>
            <SplitHeading text="Where to start" className="mt-3 font-display text-[3.4rem] leading-[0.95] sm:text-7xl lg:text-[8rem]" />
          </div>
          <a href="#menu" className="btn btn-ink">Open the menu <span aria-hidden="true">↓</span></a>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-12 lg:auto-rows-[17rem]">
          {/* big pink tile with the cut-out */}
          <Reveal className="relative col-span-2 min-h-[26rem] overflow-hidden rounded-[32px] bg-pink lg:col-span-6 lg:row-span-2">
            <div className="p-6 sm:p-9">
              <p className="flex items-center gap-2 text-sm font-bold"><VegMark veg={lead.veg} />{lead.category}</p>
              <h3 className="mt-2 max-w-[10ch] font-display text-[2.8rem] leading-[0.95] sm:text-6xl lg:text-7xl">{lead.name}</h3>
            </div>
            <span className="pill absolute right-5 top-5 text-lg sm:right-8 sm:top-8">{rupees(lead.price)}</span>
            <div className="zoom-free absolute inset-x-6 bottom-4 top-[46%] flex items-end justify-center sm:inset-x-10 sm:bottom-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/img/cutouts/cookie-dough.webp" alt={`${lead.name}, ${lead.category.toLowerCase()}`} width={900} height={800} loading="lazy" decoding="async" className="max-h-full w-auto max-w-full object-contain" />
            </div>
          </Reveal>

          <PhotoTile it={b} className="lg:col-span-3" />
          <PhotoTile it={c} className="row-span-2 min-h-[28rem] lg:col-span-3" />
          <PhotoTile it={d} className="lg:col-span-3" />

          <Reveal className="relative col-span-2 flex min-h-[14rem] flex-col justify-between overflow-hidden rounded-[28px] bg-accent p-6 sm:p-8 lg:col-span-4">
            <p className="text-sm font-bold uppercase tracking-[0.16em]">Made in front of you</p>
            <div>
              <p className="font-display text-6xl leading-[0.9] sm:text-7xl">{rupees(rollsFrom)}</p>
              <p className="mt-2 text-lg font-medium">for a roll, fresh off the cold plate.</p>
            </div>
          </Reveal>
          <PhotoTile it={e} className="lg:col-span-4" />
          <PhotoTile it={f} className="lg:col-span-4" />
        </div>
      </div>
    </section>
  );
}
