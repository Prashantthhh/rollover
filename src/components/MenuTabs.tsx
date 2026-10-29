"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import * as m from "motion/react-m";

const HIDDEN = "inset(0px 99999px 0px 0px round 999px)";

/**
 * Category tabs (WAI-ARIA tabs pattern: arrow keys, Home/End, roving tabindex).
 * The sliding highlight is one pink bar behind the tabs whose clip-path is animated to the active tab's
 * rectangle (clip-path only, no width animation). Until it is measured the active tab paints its own pink.
 * Only the tab strip is a client component. The panels (MenuSection) are plain server HTML next to it, one per tab
 * with id `panel-<id>`; every panel is in the HTML (inactive ones are `hidden`), so the whole menu is crawlable, no
 * row is hydrated, and lazy images in hidden panels do not load until their tab is opened. This component shows and
 * hides the panels directly in the DOM.
 */
export default function MenuTabs({ tabs: categories }: { tabs: { id: string; title: string }[] }) {
  const [active, setActive] = useState(0);
  const [clip, setClip] = useState(HIDDEN);
  const [instant, setInstant] = useState(true);
  const strip = useRef<HTMLDivElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const userMoved = useRef(false);

  const measure = useCallback(() => {
    const wrap = strip.current, tab = tabs.current[active];
    if (!wrap || !tab) return;
    const left = tab.offsetLeft, right = wrap.scrollWidth - (left + tab.offsetWidth);
    setClip(`inset(0px ${right}px 0px ${left}px round 999px)`);
    requestAnimationFrame(() => setInstant(false)); // the first measurement is placed without animating
  }, [active]);

  useLayoutEffect(measure, [measure]);
  useEffect(() => {
    const wrap = strip.current;
    if (!wrap) return;
    const ro = new ResizeObserver(measure);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [measure]);

  useEffect(() => {
    if (!userMoved.current) return;
    tabs.current[active]?.scrollIntoView({ inline: "center", block: "nearest", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }, [active]);

  useEffect(() => {
    categories.forEach((c, i) => {
      const panel = document.getElementById(`panel-${c.id}`);
      if (!panel) return;
      panel.hidden = i !== active;
      if (i === active && userMoved.current) panel.dataset.fresh = "true";
      else delete panel.dataset.fresh;
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

  const ready = clip !== HIDDEN;

  return (
    <div>
      <div className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div ref={strip} role="tablist" aria-label="Menu categories" onKeyDown={onKey} className="relative flex w-max gap-1 rounded-full bg-white p-1.5">
          <m.span
            aria-hidden="true"
            className="absolute inset-y-1.5 left-0 w-full bg-pink"
            initial={false}
            animate={{ clipPath: clip }}
            transition={instant ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 34 }}
          />
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
              className={`relative z-10 whitespace-nowrap rounded-full px-4 py-2.5 text-base font-bold leading-none sm:px-5 sm:py-3 ${i === active && !ready ? "bg-pink" : ""}`}
            >
              {c.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
