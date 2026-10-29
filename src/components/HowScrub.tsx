"use client";

import { useEffect, useRef } from "react";
import { steps } from "../data/steps";

const SRC = "/video/how-scrub.mp4";
const FPS = 30;
const HEAD = 56; // sticky nav height in px (3.5rem)
/** Progress (0-1 through the clip) at which each step's caption takes over: pour & chop, spread, roll. Cut points of the real footage. */
const CUTS = [0, 0.46, 0.64];
const STILLS = ["/video/how-pour.webp", "/video/how-spread.webp", "/video/how-roll.webp"];
const ALT = [
  "Two staff at the counter pour and chop the base on the steel plate",
  "A scraper spreads the batter thin across the frozen plate",
  "Finished rolls lined up on the cold tray",
];

type NetworkInformation = { saveData?: boolean; effectiveType?: string };

/**
 * "How it's made": a pinned stage in which scrolling plays the cafe's own footage forward, frame by frame.
 *
 * - The clip (how-scrub.mp4) is encoded all-intra (ffmpeg -g 1), so every frame is a keyframe and seeking to any frame is
 *   cheap. Scroll position maps to video.currentTime, eased in a rAF loop that runs only while the section is near the
 *   viewport and the value is still moving. Steps and the progress bar are written straight to the DOM (data-step, --sp):
 *   no React re-render while scrolling.
 * - The video only starts downloading when the section is within about a screen of the viewport.
 * - With prefers-reduced-motion, Data Saver, a 2G connection (or no JavaScript) the pinned stage is replaced by three
 *   still figures, one per step: no scrubbing, no video download.
 */
export default function HowScrub() {
  const root = useRef<HTMLElement>(null);
  const run = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = root.current, track = run.current, v = video.current;
    if (!el || !track || !v) return;
    const conn = (navigator as Navigator & { connection?: NetworkInformation }).connection;
    const lean = conn?.saveData || /(^|-)2g$/.test(conn?.effectiveType ?? "");
    if (lean || window.matchMedia("(prefers-reduced-motion: reduce)").matches) { el.classList.add("is-still"); return; }

    let target = 0, cur = 0, raf = 0, lastFrame = -1, lastStep = -1, near = false, loaded = false;

    const apply = () => {
      const dur = v.duration || 5.1;
      const frame = Math.min(Math.floor(dur * FPS) - 1, Math.round(cur * dur * FPS));
      if (frame !== lastFrame && v.readyState >= 1) { lastFrame = frame; v.currentTime = frame / FPS; }
      const step = cur >= CUTS[2] ? 2 : cur >= CUTS[1] ? 1 : 0;
      if (step !== lastStep) { lastStep = step; el.dataset.step = String(step); }
      el.style.setProperty("--sp", cur.toFixed(4));
    };
    const tick = () => {
      cur += (target - cur) * 0.2;
      if (Math.abs(target - cur) < 0.0004) { cur = target; raf = 0; } else raf = requestAnimationFrame(tick);
      apply();
    };
    const read = () => {
      const r = track.getBoundingClientRect();
      const span = r.height - (window.innerHeight - HEAD);
      const p = span > 0 ? (HEAD - r.top) / span : 0;
      // hold the first and last frame for a few percent of the scroll so the ends feel settled
      target = Math.min(1, Math.max(0, (p - 0.03) / 0.94));
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const load = () => { if (loaded) return; loaded = true; v.src = SRC; v.load(); };
    const io = new IntersectionObserver(([e]) => {
      near = e.isIntersecting;
      if (near) { load(); read(); window.addEventListener("scroll", read, { passive: true }); window.addEventListener("resize", read); }
      else { window.removeEventListener("scroll", read); window.removeEventListener("resize", read); }
    }, { rootMargin: "100% 0px 100% 0px" });
    io.observe(track);
    const onReady = () => { lastFrame = -1; apply(); };
    v.addEventListener("loadedmetadata", onReady);
    v.addEventListener("error", () => el.classList.add("is-still"));

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", read);
      window.removeEventListener("resize", read);
      v.removeEventListener("loadedmetadata", onReady);
    };
  }, []);

  return (
    <section id="how" ref={root} data-step="0" className="how-root relative" aria-labelledby="how-h">
      {/* page head */}
      <div className="mx-auto max-w-[1600px] px-4 pb-14 sm:px-8 sm:pb-20">
        <div className="flex items-baseline justify-between border-t border-ink pt-3">
          <p className="caption">No. 02 &mdash; How it&apos;s made</p>
          <p className="caption">p. 02</p>
        </div>
        <h2 id="how-h" className="mt-6 max-w-[14ch] font-display text-[clamp(3.4rem,10.5vw,11rem)] leading-[0.9] tracking-[-0.04em] sm:mt-10">
          Three moves, one <span className="text-pink">cold plate.</span>
        </h2>
      </div>

      {/* pinned, scrubbed stage */}
      <div ref={run} className="how-run">
        <div className="how-stage border-y border-ink bg-paper">
          <div className="grid h-full grid-rows-[56%_1fr] lg:grid-cols-12 lg:grid-rows-1">
            <figure className="relative order-1 overflow-hidden bg-ink lg:order-2 lg:col-span-8 lg:col-start-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={STILLS[0]} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" />
              <video
                ref={video}
                className="absolute inset-0 h-full w-full object-cover"
                muted playsInline preload="none" tabIndex={-1} aria-hidden="true"
              />
              <figcaption className="caption on-video absolute bottom-3 right-4 text-white [text-shadow:0_1px_8px_rgb(0_0_0/0.6)] sm:bottom-5 sm:right-6">
                Fig. 2 &mdash; the same hands, start to finish
              </figcaption>
            </figure>

            <div className="relative order-2 flex min-h-0 flex-col justify-between px-4 pb-4 pt-4 sm:px-8 lg:order-1 lg:col-span-4 lg:py-8">
              <div className="caption flex items-baseline justify-between">
                <span>Scroll to roll</span>
                <span aria-hidden="true">03 steps</span>
              </div>

              <ol className="sr-only">{steps.map((s) => <li key={s.id}><strong>{s.title}.</strong> {s.text}</li>)}</ol>
              <div className="relative min-h-0 flex-1">
                {steps.map((s, i) => (
                  <div key={s.id} data-i={i} className="step-cap absolute inset-x-0 top-1/2 -translate-y-1/2 lg:top-[38%]" aria-hidden="true">
                    <p className="caption mb-2 lg:mb-4">Step 0{i + 1} of 03</p>
                    <h3 className="font-display text-[clamp(2.6rem,6.2vw,6.4rem)] leading-[0.92] tracking-[-0.035em]">{s.title}</h3>
                    <p className="mt-3 max-w-[26rem] text-[0.95rem] leading-snug sm:text-base lg:mt-6">{s.text}</p>
                  </div>
                ))}
              </div>

              <div aria-hidden="true">
                <div className="h-px bg-ink/30"><div className="how-bar h-[3px] -translate-y-px bg-pink" /></div>
                <div className="caption mt-2 flex justify-between">{steps.map((s) => <span key={s.id}>{s.title.split(" ")[0]}</span>)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* fallback: three stills (reduced motion, Data Saver, no JS) */}
      <div className="how-static mx-auto max-w-[1600px] px-4 pb-20 sm:px-8">
        {steps.map((s, i) => (
          <figure key={s.id} className={`grid items-end gap-x-8 gap-y-4 border-t border-ink py-8 lg:grid-cols-12`}>
            <div className="lg:col-span-4">
              <p className="caption">Step 0{i + 1} of 03</p>
              <h3 className="mt-2 font-display text-5xl leading-[0.95] sm:text-7xl">{s.title}</h3>
              <p className="mt-4 max-w-sm">{s.text}</p>
            </div>
            <div className="relative aspect-[16/10] bg-ink lg:col-span-8 lg:col-start-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={STILLS[i]} alt={ALT[i]} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
            </div>
          </figure>
        ))}
      </div>
    </section>
  );
}
