import Image from "next/image";
import { featured } from "../data/featured";
import { rupees } from "../data/menu";
import menuData from "../data/menu.json";
import Reveal from "./Reveal";
import SplitHeading from "./SplitHeading";
import VegMark from "./VegMark";

const rollsFrom = Math.min(...menuData.categories.find((c) => c.id === "ice-cream-rolls")!.items.map((i) => i.price));

/**
 * Price-tag shapes: an angled-shoulder tag with a punched hole, drawn with clip-path. A clipped shape cannot carry
 * a box-shadow, so the hard offset shadow is a drop-shadow filter on the wrapper (no blur, so it stays flat).
 */
const TAG = "polygon(0 0, calc(100% - 2.2rem) 0, 100% 2.2rem, 100% 100%, 0 100%)";

function Price({ n, big = false }: { n: number; big?: boolean }) {
  return <span className={`font-display leading-none ${big ? "text-6xl sm:text-7xl" : "text-4xl"}`}>{rupees(n)}</span>;
}

/**
 * Specials as price tags. One big tag for the first item and a stack of long luggage-tag strips for the rest,
 * on a flat pink shop-sign board. Not cards: the shapes, sizes and colours differ, and the tags carry the price as
 * the biggest thing on them.
 */
export default function Specials() {
  const [lead, ...rest] = featured;
  return (
    <section id="specials" className="cv relative bg-pink text-maroon">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:py-24">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.14em] sm:text-base">Rolls from {rupees(rollsFrom)}</p>
            <SplitHeading text="Where to start" className="mt-2 font-display text-[3rem] leading-[1.02] sm:text-6xl lg:text-7xl" />
          </div>
          <a href="#menu" className="btn btn-cream">Open the menu <span aria-hidden="true">↓</span></a>
        </div>

        <div className="grid gap-12 lg:grid-cols-[minmax(0,26rem)_1fr] lg:gap-16">
          {/* the big tag */}
          <Reveal className="lg:-rotate-2">
            <div style={{ filter: "drop-shadow(8px 8px 0 var(--color-maroon))" }}>
              <article className="relative bg-cream p-5 pt-14" style={{ clipPath: TAG }}>
                <span aria-hidden="true" className="absolute left-5 top-5 h-6 w-6 rounded-full bg-pink" />
                <div className="relative aspect-[4/3] border-[3px] border-maroon">
                  {lead.image && <Image src={lead.image} alt={`${lead.name}, ${lead.category.toLowerCase()}`} fill sizes="(min-width: 1024px) 416px, 90vw" fetchPriority="low" className="object-cover" />}
                </div>
                <div className="mt-4 flex items-end justify-between gap-4">
                  <div>
                    <h3 className="font-display text-3xl leading-tight">{lead.name}</h3>
                    <p className="mt-1 flex items-center gap-2 text-sm font-bold uppercase tracking-wider"><VegMark veg={lead.veg} />{lead.category}</p>
                  </div>
                  <Price n={lead.price} big />
                </div>
              </article>
            </div>
          </Reveal>

          {/* the strips */}
          <ul className="flex flex-col gap-6">
            {rest.map((it, i) => {
              const dark = i % 2 === 1;
              return (
                <Reveal as="li" key={it.name} delay={i * 0.05} className={dark ? "lg:ml-10" : "lg:-ml-2"}>
                  <div style={{ filter: "drop-shadow(6px 6px 0 var(--color-maroon))" }}>
                    <article
                      className={`relative flex items-stretch gap-4 py-3 pl-12 ${dark ? "bg-maroon text-cream" : "bg-cream"}`}
                      style={{ clipPath: "polygon(1.6rem 0, 100% 0, 100% 100%, 1.6rem 100%, 0 50%)" }}
                    >
                      <span aria-hidden="true" className="absolute left-6 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-pink" />
                      <div className={`relative hidden w-24 shrink-0 border-[3px] sm:block ${dark ? "border-cream" : "border-maroon"}`}>
                        {it.image && <Image src={it.image} alt={`${it.name}, ${it.category.toLowerCase()}`} fill sizes="96px" fetchPriority="low" className="object-cover" />}
                      </div>
                      <div className="min-w-0 flex-1 self-center">
                        <h3 className="font-display text-2xl leading-tight sm:text-3xl">{it.name}</h3>
                        <p className="mt-1 flex items-center gap-2 text-sm font-bold uppercase tracking-wider"><VegMark veg={it.veg} />{it.category}</p>
                      </div>
                      <div className={`-my-3 flex shrink-0 items-center px-4 sm:px-6 ${dark ? "bg-pink text-maroon" : "bg-maroon text-cream"}`}><Price n={it.price} /></div>
                    </article>
                  </div>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
