import Image from "next/image";
import { rupees, type MenuCategory } from "../data/menu";

/**
 * One category of the menu, set as a list: number, name, one line, price. Server-rendered, one markup per row (the
 * whole menu is about 70 rows, so element count matters for hydration and HTML size).
 * - mouse devices: plain rows; hovering a row with a photo shows that photo following the cursor (MenuHover reads
 *   data-photo / data-caption on the <li>, and holds every <details> open so nothing toggles).
 * - touch devices: a row with a photo is a native <details>; tapping it expands the photo inline. No per-row JavaScript.
 * The veg / non-veg mark is one CSS element (.veg in globals.css), not an SVG.
 */
export default function MenuPanel({ category, offset }: { category: MenuCategory; offset: number }) {
  return (
    <div>
      <div className="mb-8 grid gap-x-8 gap-y-3 md:mb-12 md:grid-cols-12">
        <h3 className="font-display text-[clamp(2.3rem,5.4vw,5rem)] leading-[0.95] tracking-[-0.03em] md:col-span-7">{category.title}</h3>
        {category.blurb && <p className="caption-i max-w-sm self-end md:col-span-4 md:col-start-9">{category.blurb}</p>}
      </div>
      <ol className="border-b border-current/60">
        {category.items.map((it, i) => {
          const fig = `Fig. ${offset + i + 1}`;
          const row = (
            <>
              <span className="caption pt-2 md:self-center md:pt-0">{String(i + 1).padStart(2, "0")}</span>
              <span className="flex min-w-0 items-center gap-2.5">
                <i role="img" aria-label={it.veg ? "Vegetarian" : "Non-vegetarian"} className={`veg ${it.veg ? "veg-y" : "veg-n"}`} />
                <span className="nm font-display text-[1.4rem] leading-[1.1] sm:text-[1.7rem] md:text-[2rem]">{it.name}</span>
              </span>
              <span className="caption-i col-span-2 col-start-2 row-start-2 max-w-[34rem] opacity-75 md:col-span-1 md:col-start-3 md:row-start-1 md:max-w-[26rem] md:self-center">{it.desc}</span>
              <span className="flex items-center gap-3 self-start pt-1 md:self-center md:pt-0">
                <span className="font-display text-[1.25rem] leading-none tabular-nums md:text-[1.6rem]">{rupees(it.price)}</span>
                {it.image && <span aria-hidden="true" className="plus" />}
              </span>
            </>
          );
          const grid = "grid grid-cols-[2rem_minmax(0,1fr)_auto] items-start gap-x-3 py-5 md:grid-cols-[4rem_minmax(0,1.2fr)_minmax(0,1fr)_auto] md:gap-x-8 md:py-7";
          return (
            <li key={it.name} data-photo={it.image ?? undefined} data-caption={`${fig} — ${it.name}`} className="menu-li border-t border-current/25 first:border-current/60">
              {it.image ? (
                <details className="menu-row">
                  <summary className={`${grid} cursor-pointer`}>{row}</summary>
                  <figure className="row-photo pb-5 pl-[2.75rem] md:pl-[4.75rem]">
                    <div className="relative aspect-[4/3] max-w-[34rem] overflow-hidden bg-paper-deep">
                      <Image src={it.image} alt={it.name} fill sizes="(min-width: 768px) 34rem, 90vw" loading="lazy" fetchPriority="low" className="object-cover" />
                    </div>
                    <figcaption className="caption-i mt-2">{fig} &mdash; {it.name}, {rupees(it.price)}</figcaption>
                  </figure>
                </details>
              ) : (
                <div className={grid}>{row}</div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
