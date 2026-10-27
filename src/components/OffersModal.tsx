"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import * as m from "motion/react-m";
import { LOCK_HOURS, prizes, type Prize } from "../data/offers";

const STORE = "rollover-prize";
const N = prizes.length;
const SEG = 360 / N;
const COLORS = ["fill-pink", "fill-cream", "fill-sun", "fill-pink-soft"];

type Saved = { id: string; at: number; code: string };
const readSaved = (): Saved | null => {
  try {
    const v = JSON.parse(localStorage.getItem(STORE) || "null") as Saved | null;
    return v && typeof v.code === "string" && Date.now() - v.at < LOCK_HOURS * 3600_000 ? v : null;
  } catch {
    return null;
  }
};
const save = (v: Saved) => {
  try {
    localStorage.setItem(STORE, JSON.stringify(v));
  } catch {
    /* private mode: the lock just won't be remembered */
  }
};
const fmt = (t: number) => new Date(t).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" });
const fmtFull = (t: number) => new Date(t).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" });

// Short code for staff, e.g. RO-4F7K. Letters and digits that are easy to read aloud (no 0/O, 1/I).
const ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
const makeCode = () => "RO-" + Array.from(crypto.getRandomValues(new Uint8Array(4)), (b) => ALPHABET[b % ALPHABET.length]).join("");

function wedge(i: number, r = 150, cx = 160, cy = 160) {
  const a0 = ((i * SEG - 90) * Math.PI) / 180;
  const a1 = (((i + 1) * SEG - 90) * Math.PI) / 180;
  const p = (a: number) => `${(cx + r * Math.cos(a)).toFixed(2)} ${(cy + r * Math.sin(a)).toFixed(2)}`;
  return `M${cx} ${cy}L${p(a0)}A${r} ${r} 0 0 1 ${p(a1)}Z`;
}

function Wheel() {
  return (
    <svg viewBox="0 0 320 320" className="h-full w-full [stroke-linejoin:round]" aria-hidden="true" focusable="false">
      <circle cx="160" cy="160" r="154" className="fill-ink" />
      {prizes.map((p, i) => (
        <g key={p.id}>
          <path d={wedge(i)} className={`${COLORS[i % 4]} stroke-ink stroke-2`} />
          <g transform={`rotate(${i * SEG + SEG / 2} 160 160)`}>
            <text x="160" y="58" textAnchor="middle" className="fill-ink font-display" fontSize="15" fontWeight="700">
              {p.label.map((line, k) => (
                <tspan key={k} x="160" dy={k ? 16 : 0}>{line}</tspan>
              ))}
            </text>
          </g>
        </g>
      ))}
      <circle cx="160" cy="160" r="26" className="fill-cream stroke-ink stroke-4" />
    </svg>
  );
}

/**
 * Optional "spin for a treat" bottom sheet, opened only by the button (never on page load).
 * Native <dialog>: focus is trapped, Esc closes, the page behind is inert. The wheel is a rotated disc that
 * eases to a prize picked with crypto.getRandomValues; the prize list is also available as plain text.
 * After a win the wheel rests for LOCK_HOURS (remembered in localStorage, which is optional).
 */
export default function OffersModal({ buttonClass = "btn btn-pink", label = "Spin for a treat" }: { buttonClass?: string; label?: string }) {
  const dlg = useRef<HTMLDialogElement>(null);
  const [rot, setRot] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<Prize | null>(null);
  const [saved, setSaved] = useState<Saved | null>(null);
  const pending = useRef<Prize | null>(null);

  const open = () => {
    setSaved(readSaved());
    dlg.current?.showModal();
    document.documentElement.classList.add("has-dialog");
  };
  const close = useCallback(() => dlg.current?.close(), []);

  useEffect(() => {
    const d = dlg.current;
    if (!d) return;
    const onClose = () => document.documentElement.classList.remove("has-dialog");
    const onBackdrop = (e: MouseEvent) => {
      if (e.target === d) d.close();
    };
    d.addEventListener("close", onClose);
    d.addEventListener("click", onBackdrop);
    return () => {
      d.removeEventListener("close", onClose);
      d.removeEventListener("click", onBackdrop);
      document.documentElement.classList.remove("has-dialog");
    };
  }, []);

  const spin = () => {
    if (spinning) return;
    const idx = crypto.getRandomValues(new Uint32Array(1))[0] % N;
    pending.current = prizes[idx];
    setResult(null);
    setSpinning(true);
    // put the middle of wedge idx under the pointer at the top: 5 full turns plus the remaining angle
    const center = idx * SEG + SEG / 2;
    setRot((r) => r + 360 * 5 + ((360 - center - (r % 360)) + 720) % 360);
  };

  const landed = () => {
    const p = pending.current;
    if (!p || !spinning) return;
    setSpinning(false);
    setResult(p);
    if (!p.spinAgain) {
      const s = { id: p.id, at: Date.now(), code: makeCode() };
      save(s);
      setSaved(s);
    }
  };

  const shown = result ?? (saved ? prizes.find((p) => p.id === saved.id) ?? null : null);
  const locked = !!saved && !result;

  return (
    <>
      <button type="button" className={buttonClass} onClick={open}>{label}</button>
      <dialog
        ref={dlg}
        aria-labelledby="offers-title"
        className="offers-sheet m-0 mt-auto max-h-[92svh] w-full max-w-none overflow-y-auto overscroll-contain rounded-b-none rounded-t-[2rem] border-2 border-ink bg-cream p-0 text-ink shadow-pop-lg sm:m-auto sm:max-w-lg sm:rounded-[2rem]"
      >
        <div className="relative p-5 pb-8 sm:p-7">
          <button type="button" onClick={close} aria-label="Close" className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border-2 border-ink bg-cream">
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M3 3l12 12M15 3L3 15" /></svg>
          </button>
          <h2 id="offers-title" className="pr-14 font-display text-3xl font-bold leading-tight">Spin for a treat</h2>
          <p className="mt-1 text-base">One win per {LOCK_HOURS} hours. Show the result screen at the counter. Minimum order applies.</p>

          {!locked && (
            <div className="relative mx-auto mt-6 aspect-square w-[min(78vw,20rem)]">
              <div aria-hidden="true" className="absolute left-1/2 top-[-0.6rem] z-10 h-0 w-0 -translate-x-1/2 border-x-[14px] border-t-[26px] border-x-transparent border-t-ink" />
              <m.div className="h-full w-full" animate={{ rotate: rot }} transition={{ duration: 3.8, ease: [0.16, 0.7, 0.12, 1] }} onAnimationComplete={landed}>
                <Wheel />
              </m.div>
            </div>
          )}

          <div className="mt-6" aria-live="polite">
            {shown ? (
              <m.div
                key={shown.id + (result ? "r" : "s")}
                initial={{ scale: 0.8, opacity: 0, rotate: -3 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 340, damping: 18 }}
                className="rounded-3xl border-2 border-ink bg-sun p-5 text-center shadow-pop"
              >
                <p className="font-display text-3xl font-bold leading-tight">{shown.title}</p>
                {shown.minOrder && <p className="mt-2 text-lg font-semibold">Minimum order ₹{shown.minOrder}</p>}
                {!shown.spinAgain && !shown.minOrder && <p className="mt-2">No prize this time. Come back later!</p>}
                {saved && !shown.spinAgain && shown.minOrder && (
                  <>
                    <p className="mt-4 inline-block rounded-2xl border-2 border-ink bg-cream px-5 py-2 font-display text-4xl font-bold tracking-widest" aria-label={`Code ${saved.code.split("").join(" ")}`}>{saved.code}</p>
                    <p className="mt-3 text-base font-semibold">{fmtFull(saved.at)}</p>
                    <p className="mt-1 text-base">Show this screen at the counter. You can spin again after {fmt(saved.at + LOCK_HOURS * 3600_000)}.</p>
                  </>
                )}
              </m.div>
            ) : (
              <p className="text-center text-lg">{spinning ? "Spinning…" : "Press Spin and see where it lands."}</p>
            )}
          </div>

          {!locked && (
            <button type="button" onClick={spin} disabled={spinning} className="btn btn-pink mx-auto mt-5 flex disabled:opacity-60">
              {spinning ? "Spinning…" : result?.spinAgain ? "Spin again" : result ? "Spin once more" : "Spin"}
            </button>
          )}

          <details className="mt-6 rounded-2xl border-2 border-ink p-4">
            <summary className="cursor-pointer font-display text-xl font-bold">All prizes and rules</summary>
            <ul className="mt-3 space-y-1.5 text-base">
              {prizes.filter((p) => !p.spinAgain && p.minOrder).map((p) => (
                <li key={p.id}><strong>{p.title}</strong>: minimum order ₹{p.minOrder}</li>
              ))}
              <li>Some spins win nothing, and some let you spin again.</li>
            </ul>
          </details>
        </div>
      </dialog>
    </>
  );
}
