"use client";

import { useEffect, useRef } from "react";

/**
 * Desktop menu hover: a photo that follows the cursor while it is over a menu row (any element with data-photo inside
 * `[data-menu-hover]`). One floating card for the whole menu; it eases toward the pointer in a rAF loop that only runs
 * while the pointer is over the menu. Only with a fine pointer, and not on narrow screens (phones get the swipe row).
 * Decorative: the rows already carry the name and description, so the card is aria-hidden.
 */
export default function MenuHover() {
  const card = useRef<HTMLDivElement>(null);
  const img = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const host = document.querySelector<HTMLElement>("[data-menu-hover]");
    const el = card.current, im = img.current;
    if (!host || !el || !im) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 768px)").matches) return;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let tx = 0, ty = 0, x = 0, y = 0, raf = 0, shown = false, current = "";
    const W = 300, H = 380;
    const loop = () => {
      x += (tx - x) * (calm ? 1 : 0.16);
      y += (ty - y) * (calm ? 1 : 0.16);
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) scale(${shown ? 1 : 0.88})`;
      raf = shown || Math.abs(tx - x) > 0.5 || Math.abs(ty - y) > 0.5 ? requestAnimationFrame(loop) : 0;
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(loop); };
    const place = (e: PointerEvent) => {
      const right = e.clientX + 36 + W > window.innerWidth - 12;
      tx = right ? e.clientX - 36 - W : e.clientX + 36;
      ty = Math.max(12, Math.min(window.innerHeight - H - 12, e.clientY - H / 2));
    };
    const over = (e: PointerEvent) => {
      const row = (e.target as Element).closest<HTMLElement>("[data-photo]");
      const src = row?.dataset.photo;
      if (!row || !src) { hide(); return; }
      if (!shown) { place(e); x = tx; y = ty; }
      if (src !== current) { current = src; im.src = src; }
      shown = true;
      el.style.opacity = "1";
      kick();
    };
    const move = (e: PointerEvent) => { if (shown) { place(e); kick(); } };
    const hide = () => { shown = false; el.style.opacity = "0"; kick(); };
    host.addEventListener("pointerover", over);
    host.addEventListener("pointermove", move, { passive: true });
    host.addEventListener("pointerleave", hide);
    return () => { host.removeEventListener("pointerover", over); host.removeEventListener("pointermove", move); host.removeEventListener("pointerleave", hide); cancelAnimationFrame(raf); };
  }, []);

  return (
    <div ref={card} aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-40 hidden h-[380px] w-[300px] overflow-hidden rounded-[28px] bg-white opacity-0 transition-opacity duration-200 md:block" style={{ willChange: "transform, opacity" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img ref={img} alt="" width={300} height={380} decoding="async" className="h-full w-full object-cover" />
    </div>
  );
}
