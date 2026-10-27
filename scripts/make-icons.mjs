// Draws every icon (a bold ice-cream-roll spiral that still reads at 16 px) and writes:
//   src/app/icon.png, src/app/apple-icon.png, src/app/favicon.ico      (Next adds the <link> tags)
//   public/icons/icon-192.png, icon-512.png, icon-maskable-512.png      (web app manifest)
// Run: node scripts/make-icons.mjs
import sharp from "sharp";
import fs from "fs";

const PINK = "#eb3592", CREAM = "#fef2f3", INK = "#1f1419";

/** scale = how much of the canvas the roll occupies (maskable icons keep it inside the 80% safe zone). */
const svg = (scale, radius) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
  <rect width="256" height="256" rx="${radius}" fill="${PINK}"/>
  <g transform="translate(128 128) scale(${scale}) translate(-128 -128)" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="136" cy="136" r="78" fill="${INK}"/>
    <circle cx="128" cy="128" r="78" fill="${CREAM}" stroke="${INK}" stroke-width="14"/>
    <path d="M128 128a10 10 0 0 1 10-10a20 20 0 0 1 20 20a30 30 0 0 1-30 30a40 40 0 0 1-40-40a50 50 0 0 1 50-50" fill="none" stroke="${PINK}" stroke-width="13"/>
  </g>
</svg>`;

const render = (size, scale, radius) => sharp(Buffer.from(svg(scale, radius)), { density: 300 }).resize(size, size).png().toBuffer();

fs.mkdirSync("public/icons", { recursive: true });
fs.writeFileSync("src/app/icon.png", await render(256, 1, 56));
fs.writeFileSync("src/app/apple-icon.png", await render(180, 1, 0)); // iOS rounds the corners itself
fs.writeFileSync("public/icons/icon-192.png", await render(192, 1, 56));
fs.writeFileSync("public/icons/icon-512.png", await render(512, 1, 112));
fs.writeFileSync("public/icons/icon-maskable-512.png", await render(512, 0.7, 0));

// favicon.ico with PNG payloads (16, 32, 48)
const sizes = [16, 32, 48];
const pngs = await Promise.all(sizes.map((s) => render(s, 1, s * 0.22)));
const head = Buffer.alloc(6);
head.writeUInt16LE(1, 2);
head.writeUInt16LE(sizes.length, 4);
let offset = 6 + 16 * sizes.length;
const dir = pngs.map((p, i) => {
  const e = Buffer.alloc(16);
  e[0] = sizes[i]; e[1] = sizes[i];
  e.writeUInt16LE(1, 4); e.writeUInt16LE(32, 6);
  e.writeUInt32LE(p.length, 8); e.writeUInt32LE(offset, 12);
  offset += p.length;
  return e;
});
fs.writeFileSync("src/app/favicon.ico", Buffer.concat([head, ...dir, ...pngs]));
console.log("icons written");
