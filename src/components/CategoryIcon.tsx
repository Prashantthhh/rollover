import type { ReactNode } from "react";

/**
 * Our own line icons, one per menu category. 48 x 48, drawn with a 1.5 stroke in the current text colour; the one detail
 * in the accent colour (.ic-acc, pink on paper) is what makes them a set. Decorative: the label next to them is the name.
 */
const ICONS: Record<string, ReactNode> = {
  // three rolls standing on the freezing plate
  "ice-cream-rolls": (<><path d="M4 38h40" /><circle cx="12" cy="30" r="6" /><circle cx="24" cy="30" r="6" /><circle cx="36" cy="30" r="6" /><circle cx="12" cy="30" r="2" /><circle className="ic-acc" cx="24" cy="30" r="2" /><circle cx="36" cy="30" r="2" /><path d="M20 15c2-3 6-3 8 0" /></>),
  // a plate with a roll on it
  "gourmet-plates": (<><ellipse cx="24" cy="34" rx="19" ry="6" /><ellipse cx="24" cy="34" rx="11" ry="2.8" /><circle cx="24" cy="23" r="7" /><circle className="ic-acc" cx="24" cy="23" r="2.4" /></>),
  // tulip glass, a scoop and a cherry
  "exotic-sundaes": (<><path d="M12 17h24c0 9-4 15-12 16-8-1-12-7-12-16z" /><path d="M24 33v9M16 43h16" /><path d="M14 17c0-6 4-9 10-9s10 3 10 9" /><circle className="ic-acc" cx="24" cy="5" r="2.5" /></>),
  // a cone with a waffle pattern and a scoop
  "waffle-cones": (<><path d="M15 23l9 22 9-22" /><path d="M18 29l11 8M30 29l-11 8" /><path d="M14 23a10 10 0 1 1 20 0z" /><circle className="ic-acc" cx="24" cy="8" r="2.5" /></>),
  // a glass with a lid and a straw
  "shakes": (<><path d="M13 15l3 28h16l3-28" /><path d="M12 15h24" /><path d="M12 15c0-5 5-8 12-8s12 3 12 8" /><path d="M14.5 26h19" /><path className="ic-acc" d="M28 9l4-7" /></>),
  // a pleated dumpling
  "momos": (<><path d="M5 33c0-11 8-17 19-17s19 6 19 17z" /><path d="M15 33l2-9M21 33l1-12M27 33l1-12M33 33l-2-9" /><path className="ic-acc" d="M20 16c2 2.5 6 2.5 8 0" /></>),
  // a box of fries
  "munchies": (<><path d="M12 27h24l-3 16H15z" /><path d="M16 27V12M21 27V8M31 27V13M36 27V16" /><path className="ic-acc" d="M26 27V10" /></>),
  // a star with a small sparkle
  "signatures": (<><path d="M22 9l4.8 10.4 11.4 1.4-8.4 7.8 2.2 11.2L22 34l-10 5.8 2.2-11.2-8.4-7.8 11.4-1.4z" /><path className="ic-acc" d="M40 6v7M36.5 9.5h7" /></>),
  // bun, filling, patty, bun
  "burgers": (<><path d="M8 22c0-8 7-13 16-13s16 5 16 13z" /><path d="M8 26c3 3 5-3 8 0s5-3 8 0 5-3 8 0 5-3 8 0" /><path className="ic-acc" d="M9 30h30v4H9z" /><path d="M8 38h32c0 3-2 5-5 5H13c-3 0-5-2-5-5z" /><path d="M18 15h2M26 14h2M31 18h2" /></>),
  // a toasted triangle with layers
  "sandwiches": (<><path d="M5 40L24 8l19 32z" /><path d="M13 27h22" /><path className="ic-acc" d="M10 33c3 2 5-2 7 0s5-2 7 0 5-2 7 0 5-2 7 0" /></>),
  // a tall glass, a straw and a lime wheel
  "beverages": (<><path d="M14 13l2 30h16l2-30z" /><path d="M15 21h18" /><path d="M27 17l5-13" /><circle className="ic-acc" cx="36" cy="13" r="5" /></>),
};

export default function CategoryIcon({ slug, className = "" }: { slug: string; className?: string }) {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {ICONS[slug]}
    </svg>
  );
}
