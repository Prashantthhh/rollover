"use client";

import * as m from "motion/react-m";

/**
 * Section heading with a plain fade-and-lift when it scrolls into view (plays once). The word-by-word rise is
 * now reserved for the hero headline. The text is real heading text in the server-rendered HTML; with
 * reduced motion MotionConfig skips the lift and it simply appears.
 */
export default function SplitHeading({
  text,
  as = "h2",
  className = "",
}: {
  text: string;
  as?: "h2" | "h3";
  className?: string;
}) {
  const Tag = as === "h3" ? m.h3 : m.h2;
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
    >
      {text}
    </Tag>
  );
}
