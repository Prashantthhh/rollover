import { categories } from "../data/menu";
import HandDrawn from "./HandDrawn";
import MenuHover from "./MenuHover";
import MenuPanel from "./MenuPanel";
import MenuTabs from "./MenuTabs";
import OrderButton from "./OrderButton";
import Split from "./Split";

/**
 * The menu as a list in the middle of the issue: a huge cut-off headline, a contents line of categories, then name /
 * line / price rows. Photos only appear on hover (desktop) or tap (phones), so the page stays quiet.
 */
export default function MenuSection() {
  // running figure numbers, so each photo caption is unique across categories
  let figs = 11;
  const offsets = categories.map((c) => { const o = figs; figs += c.items.length; return o; });

  return (
    <>
      <section id="menu" data-tone="ink" className="cv relative">
        <div data-menu-hover className="mx-auto max-w-[1600px] px-4 pb-32 pt-24 sm:px-8 sm:pb-48 sm:pt-36">
          <div className="flex items-baseline justify-between border-t border-current/60 pt-3">
            <p className="caption">No. 03 &mdash; The menu</p>
            <p className="caption">p. 03</p>
          </div>

          <div className="relative mb-16 mt-10 grid items-end gap-x-8 gap-y-8 sm:mb-24 lg:grid-cols-12">
            <div className="drift lg:col-span-9">
              <Split
                by="char"
                id="menu-h"
                className="-ml-[0.03em] font-display text-[clamp(4.2rem,16vw,17rem)] leading-[0.85] tracking-[-0.05em]"
                parts={[{ t: "The " }, { t: "menu", em: true }, { t: ".", accent: true }]}
              />
            </div>
            <div className="lg:col-span-3 lg:pb-4">
              <p className="caption-i max-w-[16rem] opacity-80">Prices in rupees. Hover a line on a computer, or tap one on your phone, to see it.</p>
              <div className="mt-5"><OrderButton label="Get it delivered" className="btn" /></div>
              <div className="mt-12 hidden grid-cols-2 gap-x-6 lg:grid">
                <div className="relative h-14"><HandDrawn slot={2} note="arrow to the bestseller [CONFIRM which item]" className="absolute inset-0" /></div>
                <div className="relative h-14"><HandDrawn slot={3} note={'handwritten "try this one!"'} className="absolute inset-0" /></div>
              </div>
            </div>

          </div>

          <MenuTabs tabs={categories.map((c) => ({ id: c.id, title: c.title }))} />
          {categories.map((c, i) => (
            <div key={c.id} role="tabpanel" id={`panel-${c.id}`} aria-labelledby={`tab-${c.id}`} hidden={i !== 0} tabIndex={0} className="mt-14 md:mt-20">
              <MenuPanel category={c} offset={offsets[i]} />
            </div>
          ))}
        </div>
      </section>
      {/* outside the section: content-visibility contains position: fixed */}
      <MenuHover />
    </>
  );
}
