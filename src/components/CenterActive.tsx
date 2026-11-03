"use client";

import { useEffect } from "react";

/** Scrolls the category row (a swipeable strip on phones) so the open category is in view. Instant, so reduced motion needs no special case. */
export default function CenterActive() {
  useEffect(() => {
    const row = document.querySelector<HTMLElement>("[data-cat-row]");
    const cur = row?.querySelector<HTMLElement>("[aria-current='page']");
    if (!row || !cur) return;
    row.scrollLeft = Math.max(0, cur.offsetLeft - (row.clientWidth - cur.offsetWidth) / 2);
  }, []);
  return null;
}
