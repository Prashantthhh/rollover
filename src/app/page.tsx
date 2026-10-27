import Footer from "../components/Footer";
import Hero from "../components/Hero";
import JsonLd from "../components/JsonLd";
import HowRolls from "../components/HowRolls";
import MenuSection from "../components/MenuSection";
import Nav from "../components/Nav";
import OffersSection from "../components/OffersSection";
import PhotoBand from "../components/PhotoBand";
import PhotoStrip from "../components/PhotoStrip";
import ReviewsSection from "../components/ReviewsSection";
import Specials from "../components/Specials";
import VibeSection from "../components/VibeSection";
import VisitSection from "../components/VisitSection";
import { localBusinessJsonLd } from "../lib/jsonld";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main" className="curtain-main">
        <Hero />
        <HowRolls />
        <Specials />
        <MenuSection />
        <PhotoBand />
        <VibeSection />
        <PhotoStrip />
        <ReviewsSection />
        <OffersSection />
        <VisitSection />
      </main>
      <Footer />
      <JsonLd data={localBusinessJsonLd()} />
    </>
  );
}
