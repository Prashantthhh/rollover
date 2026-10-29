import { categories } from "../data/menu";
import Doodle from "./Doodle";
import MenuPanel from "./MenuPanel";
import MenuTabs from "./MenuTabs";
import OrderButton from "./OrderButton";
import SplitHeading from "./SplitHeading";

/** The menu as a maroon board: cream and pink type on flat maroon, square corners, dotted price leaders. */
export default function MenuSection() {
  return (
    <section id="menu" className="cv dark-block bg-maroon text-cream">
      <div className="mx-auto max-w-6xl px-4 pb-14 pt-20 sm:pb-16 sm:pt-24">
        <div className="relative mb-10 flex flex-wrap items-end justify-between gap-6 border-b-[3px] border-cream pb-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.14em] sm:text-base">Prices in rupees</p>
            <SplitHeading text="What's on the board" className="mt-2 font-display text-[2.7rem] leading-[1.05] sm:text-6xl lg:text-7xl" />
          </div>
          <Doodle slot="menuBoard" className="absolute -top-3 right-0 hidden w-16 text-cream md:block" />
          <OrderButton label="Get it delivered" className="btn btn-pink" align="right" />
        </div>
        <MenuTabs tabs={categories.map((c) => ({ id: c.id, title: c.title }))} />
        {categories.map((c, i) => (
          <div key={c.id} role="tabpanel" id={`panel-${c.id}`} aria-labelledby={`tab-${c.id}`} hidden={i !== 0} tabIndex={0} className="mt-5">
            <MenuPanel category={c} />
          </div>
        ))}
      </div>
    </section>
  );
}
