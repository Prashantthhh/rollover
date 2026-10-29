import Footer from "../components/Footer";
import Hero from "../components/Hero";
import HowScrub from "../components/HowScrub";
import Intro from "../components/Intro";
import JsonLd from "../components/JsonLd";
import MenuSection from "../components/MenuSection";
import Nav from "../components/Nav";
import PhotoStrip from "../components/PhotoStrip";
import PhraseBand from "../components/PhraseBand";
import ReviewsSection from "../components/ReviewsSection";
import Specials from "../components/Specials";
import VisitSection from "../components/VisitSection";
import { localBusinessJsonLd } from "../lib/jsonld";

// Editorial redesign. Page order: cover, standfirst, how it's made (scrubbed), specials, menu, photo strip, reviews, visit, footer.
// OffersSection exists but is deliberately not rendered (offers stay hidden).
export default function Home() {
  return (
    <>
      <Nav />
      <main id="main" className="curtain-main">
        <Hero />
        <Intro />
        <PhraseBand />
        <HowScrub />
        <PhraseBand />
        <Specials />
        <MenuSection />
        <PhotoStrip />
        <ReviewsSection />
        <VisitSection />
      </main>
      <Footer />
      <JsonLd data={localBusinessJsonLd()} />
    </>
  );
}
