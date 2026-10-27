import Image from "next/image";
import Doodle from "./Doodle";
import Reveal from "./Reveal";
import SplitHeading from "./SplitHeading";

function Photo({ src, alt, label, className = "", shadow = false }: { src: string; alt: string; label: string; className?: string; shadow?: boolean }) {
  return (
    <figure className={`relative border-[3px] border-maroon bg-cream ${shadow ? "shadow-[9px_9px_0_var(--color-pink)]" : ""} ${className}`}>
      <Image src={src} alt={alt} fill sizes="(min-width: 1024px) 560px, 92vw" fetchPriority="low" className="object-cover" />
      <figcaption className="absolute bottom-0 left-0 border-r-[3px] border-t-[3px] border-maroon bg-cream px-3 py-1 text-xs font-bold uppercase tracking-[0.12em]">{label}</figcaption>
    </figure>
  );
}

/**
 * The vibe: an uneven collage on a 12-column grid. Mixed sizes and shapes (one cut corner, one square tile with text,
 * wide and tall photos); the shop-sign photo is the tile that breaks out of the grid, overlapping its neighbour and
 * running past the right margin. Photos are stills from the cafe's old About video and two old dessert photos, so
 * they are low resolution in places (see NEEDS_FROM_CLIENT.md). There is no photo of the board games yet: that tile is type
 * plus a doodle slot (src/data/art.ts).
 */
export default function VibeSection() {
  return (
    <section id="gallery" className="cv relative bg-cream">
      <div className="relative mx-auto max-w-6xl px-4 py-20 sm:py-28">
        <div className="grid grid-cols-2 gap-x-4 gap-y-6 lg:grid-cols-12 lg:gap-x-6 lg:gap-y-8">
          <div className="col-span-2 lg:col-span-5 lg:row-start-1 lg:pr-6 lg:pt-10">
            <p className="text-sm font-bold uppercase tracking-[0.14em] sm:text-base">The vibe</p>
            <SplitHeading text="Stay a while" className="mt-2 font-display text-[3rem] leading-[1.02] sm:text-6xl lg:text-7xl" />
            <p className="mt-5 max-w-md text-lg leading-snug">
              A cozy, inviting place to relax, unwind and take on your friends and family at a board game. Come for the rolls, stay for the hangout.
            </p>
          </div>

          <Reveal className="col-span-2 lg:col-span-6 lg:col-start-7 lg:row-span-2 lg:row-start-1">
            <Photo src="/img/vibe/interior-table.webp" alt="A white round table with a small vase of flowers and white chairs" label="Pull up a chair" shadow className="aspect-[5/4] rounded-tl-[5rem] lg:aspect-[4/5]" />
          </Reveal>

          <Reveal className="col-span-1 lg:col-span-3 lg:row-start-2">
            <div className="relative flex aspect-square flex-col justify-between border-[3px] border-maroon bg-maroon p-4 text-cream lg:p-5">
              <Doodle slot="vibeGames" className="w-14 text-pink lg:w-20" />
              <p className="font-display text-2xl leading-[1.05] lg:text-3xl">Board games for the whole table</p>
            </div>
          </Reveal>

          <Reveal className="col-span-1 lg:col-span-3 lg:row-start-2">
            <Photo src="/img/vibe/death-by-chocolate-2.webp" alt="Chocolate sauce being poured over a dessert" label="Sauce on top" className="aspect-square rounded-b-[3rem] lg:aspect-[3/4]" />
          </Reveal>

          <Reveal className="col-span-2 lg:col-span-7 lg:row-start-3">
            <Photo src="/img/vibe/roll-on-plate.webp" alt="Ice cream mix being spread on a freezing plate" label="Rolled in front of you" className="aspect-[16/9]" />
          </Reveal>

          <Reveal className="col-span-1 lg:col-span-5 lg:col-start-8 lg:row-start-3 lg:-mt-24">
            <Photo src="/img/vibe/img3.webp" alt="Chocolate brownies on a table with sauce drizzled around them" label="Treat yourself" className="aspect-[4/5] rounded-tr-[4rem]" />
          </Reveal>

          {/* the tile that breaks the grid: rotated, overlapping, past the right margin on large screens */}
          <Reveal className="col-span-1 -ml-6 mt-8 rotate-[-4deg] lg:absolute lg:-right-14 lg:top-[44%] lg:z-10 lg:ml-0 lg:mt-0 lg:w-72 lg:rotate-[5deg]">
            <Photo src="/img/vibe/storefront-sign.webp" alt="The Roll Over shop sign: ice creams, handcrafted" label="Look for the sign" shadow className="aspect-[4/3]" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
