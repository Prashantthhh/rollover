import { categories } from "../data/menu";
import HandDrawn from "./HandDrawn";
import MenuHover from "./MenuHover";
import MenuPanel from "./MenuPanel";
import MenuTabs from "./MenuTabs";
import OrderButton from "./OrderButton";

/**
 * The menu as a list in the middle of the issue: a huge cut-off headline, a contents line of categories, then name /
 * line / price rows. Photos only appear on hover (desktop) or tap (phones), so the page stays quiet.
 */
export default function MenuSection() {
  // running figure numbers, so each photo caption is unique across categories
  let figs = 2;
  const offsets = categories.map((c) => { const o = figs; figs += c.items.length; return o; });

  return (
    <>
      <section id="menu" className="cv relative">
        <div data-menu-hover className="mx-auto max-w-[1600px] px-4 pb-24 pt-8 sm:px-8 sm:pb-32">
          <div className="flex items-baseline justify-between border-t border-ink pt-3">
            <p className="caption">No. 03 &mdash; The menu</p>
            <p className="caption">p. 03</p>
          </div>

          <div className="relative mb-10 mt-4 grid items-end gap-x-8 gap-y-6 sm:mb-14 lg:grid-cols-12">
            <h2 className="-ml-[0.04em] font-display text-[clamp(5.5rem,22vw,24rem)] leading-[0.8] tracking-[-0.06em] lg:col-span-9">
              Menu<span className="text-pink">.</span>
            </h2>
            <div className="lg:col-span-3 lg:pb-4">
              <p className="caption-i max-w-[16rem]">Prices in rupees. Hover a line on a computer, or tap one on your phone, to see it.</p>
              <div className="mt-5"><OrderButton label="Get it delivered" className="btn btn-ink" /></div>
            </div>
            <HandDrawn slot={2} note="arrow to the bestseller [CONFIRM which item]" className="absolute -bottom-2 left-[62%] hidden h-16 w-36 lg:block" />
            <HandDrawn slot={3} note={'handwritten "try this one!"'} label="right" className="absolute right-0 -top-1 hidden h-14 w-40 lg:block" />
          </div>

          <MenuTabs tabs={categories.map((c) => ({ id: c.id, title: c.title }))} />
          {categories.map((c, i) => (
            <div key={c.id} role="tabpanel" id={`panel-${c.id}`} aria-labelledby={`tab-${c.id}`} hidden={i !== 0} tabIndex={0} className="mt-10 md:mt-14">
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
