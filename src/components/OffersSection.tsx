import { OFFERS_CONFIRMED } from "../data/offers";
import SplitHeading from "./SplitHeading";

/** Optional offers banner: nothing opens until the visitor presses the button. */
export default async function OffersSection() {
  if (!OFFERS_CONFIRMED) return null;
  // Imported only after the flag check, so the spin-the-wheel code is dropped from the build while the flag is false.
  const { default: OffersModal } = await import("./OffersModal");
  return (
    <section id="offers" className="cv relative overflow-hidden bg-pink-soft">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-16 sm:py-20 md:flex-row md:items-center md:justify-between">
        <div className="max-w-xl">
          <SplitHeading text="Feeling lucky?" className="font-display text-5xl font-bold leading-[1.02] sm:text-6xl" />
          <p className="mt-3 text-lg">Spin the wheel for a free scoop, a mocktail, fries or a discount. Optional, and only when you ask.</p>
        </div>
        <OffersModal buttonClass="btn btn-sun !min-h-14 !px-8 !text-xl" />
      </div>
    </section>
  );
}
