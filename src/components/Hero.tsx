import { art, HERO_TREATMENT } from "../data/art";
import Doodle from "./Doodle";
import HeroScrub from "./HeroScrub";
import HeroVideo from "./HeroVideo";
import OrderButton from "./OrderButton";
import RiseWords from "./RiseWords";

/**
 * Phones (< 768px): the headline block is normal flow and scrolls away; the video stage sits below it and
 * pins once it reaches the top, then shrinks (60% of the desktop distance) into an arched window.
 * Desktop: the text is pinned over the stage on cream "tape" so it stays readable on the video at the start and
 * looks like plain type on the cream page once the video has shrunk.
 * Flat colour only: cream page, maroon frame, a pink block offset behind it as the hard shadow.
 * Slots for hand-made art: art.heroLettering (headline) and the heroTop / heroArch doodles (src/data/art.ts).
 */
export default function Hero() {
  return (
    <HeroScrub
      text={
        <div className="mx-auto max-w-6xl px-4 pb-8 pt-6 md:flex md:h-full md:items-center md:py-0">
          <div className="pointer-events-auto relative md:w-[50%]">
            <Doodle slot="heroTop" className="absolute -top-2 right-0 w-14 text-maroon md:-top-12 md:right-6 md:w-20" />
            <p className="inline-block bg-cream pr-3 text-sm font-bold uppercase tracking-[0.14em] md:text-base">
              Chaitanyapuri Colony, Hanamkonda
            </p>
            {art.heroLettering ? (
              <h1 className="mt-3">
                <span className="sr-only">Rolled while you watch.</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={art.heroLettering} alt="" aria-hidden="true" className="w-full max-w-xl" />
              </h1>
            ) : (
              <RiseWords
                tape
                className="mt-3 font-display text-[3rem] leading-[1.02] min-[400px]:text-[3.4rem] md:text-[3.8rem] lg:text-[5.2rem]"
                lines={[{ text: "Rolled while" }, { text: "you watch.", className: "text-pink" }]}
              />
            )}
            <p className="mt-4 inline-block max-w-md bg-cream text-lg leading-snug md:mt-6">
              Ice cream rolled on a cold plate in front of you. Shakes, momos and munchies too, and a board game if you&apos;re staying.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4 md:mt-8">
              <OrderButton label="Get it delivered" className="btn btn-pink" />
              <a href="#visit" className="btn btn-cream btn-pill">Find the shop</a>
            </div>
          </div>
        </div>
      }
    >
      <div aria-hidden="true" className="hero-frame hero-frame-offset hero-frame-bg bg-pink" />
      <div aria-hidden="true" className="hero-frame hero-frame-bg bg-maroon" />

      <div className="hero-clip">
        <HeroVideo treatment={HERO_TREATMENT} />
      </div>

      <div className="hero-frame pointer-events-none">
        <Doodle slot="heroArch" className="hero-pop absolute -left-16 bottom-4 hidden w-24 text-pink md:block" />
      </div>
    </HeroScrub>
  );
}
