import type { CSSProperties } from "react";
import { HERO_TREATMENT } from "../data/art";
import HeroVideo from "./HeroVideo";
import OrderButton from "./OrderButton";

const lines = ["Rolled while", "you watch."]; // the second line renders "watch." in italic

/**
 * Cover page. Full-bleed real footage with the headline set huge across the bottom; each line is revealed by a
 * left-to-right mask wipe (.wipe-line, pure CSS, so it is in the server HTML and paints without waiting for hydration).
 * The issue line sits in the top-right corner. A flat 40% ink layer keeps the white type readable on any frame.
 * The wipe is switched off under prefers-reduced-motion in globals.css.
 */
export default function Hero() {
  return (
    <section id="top" className="hero on-video" aria-label="Cover">
      <HeroVideo treatment={HERO_TREATMENT} />
      <div aria-hidden="true" className="absolute inset-0 bg-ink/40" />

      <p className="caption fade-in absolute right-4 top-5 sm:right-8 sm:top-7" style={{ "--i": 0 } as CSSProperties}>No. 01 &mdash; Hanamkonda</p>
      <p aria-hidden="true" className="caption fade-in absolute left-4 top-5 sm:left-8 sm:top-7" style={{ "--i": 0 } as CSSProperties}>The cold plate issue</p>

      <div className="absolute inset-x-0 bottom-0 mx-auto flex max-w-[1800px] flex-col px-4 pb-5 sm:px-8 sm:pb-7">
        <h1 className="font-display text-[clamp(3rem,11vw,12.5rem)] leading-[0.9] tracking-[-0.035em]">
          <span className="sr-only">{lines.join(" ")}</span>
          <span aria-hidden="true">
            {lines.map((t, i) => (
              <span key={t} className={`wipe-line ${i === 1 ? "text-pink" : ""}`}><span className="wipe-in" style={{ "--i": i } as CSSProperties}>{i === 1 ? <>you <em>watch.</em></> : t}</span></span>
            ))}
          </span>
        </h1>

        <div className="fade-in mt-6 flex flex-wrap items-end justify-between gap-x-8 gap-y-5 border-t border-white/50 pt-5" style={{ "--i": 2 } as CSSProperties}>
          <p className="caption-i max-w-[22rem]">
            <span className="caption mr-2">Fig. 1</span>
            Made on a cold steel plate, in front of you. Opposite Tara Gardens, Prashanthnagar Colony.
          </p>
          <div className="flex flex-wrap items-center gap-6">
            <OrderButton label="Order" className="btn btn-pink" />
            <a href="#visit" className="caption ulink px-1">Find the shop</a>
          </div>
        </div>
      </div>
    </section>
  );
}
