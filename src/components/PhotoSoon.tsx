/**
 * Placeholder for a menu item that has no usable photo yet: a pink tile with a little tray of rolls.
 * The item name is shown by the card around it, so the tile only says what is missing.
 */
export default function PhotoSoon({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-1 overflow-hidden border-2 border-maroon bg-pink p-2 text-center text-maroon ${className}`}>
      <svg aria-hidden="true" viewBox="0 0 120 84" focusable="false" className="w-14 shrink-0 [stroke-linecap:round] [stroke-linejoin:round] sm:w-28">
        <rect x="6" y="40" width="108" height="38" rx="10" className="fill-cream stroke-ink stroke-3" />
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <rect x="24" y={12 + i * 12} width="66" height="14" rx="7" className="fill-pink-soft stroke-ink stroke-3" />
            <circle cx="90" cy={19 + i * 12} r="7" className="fill-cream stroke-ink stroke-3" />
          </g>
        ))}
        <rect x="6" y="52" width="108" height="26" rx="10" className="fill-cream stroke-ink stroke-3" />
      </svg>
      <span className="font-display text-xs font-bold leading-tight sm:text-lg">Photo<br className="sm:hidden" /> coming soon</span>
    </div>
  );
}
