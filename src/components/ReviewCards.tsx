"use client";

import * as m from "motion/react-m";
import type { Review } from "../data/reviews";

const list = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const slip = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 0.61, 0.36, 1] as const } } };

// torn top and bottom edges: a zig-zag, drawn with clip-path (flat, no shadow needed: the board behind is flat)
const TORN =
  "polygon(0 6px, 4% 0, 8% 6px, 12% 0, 16% 6px, 20% 0, 24% 6px, 28% 0, 32% 6px, 36% 0, 40% 6px, 44% 0, 48% 6px, 52% 0, 56% 6px, 60% 0, 64% 6px, 68% 0, 72% 6px, 76% 0, 80% 6px, 84% 0, 88% 6px, 92% 0, 96% 6px, 100% 0, 100% calc(100% - 6px), 96% 100%, 92% calc(100% - 6px), 88% 100%, 84% calc(100% - 6px), 80% 100%, 76% calc(100% - 6px), 72% 100%, 68% calc(100% - 6px), 64% 100%, 60% calc(100% - 6px), 56% 100%, 52% calc(100% - 6px), 48% 100%, 44% calc(100% - 6px), 40% 100%, 36% calc(100% - 6px), 32% 100%, 28% calc(100% - 6px), 24% 100%, 20% calc(100% - 6px), 16% 100%, 12% calc(100% - 6px), 8% 100%, 4% calc(100% - 6px), 0 100%)";

function Stars({ n }: { n: number }) {
  return (
    <p className="text-2xl leading-none" aria-label={`${n} out of 5 stars`}>
      <span aria-hidden="true">{"★".repeat(Math.round(n))}{"☆".repeat(5 - Math.round(n))}</span>
    </p>
  );
}

/**
 * Real guest reviews as torn receipt slips. Not rendered until src/data/reviews.ts has entries.
 * Phones: a swipeable row. Larger screens: a staggered grid.
 */
export default function ReviewCards({ reviews }: { reviews: Review[] }) {
  return (
    <m.ul
      className="-mx-4 mt-14 flex snap-x snap-mandatory gap-6 overflow-x-auto px-4 pb-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-3"
      variants={list}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
    >
      {reviews.map((r, i) => (
        <m.li key={r.name + i} variants={slip} className={`w-[80%] shrink-0 snap-center sm:w-auto ${i % 2 ? "sm:mt-8" : ""}`}>
          <div className={i % 2 ? "rotate-[1.5deg]" : "-rotate-[1.5deg]"}>
            <figure className="bg-cream px-6 pb-9 pt-9 text-maroon" style={{ clipPath: TORN }}>
              <p className="flex justify-between text-[0.7rem] font-extrabold uppercase tracking-[0.18em]">
                <span>Guest slip</span>
                <span>No. {String(i + 1).padStart(4, "0")}</span>
              </p>
              <p className="my-3 border-t-[3px] border-dashed border-maroon" aria-hidden="true" />
              {r.rating && <Stars n={r.rating} />}
              <blockquote className="mt-3 text-lg leading-snug">&ldquo;{r.text}&rdquo;</blockquote>
              <p className="my-3 border-t-[3px] border-dashed border-maroon" aria-hidden="true" />
              <figcaption className="flex justify-between gap-3 text-sm font-extrabold uppercase tracking-[0.1em]">
                <span>{r.name}</span>
                {r.when && <span>{r.when}</span>}
              </figcaption>
            </figure>
          </div>
        </m.li>
      ))}
    </m.ul>
  );
}
