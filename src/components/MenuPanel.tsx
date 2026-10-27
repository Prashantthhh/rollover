import Image from "next/image";
import { rupees, type MenuCategory } from "../data/menu";
import MenuBoard from "./MenuBoard";
import VegMark from "./VegMark";

/**
 * One category of the menu board. Server-rendered (no per-row JavaScript). Left: category title and, on large
 * screens, a photo window that shows the photo of whichever row is hovered, focused or tapped (MenuBoard sets
 * --active and fetches that photo on first use; the CSS does the rest). Right: a price list with dotted leaders. On smaller screens each row carries
 * its own small photo instead of the window.
 */
export default function MenuPanel({ category }: { category: MenuCategory }) {
  return (
    <MenuBoard title={category.title} blurb={category.blurb} shots={category.items.map((i) => ({ name: i.name, image: i.image }))}>
      <ul>
        {category.items.map((it, i) => (
          <li
            key={it.name}
            data-i={i}
            style={{ "--i": i } as React.CSSProperties}
            className="board-row menu-card relative flex gap-4 border-b-[3px] border-cream py-5 pl-4 first:pt-0 lg:pl-6"
          >
            {it.image && (
              <div className="relative mt-1 h-16 w-16 shrink-0 border-2 border-cream lg:hidden">
                <Image src={it.image} alt={it.name} fill sizes="64px" loading="lazy" fetchPriority="low" className="object-cover" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline gap-3">
                <VegMark veg={it.veg} className="relative top-0.5 shrink-0" />
                <h4 className="text-xl font-extrabold leading-tight sm:text-2xl">{it.name}</h4>
                <span aria-hidden="true" className="mb-1.5 min-w-4 flex-1 self-end border-b-[3px] border-dotted border-cream" />
                <span className="font-display text-3xl leading-none text-pink">{rupees(it.price)}</span>
              </div>
              <p className="mt-1.5 max-w-xl text-base leading-snug">{it.desc}</p>
            </div>
          </li>
        ))}
      </ul>
    </MenuBoard>
  );
}
