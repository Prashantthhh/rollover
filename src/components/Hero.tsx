import { HERO_TREATMENT } from "../data/art";
import HeroScrub from "./HeroScrub";
import HeroVideo from "./HeroVideo";
import OrderButton from "./OrderButton";
import RiseWords from "./RiseWords";

/**
 * Full-screen video with an oversized headline. Scrolling shrinks the video into a rounded rectangle (HeroScrub writes --p,
 * globals.css does the rest), the headline fades out, and the two buttons stay where they are: over the video first,
 * then on the cream band under it. A flat 30% ink layer keeps the white type readable on any frame.
 */
export default function Hero() {
  return (
    <HeroScrub>
      <div className="hero-clip">
        <HeroVideo treatment={HERO_TREATMENT} />
        <div aria-hidden="true" className="absolute inset-0 bg-ink/30" />
      </div>

      <div className="absolute inset-x-0 bottom-0 mx-auto flex max-w-[1600px] flex-col px-5 pb-5 sm:px-8 sm:pb-6">
        <div className="hero-fade pointer-events-none text-white">
          <p className="text-sm font-bold uppercase tracking-[0.16em] sm:text-base">Chaitanyapuri Colony, Hanamkonda</p>
          <RiseWords
            className="mt-3 font-display text-[clamp(3.4rem,12.4vw,11.5rem)] leading-[0.9] tracking-[-0.05em]"
            lines={[{ text: "Rolled while" }, { text: "you watch.", className: "text-pink" }]}
          />
          <p className="mt-5 max-w-xl text-lg leading-snug sm:text-xl">
            Ice cream rolled on a cold plate in front of you. Shakes, momos and munchies too, and a board game if you&apos;re staying.
          </p>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <OrderButton label="Get it delivered" className="btn btn-pink" />
          <a href="#visit" className="btn btn-cream">Find the shop</a>
        </div>
      </div>
    </HeroScrub>
  );
}
