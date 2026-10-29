"use client";

import { useEffect, useRef, useState } from "react";
import OrderButton from "./OrderButton";

const links = [
  { href: "#how", label: "How it's made" },
  { href: "#specials", label: "Specials" },
  { href: "#menu", label: "Menu" },
  { href: "#visit", label: "Visit" },
];

/** Masthead: wordmark left, issue line centre, contents and the order button right. A hairline underneath, like a magazine page head. */
export default function Nav() {
  const [open, setOpen] = useState(false);
  const header = useRef<HTMLElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => { if (!header.current?.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(false); toggle.current?.focus(); } };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDown); document.removeEventListener("keydown", onKey); };
  }, [open]);

  return (
    <header ref={header} className="sticky top-0 z-50 border-b border-current/60 bg-[var(--bg)]">
      <nav aria-label="Main" className="mx-auto flex h-14 max-w-[1600px] items-center gap-4 px-4 sm:px-8">
        <a href="#top" className="shrink-0 font-display text-[1.45rem] leading-none tracking-[-0.03em]" aria-label="RollOver Warangal, home">
          Roll<span className="t-accent">O</span>ver
        </a>
        <p className="caption ml-6 hidden border-l border-current/60 pl-6 lg:block">No. 01 &mdash; Hanamkonda</p>

        <ul className="ml-auto hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <li key={l.href}><a href={l.href} className="caption ulink">{l.label}</a></li>
          ))}
        </ul>

        <div className="ml-auto md:ml-0"><OrderButton label="Order" align="right" className="btn btn-pink !min-h-10 !px-4" /></div>

        <button
          ref={toggle}
          type="button"
          className="caption flex h-10 items-center border border-current/60 px-3 md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? "Close" : "Index"}
        </button>
      </nav>

      {open && (
        <div id="mobile-menu" className="absolute inset-x-0 top-full border-b border-current/60 bg-[var(--bg)] px-4 pb-8 pt-2 md:hidden">
          <ul>
            {links.map((l, i) => (
              <li key={l.href} className="border-t border-current/20 first:border-t-0">
                <a href={l.href} onClick={() => setOpen(false)} className="flex items-baseline gap-4 py-3 font-display text-4xl leading-none">
                  <span className="caption w-6">0{i + 1}</span>{l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
