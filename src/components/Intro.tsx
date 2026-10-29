import { rupees } from "../data/menu";
import menuData from "../data/menu.json";
import HandDrawn from "./HandDrawn";

const rollsFrom = Math.min(...menuData.categories.find((c) => c.id === "ice-cream-rolls")!.items.map((i) => i.price));

/** Standfirst: the shop in one paragraph, set large, with the folio and a hanging note in the margin. */
export default function Intro() {
  return (
    <section aria-labelledby="intro-h" className="relative mx-auto max-w-[1600px] px-4 pb-24 pt-20 sm:px-8 sm:pb-36 sm:pt-32">
      <div className="grid gap-x-8 gap-y-8 lg:grid-cols-12">
        <div className="lg:col-span-2">
          <p className="caption">No. 01</p>
          <hr className="my-3 border-0 border-t border-ink" />
          <p className="caption-i max-w-[12rem] text-ink/80">
            A rolled ice cream shop in Hanamkonda, and how it got that way.
          </p>
          <p className="caption mt-8 border border-dashed border-ink/60 p-2 text-[0.6875rem] normal-case tracking-normal">Doodle slot 1 &middot; a hand-drawn circle round the price, drawn on as this enters.</p>
        </div>

        <div className="lg:col-span-9 lg:col-start-4">
          <h2 id="intro-h" className="sr-only">About RollOver</h2>
          <p className="font-display text-[clamp(2rem,4.3vw,4.4rem)] leading-[1.08] tracking-[-0.03em]">
            RollOver is the ice cream shop <em className="not-italic text-pink">opposite Tara Gardens</em>, in Prashanthnagar Colony. Rolls start at{" "}
            <span className="relative inline-block whitespace-nowrap">
              {rupees(rollsFrom)}
              <HandDrawn slot={1} note="circle round the price" label="none" className="absolute -inset-x-4 -inset-y-1" />
            </span>
            , each one made on a cold steel plate in front of you. Stay a while: there are board games.
          </p>
          <p className="caption mt-10 flex items-center gap-4">
            <span className="inline-block h-px w-12 bg-ink" />
            Scroll to watch one get rolled
          </p>
        </div>
      </div>
    </section>
  );
}
