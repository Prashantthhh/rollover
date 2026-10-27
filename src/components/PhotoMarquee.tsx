"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Photo = { name: string; image: string | null };

/**
 * Looping photo strip. CSS translates a doubled track by -50% (compositor only).
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
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY, d = y - last;
        last = y;
        if (Math.abs(d) < 4) return;
        const next = d > 0 ? 1 : -1;
        if (next === dir) return;
        dir = next;
        el.getAnimations().forEach((a) => a.updatePlaybackRate(dir));
      });
    };
    // Listen only while the strip is on screen: reading scrollY elsewhere (e.g. during the hero shrink) forces a layout flush every frame.
    const io = new IntersectionObserver(([e]) => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
      if (e.isIntersecting) { last = window.scrollY; window.addEventListener("scroll", onScroll, { passive: true }); }
    });
    io.observe(el);
    return () => { io.disconnect(); window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, []);

  const shots = photos.filter((p) => p.image);

  return (
    <div className="marquee relative">
      {/* A strip of film: maroon base, perforations top and bottom, cream-edged frames with frame numbers. */}
      <div className="marquee-viewport overflow-hidden border-y-[3px] border-maroon bg-maroon">
        <ul ref={track} className="marquee-track flex w-max" style={{ animationPlayState: paused ? "paused" : undefined }}>
          {[0, 1].map((copy) =>
            shots.map((p, i) => (
              <li key={`${copy}-${p.name}`} className={`${copy ? "marquee-clone" : ""} film-frame relative shrink-0 px-2 pb-9 pt-9`} aria-hidden={copy ? true : undefined}>
                <div className="relative h-56 w-44 border-[3px] border-cream bg-cream sm:h-72 sm:w-56">
                  <Image src={p.image!} alt={copy ? "" : p.name} fetchPriority="low" fill sizes="(min-width: 640px) 224px, 176px" className="object-cover" />
                </div>
                <span aria-hidden="true" className="absolute bottom-2 left-3 text-[10px] font-extrabold tracking-[0.2em] text-cream">{String(i + 1).padStart(2, "0")}A</span>
              </li>
            )),
          )}
        </ul>
      </div>
      <button
        type="button"
        onClick={() => setPaused((v) => !v)}
        aria-pressed={paused}
        className="marquee-pause btn btn-cream mx-auto mt-6 !min-h-11 !px-4 !text-base"
      >
        <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
          {paused ? <path d="M3 1.5v11l9-5.5Z" /> : <path d="M2.5 1.5h3v11h-3zM8.500 1.500h3v11h-3z" />}
        </svg>
        {paused ? "Play photo strip" : "Pause photo strip"}
      </button>
    </div>
  );
}
