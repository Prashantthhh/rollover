const phrases = ["Rolled while you watch", "Opposite Tara Gardens", "From ₹125", "Board games inside"];

/**
 * A slow band of real phrases between sections. Decorative repeat of facts the page already states, so it is aria-hidden;
 * the second copy only exists to make the loop seamless (the track slides by half its width). With prefers-reduced-motion
 * it stops and shows one wrapped copy.
 */
export default function PhraseBand({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`overflow-hidden border-y border-current/60 py-5 sm:py-7 ${className}`}>
      <div className="band-track">
        {[0, 1].map((k) => (
          <ul key={k} className="band-set" aria-hidden={k === 1 ? "true" : undefined}>
            {phrases.map((p, i) => (
              <li key={p} className="flex shrink-0 items-baseline whitespace-nowrap font-display text-[clamp(2rem,4.6vw,4.4rem)] leading-none tracking-[-0.02em]">
                {i % 2 === 1 ? <em>{p}</em> : p}
                <span className="t-accent mx-[0.6em] text-[0.5em]">/</span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
