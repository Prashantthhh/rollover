"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion, useScroll, useTransform } from "motion/react";
import * as m from "motion/react-m";
import { HOURS_CONFIRMED, site } from "../data/site";
import { to12h } from "../lib/hours";

const explore = [
  { href: "#menu", label: "Menu" },
  { href: "#specials", label: "Specials" },
  { href: "#gallery", label: "The vibe" },
  { href: "#visit", label: "Come find us" },
];

const social = [
  {
    label: "Instagram",
    href: site.social.instagram,
    icon: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.2" cy="6.8" r="1" className="fill-cream" stroke="none" />
      </>
    ),
  },
  { label: "Facebook", href: site.social.facebook, icon: <path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8Z" /> },
  {
    label: "YouTube",
    href: site.social.youtube,
    icon: (
      <>
        <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
        <path d="M10 9.5v5l4.5-2.5Z" className="fill-cream" />
      </>
    ),
  },
];

const link = "underline decoration-2 underline-offset-4 hover:decoration-4";

/**
 * Footer: maroon, with a straight scalloped shop awning (pink and cream stripes) hanging over its top edge.
 * The awning is a flat repeating SVG (.awning in globals.css). As the footer scrolls into view its content slides
 * down out from underneath the awning (transform only). The footer stays in normal document flow, so keyboard
 * order and screen readers are unaffected; while focus is inside it the content sits in its final place.
 */
export default function Footer() {
  const ref = useRef<HTMLElement>(null);
  const still = !!useReducedMotion();
  const [focusIn, setFocusIn] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  // Focus snaps the content to its final place (below); the browser scrolled to the old position, so scroll again.
  useEffect(() => {
    if (!focusIn) return;
    // motion applies the new transform on its next frame, so wait two frames before measuring
    let id = requestAnimationFrame(() => { id = requestAnimationFrame(() => document.activeElement?.scrollIntoView({ block: "nearest", behavior: "instant" })); });
    return () => cancelAnimationFrame(id);
  }, [focusIn]);
  const y = useTransform(scrollYProgress, [0, 1], still ? ["0%", "0%"] : ["-24%", "0%"]);

  return (
    <footer
      ref={ref}
      className="curtain-footer dark-block relative bg-maroon text-cream"
      onFocusCapture={() => setFocusIn(true)}
      onBlurCapture={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocusIn(false); }}
    >
      <div aria-hidden="true" className="awning" />
      <m.div style={focusIn ? { y: "0%" } : { y }} className="mx-auto max-w-6xl px-4 pb-8 pt-28">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h2 className="font-display text-2xl text-pink">{site.name}</h2>
            <address className="mt-3 not-italic leading-relaxed">
              {site.address.line}
              <br />
              {site.address.locality}, {site.address.region} {site.address.postalCode}
            </address>
            <p className="mt-3"><a className={link} href={site.maps.directionsUrl} target="_blank" rel="noopener noreferrer">Directions</a></p>
          </div>

          <div>
            <h2 className="font-display text-2xl text-pink">Opening hours</h2>
            <dl className="mt-3 space-y-1">
              {site.hours.map((h) => (
                <div key={h.days}>
                  <dt className="font-bold uppercase tracking-wide">{h.days}</dt>
                  <dd>{to12h(h.opens)} to {to12h(h.closes)}</dd>
                </div>
              ))}
            </dl>
            {!HOURS_CONFIRMED && <p className="mt-2 text-sm font-bold uppercase tracking-wider">Hours may vary</p>}
          </div>

          <div>
            <h2 className="font-display text-2xl text-pink">Say hello</h2>
            <ul className="mt-3 space-y-2">
              <li><a className={link} href={site.phoneHref}>{site.phone}</a></li>
              <li><a className={link} href={site.whatsappHref} target="_blank" rel="noopener noreferrer">WhatsApp</a></li>
              <li><a className={link} href={site.order.swiggy} target="_blank" rel="noopener noreferrer">Order on Swiggy</a></li>
              <li><a className={link} href={site.order.zomato} target="_blank" rel="noopener noreferrer">Order on Zomato</a></li>
            </ul>
          </div>

          <div>
            <h2 className="font-display text-2xl text-pink">Follow along</h2>
            <ul className="mt-3 flex gap-3">
              {social.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="flex h-12 w-12 items-center justify-center border-[3px] border-cream bg-maroon text-cream hover:bg-cream hover:text-maroon">
                    <svg aria-hidden="true" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" focusable="false">{s.icon}</svg>
                  </a>
                </li>
              ))}
            </ul>
            <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-1">
              {explore.map((l) => (
                <li key={l.href}><a className={link} href={l.href}>{l.label}</a></li>
              ))}
            </ul>
          </div>
        </div>

        <p aria-hidden="true" className="mt-14 select-none text-center font-display text-[clamp(4.2rem,19.5vw,16rem)] leading-[0.9] text-pink">
          RollOver
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t-[3px] border-cream pt-5 text-sm">
          <p>&copy; {new Date().getFullYear()} {site.name}</p>
          <p>
            <a className={link} href={site.partner.href} target="_blank" rel="noopener noreferrer">{site.partner.label}</a>
            {!site.partner.active && <span className="ml-2 font-bold">[CONFIRM IF ACTIVE]</span>}
          </p>
          <a className={link} href="#top">Back to top <span aria-hidden="true">↑</span></a>
        </div>
      </m.div>
    </footer>
  );
}
