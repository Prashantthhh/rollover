"use client";

import { useEffect, useRef } from "react";

/**
 * Desktop menu hover: the item's real photo follows the cursor with a slight lag and a tilt, like a print being carried
 * across the page. One floating card for the whole menu (any element with data-photo inside `[data-menu-hover]`). It eases
 * toward the pointer in a rAF loop that only runs while the pointer is over the menu or the card is still settling; the tilt
 * follows the horizontal velocity, so it leans into the move and straightens as it catches up. Only with a fine pointer and
 * not on narrow screens (phones expand the photo inline instead). Decorative: the rows already carry the name and line,
 * so the card is aria-hidden. With reduced motion the card still appears but sticks to the cursor with no lag or tilt.
 */
export default function MenuHover() {
  const card = useRef<HTMLDivElement>(null);
  const img = useRef<HTMLImageElement>(null);
  const cap = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const host = document.querySelector<HTMLElement>("[data-menu-hover]");
    const el = card.current, im = img.current, label = cap.current;
    if (!host || !el || !im || !label) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 768px)").matches) return;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // rows with a photo are <details> for touch devices; with a mouse nothing should toggle, so hold them open
    host.querySelectorAll<HTMLDetailsElement>("details.menu-row").forEach((d) => { d.open = true; });
    const noToggle = (e: Event) => { if ((e.target as Element).closest("details.menu-row > summary")) e.preventDefault(); };
    host.addEventListener("click", noToggle);

    let tx = 0, ty = 0, x = 0, y = 0, raf = 0, shown = false, current = "";
    const W = 280, H = 372;
    const loop = () => {
      const k = calm ? 1 : 0.11;
      const dx = tx - x, dy = ty - y;
      x += dx * k; y += dy * k;
      const tilt = calm ? 0 : Math.max(-9, Math.min(9, dx * 0.07));
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(${tilt.toFixed(2)}deg) scale(${shown ? 1 : 0.94})`;
      raf = shown || Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5 ? requestAnimationFrame(loop) : 0;
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(loop); };
    const place = (e: PointerEvent) => {
      const right = e.clientX + 40 + W > window.innerWidth - 12;
      tx = right ? e.clientX - 40 - W : e.clientX + 40;
      ty = Math.max(12, Math.min(window.innerHeight - H - 12, e.clientY - H / 2));
    };
    const hide = () => { shown = false; el.style.opacity = "0"; kick(); };
    const over = (e: PointerEvent) => {
      const row = (e.target as Element).closest<HTMLElement>("[data-photo]");
      const src = row?.dataset.photo;
      if (!row || !src) { hide(); return; }
      if (!shown) { place(e); x = tx; y = ty; }
      if (src !== current) { current = src; im.src = src; label.textContent = row.dataset.caption ?? ""; }
      shown = true;
      el.style.opacity = "1";
      kick();
    };
    const move = (e: PointerEvent) => { if (shown) { place(e); kick(); } };
    host.addEventListener("pointerover", over);
    host.addEventListener("pointermove", move, { passive: true });
    host.addEventListener("pointerleave", hide);
    return () => { host.removeEventListener("pointerover", over); host.removeEventListener("pointermove", move); host.removeEventListener("pointerleave", hide); host.removeEventListener("click", noToggle); cancelAnimationFrame(raf); };
  }, []);

  return (
    <div ref={card} aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-40 hidden w-[280px] bg-paper p-2 opacity-0 transition-opacity duration-200 md:block" style={{ willChange: "transform, opacity", boxShadow: "0 0 0 1px var(--color-ink)" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img ref={img} alt="" width={264} height={330} decoding="async" className="aspect-[4/5] w-full object-cover" />
      <p ref={cap} className="caption-i mt-2 truncate" />
    </div>
  );
}
