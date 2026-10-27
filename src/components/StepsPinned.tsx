"use client";

import { useRef, useState } from "react";
import { useMotionValueEvent, useScroll } from "motion/react";
import * as m from "motion/react-m";
import { steps } from "../data/steps";
import StepArtLive from "./StepArtLive";

const blocks = ["bg-cream", "bg-pink", "bg-cream"];

/** Where card i sits relative to the active step: already used (flies up), current, or waiting behind. */
function pose(i: number, active: number) {
  const r = i - active;
  if (r < 0) return { y: "-115%", rotate: -5, opacity: 0 };
  if (r === 0) return { y: 0, rotate: 0, opacity: 1 };
  return { y: r * 22, rotate: r * (i % 2 ? 2 : -2), opacity: 1 };
}

/**
 * Desktop: a tall track with a pinned stage. Scroll progress picks the active step; the picture blocks swap with a
 * spring (transform + opacity only). The recipe card on the left is always fully readable text: the active step is
 * marked by a pink numeral and a bar, never by dimming.
 * Hidden below lg and under reduced motion (the stacked version in HowRolls takes over).
 */
export default function StepsPinned({ heading }: { heading: React.ReactNode }) {
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: track, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (v) => setActive(Math.min(steps.length - 1, Math.max(0, Math.floor(v * steps.length)))));

  return (
    <div ref={track} className="steps-pinned relative hidden h-[300svh] lg:block">
      <div className="sticky top-16 mx-auto grid h-[calc(100svh-4rem)] max-w-6xl grid-cols-[1.1fr_1fr] items-center gap-14 px-4">
        <div>
          {heading}
          <div className="mt-8 border-[3px] border-maroon bg-cream">
            <div className="flex items-center justify-between border-b-[3px] border-maroon bg-maroon px-5 py-2 text-xs font-bold uppercase tracking-[0.16em] text-cream">
              <span>Recipe card no. 1</span>
              <span>Rolled ice cream, serves 1</span>
            </div>
            <ol>
              {steps.map((s, i) => (
                <li
                  key={s.id}
                  className={`relative flex items-center gap-6 px-5 py-5 ${i > 0 ? "border-t-[3px] border-dashed border-maroon" : ""}`}
                  aria-current={i === active ? "step" : undefined}
                >
                  <span aria-hidden="true" className={`absolute inset-y-0 left-0 w-2 ${i === active ? "bg-pink" : "bg-transparent"}`} />
                  <span aria-hidden="true" className={`w-20 shrink-0 text-center font-display text-[5.5rem] leading-none ${i === active ? "text-pink" : "text-maroon"}`}>{i + 1}</span>
                  <div>
                    <h3 className="text-xl font-extrabold uppercase tracking-[0.06em]"><span className="sr-only">Step {i + 1}: </span>{s.title}</h3>
                    <p className="mt-1 max-w-sm text-lg leading-snug">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="relative mx-auto aspect-[4/3] w-full max-w-lg" aria-hidden="true">
          {steps.map((s, i) => (
            <m.div
              key={s.id}
              className={`absolute inset-0 border-[3px] border-maroon p-5 shadow-[10px_10px_0_var(--color-maroon)] ${blocks[i]} ${i === 1 ? "rounded-t-[8rem]" : ""}`}
              style={{ zIndex: steps.length - i }}
              initial={false}
              animate={pose(i, active)}
              transition={{ type: "spring", stiffness: 210, damping: 26 }}
            >
              <StepArtLive id={s.id} active={i === active} />
            </m.div>
          ))}
        </div>
      </div>
    </div>
  );
}
