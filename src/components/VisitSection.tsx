import { HOURS_CONFIRMED, site } from "../data/site";
import { to12h } from "../lib/hours";
import MapFacade from "./MapFacade";
import OrderButton from "./OrderButton";
import Reveal from "./Reveal";
import SplitHeading from "./SplitHeading";
import StatChips from "./StatChips";

/**
 * Visit: a shop signboard (maroon board, cream inner border, hard pink shadow) with the address, the hours as a dotted
 * price-list, and square block buttons. The map is a separate card that loads only when asked.
 */
export default function VisitSection() {
  const a = site.address;
  return (
    <section id="visit" className="cv relative bg-cream">
      <div className="mx-auto grid max-w-6xl gap-14 px-4 py-20 sm:py-28 lg:grid-cols-[1.05fr_1fr] lg:items-start lg:gap-16">
        <div>
          <Reveal>
            <div className="dark-block border-[3px] border-maroon bg-maroon p-3 text-cream shadow-[10px_10px_0_var(--color-pink)]">
              <div className="border-[3px] border-cream p-6 sm:p-9">
                <p className="text-xs font-extrabold uppercase tracking-[0.22em] sm:text-sm">Chaitanyapuri Colony</p>
                <SplitHeading text="Come find us" className="mt-2 font-display text-[3rem] leading-[1.02] sm:text-6xl lg:text-7xl" />

                <address className="mt-6 text-lg not-italic leading-snug sm:text-xl">
                  <strong className="font-display text-2xl font-normal text-pink sm:text-3xl">{site.name}</strong>
                  <span className="mt-2 block font-bold uppercase tracking-[0.06em]">{a.line}</span>
                  <span className="block font-bold uppercase tracking-[0.06em]">{a.locality}, {a.region} {a.postalCode}</span>
                </address>

                <dl className="mt-7 border-t-[3px] border-dashed border-cream pt-5 text-lg sm:text-xl">
                  {site.hours.map((h) => (
                    <div key={h.days} className="flex items-baseline gap-3 py-1">
                      <dt className="font-extrabold uppercase tracking-[0.06em]">{h.days}</dt>
                      <span aria-hidden="true" className="mb-1.5 min-w-4 flex-1 self-end border-b-[3px] border-dotted border-cream" />
                      <dd className="font-bold">{to12h(h.opens)} to {to12h(h.closes)}</dd>
                    </div>
                  ))}
                </dl>
                {!HOURS_CONFIRMED && <p className="mt-2 text-sm font-bold uppercase tracking-[0.1em]">Hours may vary</p>}

                <div className="mt-8 flex flex-wrap gap-4">
                  <a href={site.phoneHref} className="btn btn-pink">Call the shop</a>
                  <a href={site.whatsappHref} target="_blank" rel="noopener noreferrer" className="btn btn-cream">Message us</a>
                  <a href={site.maps.directionsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-cream">Directions <span aria-hidden="true">↗</span></a>
                  <OrderButton label="Get it delivered" className="btn btn-cream" />
                </div>
                <p className="mt-5 text-base font-bold tracking-wide">{site.phone}</p>
              </div>
            </div>
          </Reveal>
          <div className="mt-10">
            <StatChips />
          </div>
        </div>

        <MapFacade />
      </div>
    </section>
  );
}
