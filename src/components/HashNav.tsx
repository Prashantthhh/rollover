"use client";

import { useEffect } from "react";

/**
 * Below-the-fold sections use `content-visibility: auto` (see .cv in globals.css) so the browser skips their
 * layout and paint until they are near the viewport. The catch: their off-screen height is an estimate, so a
 * jump to "#menu" could land short. For in-page links we therefore turn the optimisation off for a moment,
 * jump (the positions are then exact), and turn it back on once the scroll has settled.
 */
export default function HashNav() {
  useEffect(() => {
    const root = document.documentElement;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let keyboardMode = false;

    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[href^='#']") as HTMLAnchorElement | null;
      if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      const id = a.getAttribute("href")!.slice(1);
      const target = id ? document.getElementById(id) : document.body;
      if (!target) return;
      e.preventDefault();
      root.classList.add("cv-off");
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      requestAnimationFrame(() => {
        target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
        history.replaceState(null, "", id ? `#${id}` : location.pathname);
        clearTimeout(timer);
        timer = setTimeout(() => { if (!keyboardMode) root.classList.remove("cv-off"); }, reduce ? 100 : 1500);
      });
    };

    // Keyboard users: focus moving into a skipped section would scroll using its estimated height and can
    // overshoot. The first Tab press renders every section for real (a one-off layout cost) and keeps it that way.
    const onKey = (e: KeyboardEvent) => { if (e.key === "Tab") { keyboardMode = true; root.classList.add("cv-off"); document.removeEventListener("keydown", onKey); } };

    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("click", onClick); document.removeEventListener("keydown", onKey); clearTimeout(timer); };
  }, []);
  return null;
}
