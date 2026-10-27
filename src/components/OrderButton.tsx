"use client";

import { useEffect, useId, useRef, useState } from "react";
import { site } from "../data/site";

/** "Order" button that opens a small Swiggy / Zomato chooser. */
export default function OrderButton({ label, className = "btn btn-pink", align = "left" }: { label: string; className?: string; align?: "left" | "right" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(false); button.current?.focus(); } };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDown); document.removeEventListener("keydown", onKey); };
  }, [open]);

  const link = "flex min-h-12 items-center justify-between gap-6 px-4 py-2 text-base font-bold uppercase tracking-wide hover:bg-maroon hover:text-cream";

  return (
    <div ref={ref} className="relative inline-block">
      <button ref={button} type="button" className={className} aria-expanded={open} aria-controls={panelId} onClick={() => setOpen((o) => !o)}>
        {label}
        <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14" className={`transition-transform ${open ? "rotate-180" : ""}`}><path d="M2 5l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      {open && (
        <div id={panelId} className={`absolute z-50 mt-3 w-60 border-[3px] border-maroon bg-cream p-1 text-maroon shadow-[5px_5px_0_var(--color-pink)] ${align === "right" ? "right-0" : "left-0"}`}>
          <a className={link} href={site.order.swiggy} target="_blank" rel="noopener noreferrer">Order on Swiggy <span aria-hidden="true">↗</span></a>
          <a className={link} href={site.order.zomato} target="_blank" rel="noopener noreferrer">Order on Zomato <span aria-hidden="true">↗</span></a>
        </div>
      )}
    </div>
  );
}
