"use client";

import { LazyMotion, MotionConfig, domAnimation } from "motion/react";

/**
 * App-wide motion setup.
 * - reducedMotion="user": transform/layout animations are skipped when the OS asks for less motion.
 * - LazyMotion + domAnimation, with `strict`: only the slim `m.*` components are allowed (import them
 *   from "motion/react-m"), so the full `motion.*` bundle can never sneak in.
 */
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation} strict>
        {children}
      </LazyMotion>
    </MotionConfig>
  );
}
