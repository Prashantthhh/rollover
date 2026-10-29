import { HOURS_CONFIRMED, site } from "../data/site";
import { to12h } from "../lib/hours";

const explore = [
  { href: "#how", label: "How it's made" },
  { href: "#specials", label: "Specials" },
  { href: "#menu", label: "Menu" },
  { href: "#visit", label: "Visit" },
];

const social = [
  { label: "Instagram", href: site.social.instagram },
  { label: "Facebook", href: site.social.facebook },
  { label: "YouTube", href: site.social.youtube },
];

/**
 * Footer: the last page of the issue. A huge "RollOver" wordmark in Gambarino slides in as it enters (CSS scroll timeline, see
 * .wordmark in globals.css), with the real address, hours and order links set small underneath. The footer keeps the ink
 * colour whatever the page tone is.
 */
export default function Footer() {
  return (
    <footer data-tone="ink" className="relative overflow-hidden bg-ink text-paper">
      <div className="mx-auto max-w-[1600px] px-4 pt-32 sm:px-8 sm:pt-52">
        <p aria-hidden="true" className="wordmark select-none whitespace-nowrap font-display text-[27.5vw] leading-[0.8] tracking-[-0.06em] min-[1700px]:text-[27rem]">
          Roll<em className="text-[#f472b4]">Over</em>
        </p>

        <div className="mt-20 grid gap-x-8 gap-y-12 border-t border-paper/40 pt-6 sm:mt-28 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h2 className="caption">Find us</h2>
            <address className="caption-i mt-4 not-italic leading-relaxed">
              <em className="font-display text-xl not-italic">{site.address.landmark}</em>
              <br />
              {site.address.line}
              <br />
              {site.address.locality}, {site.address.region} {site.address.postalCode}
            </address>
            <p className="mt-4"><a className="caption ulink" href={site.maps.directionsUrl} target="_blank" rel="noopener noreferrer">Directions <span aria-hidden="true">↗</span></a></p>
          </div>

          <div>
            <h2 className="caption">Hours</h2>
            <dl className="caption-i mt-4 space-y-2">
              {site.hours.map((h) => (
                <div key={h.days} className="flex gap-4"><dt className="w-20 opacity-80">{h.days}</dt><dd>{to12h(h.opens)} to {to12h(h.closes)}</dd></div>
              ))}
            </dl>
            {!HOURS_CONFIRMED && <p className="caption mt-3 normal-case tracking-normal">[CONFIRM] hours</p>}
          </div>

          <div>
            <h2 className="caption">Order &amp; say hello</h2>
            <ul className="caption-i mt-4 space-y-2">
              <li><a className="ulink" href={site.order.swiggy} target="_blank" rel="noopener noreferrer">Order on Swiggy <span aria-hidden="true">↗</span></a></li>
              <li><a className="ulink" href={site.order.zomato} target="_blank" rel="noopener noreferrer">Order on Zomato <span aria-hidden="true">↗</span></a></li>
              <li><a className="ulink" href={site.phoneHref}>{site.phone}</a></li>
              <li><a className="ulink" href={site.whatsappHref} target="_blank" rel="noopener noreferrer">WhatsApp</a></li>
            </ul>
          </div>

          <div>
            <h2 className="caption">Follow &amp; explore</h2>
            <ul className="caption-i mt-4 flex flex-wrap gap-x-6 gap-y-2">
              {social.map((s) => (
                <li key={s.label}><a className="ulink" href={s.href} target="_blank" rel="noopener noreferrer">{s.label} <span aria-hidden="true">↗</span></a></li>
              ))}
            </ul>
            <ul className="caption-i mt-4 flex flex-wrap gap-x-6 gap-y-2 opacity-80">
              {explore.map((l) => (
                <li key={l.href}><a className="ulink" href={l.href}>{l.label}</a></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-paper/40 py-6 sm:mt-24">
          <p className="caption">&copy; {new Date().getFullYear()} {site.name}</p>
          <p className="caption">
            <a className="ulink" href={site.partner.href} target="_blank" rel="noopener noreferrer">{site.partner.label}</a>
            {!site.partner.active && <span className="ml-2 normal-case tracking-normal">[CONFIRM IF ACTIVE]</span>}
          </p>
          <a className="caption ulink" href="#top">Back to top <span aria-hidden="true">↑</span></a>
        </div>
      </div>
    </footer>
  );
}
