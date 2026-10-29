import { categories, rupees } from "../data/menu";
import menuData from "../data/menu.json";
import { site } from "../data/site";
import HandDrawn from "./HandDrawn";
import Photo from "./Photo";

const rollsFrom = Math.min(...menuData.categories.find((c) => c.id === "ice-cream-rolls")!.items.map((i) => i.price));
const onTheMenu = categories.reduce((n, c) => n + c.items.length, 0);

/**
 * Standfirst: the shop in one paragraph, set large but narrow, with a folio and a hanging note in the margin; then three
 * photographs from the cafe's own footage laid out like a magazine spread (one bleeding off the right edge, one offset left,
 * one small), and a row of numbers that count up when they come into view.
 */
export default function Intro() {
  return (
    <section data-tone="paper" aria-labelledby="intro-h" className="relative pb-32 pt-28 sm:pb-52 sm:pt-44">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-8">
        <div className="grid gap-x-8 gap-y-8 lg:grid-cols-12">
          <div className="lg:col-span-2">
            <p className="caption">No. 01</p>
            <hr className="my-3 border-0 border-t border-current/60" />
            <p className="caption-i max-w-[12rem] opacity-80">A rolled ice cream shop in Hanamkonda, and how it got that way.</p>
            <p className="caption mt-8 border border-dashed border-current/60 p-2 text-[0.625rem] normal-case tracking-normal">Doodle slot 1 &middot; a hand-drawn circle round the price, drawn on as this enters.</p>
          </div>

          <div className="lg:col-span-7 lg:col-start-4">
            <h2 id="intro-h" className="sr-only">About RollOver</h2>
            <p className="max-w-[24em] font-display text-[clamp(1.6rem,3vw,3.1rem)] leading-[1.18] tracking-[-0.02em]">
              RollOver is the ice cream shop <em className="t-accent">opposite Tara Gardens</em>, in Prashanthnagar Colony. Rolls start at{" "}
              <span className="relative inline-block whitespace-nowrap">
                <span data-count={rollsFrom} data-prefix="₹" className="inline-block tabular-nums" style={{ minWidth: "2.5ch" }}>{rupees(rollsFrom)}</span>
                <HandDrawn slot={1} note="circle round the price" label="none" className="absolute -inset-x-4 -inset-y-1" />
              </span>
              , each one made on a cold steel plate in front of you. Stay a while: there are board games.
            </p>
          </div>
        </div>

        {/* the spread */}
        <div className="mt-28 grid gap-x-8 gap-y-16 sm:mt-44 lg:grid-cols-12">
          <Photo
            src="/img/editorial/plate-c.webp"
            alt="Fresh ice cream rolls lined up on the steel tray"
            ratio={1.6}
            className="-mx-4 sm:-mx-8 lg:col-span-8 lg:col-start-5 lg:-mr-8 lg:ml-0"
            caption={<><span className="caption mr-2">Fig. 2</span>The cold tray, a minute after the roll.</>}
            captionClass="px-4 sm:px-8 lg:px-0"
          />
          <Photo
            src="/img/editorial/plate-d.webp"
            alt="Chocolate-chip ice cream rolls on a white plate"
            ratio={0.8}
            className="lg:col-span-4 lg:col-start-1 lg:row-start-1 lg:mt-56 lg:self-start"
            caption={<><span className="caption mr-2">Fig. 3</span>Chips, sauce, done.</>}
          />
        </div>

        <div className="mt-24 grid gap-x-8 gap-y-16 sm:mt-40 lg:grid-cols-12">
          <Photo
            src="/img/editorial/plate-a.webp"
            alt="Rolls with peanuts and chocolate sauce beside a shot glass of sauce"
            ratio={1.5}
            className="lg:col-span-6 lg:col-start-7"
            caption={<><span className="caption mr-2">Fig. 4</span>Nuts, a shot of sauce, a plastic fork.</>}
          />
          <dl className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-3 lg:col-span-12 lg:row-start-2">
            <div className="border-t border-current/60 pt-3">
              <dt className="caption">Rolls from</dt>
              <dd className="mt-3 font-display text-[clamp(2.2rem,3.8vw,3.6rem)] leading-none"><span data-count={rollsFrom} data-prefix="₹" className="tabular-nums">{rupees(rollsFrom)}</span></dd>
            </div>
            <div className="border-t border-current/60 pt-3">
              <dt className="caption">On Google</dt>
              <dd className="mt-3 font-display text-[clamp(2.2rem,3.8vw,3.6rem)] leading-none"><span data-count={site.rating.value} data-decimals="1" className="tabular-nums">{site.rating.value.toFixed(1)}</span><span className="t-accent ml-1 text-[0.6em]" aria-label="stars">&#9733;</span></dd>
              <dd className="caption-i mt-2 opacity-80">{site.rating.label.replace(/^on Google · /, "")}</dd>
            </div>
            <div className="border-t border-current/60 pt-3">
              <dt className="caption">On the menu</dt>
              <dd className="mt-3 font-display text-[clamp(2.2rem,3.8vw,3.6rem)] leading-none"><span data-count={onTheMenu} className="tabular-nums">{onTheMenu}</span></dd>
              <dd className="caption-i mt-2 opacity-80">rolls, cones, shakes, momos and more</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
