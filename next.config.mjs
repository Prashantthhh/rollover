/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  // next/image's optimizer needs a server, so images are pre-sized by scripts/optimize-media.mjs and a
  // custom loader picks the full or -sm file (srcset still works).
  images: { loader: "custom", loaderFile: "./src/lib/imageLoader.ts" },
  productionBrowserSourceMaps: false, // never publish source maps
  reactStrictMode: true,
  experimental: { inlineCss: true },
};
export default nextConfig;
