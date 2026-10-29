"use client";

import { useEffect } from "react";
import Lenis from "lenis";

type RGB = [number, number, number];
type Tone = { bg: RGB; fg: RGB; accent: RGB };
const TONES: Record<string, Tone> = {
  paper: { bg: [243, 238, 228], fg: [26, 22, 19], accent: [235, 53, 146] },
  blush: { bg: [246, 210, 227], fg: [26, 22, 19], accent: [168, 24, 98] },
  ink: { bg: [26, 22, 19], fg: [243, 238, 228], accent: [244, 114, 180] },
};
const mix = (a: RGB, b: RGB, t: number) => a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(" ");
const ease = (t: number) => t * t * (3 - 2 * t);

/**
 * All the scripted motion, nothing rendered except the cursor. Everything here is switched off by prefers-reduced-motion;
 * Lenis and the cursor also need a mouse (fine pointer), so touch devices keep their native scrolling.
 *  - Lenis smooth scroll. Its rAF loop only runs while it is moving (idle pages cost nothing), it fires ordinary scroll events
 *    so the "How it's made" scrub stays frame-accurate, and in-page links glide through it.
 *  - Section colours: the page background, text and accent colours ease between the tones of the sections (data-tone) as
 *    each section's top moves up the screen. Three custom properties on <html>, written only when the blend changes.
 *  - Headlines (data-split): add .is-in when they enter the viewport so their words rise (CSS does the animating).
 *  - Count-ups (data-count): numbers count up the first time they come into view.
 *  - Custom cursor: a dot that grows into a ring over links and into a labelled circle ("View", "Order") over [data-cursor].
 *  - Remembers that the load intro has played.
 */
export default function Motion() {
  useEffect(() => {
    const root = document.documentElement;
    try { setTimeout(() => localStorage.setItem("ro-intro", "1"), 1600); } catch { /* private mode */ }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const undo: (() => void)[] = [];

    // ---- headlines + count-ups: one observer each
    const splitIO = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-in"); splitIO.unobserve(e.target); } }), { threshold: 0.25 });
    document.querySelectorAll("[data-split]").forEach((el) => splitIO.observe(el));
    undo.push(() => splitIO.disconnect());

    const fmt = (el: HTMLElement, v: number) => {
      const d = Number(el.dataset.decimals ?? 0);
      el.textContent = (el.dataset.prefix ?? "") + v.toLocaleString("en-IN", { minimumFractionDigits: d, maximumFractionDigits: d }) + (el.dataset.suffix ?? "");
    };
    const countIO = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      countIO.unobserve(e.target);
      const el = e.target as HTMLElement, end = Number(el.dataset.count), t0 = performance.now(), dur = 1500;
      const step = (t: number) => {
        const k = Math.min(1, (t - t0) / dur);
        fmt(el, end * (1 - Math.pow(1 - k, 4)));
        if (k < 1) requestAnimationFrame(step); else fmt(el, end);
      };
      requestAnimationFrame(step);
    }), { threshold: 0.7 });
    document.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => { fmt(el, 0); countIO.observe(el); });
    undo.push(() => countIO.disconnect());

    // ---- marquee bands run only while visible
    const bandIO = new IntersectionObserver((es) => es.forEach((e) => e.target.classList.toggle("run", e.isIntersecting)), { rootMargin: "80px" });
    document.querySelectorAll(".band-track").forEach((el) => bandIO.observe(el));
    undo.push(() => bandIO.disconnect());

    // ---- section colours
    const sections = [...document.querySelectorAll<HTMLElement>("[data-tone]")];
    let lastBg = "", lastSide: Tone | null = null;
    // Section positions are measured once (and again when the page height changes), not on every scroll frame: reading layout
    // while scrolling forces the browser to lay out in the middle of a frame.
    let tops: number[] = [];
    const measure = () => { tops = sections.map((s) => s.getBoundingClientRect().top + window.scrollY); };
    measure();
    const ro = new ResizeObserver(() => { measure(); onScroll(); });
    ro.observe(document.body);
    undo.push(() => ro.disconnect());
    const paint = () => {
      const vh = window.innerHeight, y = window.scrollY;
      let idx = -1;
      for (let i = 0; i < sections.length; i++) if (tops[i] - y <= vh) idx = i;
      let from = TONES.paper, to = TONES.paper, t = 0;
      if (idx >= 0) {
        to = TONES[sections[idx].dataset.tone ?? "paper"] ?? TONES.paper;
        from = idx > 0 ? TONES[sections[idx - 1].dataset.tone ?? "paper"] ?? TONES.paper : TONES.paper;
        t = ease(Math.min(1, Math.max(0, (vh - (tops[idx] - y)) / (vh * 0.6))));
      }
      // The background eases smoothly (it only repaints one fixed layer). Text and accent colours change on every element that
      // inherits them, so they flip once, at the midpoint of the blend, instead of restyling the whole page every frame.
      const bg = mix(from.bg, to.bg, t);
      if (bg !== lastBg) { lastBg = bg; root.style.setProperty("--bg", `rgb(${bg})`); }
      const side = t < 0.5 ? from : to;
      if (side !== lastSide) {
        lastSide = side;
        root.style.setProperty("--fg", `rgb(${side.fg.join(" ")})`);
        root.style.setProperty("--accent", `rgb(${side.accent.join(" ")})`);
      }
    };
    let paintRaf = 0;
    const onScroll = () => { if (!paintRaf) paintRaf = requestAnimationFrame(() => { paintRaf = 0; paint(); }); };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    paint();
    undo.push(() => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); });

    if (!fine) return () => undo.forEach((f) => f());

    // ---- Lenis
    const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 0.95, autoRaf: false, anchors: false });
    const w = window as unknown as { __lenis?: Lenis };
    w.__lenis = lenis;
    let raf = 0, awake = 0;
    const loop = (t: number) => { lenis.raf(t); raf = lenis.isScrolling || t < awake ? requestAnimationFrame(loop) : 0; };
    const wake = () => { awake = performance.now() + 400; if (!raf) raf = requestAnimationFrame(loop); };
    lenis.on("scroll", wake);
    window.addEventListener("wheel", wake, { passive: true });
    window.addEventListener("keydown", wake);
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[href^='#']") as HTMLAnchorElement | null;
      if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      const id = a.getAttribute("href")!.slice(1);
      const target = id ? document.getElementById(id) : document.body;
      if (!target) return;
      e.stopImmediatePropagation();
      e.preventDefault();
      root.classList.add("cv-off"); // HashNav's trick: render every section for real so the jump lands exactly
      requestAnimationFrame(() => {
        lenis.scrollTo(id ? target : 0, { offset: id ? -56 : 0, duration: 1.4 });
        wake();
        history.replaceState(null, "", id ? `#${id}` : location.pathname);
        setTimeout(() => root.classList.remove("cv-off"), 1900);
      });
    };
    document.addEventListener("click", onClick, true);
    undo.push(() => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("wheel", wake);
      window.removeEventListener("keydown", wake);
      cancelAnimationFrame(raf);
      lenis.destroy();
      delete w.__lenis;
    });

    // ---- cursor
    const dot = document.createElement("div");
    dot.className = "cursor";
    dot.setAttribute("aria-hidden", "true");
    const label = document.createElement("span");
    dot.appendChild(label);
    document.body.appendChild(dot);
    root.classList.add("has-cursor");
    let tx = -100, ty = -100, x = -100, y = -100, craf = 0, state = "", text = "";
    const cloop = () => {
      x += (tx - x) * 0.32; y += (ty - y) * 0.32;
      dot.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      craf = Math.abs(tx - x) > 0.3 || Math.abs(ty - y) > 0.3 ? requestAnimationFrame(cloop) : 0;
    };
    const pm = (e: PointerEvent) => {
      tx = e.clientX; ty = e.clientY;
      if (!dot.classList.contains("on")) { x = tx; y = ty; dot.classList.add("on"); }
      if (!craf) craf = requestAnimationFrame(cloop);
      const el = e.target as Element | null;
      const tagged = el?.closest<HTMLElement>("[data-cursor]");
      const next = tagged ? "label" : el?.closest("a, button, [role=tab]") ? "link" : "";
      const nt = tagged?.dataset.cursor ?? "";
      if (next !== state) { state = next; if (next) dot.dataset.s = next; else delete dot.dataset.s; }
      if (nt !== text) { text = nt; label.textContent = nt; }
    };
    const leave = () => dot.classList.remove("on");
    window.addEventListener("pointermove", pm, { passive: true });
    root.addEventListener("pointerleave", leave);
    undo.push(() => { window.removeEventListener("pointermove", pm); root.removeEventListener("pointerleave", leave); cancelAnimationFrame(craf); dot.remove(); root.classList.remove("has-cursor"); });

    return () => undo.forEach((f) => f());
  }, []);

  return null;
}
