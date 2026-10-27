"use client";

import { useRef } from "react";
import { useInView } from "motion/react";
import type { StepId } from "../data/steps";
import StepArt from "./StepArt";

/**
 * Wraps a step illustration so its CSS animation only runs while it is on screen (and `active`).
 * SVG-internal animation is main-thread work, so running it off-screen cost ~5 fps during the hero scroll
 * on a throttled phone.
 */
export default function StepArtLive({ id, active = true }: { id: StepId; active?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "0px" });
  return (
    <div ref={ref} className="h-full w-full">
      <StepArt id={id} active={active && inView} />
    </div>
  );
}
