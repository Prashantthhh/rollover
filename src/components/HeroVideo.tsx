"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type NetworkInformation = { saveData?: boolean; effectiveType?: string };

/**
 * Short muted loop (under 1 MB) over a poster <img> (the poster is what paints first).
 * Playback starts after the window `load` event plus an idle moment (requestIdleCallback, 1 s fallback), so it
 * never competes with the page's own resources, and then fades in over the poster. It does not start at all
 * with reduced motion, Data Saver or a 2G/slow-2G connection; the poster stays. Pauses when scrolled away.
 */
export default function HeroVideo({ treatment = "none" }: { treatment?: "duotone" | "halftone" | "none" }) {
  const suffix = treatment === "none" ? "" : `-${treatment}`;
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const conn = (navigator as Navigator & { connection?: NetworkInformation }).connection;
    const slow = conn?.saveData || /(^|-)2g$/.test(conn?.effectiveType ?? "");
    if (slow || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let io: IntersectionObserver | undefined;
    let idle: number | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const start = () => {
      io = new IntersectionObserver(([e]) => { if (e.isIntersecting) v.play().catch(() => {}); else v.pause(); }, { threshold: 0.2 });
      io.observe(v);
    };
    const afterLoad = () => {
      if ("requestIdleCallback" in window) idle = window.requestIdleCallback(start, { timeout: 1000 });
      else timer = setTimeout(start, 1000);
    };
    if (document.readyState === "complete") afterLoad(); else window.addEventListener("load", afterLoad, { once: true });

    return () => {
      io?.disconnect();
      if (idle !== undefined) window.cancelIdleCallback(idle);
      clearTimeout(timer);
      window.removeEventListener("load", afterLoad);
    };
  }, []);

  return (
    <>
      <Image src={`/video/hero-poster${suffix}.webp`} alt="" fill priority sizes="100vw" className="object-cover" />
      <video
        ref={ref}
        onPlaying={() => setPlaying(true)}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${playing ? "opacity-100" : "opacity-0"}`}
        muted loop playsInline preload="metadata"
        aria-label="A chef spreads ice cream batter on a freezing plate and rolls it, then a plate of chocolate-drizzled rolls"
      >
        <source src={`/video/hero${suffix}.mp4`} type="video/mp4" />
      </video>
    </>
  );
}
