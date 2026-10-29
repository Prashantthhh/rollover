"use client";

import { useEffect, useRef, useState } from "react";
import { SHOW_SLOT_HINTS } from "../data/site";

export type DoodlePath = { d: string };

/**
 * Hand-drawn layer. Takes SVG paths traced from the cafe's own doodles (scripts/trace-doodles.mjs, once the scans exist)
 * and draws them stroke by stroke (stroke-dashoffset, see .doodle in globals.css) the first time the element scrolls into view.
 * Paths use pathLength="1", so any path length animates with the same CSS.
 *
 * Until the real doodles arrive there are no paths: the component renders a clearly labelled empty slot instead,
 * never a made-up doodle. Fill a slot by passing `paths` (and the viewBox of the trace).
 */
export default function HandDrawn({
  slot,
  note,
  paths,
  viewBox = "0 0 200 100",
  stroke = "#eb3592",
  strokeWidth = 3,
  className = "",
  label = "left",
}: {
  slot: number;
  /** What the doodle should be, shown in the placeholder. */
  note: string;
  paths?: DoodlePath[];
  viewBox?: string;
  stroke?: string;
  strokeWidth?: number;
  className?: string;
  /** Where the placeholder's label sits: under the slot (left- or right-aligned), or "none" when the page lists it elsewhere. */
  label?: "left" | "right" | "none";
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !paths?.length) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold: 0.6 });
    io.observe(el);
    return () => io.disconnect();
  }, [paths]);

  if (!paths?.length) {
    if (!SHOW_SLOT_HINTS) return null;
    return (
      <span data-doodle-slot={slot} className={`pointer-events-none ${className}`}>
        <span aria-hidden="true" className="absolute inset-0 border border-dashed border-current/60" />
        {label !== "none" && <span className={`caption absolute top-full z-10 mt-1 w-full bg-[var(--bg)] px-1 text-[0.625rem] normal-case tracking-normal ${label === "right" ? "right-0 text-right" : "left-0"}`}>Doodle slot {slot} &middot; {note}</span>}
      </span>
    );
  }

  return (
    <span ref={ref} aria-hidden="true" className={`pointer-events-none ${className}`}>
      <svg viewBox={viewBox} className={`doodle h-full w-full overflow-visible ${seen ? "is-in" : ""}`} fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        {paths.map((p, i) => (
          <path key={i} d={p.d} pathLength={1} vectorEffect="non-scaling-stroke" style={{ "--d": i } as React.CSSProperties} />
        ))}
      </svg>
    </span>
  );
}
