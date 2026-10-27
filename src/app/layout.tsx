import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Shrikhand, Archivo } from "next/font/google";
import HashNav from "../components/HashNav";
import MotionProvider from "../components/MotionProvider";
import { site } from "../data/site";
import { SEO } from "../lib/seo";
import "./globals.css";

// Fonts: display "swap" (text paints at once in the fallback face). Only the display face, which the hero
// headline uses, is preloaded; the body face loads when it is first needed.
// Display: Shrikhand (one weight, used big). Body: Archivo (sturdy, signage-like). Alternative body face: Atkinson Hyperlegible.
const shrikhand = Shrikhand({ weight: "400", subsets: ["latin"], variable: "--font-shrikhand", display: "swap", preload: true });
const archivo = Archivo({ subsets: ["latin"], variable: "--font-archivo", display: "swap", preload: false });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: SEO.title,
  description: SEO.description,
  alternates: { canonical: SEO.url },
  openGraph: {
    type: "website",
    url: SEO.url,
    siteName: site.name,
    locale: "en_IN",
    title: SEO.title,
    description: SEO.description,
    images: [{ url: SEO.ogImage, width: 1200, height: 630, alt: SEO.ogImageAlt }],
  },
  twitter: { card: "summary_large_image", title: SEO.title, description: SEO.description, images: [SEO.ogImage] },
};

// GA4 loads only when NEXT_PUBLIC_GA_ID is set at build time (Vercel: Project Settings > Environment Variables).
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export const viewport: Viewport = { themeColor: "#eb3592" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${shrikhand.variable} ${archivo.variable}`}>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-sun focus:px-4 focus:py-2 focus:font-semibold">
          Skip to content
        </a>
        <noscript>
          {/* No JS: show every heading and the framed hero state instead of the hidden start poses. */}
          <style>{`.split-word{transform:none!important}.word-rise{animation:none!important}.hero-runway{display:none!important}.hero-stage{position:relative!important;top:0!important;--p:1!important}.hero-text{position:relative!important;top:0!important}`}</style>
        </noscript>
        <MotionProvider>{children}</MotionProvider>
        <HashNav />
        {GA_ID && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
            <Script id="ga4" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${GA_ID}');`}</Script>
          </>
        )}
      </body>
    </html>
  );
}
