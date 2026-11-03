import { categories, fromPrice, rupees } from "../data/menu";
import CategoryIcon from "./CategoryIcon";
import HandDrawn from "./HandDrawn";
import { SHOW_SLOT_HINTS } from "../data/site";
import OrderButton from "./OrderButton";
import Split from "./Split";

// The preview lists rolls first, then the savoury categories, then the rest in menu order, so food shows near the top.
const SAVOURY = ["burgers", "momos", "munchies", "sandwiches"];
const ordered = [categories[0], ...SAVOURY.map((id) => categories.find((c) => c.id === id)!), ...categories.filter((c, i) => i > 0 && !SAVOURY.includes(c.id))];

const dishes = categories.reduce((n, c) => n + c.items.length, 0);

/**
 * The menu preview in the middle of the issue: the huge cut-off headline, then a contents list of every category (number,
 * icon, name, a line, how many dishes and the starting price), each a link to its own page under /menu/c/<slug>. The dishes
 * themselves live on those pages (MenuPage), so the home page stays short.
 */
export default function MenuSection() {
  return (
    <section id="menu" data-tone="ink" className="cv relative">
      <div className="mx-auto max-w-[1600px] px-4 pb-32 pt-24 sm:px-8 sm:pb-48 sm:pt-36">
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
            <p className="caption-i max-w-[16rem] opacity-80">{dishes} dishes in {categories.length} categories, prices in rupees. Pick a category to see every dish.</p>
            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
              <a href="/menu" className="btn btn-pink">See the full menu</a>
              <OrderButton label="Get it delivered" className="btn" />
            </div>
            {/* doodle placeholders: only rendered with SHOW_SLOT_HINTS; once real doodle paths exist, move them out of this block */}
            {SHOW_SLOT_HINTS && (
              <div className="mt-12 hidden grid-cols-2 gap-x-6 lg:grid">
                <div className="relative h-14"><HandDrawn slot={2} note="arrow to the bestseller [CONFIRM which item]" className="absolute inset-0" /></div>
                <div className="relative h-14"><HandDrawn slot={3} note={'handwritten "try this one!"'} className="absolute inset-0" /></div>
              </div>
            )}
          </div>
        </div>

        <ol className="border-y border-current/60">
          {ordered.map((c, i) => (
            <li key={c.id} className="menu-li border-t border-current/25 first:border-t-transparent">
              <a href={`/menu/c/${c.id}`} className="grid grid-cols-[2rem_2.5rem_minmax(0,1fr)_auto] items-center gap-x-3 py-5 md:grid-cols-[4rem_3rem_minmax(0,1.2fr)_minmax(0,1fr)_auto] md:gap-x-8 md:py-6">
                <span className="caption">{String(i + 1).padStart(2, "0")}</span>
                <CategoryIcon slug={c.id} className="h-8 w-8 md:h-10 md:w-10" />
                <span className="nm font-display text-[1.4rem] leading-[1.1] sm:text-[1.7rem] md:text-[2rem]">{c.title}</span>
                <span className="caption-i hidden max-w-[26rem] opacity-75 md:block">{c.items.slice(0, 3).map((it) => it.name).join(", ")}{c.items.length > 3 ? " and more" : ""}</span>
                <span className="caption text-right">
                  {c.items.length} <span className="hidden sm:inline">dishes &middot; </span>
                  <span className="sm:hidden">&middot; </span>from {rupees(fromPrice(c))}
                </span>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
