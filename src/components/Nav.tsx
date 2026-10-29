"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import OrderButton from "./OrderButton";

const links = [
  { href: "#menu", label: "Menu" },
  { href: "#specials", label: "Specials" },
  { href: "#gallery", label: "Gallery" },
  { href: "#visit", label: "Visit" },
];

const list = { hidden: {}, show: { transition: { staggerChildren: 0.04, delayChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: -10 }, show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 500, damping: 34 } } };

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
    <header ref={header} className="sticky top-0 z-50 bg-cream">
      <nav aria-label="Main" className="mx-auto flex h-16 max-w-[1600px] items-center gap-3 px-4 sm:px-8">
        <a href="#top" className="mr-auto shrink-0" aria-label="RollOver Warangal, home">
          {/* plain <img>: always above the fold, so no lazy loading, and no preload hint competing with the hero poster */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/img/brand/logo.webp" srcSet="/img/brand/logo-sm.webp 480w, /img/brand/logo.webp 586w" sizes="195px" alt="RollOver: ice creams, hand crafted" width={586} height={133} loading="lazy" decoding="async" className="h-8 w-auto min-[400px]:h-10 sm:h-11" />
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="rounded-full px-4 py-2 text-base font-bold hover:bg-white">{l.label}</a>
            </li>
          ))}
        </ul>

        <OrderButton label="Order" align="right" className="btn btn-pink !min-h-11 !px-5 !text-base sm:!px-6" />

        <button
          ref={toggle}
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((o) => !o)}
        >
          <svg aria-hidden="true" width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            {open ? <path d="M4 4l12 12M16 4L4 16" /> : <path d="M3 6h14M3 10h14M3 14h14" />}
          </svg>
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <m.div
            id="mobile-menu"
            className="dark-block absolute inset-x-3 top-full mt-2 origin-top rounded-[28px] bg-ink p-3 text-cream md:hidden"
            initial={{ opacity: 0, y: -18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, transition: { duration: 0.14 } }}
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
          >
            <m.ul variants={list} initial="hidden" animate="show">
              {links.map((l) => (
                <m.li key={l.href} variants={item}>
                  <a href={l.href} onClick={() => setOpen(false)} className="block rounded-2xl px-4 py-3 font-display text-4xl leading-tight hover:bg-cream hover:text-ink">{l.label}</a>
                </m.li>
              ))}
            </m.ul>
          </m.div>
        )}
      </AnimatePresence>
    </header>
  );
}
