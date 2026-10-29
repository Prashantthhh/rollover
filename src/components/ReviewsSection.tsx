import { reviews } from "../data/reviews";
import { RATING_CONFIRMED, SHOW_SLOT_HINTS, site } from "../data/site";
import Split from "./Split";

/**
 * Reviews: one huge rating numeral that counts up, with the Google link. Real guest quotes appear as pull quotes once
 * src/data/reviews.ts has entries (never write one by hand); until then a labelled slot marks where the first one goes.
 */
export default function ReviewsSection() {
  const [, count] = site.rating.label.match(/([\d,]+)\+?\s+reviews/) ?? [];
  return (
    <section id="reviews" data-tone="paper" className="relative py-28 sm:py-40">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-8">
        <div className="flex items-baseline justify-between border-t border-current/60 pt-3">
          <p className="caption">No. 06 &mdash; What people say</p>
          <p className="caption">p. 06</p>
        </div>

        <div className="mt-12 grid items-end gap-x-8 gap-y-12 sm:mt-20 lg:grid-cols-12">
          <p className="font-display text-[clamp(8rem,24vw,22rem)] leading-[0.8] tracking-[-0.05em] lg:col-span-7" aria-label={`${site.rating.value} out of 5 stars`}>
            <span data-count={site.rating.value} data-decimals="1" className="inline-block tabular-nums" style={{ minWidth: "2.1ch" }}>{site.rating.value.toFixed(1)}</span>
            <span aria-hidden="true" className="t-accent ml-[0.05em] text-[0.5em]">&#9733;</span>
          </p>
          <div className="lg:col-span-4 lg:col-start-9 lg:pb-4">
            <Split
              as="h2"
              id="reviews-h"
              className="font-display text-[clamp(1.9rem,3.2vw,3.2rem)] leading-[1.05] tracking-[-0.02em]"
              parts={[{ t: "What people are " }, { t: "saying", em: true, accent: true }]}
            />
            <p className="lead measure mt-5 max-w-[24rem]">
              {count ? <>From more than <span data-count={Number(count.replace(/,/g, ""))} className="tabular-nums">{count}</span> reviews on Google. </> : null}
              Ask around Hanamkonda, or read what guests wrote.
            </p>
            {!RATING_CONFIRMED && <p className="caption mt-3 normal-case tracking-normal">[CONFIRM] rating and review count</p>}
            <a href={site.maps.reviewsUrl} target="_blank" rel="noopener noreferrer" className="btn mt-8">
              See the Google reviews <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>

        {(reviews.length > 0 || SHOW_SLOT_HINTS) && (
        <div className="mt-24 sm:mt-40">
          {reviews.length > 0 ? (
            <ul className="grid gap-x-8 gap-y-20 lg:grid-cols-3">
              {reviews.map((r, i) => (
                <li key={r.name + i} className={i % 2 ? "lg:mt-24" : ""}>
                  <figure className="border-t border-current/60 pt-6">
                    <blockquote className="font-display text-[clamp(1.5rem,2.2vw,2.2rem)] leading-[1.2] tracking-[-0.01em]">&ldquo;{r.text}&rdquo;</blockquote>
                    <figcaption className="caption mt-6 flex justify-between gap-4">
                      <span>{r.name}{r.rating ? <span className="sr-only">, {r.rating} out of 5</span> : null}</span>
                      {r.when && <span>{r.when}</span>}
                    </figcaption>
                  </figure>
                </li>
              ))}
            </ul>
          ) : SHOW_SLOT_HINTS ? (
            <p className="caption max-w-xl border border-dashed border-current/60 p-4 normal-case tracking-normal">
              Pull-quote slot &middot; a real guest review goes here. Add it to src/data/reviews.ts (name and their own words); nothing is written by hand.
            </p>
          ) : null}
        </div>
        )}
      </div>
    </section>
  );
}
