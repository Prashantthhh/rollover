"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Desktop-only motion polish, nothing rendered:
 * - Lenis smooth scroll, only with a fine pointer and no reduced-motion preference (touch keeps native momentum scrolling,
 *   which a JS scroller cannot match). In-page links hand over to Lenis so "#menu" glides the same way.
 * - "Magnet" buttons: .btn drifts a few pixels toward the cursor while hovered and settles back on leave.
 */
export default function FreshMotion() {
  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || calm) return;

    const root = document.documentElement;
    const lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 0.9, anchors: false });
    let raf = 0;
    const tick = (t: number) => { lenis.raf(t); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);

    // HashNav renders every section for real before jumping (content-visibility); here we only take over the scroll itself.
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[href^='#']") as HTMLAnchorElement | null;
      if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      const id = a.getAttribute("href")!.slice(1);
      const target = id ? document.getElementById(id) : null;
      if (!target) return;
      e.stopImmediatePropagation();
      e.preventDefault();
      root.classList.add("cv-off");
      requestAnimationFrame(() => {
        lenis.scrollTo(target, { offset: -64, duration: 1.2 });
        history.replaceState(null, "", `#${id}`);
        setTimeout(() => root.classList.remove("cv-off"), 1600);
      });
    };
    document.addEventListener("click", onClick, true);

    let hot: HTMLElement | null = null;
    const move = (e: PointerEvent) => {
      const b = (e.target as Element | null)?.closest?.<HTMLElement>(".btn") ?? null;
      if (hot && hot !== b) { hot.style.transform = ""; hot = null; }
      if (!b) return;
      hot = b;
      const r = b.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / r.width, dy = (e.clientY - (r.top + r.height / 2)) / r.height;
      b.style.transform = `translate3d(${(dx * 14).toFixed(1)}px, ${(dy * 10).toFixed(1)}px, 0)`;
    };
    const leave = () => { if (hot) { hot.style.transform = ""; hot = null; } };
    document.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, []);
  return null;
}
