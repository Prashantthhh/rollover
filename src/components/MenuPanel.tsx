import Image from "next/image";
import { rupees, type MenuCategory } from "../data/menu";
import PhotoSoon from "./PhotoSoon";

/**
 * The dish list of one category, set as a list: number, name, one line, price. Server-rendered, one markup per row (the
 * filter and search in MenuControls only show and hide rows, found by the `data-veg` / `.nm` / `.ds` / `.no` hooks below).
 * - mouse devices: plain rows; hovering a row shows its photo following the cursor (MenuHover reads data-photo / data-soon /
 *   data-caption on the <li>, and holds every <details> open so nothing toggles).
 * - touch devices: every row is a native <details>; tapping it expands the photo inline. No per-row JavaScript.
 * A dish with no photo yet shows the "Photo coming soon" tile in the same places (PhotoSoon).
 * The veg / non-veg mark is one CSS element (.veg in globals.css), not an SVG.
 */
export default function MenuPanel({ category, offset, listId }: { category: MenuCategory; offset: number; listId: string }) {
  return (
    <ol id={listId} className="border-y border-current/60">
      {category.items.map((it, i) => {
        const fig = `Fig. ${offset + i + 1}`;
        return (
          <li key={it.name} data-veg={it.veg ? "1" : "0"} data-photo={it.image ?? undefined} data-soon={it.image ? undefined : ""} data-caption={`${fig} — ${it.name}${it.placeholder ? " (representative photo)" : ""}`} className={`menu-li border-t border-current/25 ${i === 0 ? "is-first" : ""}`}>
            <details className="menu-row">
              <summary className="grid cursor-pointer grid-cols-[2rem_minmax(0,1fr)_auto] items-start gap-x-3 py-5 md:grid-cols-[4rem_minmax(0,1.2fr)_minmax(0,1fr)_auto] md:gap-x-8 md:py-7">
                <span className="no caption pt-2 md:self-center md:pt-0">{String(i + 1).padStart(2, "0")}</span>
                <span className="flex min-w-0 items-center gap-2.5">
                  <i role="img" aria-label={it.veg ? "Vegetarian" : "Non-vegetarian"} className={`veg ${it.veg ? "veg-y" : "veg-n"}`} />
                  <span className="nm font-display text-[1.4rem] leading-[1.1] sm:text-[1.7rem] md:text-[2rem]">{it.name}</span>
                </span>
                <span className="ds caption-i col-span-2 col-start-2 row-start-2 max-w-[34rem] opacity-75 md:col-span-1 md:col-start-3 md:row-start-1 md:max-w-[26rem] md:self-center">{it.desc}</span>
                <span className="flex items-center gap-3 self-start pt-1 md:self-center md:pt-0">
                  <span className="font-display text-[1.25rem] leading-none tabular-nums md:text-[1.6rem]">{rupees(it.price)}</span>
                  <span aria-hidden="true" className="plus" />
                </span>
              </summary>
              <figure className="row-photo pb-5 pl-[2.75rem] md:pl-[4.75rem]">
                {it.image ? (
                  <div className="relative aspect-[4/3] max-w-[34rem] overflow-hidden bg-paper-deep">
                    <Image src={it.image} alt={it.name} fill sizes="(min-width: 768px) 34rem, 90vw" loading="lazy" fetchPriority="low" className="object-cover" />
                  </div>
                ) : (
                  <PhotoSoon className="aspect-[4/3] max-w-[34rem]" />
                )}
                <figcaption className="caption-i mt-2">{fig} &mdash; {it.name}, {rupees(it.price)}{it.placeholder && " · representative photo"}</figcaption>
              </figure>
            </details>
          </li>
        );
      })}
    </ol>
  );
}
