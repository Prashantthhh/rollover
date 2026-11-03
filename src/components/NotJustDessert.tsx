import { savouryRows } from "../data/savoury";
import Photo from "./Photo";
import Split from "./Split";

const photos = savouryRows.filter((r) => r.photo);

/**
 * "Not just dessert": a typographic spread for the savoury side of the menu. Four huge words (Burgers. Momos. Munchies.
 * Sandwiches.), each a link to its category with the dish count and starting price taken from the menu data. Same motion as the
 * rest of the issue: the words rise out of a mask, the rules wipe open, and the headline drifts sideways.
 * Photo slots: a row whose `photo` is set in data/savoury.ts gets a figure (clip-path reveal, inner parallax) in the strip
 * under the list; rows without a photo render nothing, so the section looks finished without pictures.
 */
export default function NotJustDessert() {
  return (
    <section id="savoury" data-tone="paper" aria-labelledby="savoury-h" className="relative py-28 sm:py-40">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-8">
        <div className="flex items-baseline justify-between border-t border-current/60 pt-3">
          <p className="caption">Also on the counter</p>
          <p className="caption">p. 02a</p>
        </div>

        <div className="mt-10 grid items-end gap-x-8 gap-y-8 sm:mt-16 lg:grid-cols-12">
          <div className="drift lg:col-span-8">
            <Split
              id="savoury-h"
              className="max-w-[12ch] font-display text-[clamp(2.7rem,7.6vw,8.2rem)] leading-[0.95] tracking-[-0.03em]"
              parts={[{ t: "Not just " }, { t: "dessert.", em: true, accent: true }]}
            />
          </div>
          <p className="lead measure max-w-[24rem] opacity-90 lg:col-span-4 lg:pb-4">
            Burgers, momos, fries and toasted sandwiches, made to order. Come for dinner, and stay for the rolls.
          </p>
        </div>

        <ol className="mt-16 sm:mt-24">
          {savouryRows.map((r, i) => (
            <li key={r.id}>
              <span aria-hidden="true" className="rule-wipe block border-t border-current/60" />
              <a href={`/menu/c/${r.id}`} className="group grid items-end gap-x-8 gap-y-3 py-6 md:grid-cols-12 md:py-9">
                <span className="caption md:col-span-1 md:self-start md:pt-4">{String(i + 1).padStart(2, "0")}</span>
                <span className="transition-transform duration-500 ease-out group-hover:translate-x-3 group-focus-visible:translate-x-3 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0 md:col-span-7">
                  <Split
                    as="h3"
                    by="char"
                    className="font-display text-[clamp(3rem,14vw,9.5rem)] leading-[0.92] tracking-[-0.04em] md:text-[clamp(4rem,9.6vw,9.5rem)]"
                    parts={[{ t: r.word }, { t: ".", accent: true }]}
                  />
                </span>
                <span className="caption-i max-w-[22rem] opacity-80 md:col-span-2 md:pb-3">{r.names}</span>
                <span className="caption flex items-baseline justify-between gap-4 md:col-span-2 md:justify-end md:pb-3">
                  <span>{r.count} dishes &middot; from {r.from}</span>
                  <span aria-hidden="true" className="t-accent text-base transition-transform duration-500 group-hover:translate-x-1 motion-reduce:transition-none">&rarr;</span>
                </span>
              </a>
            </li>
          ))}
          <li aria-hidden="true"><span className="rule-wipe block border-t border-current/60" /></li>
        </ol>

        {photos.length > 0 && (
          <div className="mt-20 grid gap-x-8 gap-y-16 sm:mt-32 md:grid-cols-12">
            {photos.map((r, i) => (
              <Photo
                key={r.id}
                src={r.photo!}
                alt={r.alt}
                ratio={i === 0 ? 1.2 : 0.85}
                className={["md:col-span-6", "md:col-span-3 md:col-start-8 md:mt-24", "md:col-span-3 md:col-start-11"][i] ?? "md:col-span-4"}
                caption={<><span className="caption mr-2">Fig. {i + 1}</span>{r.item.name}, {r.from}</>}
              />
            ))}
          </div>
        )}

        <p className="mt-10 flex flex-wrap items-baseline gap-x-8 gap-y-3">
          <a href="/menu" className="btn">See the full menu</a>
        </p>
      </div>
    </section>
  );
}
