import { categories } from "../data/menu";
import CategoryIcon from "./CategoryIcon";
import CenterActive from "./CenterActive";

/**
 * The category row: a real link per category (/menu/c/<slug>), an icon, a number and a short name, the open one marked with
 * aria-current, an accent rule and an italic name. All 11 sit side by side on a computer; on a phone it is a strip you swipe.
 */
export default function MenuCategoryNav({ current }: { current: string }) {
  return (
    <nav aria-label="Menu categories" className="-mx-4 border-y border-current/60 sm:-mx-8">
      <div data-cat-row className="overflow-x-auto overscroll-x-contain px-4 [scrollbar-width:none] sm:px-8 [&::-webkit-scrollbar]:hidden">
        <ul className="flex w-max min-w-full lg:grid lg:w-full lg:grid-cols-11">
          {categories.map((c, i) => {
            const on = c.id === current;
            return (
              <li key={c.id} className="shrink-0">
                <a
                  href={`/menu/c/${c.id}`}
                  aria-current={on ? "page" : undefined}
                  className={`flex w-[5.75rem] flex-col items-center gap-2 border-b-2 py-4 text-center lg:w-auto ${on ? "border-[var(--accent)]" : "border-transparent opacity-60 hover:opacity-100 focus-visible:opacity-100"}`}
                >
                  <CategoryIcon slug={c.id} className="h-9 w-9" />
                  <span className="caption">{String(i + 1).padStart(2, "0")}</span>
                  <span className={`font-display text-[1.05rem] leading-none sm:text-lg ${on ? "it" : ""}`}>{c.short}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
      <CenterActive />
    </nav>
  );
}
