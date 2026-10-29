import type { Metadata } from "next";
import OrderButton from "../components/OrderButton";
import { site } from "../data/site";

export const metadata: Metadata = {
  title: "Page not found | RollOver Warangal",
  description: "That page rolled off the plate. Head back to the RollOver Warangal home page.",
  robots: { index: false },
};

/** The 404, set as the last page of the issue: a huge italic 404, one line of copy and three ways back. */
export default function NotFound() {
  return (
    <main id="main" className="flex min-h-svh flex-col">
      <header className="border-b border-current/60">
        <div className="mx-auto flex h-14 max-w-[1600px] items-center justify-between px-4 sm:px-8">
          <a href="/" className="font-display text-[1.45rem] leading-none tracking-[-0.03em]" aria-label="RollOver Warangal, home">
            Roll<span className="t-accent">O</span>ver
          </a>
          <p className="caption">No. 404 &mdash; Hanamkonda</p>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col justify-center px-4 py-24 sm:px-8">
        <p aria-hidden="true" className="font-display text-[clamp(9rem,34vw,32rem)] leading-[0.75] tracking-[-0.06em]">
          <em className="t-accent">404</em>
        </p>
        <div className="mt-16 grid gap-x-8 gap-y-10 border-t border-current/60 pt-6 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <h1 className="font-display text-[clamp(2rem,4vw,4rem)] leading-[1.05] tracking-[-0.03em]">This roll fell off the <em>plate.</em></h1>
            <p className="lead measure mt-5 max-w-[28rem]">We couldn&apos;t find that page. The menu, the specials and the ice cream are all still on the home page.</p>
          </div>
          <div className="flex flex-wrap items-start gap-x-6 gap-y-4 lg:col-span-5 lg:col-start-8">
            <a href="/" className="btn btn-pink">Back home</a>
            <a href="/#menu" className="btn">Open the menu</a>
            <OrderButton label="Order" className="btn" />
          </div>
        </div>
        <p className="caption mt-16">Or call the shop on <a className="ulink" href={site.phoneHref}>{site.phone}</a></p>
      </div>
    </main>
  );
}
