import type { Metadata, Viewport } from "next";
import Script from "next/script";
import localFont from "next/font/local";
import HashNav from "../components/HashNav";
import FreshMotion from "../components/FreshMotion";
import MotionProvider from "../components/MotionProvider";
import { site } from "../data/site";
import { SEO } from "../lib/seo";
import "./globals.css";

// Fonts (Fontshare, free for commercial use; licences in public/fonts-licenses), self-hosted variable woff2.
// Display: Clash Display (headings). Body: Satoshi. "swap" paints text at once in the fallback face.
const clash = localFont({ src: "./fonts/ClashDisplay-Variable.woff2", weight: "200 700", variable: "--font-clash", display: "swap", preload: true });
const satoshi = localFont({ src: "./fonts/Satoshi-Variable.woff2", weight: "300 900", variable: "--font-satoshi", display: "swap", preload: true });

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
    <html lang="en-IN" className={`${clash.variable} ${satoshi.variable}`}>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:font-semibold">
          Skip to content
        </a>
        <noscript>
          {/* No JS: show every heading and the framed hero state instead of the hidden start poses. */}
          <style>{`.split-word{transform:none!important}.word-rise{animation:none!important}.hero-runway{display:none!important}.hero-stage{position:relative!important;top:0!important;--p:0!important}`}</style>
        </noscript>
        <MotionProvider>{children}</MotionProvider>
        <HashNav />
        <FreshMotion />
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
