import { reviews } from "../data/reviews";
import { site } from "../data/site";
import ReviewCards from "./ReviewCards";
import Reveal from "./Reveal";
import SplitHeading from "./SplitHeading";

/**
 * Reviews. The rating is a shop-window sign: a maroon board hung from two chains with the number in huge Shrikhand.
 * The Google button is a square block. Real review slips (torn receipts) appear under it once src/data/reviews.ts has entries.
 */
export default function ReviewsSection() {
  return (
    <section id="reviews" className="cv relative overflow-hidden bg-pink text-maroon">
      <div className="mx-auto max-w-6xl px-4 pb-20 pt-24 sm:pb-24">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,34rem)_1fr] lg:gap-20">
          <Reveal className="relative mx-auto w-full max-w-lg">
            {/* chains */}
            <span aria-hidden="true" className="absolute -top-24 left-[18%] h-24 w-[6px] bg-maroon" />
            <span aria-hidden="true" className="absolute -top-24 right-[18%] h-24 w-[6px] bg-maroon" />
            <div className="relative border-[3px] border-maroon bg-maroon p-3 shadow-[10px_10px_0_var(--color-cream)]">
              <div className="border-[3px] border-cream px-6 pb-6 pt-5 text-center text-cream">
                <p className="text-xs font-extrabold uppercase tracking-[0.22em] sm:text-sm">Rated by our guests</p>
                <p className="font-display text-[7.5rem] leading-[0.95] sm:text-[10rem]">
                  {site.rating.value}
                  <span aria-hidden="true" className="text-pink">★</span>
                  <span className="sr-only"> out of 5 stars</span>
                </p>
                <p className="border-t-[3px] border-dashed border-cream pt-3 text-base font-bold uppercase tracking-[0.12em] sm:text-lg">{site.rating.label}</p>
              </div>
            </div>
          </Reveal>

          <div>
            <p className="text-sm font-bold uppercase tracking-[0.14em] sm:text-base">Reviews</p>
            <SplitHeading text="What people are saying" className="mt-2 font-display text-[3rem] leading-[1.02] sm:text-6xl lg:text-7xl" />
            <p className="mt-4 max-w-md text-lg leading-snug">Ask around Hanamkonda, or read what guests wrote on Google.</p>
            <a href={site.maps.reviewsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-maroon mt-7">
              See the Google reviews <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
        {reviews.length > 0 && <ReviewCards reviews={reviews} />}
      </div>
    </section>
  );
}
