import { stripPhotos } from "../data/featured";
import { site } from "../data/site";
import PhotoMarquee from "./PhotoMarquee";
import SplitHeading from "./SplitHeading";

/** A strip of film rolling past, with the heading above on cream. */
export default function PhotoStrip() {
  return (
    <section id="photos" className="bg-cream">
      <div className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-6 px-4 pb-10 pt-20">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.14em] sm:text-base">On the counter</p>
          <SplitHeading text="Straight off the plate" className="mt-2 font-display text-[3rem] leading-[1.02] sm:text-6xl lg:text-7xl" />
        </div>
        <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-pink">
          Follow along <span aria-hidden="true">↗</span>
        </a>
      </div>
      <PhotoMarquee photos={stripPhotos} />
      <div className="pb-16" />
    </section>
  );
}
