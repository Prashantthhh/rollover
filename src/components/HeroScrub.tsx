"use client";

import { useRef } from "react";
import { useScroll, useSpring, useTransform } from "motion/react";
import * as m from "motion/react-m";

/**
 * Scroll-driven hero. Exposes progress to CSS as --p on the stage (0 = full-bleed video, 1 = framed video).
 * Only one custom property changes per frame; the clip-path and the pop-in stickers are derived from it in
 * globals.css, so nothing here animates layout.
 *
 * Progress is measured on the invisible "runway" after the stage: it starts at exactly the moment the stage
 * becomes pinned (so on phones, where the headline block sits above the stage and scrolls away, nothing
 * shrinks until the stage is pinned) and ends after --d of scroll (85svh desktop, 51svh = 60% on phones).
 *
 * Under prefers-reduced-motion the CSS pins --p to 1 and removes the pinning and the runway.
 */
export default function HeroScrub({ text, children }: { text: React.ReactNode; children: React.ReactNode }) {
  const runway = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: runway, offset: ["start end", "end end"] });
  const shrink = useTransform(scrollYProgress, [0, 0.75], [0, 1], { clamp: true });
  const p = useSpring(shrink, { stiffness: 140, damping: 30, mass: 0.6, restDelta: 0.001 });

  return (
    <div id="top" className="hero-wrap">
      <div className="hero-text">{text}</div>
      <m.div className="hero-stage" style={{ "--p": p } as React.ComponentProps<typeof m.div>["style"]}>
        {children}
      </m.div>
      <div ref={runway} className="hero-runway" aria-hidden="true" />
    </div>
  );
}
