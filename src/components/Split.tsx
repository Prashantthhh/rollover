import type { CSSProperties } from "react";

export type Part = { t: string; em?: boolean; accent?: boolean };

/**
 * A headline whose words (or, with by="char", letters) rise out of a mask with a stagger when it scrolls into view.
 * The server renders the final text; Motion.tsx adds .is-in when the heading enters the viewport, and globals.css only
 * hides the words beforehand when JavaScript is on and motion is allowed. `parts` marks the one or two words that are
 * set in italic (em) or in the accent colour. Accessibility: the real text is a visually hidden copy; the animated
 * spans are aria-hidden.
 */
export default function Split({
  parts,
  as: Tag = "h2",
  by = "word",
  className = "",
  id,
}: {
  parts: Part[];
  as?: "h1" | "h2" | "h3";
  by?: "word" | "char";
  className?: string;
  id?: string;
}) {
  let n = 0;
  const text = parts.map((p) => p.t).join("");
  return (
    <Tag id={id} data-split className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {parts.flatMap((p, pi) =>
          p.t.split(/(\s+)/).map((w, wi) => {
            if (!w) return null;
            if (/^\s+$/.test(w)) return " ";
            const cls = `sw-i ${p.em ? "it" : ""} ${p.accent ? "t-accent" : ""}`;
            const units = by === "char" ? w.split("") : [w];
            return (
              <span key={`${pi}-${wi}`} className="sw">
                {units.map((u, ui) => (
                  <span key={ui} className={cls} style={{ "--i": n++ } as CSSProperties}>{u}</span>
                ))}
              </span>
            );
          }),
        )}
      </span>
    </Tag>
  );
}
