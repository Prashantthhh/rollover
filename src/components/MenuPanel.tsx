import Image from "next/image";
import { rupees, type MenuCategory } from "../data/menu";
import PhotoSoon from "./PhotoSoon";
import VegMark from "./VegMark";

/**
 * One category of the menu. Server-rendered, one list, two layouts:
 * - phones: a horizontal swipe row (scroll-snap) of big photo cards;
 * - desktop: a clean price list; hovering a row shows its photo following the cursor (MenuHover reads data-photo).
 * No per-row JavaScript.
 */
export default function MenuPanel({ category }: { category: MenuCategory }) {
  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-x-8 gap-y-2 md:mb-8">
        <h3 className="font-display text-[2.6rem] leading-none sm:text-6xl">{category.title}</h3>
        {category.blurb && <p className="max-w-md text-lg leading-snug md:text-right">{category.blurb}</p>}
      </div>
      <ul className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-3 [scrollbar-width:none] md:mx-0 md:block md:snap-none md:overflow-visible md:px-0 md:pb-0 [&::-webkit-scrollbar]:hidden">
        {category.items.map((it) => (
          <li
            key={it.name}
            data-photo={it.image ?? undefined}
            className="menu-card w-[74vw] max-w-[21rem] shrink-0 snap-start rounded-[28px] bg-white p-3 md:w-auto md:max-w-none md:shrink md:rounded-none md:border-t md:border-ink/20 md:bg-transparent md:p-0 md:last:border-b"
          >
            <div className="relative mb-3 aspect-[4/5] overflow-hidden rounded-[20px] md:hidden">
              {it.image ? <Image src={it.image} alt={it.name} fill sizes="74vw" loading="lazy" fetchPriority="low" className="object-cover" /> : <PhotoSoon className="h-full w-full" />}
            </div>
            <div className="menu-row flex items-start justify-between gap-4 px-1 md:items-center md:rounded-2xl md:px-5 md:py-6 md:transition-colors md:hover:bg-white/70">
              <div className="min-w-0">
                <div className="flex items-center gap-2.5">
                  <VegMark veg={it.veg} className="shrink-0" />
                  <h4 className="font-display text-2xl leading-tight md:text-[2.1rem]">{it.name}</h4>
                </div>
                <p className="mt-1.5 max-w-2xl text-base leading-snug text-ink/75 md:pl-[1.9rem] md:text-lg">{it.desc}</p>
              </div>
              <span className="pill shrink-0 !bg-pink text-base md:text-lg md:!bg-white md:[.menu-card:hover_&]:!bg-pink">{rupees(it.price)}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
