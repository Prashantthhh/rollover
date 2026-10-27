"use client";

import { useState } from "react";
import { site } from "../data/site";

/**
 * The Google map is a heavy third-party iframe, so it loads only when asked ("Show the map").
 * Until then the card is a flat illustration with a normal link out to Google Maps.
 */
export default function MapFacade() {
  const [show, setShow] = useState(false);
  return (
    <div className="relative h-[26rem] border-[3px] border-maroon bg-pink shadow-[10px_10px_0_var(--color-maroon)] sm:h-[32rem]">
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
        <div className="flex h-full flex-col items-center justify-center gap-6 p-6 text-center">
          <svg aria-hidden="true" viewBox="0 0 120 150" focusable="false" className="w-24 [stroke-linecap:round] [stroke-linejoin:round]">
            <rect x="26" y="136" width="68" height="8" className="fill-maroon" />
            <path d="M60 8C36 8 20 26 20 48c0 30 40 82 40 82s40-52 40-82C100 26 84 8 60 8Z" className="fill-cream stroke-maroon stroke-4" />
            <circle cx="60" cy="48" r="16" className="fill-maroon" />
          </svg>
          <p className="font-display text-3xl leading-tight">Chaitanyapuri Colony,<br />Hanamkonda</p>
          <div className="flex flex-wrap justify-center gap-4">
            <button type="button" onClick={() => setShow(true)} className="btn btn-maroon">Show the map</button>
            <a href={site.maps.placeUrl} target="_blank" rel="noopener noreferrer" className="btn btn-cream">Open in Google Maps <span aria-hidden="true">↗</span></a>
          </div>
        </div>
      )}
    </div>
  );
}
