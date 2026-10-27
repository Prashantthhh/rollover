"use client";

import { useEffect, useState } from "react";
import * as m from "motion/react-m";
import { HOURS_CONFIRMED, site } from "../data/site";
import { openStatus } from "../lib/hours";

const list = { hidden: {}, show: { transition: { staggerChildren: 0.09 } } };
const chip = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };
const base = "border-[3px] border-maroon px-3 py-1.5 text-sm font-extrabold uppercase tracking-[0.1em] sm:text-base";

/** Quick facts as plain labelled boxes that fade in together. "Open now" is worked out in the browser (Indian time). */
export default function StatChips() {
  const [status, setStatus] = useState<{ open: boolean; text: string } | null>(null);
  useEffect(() => {
    if (!HOURS_CONFIRMED) return;
    const tick = () => setStatus(openStatus());
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <m.ul className="flex flex-wrap gap-3" variants={list} initial="hidden" whileInView="show" viewport={{ once: true, margin: "0px 0px -10% 0px" }}>
      <m.li variants={chip} className={`${base} bg-pink`}>
        <span aria-hidden="true">★ {site.rating.value}</span>
        <span className="sr-only">{site.rating.value} star rating</span>
      </m.li>
      {HOURS_CONFIRMED && (
        <m.li variants={chip} className={`${base} ${status ? (status.open ? "bg-pink" : "bg-cream") : "bg-cream"}`}>
          {status ? status.text : "Open daily"}
        </m.li>
      )}
      <m.li variants={chip} className={`${base} bg-cream`}>Board games</m.li>
      <m.li variants={chip} className={`${base} bg-cream`}>Family-friendly hangout</m.li>
    </m.ul>
  );
}
