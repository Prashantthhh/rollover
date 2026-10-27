import type { Metadata } from "next";
import OrderButton from "../components/OrderButton";
import { site } from "../data/site";

export const metadata: Metadata = {
  title: "Page not found | RollOver Warangal",
  description: "That page rolled off the plate. Head back to the RollOver Warangal home page.",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <main id="main" className="flex min-h-svh flex-col bg-cream text-maroon">
      <header className="border-b-[3px] border-maroon bg-cream">
        <div className="mx-auto flex h-16 max-w-6xl items-center px-4">
          <a href="/" aria-label="RollOver Warangal, home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/img/brand/logo.webp" alt="RollOver: ice creams, hand crafted" width={586} height={133} className="h-9 w-auto sm:h-11" />
          </a>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-6xl flex-1 items-center gap-10 px-4 py-14 lg:grid-cols-[1fr_1fr] lg:gap-16">
        <div>
          <p className="font-display text-[8rem] leading-[0.85] text-pink sm:text-[12rem]" aria-hidden="true">404</p>
          <h1 className="mt-4 font-display text-[2.6rem] leading-[1.05] sm:text-6xl">This roll fell off the plate.</h1>
          <p className="mt-4 max-w-md text-lg leading-snug">We could not find that page. The menu, the specials and the ice cream are all still on the home page.</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a href="/" className="btn btn-pink">Back home</a>
            <a href="/#menu" className="btn btn-cream">Open the menu</a>
            <OrderButton label="Get it delivered" className="btn btn-cream" />
          </div>
          <p className="mt-8 text-base">Or call the shop on <a className="underline decoration-2 underline-offset-4" href={site.phoneHref}>{site.phone}</a>.</p>
        </div>

        {/* a plate with the roll that fell off it: flat shapes, maroon outline */}
        <svg aria-hidden="true" viewBox="0 0 400 300" focusable="false" className="mx-auto w-full max-w-md [stroke-linecap:round] [stroke-linejoin:round]">
          <rect x="0" y="262" width="400" height="10" className="fill-maroon" />
          <ellipse cx="150" cy="232" rx="120" ry="26" className="fill-cream stroke-maroon stroke-4" />
          <ellipse cx="150" cy="224" rx="92" ry="17" className="fill-pink stroke-maroon stroke-3" />
          <g transform="rotate(-8 292 232)">
            <rect x="236" y="214" width="124" height="44" rx="22" className="fill-cream stroke-maroon stroke-4" />
            <circle cx="360" cy="236" r="22" className="fill-pink stroke-maroon stroke-4" />
            <path d="M360 236m-8 0a8 8 0 1 1 8 8" fill="none" className="stroke-maroon stroke-3" />
          </g>
          <path d="M214 196q8-22-4-46" fill="none" className="stroke-maroon stroke-3" strokeDasharray="2 12" />
        </svg>
      </div>
    </main>
  );
}
