import type { CSSProperties } from "react";

/**
 * First-visit intro, under 1.2 s: the letters of "RollOver" rise out of masks, a hairline draws across, then the panel wipes
 * upward to reveal the hero video. Pure CSS (see .intro in globals.css), rendered on the server so it paints with the first
 * frame and needs no JavaScript. Skipped on repeat visits (html.seen, set by an inline script from localStorage) and with
 * prefers-reduced-motion. Decorative, so aria-hidden; it never takes focus or pointer events.
 */
export default function IntroLoader() {
  return (
    <div className="intro" aria-hidden="true">
      <div className="intro-word">
        {"RollOver".split("").map((c, i) => (
          <span key={i} className="intro-mask"><span style={{ "--i": i } as CSSProperties}>{c}</span></span>
        ))}
      </div>
      <span className="intro-line" />
    </div>
  );
}
