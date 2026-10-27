import type { CSSProperties } from "react";

export type Line = { text: string; className?: string };

/**
 * Hero headline: words rise out of a line mask on load. Pure CSS (no JS), so it is in the server-rendered
 * HTML, paints without waiting for hydration, and is switched off by prefers-reduced-motion in globals.css.
 *
 * Accessibility: the real heading text is a visually hidden copy; the animated spans are aria-hidden.
 */
export default function RiseWords({
  lines,
  as: Tag = "h1",
  className = "",
  tape = false,
}: {
  lines: Line[];
  as?: "h1" | "h2";
  className?: string;
  /** Cream label-tape behind each word, so it stays legible on top of video. */
  tape?: boolean;
}) {
  let n = 0;
  return (
    <Tag className={className}>
      <span className="sr-only">{lines.map((l) => l.text).join(" ")}</span>
      <span aria-hidden="true">
        {lines.map((line) => (
          <span key={line.text} className={`block ${line.className ?? ""}`}>
            {line.text.split(" ").map((w, i) => (
              <span key={i}>
                {i > 0 && " "}
                <span className={`word-mask ${tape ? "tape" : ""}`}>
                  <span className="word-rise" style={{ "--i": n++ } as CSSProperties}>{w}</span>
                </span>
              </span>
            ))}
          </span>
        ))}
      </span>
    </Tag>
  );
}
