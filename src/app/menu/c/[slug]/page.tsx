import type { Metadata } from "next";
import MenuPage from "../../../../components/MenuPage";
import { categories } from "../../../../data/menu";
import { categoryMetadata } from "../../../../lib/menuSeo";

// One static page per category. The slugs are the old live site's, so existing /menu/c/<slug> links keep working.
export const dynamicParams = false;
export const generateStaticParams = () => categories.map((c) => ({ slug: c.id }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  return categoryMetadata((await params).slug);
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  return <MenuPage slug={(await params).slug} />;
}
