"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import PhotoSoon from "./PhotoSoon";

type Shot = { name: string; image: string | null };

/**
 * The photo window of a menu-board category (large screens). The only client code on the board: it listens (one
 * delegated listener per board) for hover, focus or tap on a price row, sets --active on the board so the CSS shows
 * that row's photo, and fetches the photo the first time it is needed. The rows themselves are plain server HTML.
 */
export default function BoardWindow({ shots }: { shots: Shot[] }) {
  const win = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState<number[]>([0]);

  useEffect(() => {
    const board = win.current?.closest<HTMLElement>(".board");
    if (!board) return;
    const pick = (e: Event) => {
      const row = (e.target as Element).closest<HTMLElement>("[data-i]");
      if (!row) return;
      const i = Number(row.dataset.i);
      board.style.setProperty("--active", String(i));
      setLoaded((l) => (l.includes(i) ? l : [...l, i]));
    };
    const events = ["mouseover", "focusin", "click"] as const;
    events.forEach((t) => board.addEventListener(t, pick));
    return () => events.forEach((t) => board.removeEventListener(t, pick));
  }, []);

  return (
    <div ref={win} aria-hidden="true" className="board-window relative mt-8 hidden aspect-square border-[3px] border-cream lg:block">
      {shots.map((s, i) => (
        <div key={s.name} className="board-shot absolute inset-0" style={{ "--i": i } as React.CSSProperties}>
          {s.image ? (
            loaded.includes(i) && <Image src={s.image} alt="" fill sizes="336px" loading="lazy" fetchPriority="low" className="object-cover" />
          ) : (
            <PhotoSoon className="h-full w-full" />
          )}
        </div>
      ))}
    </div>
  );
}
