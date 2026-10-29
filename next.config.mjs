/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  // next/image's optimizer needs a server, so images are pre-sized by scripts/optimize-media.mjs and a
  // custom loader picks the full or -sm file (srcset still works).
  images: { loader: "custom", loaderFile: "./src/lib/imageLoader.ts" },
  productionBrowserSourceMaps: false, // never publish source maps
  reactStrictMode: true,
  // BUILD_CPUS=1 keeps the static export to one worker on machines with little free memory (the default is one per core).
  experimental: { inlineCss: true, ...(process.env.BUILD_CPUS ? { cpus: Number(process.env.BUILD_CPUS) } : {}) },
};
export default nextConfig;
