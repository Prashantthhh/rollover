"use client";

import { useRef } from "react";
import { useScroll, useSpring, useTransform } from "motion/react";
import * as m from "motion/react-m";

/**
 * Scroll-driven hero. Exposes progress to CSS as --p on the stage (0 = full-screen video, 1 = rounded rectangle).
 * Only one custom property changes per frame; the clip-path, radius and headline fade are derived from it in globals.css,
 * so nothing here animates layout.
 *
 * Progress is measured on the invisible "runway" after the stage: it starts at exactly the moment the stage
 * becomes pinned and ends after the runway's height of scroll (80svh desktop, 60svh phones).
 *
 * Under prefers-reduced-motion the CSS pins --p to 0 and removes the pinning and the runway: a plain full-screen hero.
 */
export default function HeroScrub({ children }: { children: React.ReactNode }) {
  const runway = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: runway, offset: ["start end", "end end"] });
  const shrink = useTransform(scrollYProgress, [0, 0.8], [0, 1], { clamp: true });
  const p = useSpring(shrink, { stiffness: 140, damping: 30, mass: 0.6, restDelta: 0.001 });

  return (
    <div id="top" className="hero-wrap">
      <m.div className="hero-stage" style={{ "--p": p } as React.ComponentProps<typeof m.div>["style"]}>
        {children}
      </m.div>
      <div ref={runway} className="hero-runway" aria-hidden="true" />
    </div>
  );
}
