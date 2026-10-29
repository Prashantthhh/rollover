import { featured } from "../data/featured";
import { rupees } from "../data/menu";
import Photo from "./Photo";
import Split from "./Split";

type Item = (typeof featured)[number];

const Veg = ({ veg }: { veg: boolean }) => <i role="img" aria-label={veg ? "Vegetarian" : "Non-vegetarian"} className={`veg ${veg ? "veg-y" : "veg-n"}`} />;

function Pick({ it, n, className }: { it: Item; n: number; className: string }) {
  return (
    <Photo
      src={it.image!}
      alt={`${it.name}, ${it.category.toLowerCase()}`}
      ratio={1}
      className={className}
      caption={
        <span className="flex items-baseline justify-between gap-4">
          <span className="flex items-center gap-2"><span className="caption">Fig. {n}</span><Veg veg={it.veg} /><span className="font-display text-xl leading-none">{it.name}</span></span>
          <span className="tabular-nums">{rupees(it.price)}</span>
        </span>
      }
    />
  );
}

/**
 * Specials as a magazine spread: one lead item with its cut-out beside a large italic name, then the other five as
 * photographs staggered across the grid, each with a figure number, name and price. No tiles, no badges.
 * The menu photos are small files, so each one sits in a frame no wider than about 440px.
 */
export default function Specials() {
  const [lead, ...rest] = featured;
  return (
    <section id="specials" data-tone="paper" className="relative py-28 sm:py-40">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-8">
        <div className="flex items-baseline justify-between border-t border-current/60 pt-3">
          <p className="caption">No. 03 &mdash; Where to start</p>
          <p className="caption">p. 03</p>
        </div>

        <div className="drift mt-10 sm:mt-16">
          <Split
            id="specials-h"
            className="max-w-[12ch] font-display text-[clamp(2.7rem,7.6vw,8.2rem)] leading-[0.95] tracking-[-0.03em]"
            parts={[{ t: "Where to " }, { t: "start.", em: true, accent: true }]}
          />
        </div>

        {/* lead */}
        <div className="mt-20 grid items-end gap-x-8 gap-y-10 sm:mt-32 lg:grid-cols-12">
          <div className="ph-frame ph-reveal lg:col-span-6 lg:col-start-1" data-cursor="View" style={{ aspectRatio: "1.15" }}>
            <div className="absolute inset-0 flex items-end justify-center p-6 sm:p-10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/img/cutouts/cookie-dough.webp" alt={`${lead.name}, ${lead.category.toLowerCase()}`} width={900} height={800} loading="lazy" decoding="async" className="max-h-full w-auto max-w-full object-contain transition-transform duration-[1100ms] ease-out hover:scale-[1.04] motion-reduce:transition-none motion-reduce:hover:scale-100" />
            </div>
          </div>
          <div className="lg:col-span-5 lg:col-start-8 lg:pb-6">
            <p className="caption flex items-center gap-2"><Veg veg={lead.veg} />{lead.category}</p>
            <h3 className="mt-4 max-w-[10ch] font-display text-[clamp(2.2rem,4.4vw,4.6rem)] leading-[1] tracking-[-0.03em]">Choco chip <em>cookie dough</em></h3>
            <p className="lead measure mt-6 max-w-[26rem] opacity-90">Mellow chocolate, cookie dough and truffle paste, rolled on the plate and finished with choco chips and sauce.</p>
            <p className="mt-8 flex items-baseline gap-6">
              <span className="font-display text-4xl tabular-nums">{rupees(lead.price)}</span>
              <a href="#menu" className="caption ulink">See it on the menu</a>
            </p>
          </div>
        </div>

        {/* the other five, staggered */}
        <div className="mt-24 grid gap-x-8 gap-y-20 sm:mt-40 md:grid-cols-12">
          <Pick it={rest[0]} n={6} className="md:col-span-4 md:col-start-1" />
          <Pick it={rest[1]} n={7} className="md:col-span-4 md:col-start-5 md:mt-28" />
          <Pick it={rest[2]} n={8} className="md:col-span-4 md:col-start-9 md:mt-12" />
          <Pick it={rest[3]} n={9} className="md:col-span-4 md:col-start-3 md:mt-8" />
          <Pick it={rest[4]} n={10} className="md:col-span-4 md:col-start-8 md:mt-36" />
        </div>
      </div>
    </section>
  );
}
