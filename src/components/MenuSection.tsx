import { categories } from "../data/menu";
import MenuHover from "./MenuHover";
import MenuPanel from "./MenuPanel";
import MenuTabs from "./MenuTabs";
import OrderButton from "./OrderButton";
import SplitHeading from "./SplitHeading";

/** The menu as a wide rounded panel in the accent colour: pill tabs, big type, white cards. */
export default function MenuSection() {
  return (
    <>
    <section id="menu" className="cv mx-2 rounded-[32px] bg-accent sm:mx-4 sm:rounded-[44px]">
      <div data-menu-hover className="mx-auto max-w-[1400px] px-4 pb-16 pt-16 sm:px-8 sm:pb-24 sm:pt-24">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6 sm:mb-14">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] sm:text-base">Prices in rupees</p>
            <SplitHeading text="The menu" className="mt-3 font-display text-[3.6rem] leading-[0.95] sm:text-8xl lg:text-[9rem]" />
          </div>
          <OrderButton label="Get it delivered" className="btn btn-ink" align="right" />
        </div>
        <MenuTabs tabs={categories.map((c) => ({ id: c.id, title: c.title }))} />
        {categories.map((c, i) => (
          <div key={c.id} role="tabpanel" id={`panel-${c.id}`} aria-labelledby={`tab-${c.id}`} hidden={i !== 0} tabIndex={0} className="mt-8 md:mt-10">
            <MenuPanel category={c} />
          </div>
        ))}
      </div>
    </section>
    {/* outside the section: content-visibility contains position: fixed */}
    <MenuHover />
    </>
  );
}
