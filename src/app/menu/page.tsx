import type { Metadata } from "next";
import MenuPage from "../../components/MenuPage";
import { categories } from "../../data/menu";
import { menuIndexMetadata } from "../../lib/menuSeo";

// /menu is the first category (Ice Cream Rolls); its canonical URL is /menu/c/ice-cream-rolls.
export const metadata: Metadata = menuIndexMetadata();

export default function Page() {
  return <MenuPage slug={categories[0].id} />;
}
