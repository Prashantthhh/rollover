"use client";

import { useEffect, useId, useState } from "react";

type Diet = "all" | "veg" | "non";
const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Filter (All / Veg / Non-veg) and search for the dish list of the current category. The rows are plain server HTML in
 * `#<listId>`; this only shows and hides them in the DOM (a row stays in the page, so everything is still crawlable) and
 * renumbers the visible ones. Search matches the name or the description (which is where the ingredients are), every word
 * has to match. The count is a polite live region; an empty result gets its own message and a way back.
 */
export default function MenuControls({ listId, title, total }: { listId: string; title: string; total: number }) {
  const [diet, setDiet] = useState<Diet>("all");
  const [q, setQ] = useState("");
  const [shown, setShown] = useState(total);
  const id = useId();

  useEffect(() => {
    const list = document.getElementById(listId);
    if (!list) return;
    const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    let n = 0;
    list.querySelectorAll<HTMLElement>(":scope > li").forEach((li) => {
      const text = `${li.querySelector(".nm")?.textContent ?? ""} ${li.querySelector(".ds")?.textContent ?? ""}`.toLowerCase();
      const ok = (diet === "all" || li.dataset.veg === (diet === "veg" ? "1" : "0")) && terms.every((t) => text.includes(t));
      li.hidden = !ok;
      li.classList.toggle("is-first", ok && n === 0);
      if (ok) { n++; const num = li.querySelector(".no"); if (num) num.textContent = pad(n); }
    });
    setShown(n);
  }, [diet, q, listId]);

  const reset = () => { setDiet("all"); setQ(""); };
  const options: { v: Diet; label: string; mark?: string }[] = [{ v: "all", label: "All" }, { v: "veg", label: "Veg", mark: "veg-y" }, { v: "non", label: "Non-veg", mark: "veg-n" }];
  const word = q.trim();

  return (
    <div className="mb-8 md:mb-10">
      <div className="grid gap-x-10 gap-y-6 md:grid-cols-12">
        <div className="md:col-span-6" role="group" aria-labelledby={`${id}-diet`}>
          <p id={`${id}-diet`} className="caption mb-3">Show</p>
          <div className="flex flex-wrap gap-2">
            {options.map((o) => (
              <button
                key={o.v}
                type="button"
                aria-pressed={diet === o.v}
                onClick={() => setDiet(o.v)}
                className={`caption flex min-h-11 items-center gap-2 border border-current/60 px-4 ${diet === o.v ? "bg-[var(--fg)] text-[var(--bg)]" : "hover:bg-current/10"}`}
              >
                {o.mark && <i aria-hidden="true" className={`veg ${o.mark}`} />}
                {o.label}
              </button>
            ))}
          </div>
        </div>
        <div className="md:col-span-6">
          <label htmlFor={`${id}-q`} className="caption mb-3 block">Search {title}</label>
          <input
            id={`${id}-q`}
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="A dish or an ingredient"
            autoComplete="off"
            spellCheck={false}
            className="menu-search min-h-11 w-full border-0 border-b border-current/60 bg-transparent py-2 font-display text-[1.4rem] placeholder:opacity-50 focus-visible:outline-offset-8"
          />
        </div>
      </div>
      <p role="status" aria-live="polite" className="caption mt-6">{shown === total ? `${total} ${total === 1 ? "dish" : "dishes"}` : `Showing ${shown} of ${total}`}</p>
      {shown === 0 && (
        <div className="mt-6 border-y border-current/60 py-10">
          <p className="font-display text-[1.8rem] leading-tight md:text-4xl">No dishes found<span className="t-accent">.</span></p>
          <p className="caption-i mt-3 max-w-md">
            {word
              ? <>Nothing in {title} matches &ldquo;{word}&rdquo;{diet !== "all" ? ` in ${diet === "veg" ? "veg" : "non-veg"}` : ""}. Try another word.</>
              : <>There is no {diet === "veg" ? "veg" : "non-veg"} dish in {title}.</>}
          </p>
          <button type="button" onClick={reset} className="btn mt-6">Show all of {title}</button>
        </div>
      )}
    </div>
  );
}
