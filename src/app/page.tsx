import Footer from "../components/Footer";
import Hero from "../components/Hero";
import HowScrub from "../components/HowScrub";
import Intro from "../components/Intro";
import JsonLd from "../components/JsonLd";
import MenuSection from "../components/MenuSection";
import Nav from "../components/Nav";
import PhraseBand from "../components/PhraseBand";
import VisitSection from "../components/VisitSection";
import { localBusinessJsonLd } from "../lib/jsonld";

// Editorial redesign, first pass: cover, standfirst, "How it's made" (scrubbed), menu. Visit and the footer are still the
// old layouts; the remaining sections (specials, reviews, offers, photo strip) come in the next pass.
export default function Home() {
  return (
    <>
      <Nav />
      <main id="main" className="curtain-main">
        <Hero />
        <Intro />
        <PhraseBand />
        <HowScrub />
        <PhraseBand className="mt-0" />
        <MenuSection />
        <div data-tone="paper"><VisitSection /></div>
      </main>
      <Footer />
      <JsonLd data={localBusinessJsonLd()} />
    </>
  );
}
