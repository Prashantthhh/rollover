import { art, SHOW_SLOT_HINTS } from "../data/art";

type Slot = keyof typeof art.doodles;

/**
 * A slot for one hand-drawn doodle. If art.doodles[slot] has a path it is shown (as decoration, empty alt);
 * otherwise a simple dashed placeholder marks where it goes, or nothing once SHOW_SLOT_HINTS is false.
 */
export default function Doodle({ slot, className = "" }: { slot: Slot; className?: string }) {
  const src = art.doodles[slot];
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt="" aria-hidden="true" className={className} data-slot={slot} />;
  }
  if (!SHOW_SLOT_HINTS) return null;
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 80 80" className={className} data-slot={slot}>
      <path d="M14 46C8 24 30 8 48 14c20 6 22 30 8 42-12 10-34 10-40-6" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="7 7" strokeLinecap="round" />
      <path d="M32 40c4-8 12-8 14 0s-6 10-10 4" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
