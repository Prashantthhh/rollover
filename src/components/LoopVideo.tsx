"use client";

import { useEffect, useRef } from "react";

/**
 * Muted, looping, inline clip over a poster frame. Nothing is fetched until it nears the viewport (preload="none"),
 * and it plays only while on screen and `active`: every time it comes back into view it is told to play again,
 * so scrolling past and back never leaves it frozen. With reduced motion (or Data Saver) the poster stays.
 */
export default function LoopVideo({ src, poster, label, active = true, className = "", style, eager = false }: { src: string; poster: string; label?: string; active?: boolean; className?: string; style?: React.CSSProperties; eager?: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  const visible = useRef(false);
  const want = useRef(active);
  const still = useRef(false);

  const sync = () => {
    const v = ref.current;
    if (!v || still.current) return;
    if (visible.current && want.current) v.play().catch(() => {});
    else v.pause();
  };

  useEffect(() => {
    want.current = active;
    sync();
  }, [active]);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    still.current = !!conn?.saveData || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (still.current) return;
    const io = new IntersectionObserver(([e]) => { visible.current = e.isIntersecting; sync(); }, { rootMargin: eager ? "200px" : "0px", threshold: 0.15 });
    io.observe(v);
    const onVis = () => sync();
    document.addEventListener("visibilitychange", onVis);
    return () => { io.disconnect(); document.removeEventListener("visibilitychange", onVis); };
  }, []);

  return (
    <video
      ref={ref}
      className={className}
      style={style}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload={eager ? "metadata" : "none"}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      tabIndex={-1}
    />
  );
}
