import type { Metadata, Viewport } from "next";
import Script from "next/script";
import localFont from "next/font/local";
import HashNav from "../components/HashNav";
import IntroLoader from "../components/IntroLoader";
import Motion from "../components/Motion";
import MotionProvider from "../components/MotionProvider";
import { site } from "../data/site";
import { SEO } from "../lib/seo";
import "./globals.css";

// Fonts (Fontshare, free for commercial use; licences in public/fonts-licenses), self-hosted woff2.
// Display: Gambarino (editorial serif, one weight). Body: Switzer 400/500/600. "swap" paints text at once in the fallback face.
const gambarino = localFont({ src: "./fonts/Gambarino-Regular.woff2", weight: "400", variable: "--font-gambarino", display: "swap", preload: true });
// Gambarino has one weight and no italic, so the one or two emphasised words per headline use its sibling Gambetta Light Italic.
const gambetta = localFont({ src: "./fonts/Gambetta-LightItalic.woff2", weight: "300", style: "italic", variable: "--font-gambetta", display: "swap", preload: false });
const switzer = localFont({
  src: [
    { path: "./fonts/Switzer-300.woff2", weight: "300" },
    { path: "./fonts/Switzer-400.woff2", weight: "400" },
    { path: "./fonts/Switzer-500.woff2", weight: "500" },
    { path: "./fonts/Switzer-600.woff2", weight: "600" },
  ],
  variable: "--font-switzer", display: "swap", preload: true,
});

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

export const viewport: Viewport = { themeColor: "#f3eee4" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" suppressHydrationWarning className={`${gambarino.variable} ${gambetta.variable} ${switzer.variable}`}>
      <head>
        {/* html.js: scripted enhancements may hide things until they animate in. html.seen: the load intro already played on this browser. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js');try{if(localStorage.getItem('ro-intro'))document.documentElement.classList.add('seen')}catch(e){}" }} />
      </head>
      <body>
        <div className="tone-bg" aria-hidden="true" />
        <IntroLoader />
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-paper focus:px-4 focus:py-2 focus:text-ink focus:outline focus:outline-1 focus:outline-ink">
          Skip to content
        </a>
        <noscript>
          {/* No JS: show the step figures instead of the scrubbing stage. */}
          <style>{`.how-run{display:none!important}.how-static{display:block!important}`}</style>
        </noscript>
        <MotionProvider>{children}</MotionProvider>
        <HashNav />
        <Motion />
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
