/** Standard Indian food mark: green dot in a square = vegetarian, brown dot = non-vegetarian. */
export default function VegMark({ veg, className = "" }: { veg: boolean; className?: string }) {
  const color = veg ? "#1b8a3a" : "#9a3412";
  return (
    <span className={`inline-flex ${className}`} title={veg ? "Vegetarian" : "Non-vegetarian"}>
      <svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18" focusable="false">
        <rect x="1" y="1" width="16" height="16" rx="3" fill="#fff" stroke={color} strokeWidth="2" />
        <circle cx="9" cy="9" r="4.5" fill={color} />
      </svg>
      <span className="sr-only">{veg ? "Vegetarian" : "Non-vegetarian"}</span>
    </span>
  );
}
