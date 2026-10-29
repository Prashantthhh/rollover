"use client";

import { useState } from "react";
import { site } from "../data/site";

/**
 * The Google map is a heavy third-party iframe, so it loads only when asked ("Show the map").
 * Until then the frame is a quiet card with the location set in type and a plain link out to Google Maps.
 */
export default function MapFacade() {
  const [show, setShow] = useState(false);
  return (
    <figure>
      <div className="relative h-[26rem] border border-current/60 sm:h-[34rem]" data-cursor={show ? undefined : "Map"}>
        {show ? (
          <iframe
            title="RollOver Warangal on Google Maps"
            src={site.maps.embedUrl}
            className="h-full w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        ) : (
          <div className="flex h-full flex-col justify-between p-6 sm:p-10">
            <p className="caption">Fig. 90 &mdash; the shop, on the map</p>
            <div>
              <p className="font-display text-[clamp(1.8rem,3vw,3rem)] leading-[1.1] tracking-[-0.02em]">Opposite <em>Tara Gardens</em>,<br />Hanamkonda</p>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
                <button type="button" onClick={() => setShow(true)} className="btn">Show the map</button>
                <a href={site.maps.placeUrl} target="_blank" rel="noopener noreferrer" className="caption ulink">Open in Google Maps <span aria-hidden="true">↗</span></a>
              </div>
            </div>
          </div>
        )}
      </div>
    </figure>
  );
}
