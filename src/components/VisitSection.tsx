import { HOURS_CONFIRMED, site } from "../data/site";
import { to12h } from "../lib/hours";
import MapFacade from "./MapFacade";
import OrderButton from "./OrderButton";
import Split from "./Split";

/**
 * Visit: set like a colophon. The location in large italic type, the address and the hours as a ruled list with
 * dotted leaders, outlined buttons, and the map beside it (loaded only when asked).
 */
export default function VisitSection() {
  const a = site.address;
  return (
    <section id="visit" data-tone="blush" className="cv relative py-28 sm:py-40">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-8">
        <div className="flex items-baseline justify-between border-t border-current/60 pt-3">
          <p className="caption">No. 07 &mdash; Come find us</p>
          <p className="caption">p. 07</p>
        </div>

        <div className="drift mt-10 sm:mt-16">
          <Split
            id="visit-h"
            className="max-w-[12ch] font-display text-[clamp(2.7rem,7.6vw,8.2rem)] leading-[0.95] tracking-[-0.03em]"
            parts={[{ t: "Come " }, { t: "find", em: true, accent: true }, { t: " us." }]}
          />
        </div>

        <div className="mt-20 grid gap-x-8 gap-y-16 sm:mt-32 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="font-display text-[clamp(1.6rem,2.6vw,2.6rem)] leading-[1.15] tracking-[-0.02em]">
              <em>{a.landmark},</em> {a.area}, {a.locality}.
            </p>
            <address className="caption-i mt-8 not-italic leading-relaxed opacity-90">
              {a.street}, {a.area}
              <br />
              {a.locality}, {a.region} {a.postalCode}
            </address>

            <dl className="mt-12 border-t border-current/60">
              {site.hours.map((h) => (
                <div key={h.days} className="flex items-baseline gap-4 border-b border-current/30 py-4">
                  <dt className="caption">{h.days}</dt>
                  <span aria-hidden="true" className="leader mb-1 h-px min-w-4 flex-1 self-end" />
                  <dd className="font-display text-xl tabular-nums">{to12h(h.opens)} to {to12h(h.closes)}</dd>
                </div>
              ))}
            </dl>
            {!HOURS_CONFIRMED && <p className="caption mt-3 normal-case tracking-normal">[CONFIRM] hours. Taken from the old site; they may vary.</p>}

            <p className="caption mt-10 opacity-90">Board games &middot; Family-friendly hangout &middot; Made on a cold steel plate</p>

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
              <OrderButton label="Order" className="btn btn-pink" />
              <a href={site.phoneHref} className="btn">Call {site.phone}</a>
              <a href={site.maps.directionsUrl} target="_blank" rel="noopener noreferrer" className="caption ulink">Directions <span aria-hidden="true">↗</span></a>
              <a href={site.whatsappHref} target="_blank" rel="noopener noreferrer" className="caption ulink">WhatsApp</a>
            </div>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <MapFacade />
          </div>
        </div>
      </div>
    </section>
  );
}
