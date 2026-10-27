// Re-encodes everything in source-assets/ (raw originals, NOT shipped) into public/img/*.webp.
// next/image runs with `unoptimized` under static export, so images are sized here instead.
// Run: node scripts/optimize-media.mjs
import sharp from "sharp";
import fs from "fs";
import path from "path";

const SRC = "source-assets", OUT = "public/img";
const jobs = [
  { dir: "menu", width: 720 },
  { dir: "vibe", width: 1400 },
  { dir: "brand", width: 640, only: /logonew1|wtsaplogo/ },
  { dir: "cutouts", width: 900 },
];
let n = 0;
for (const { dir, width, only } of jobs) {
  const d = path.join(SRC, dir);
  if (!fs.existsSync(d)) continue;
  fs.mkdirSync(path.join(OUT, dir), { recursive: true });
  for (const f of fs.readdirSync(d)) {
    if (only && !only.test(f)) continue;
    const out = path.join(OUT, dir, f.replace(/\.\w+$/, "").replace(/^logonew1$/, "logo") + ".webp");
    const img = () => sharp(path.join(d, f)).rotate();
    await img().resize({ width, withoutEnlargement: true }).webp({ quality: 80, alphaQuality: 90 }).toFile(out);
    // small variant for phones (picked by src/lib/imageLoader.ts)
    await img().resize({ width: 480, withoutEnlargement: true }).webp({ quality: 76, alphaQuality: 90 }).toFile(out.replace(/\.webp$/, "-sm.webp"));
    n++;
  }
}
// hero poster (frame grabbed from public/video/hero.mp4 with ffmpeg) also gets a small variant
await sharp("public/video/hero-poster.webp").resize({ width: 640 }).webp({ quality: 74 }).toFile("public/video/hero-poster-sm.webp");
console.log("wrote", n, "images (+ -sm variants)");
