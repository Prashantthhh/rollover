"use client";

import { steps } from "../data/steps";
import Reveal from "./Reveal";
import StepArtLive from "./StepArtLive";

const blocks = ["bg-cream", "bg-pink", "bg-cream"];

/** Phones, tablets and reduced motion: the same recipe card as one printed strip, steps one under another. */
export default function StepsStacked() {
  return (
    <Reveal className="steps-stacked mt-8 border-[3px] border-maroon bg-cream lg:hidden">
      <div className="flex items-center justify-between border-b-[3px] border-maroon bg-maroon px-4 py-2 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-cream sm:text-xs">
        <span>Recipe card no. 1</span>
        <span className="hidden sm:inline">Rolled ice cream, serves 1</span>
      </div>
      <ol className="sm:grid sm:grid-cols-3">
        {steps.map((s, i) => (
          <li key={s.id} className={`px-4 py-6 ${i > 0 ? "border-t-[3px] border-dashed border-maroon sm:border-l-[3px] sm:border-t-0" : ""}`}>
            <div className="flex items-start gap-4">
              <span aria-hidden="true" className="w-14 shrink-0 text-center font-display text-[4.5rem] leading-[0.9] text-pink">{i + 1}</span>
              <div>
                <h3 className="text-lg font-extrabold uppercase tracking-[0.06em]"><span className="sr-only">Step {i + 1}: </span>{s.title}</h3>
                <p className="mt-1 text-base leading-snug">{s.text}</p>
              </div>
            </div>
            <div aria-hidden="true" className={`mt-5 aspect-[4/3] border-[3px] border-maroon p-3 ${blocks[i]} ${i === 1 ? "rounded-t-[5rem]" : ""}`}>
              <StepArtLive id={s.id} />
            </div>
          </li>
        ))}
      </ol>
    </Reveal>
  );
}
