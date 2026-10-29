"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Photo = { name: string; image: string | null };

/**
 * Looping row of photographs. CSS translates a doubled track by -50% (compositor only). It only runs while it is on screen.
 * - Direction follows the page: scrolling up reverses it (Animation.updatePlaybackRate, so it turns smoothly).
 * - Pauses on hover and focus; there is also a real Pause button (WCAG 2.2.2: moving content > 5 s).
 * - Reduced motion: no animation; the strip becomes a normal swipeable row (see globals.css).
 * - The second copy is aria-hidden and unfocusable so screen readers meet each photo once.
 */
export default function PhotoMarquee({ photos }: { photos: Photo[] }) {
  const track = useRef<HTMLUListElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    let last = window.scrollY, dir = 1, raf = 0;
    const anims = () => el.getAnimations();
    // A negative playback rate on an animation sitting near time 0 runs off the start and FINISHES it, and a finished
    // loop never comes back. So keep currentTime many whole loops from zero (a whole-loop shift looks identical).
    const rearm = () => {
      for (const a of anims()) {
        const d = Number(a.effect?.getComputedTiming().duration) || 36000;
        if (a.playState === "idle" || a.playState === "finished") { a.currentTime = d * 1000; a.playbackRate = dir; a.play(); }
        else if (Number(a.currentTime) < d * 100) a.currentTime = Number(a.currentTime) + d * 1000;
      }
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY, d = y - last;
        last = y;
        if (Math.abs(d) < 4) return;
        const next = d > 0 ? 1 : -1;
        if (next === dir) return;
        dir = next;
        rearm();
        anims().forEach((a) => a.updatePlaybackRate(dir));
      });
    };
    // Listen only while the strip is on screen: reading scrollY elsewhere (e.g. during the hero shrink) forces a layout flush every frame.
    // Each time it comes back into view, re-arm the animation so it always runs again.
    const io = new IntersectionObserver(([e]) => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
      if (e.isIntersecting) {
        last = window.scrollY; rearm();
        if (el.style.animationPlayState !== "paused") anims().forEach((a) => a.play());
        window.addEventListener("scroll", onScroll, { passive: true });
      } else anims().forEach((a) => a.pause()); // an infinite animation costs main-thread time even offscreen
    });
    io.observe(el);
    rearm();
    return () => { io.disconnect(); window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, []);

  const shots = photos.filter((p) => p.image);

  return (
    <div className="marquee relative">
      <div className="marquee-viewport overflow-hidden" data-cursor="View">
        <ul ref={track} className="marquee-track flex w-max" style={{ animationPlayState: paused ? "paused" : undefined }}>
          {[0, 1].map((copy) =>
            shots.map((p, i) => (
              <li key={`${copy}-${p.name}`} className={`${copy ? "marquee-clone" : ""} mr-6 shrink-0 sm:mr-10 ${i % 2 ? "mt-12 sm:mt-20" : ""}`} aria-hidden={copy ? true : undefined}>
                <div className="relative h-64 w-52 bg-paper-deep sm:h-[26rem] sm:w-80">
                  <Image src={p.image!} alt={copy ? "" : p.name} fetchPriority="low" fill sizes="(min-width: 640px) 320px, 208px" className="object-cover" />
                </div>
                <p className="caption-i mt-3 max-w-52 truncate sm:max-w-80"><span className="caption mr-2">Fig. {80 + i}</span>{p.name}</p>
              </li>
            )),
          )}
        </ul>
      </div>
      <button
        type="button"
        onClick={() => setPaused((v) => !v)}
        aria-pressed={paused}
        className="marquee-pause btn mx-auto mt-12 flex"
      >
        <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
          {paused ? <path d="M3 1.5v11l9-5.5Z" /> : <path d="M2.5 1.5h3v11h-3zM8.500 1.500h3v11h-3z" />}
        </svg>
        {paused ? "Play photo strip" : "Pause photo strip"}
      </button>
    </div>
  );
}
