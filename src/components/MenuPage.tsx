import { SHOW_TAGLINES } from "../data/site";
import { categories, categoryBySlug, figureOffsets, fromPrice, rupees } from "../data/menu";
import { menuCategoryJsonLd } from "../lib/jsonld";
import Footer from "./Footer";
import JsonLd from "./JsonLd";
import MenuCategoryNav from "./MenuCategoryNav";
import MenuControls from "./MenuControls";
import MenuHover from "./MenuHover";
import MenuPanel from "./MenuPanel";
import Nav from "./Nav";
import OrderButton from "./OrderButton";

const dishes = categories.reduce((n, c) => n + c.items.length, 0);

/**
 * One page of the menu (/menu and /menu/c/<slug>): the category row, then the category's heading, filter and search, then
 * its dishes as the same editorial list the home page used to carry. Each page is plain static HTML with every dish in it;
 * the filter and search (MenuControls) only hide rows. Category links are real page loads, so each page keeps its own
 * title, description and structured data.
 */
export default function MenuPage({ slug }: { slug: string }) {
  const found = categoryBySlug(slug);
  if (!found) throw new Error(`No menu category: ${slug}`);
  const { category: c, index, prev, next } = found;
  const listId = "dish-list";

  return (
    <>
      <Nav home={false} />
      <main id="main">
        <div id="top" data-menu-hover className="mx-auto max-w-[1600px] px-4 pb-28 pt-8 sm:px-8 sm:pb-40 sm:pt-12">
          <div className="mb-5 flex items-baseline justify-between">
            <p className="caption">No. 03 &mdash; The menu</p>
            <p className="caption">{dishes} dishes, prices in rupees</p>
          </div>

          <MenuCategoryNav current={c.id} />

          <header className="mb-10 mt-12 grid items-end gap-x-8 gap-y-5 md:mb-14 md:mt-16 md:grid-cols-12">
            <div className="md:col-span-8">
              <p className="caption mb-4">Category {index + 1} of {categories.length}</p>
              <h1 className="font-display text-[clamp(3.2rem,9vw,9rem)] leading-[0.9] tracking-[-0.04em]">{c.title}<span className="t-accent">.</span></h1>
            </div>
            <div className="md:col-span-4 md:pb-3">
              {SHOW_TAGLINES && c.taglineConfirmed && <p className="it mb-4 text-[1.35rem] leading-snug sm:text-2xl">{c.tagline}</p>}
              <p className="caption opacity-70">From {rupees(fromPrice(c))}</p>
            </div>
          </header>

          <MenuControls listId={listId} title={c.title} total={c.items.length} />
          <MenuPanel category={c} offset={figureOffsets[index]} listId={listId} />

          <nav aria-label="Other categories" className="mt-12 grid grid-cols-2 gap-x-6 border-b border-current/60 pb-8 md:mt-16">
            <a href={`/menu/c/${prev.id}`} className="group block">
              <span className="caption block opacity-70"><span aria-hidden="true">&larr;</span> Previous</span>
              <span className="mt-2 block font-display text-[1.5rem] leading-none sm:text-4xl">{prev.title}</span>
            </a>
            <a href={`/menu/c/${next.id}`} className="group block text-right">
              <span className="caption block opacity-70">Next <span aria-hidden="true">&rarr;</span></span>
              <span className="mt-2 block font-display text-[1.5rem] leading-none sm:text-4xl">{next.title}</span>
            </a>
          </nav>

          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            <OrderButton label="Get it delivered" className="btn" />
            <a href="/#visit" className="caption ulink">Or come and find us</a>
          </div>
        </div>
      </main>
      <Footer home={false} />
      {/* outside the page wrapper, like on the home page */}
      <MenuHover />
      <JsonLd data={menuCategoryJsonLd(c)} />
    </>
  );
}
