import type { StepId } from "../data/steps";

/**
 * Flat SVG illustrations for the three steps. Pure SVG + CSS keyframes (see "Step art" in globals.css),
 * transform/opacity only, and they only animate while `active`. With no animation (reduced motion, or an
 * inactive card) each one shows its finished composition.
 */
const svgProps = {
  viewBox: "0 0 320 240",
  "aria-hidden": true,
  focusable: false,
  className: "art h-full w-full [stroke-linecap:round] [stroke-linejoin:round]",
} as const;

function Plate() {
  return (
    <>
      <rect x="24" y="118" width="272" height="100" rx="22" className="fill-cream stroke-ink stroke-4" />
      <rect x="38" y="132" width="244" height="72" rx="12" className="fill-pink-soft" />
    </>
  );
}

function Spatula({ className, x, y, rot = 0 }: { className: string; x: number; y: number; rot?: number }) {
  return (
    <g className={className} style={{ transformOrigin: `${x}px ${y + 60}px` }} transform={`rotate(${rot} ${x} ${y + 60})`}>
      <rect x={x - 4} y={y} width="8" height="56" rx="4" className="fill-ink" />
      <rect x={x - 22} y={y + 52} width="44" height="14" rx="4" className="fill-cream stroke-ink stroke-3" />
    </g>
  );
}

function Pour() {
  return (
    <>
      <Plate />
      <ellipse className="a-puddle fill-pink stroke-ink stroke-3" cx="160" cy="170" rx="66" ry="20" />
      <g className="a-jug">
        <path d="M54 34h56l-6 52q-1 9-10 9H70q-9 0-10-9Z" className="fill-cream stroke-ink stroke-4" transform="rotate(-18 82 66)" />
        <path d="M108 44q22 2 20 22t-20 18" fill="none" className="stroke-ink stroke-4" transform="rotate(-18 82 66)" />
      </g>
      <rect className="a-stream fill-pink" x="150" y="88" width="9" height="80" rx="4.5" />
      <Spatula className="a-chop-a" x={118} y={76} rot={-10} />
      <Spatula className="a-chop-b" x={206} y={76} rot={10} />
      <circle className="a-top fill-sun stroke-ink stroke-3" style={{ "--d": "0s" } as React.CSSProperties} cx="132" cy="150" r="7" />
      <circle className="a-top fill-pink-soft stroke-ink stroke-3" style={{ "--d": "0.5s" } as React.CSSProperties} cx="184" cy="146" r="6" />
      <circle className="a-top fill-sun stroke-ink stroke-3" style={{ "--d": "1s" } as React.CSSProperties} cx="160" cy="154" r="5" />
    </>
  );
}

function Spread() {
  return (
    <>
      <Plate />
      <rect className="a-sheet fill-pink stroke-ink stroke-3" x="50" y="146" width="220" height="42" rx="16" />
      <Spatula className="a-spread" x={160} y={92} rot={14} />
      <path className="a-spark fill-sun stroke-ink stroke-3" style={{ "--d": "0s" } as React.CSSProperties} d="M70 100l5 11 11 5-11 5-5 11-5-11-11-5 11-5Z" />
      <path className="a-spark fill-sun stroke-ink stroke-3" style={{ "--d": "0.7s" } as React.CSSProperties} d="M252 84l4 8 8 4-8 4-4 8-4-8-8-4 8-4Z" />
      <path className="a-spark fill-cream stroke-ink stroke-3" style={{ "--d": "1.4s" } as React.CSSProperties} d="M236 118l3 6 6 3-6 3-3 6-3-6-6-3 6-3Z" />
    </>
  );
}

function Roll() {
  const roll = (cls: string, y: number) => (
    <g className={cls}>
      <rect x="74" y={y} width="150" height="30" rx="15" className="fill-pink-soft stroke-ink stroke-4" />
      <circle cx="224" cy={y + 15} r="15" className="fill-cream stroke-ink stroke-4" />
      <path d={`M224 ${y + 15}m-6 0a6 6 0 1 1 6 6`} fill="none" className="stroke-pink stroke-3" />
    </g>
  );
  return (
    <>
      <Plate />
      {roll("a-roll a-roll-1", 124)}
      {roll("a-roll a-roll-2", 154)}
      {roll("a-roll a-roll-3", 184)}
      <path className="a-drizzle stroke-ink stroke-4" fill="none" d="M92 120q12 14 24 0t24 0t24 0t24 0t24 0" />
      <circle className="a-top fill-sun stroke-ink stroke-3" style={{ "--d": "0s" } as React.CSSProperties} cx="110" cy="112" r="6" />
      <circle className="a-top fill-pink stroke-ink stroke-3" style={{ "--d": "0.6s" } as React.CSSProperties} cx="170" cy="108" r="6" />
      <circle className="a-top fill-sun stroke-ink stroke-3" style={{ "--d": "1.2s" } as React.CSSProperties} cx="206" cy="114" r="5" />
    </>
  );
}

export default function StepArt({ id, active }: { id: StepId; active: boolean }) {
  return (
    <svg {...svgProps} data-active={active} data-step={id}>
      {id === "pour" && <Pour />}
      {id === "spread" && <Spread />}
      {id === "roll" && <Roll />}
    </svg>
  );
}
