import { stripPhotos } from "../data/featured";
import { site } from "../data/site";
import PhotoMarquee from "./PhotoMarquee";
import Split from "./Split";

/** A slow row of photographs on the ink page, with the heading above. */
export default function PhotoStrip() {
  return (
    <section id="photos" data-tone="ink" className="relative pb-28 pt-8 sm:pb-40">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-8">
        <div className="flex items-baseline justify-between border-t border-current/60 pt-3">
          <p className="caption">No. 05 &mdash; On the counter</p>
          <p className="caption">p. 05</p>
        </div>
        <div className="mb-16 mt-10 flex flex-wrap items-end justify-between gap-x-8 gap-y-8 sm:mb-24 sm:mt-16">
          <div className="drift">
            <Split
              id="photos-h"
              className="max-w-[12ch] font-display text-[clamp(2.7rem,7.6vw,8.2rem)] leading-[0.95] tracking-[-0.03em]"
              parts={[{ t: "Straight off the " }, { t: "plate.", em: true, accent: true }]}
            />
          </div>
          <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" className="btn">
            Follow along <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
      <PhotoMarquee photos={stripPhotos} />
    </section>
  );
}
