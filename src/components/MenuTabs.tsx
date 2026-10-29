"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Category tabs (WAI-ARIA tabs pattern: arrow keys, Home/End, roving tabindex), set as a contents line: a number and a
 * name, a pink rule under the open one. Only this strip is a client component. The panels (MenuSection) are plain server
 * HTML next to it, one per tab with id `panel-<id>`; every panel is in the HTML (inactive ones are `hidden`), so the
 * whole menu is crawlable and lazy images in hidden panels do not load until their tab is opened. This component shows
 * and hides the panels directly in the DOM.
 */
export default function MenuTabs({ tabs: categories }: { tabs: { id: string; title: string }[] }) {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const userMoved = useRef(false);

  useEffect(() => {
    if (!userMoved.current) return;
    tabs.current[active]?.scrollIntoView({ inline: "center", block: "nearest", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }, [active]);

  useEffect(() => {
    categories.forEach((c, i) => {
      const panel = document.getElementById(`panel-${c.id}`);
      if (panel) panel.hidden = i !== active;
    });
  }, [active, categories]);

  const go = (i: number) => {
    const next = (i + categories.length) % categories.length;
    userMoved.current = true;
    setActive(next);
    tabs.current[next]?.focus();
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") go(active + 1);
    else if (e.key === "ArrowLeft") go(active - 1);
    else if (e.key === "Home") go(0);
    else if (e.key === "End") go(categories.length - 1);
    else return;
    e.preventDefault();
  };

  return (
    <div className="-mx-4 overflow-x-auto border-y border-current/60 px-4 [scrollbar-width:none] sm:-mx-8 sm:px-8 [&::-webkit-scrollbar]:hidden">
      <div role="tablist" aria-label="Menu categories" onKeyDown={onKey} className="flex w-max gap-7 sm:gap-10">
        {categories.map((c, i) => (
          <button
            key={c.id}
            ref={(el) => { tabs.current[i] = el; }}
            type="button"
            role="tab"
            id={`tab-${c.id}`}
            aria-selected={i === active}
            aria-controls={`panel-${c.id}`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => { userMoved.current = true; setActive(i); }}
            className={`flex items-baseline gap-2 whitespace-nowrap border-b py-4 ${i === active ? "border-current" : "border-transparent opacity-60 hover:opacity-100"}`}
          >
            <span className="caption">{String(i + 1).padStart(2, "0")}</span>
            <span className={`font-display text-xl leading-none sm:text-2xl ${i === active ? "it" : ""}`}>{c.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
