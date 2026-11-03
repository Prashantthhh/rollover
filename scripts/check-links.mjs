// Crawls the built site (served with: npx serve out -l 4173): every page (/, /menu, every /menu/c/<slug>), then every image,
// stylesheet, script, media file and internal link found in it, and every image path in menu.json / savoury.ts. Fails on any non-200.
// Run: node scripts/check-links.mjs   (BASE=http://localhost:4173 by default)
import fs from "fs";
const BASE = process.env.BASE || "http://localhost:4173";
const slugs = JSON.parse(fs.readFileSync("src/data/menu.json", "utf8")).categories.map((c) => c.id);
const pages = ["/", "/menu", ...slugs.map((s) => `/menu/c/${s}`)];
const seen = new Map(); let bad = 0;
const check = async (path, from) => {
  if (seen.has(path)) return;
  const r = await fetch(BASE + path, { redirect: "manual" });
  seen.set(path, r.status);
  if (r.status >= 300) { bad++; console.log(`FAIL ${r.status} ${path}  (from ${from})`); }
};
for (const p of pages) {
  const res = await fetch(BASE + p);
  if (res.status !== 200) { bad++; console.log(`FAIL ${res.status} page ${p}`); continue; }
  const html = await res.text();
  const urls = new Set();
  for (const m of html.matchAll(/\s(?:src|href|poster)="([^"]+)"/g)) urls.add(m[1]);
  for (const m of html.matchAll(/\ssrcset="([^"]+)"/g)) m[1].split(",").forEach((s) => urls.add(s.trim().split(/\s+/)[0]));
  for (const u of urls) {
    if (/^(https?:|mailto:|tel:|#|data:)/.test(u) && !u.startsWith(BASE)) continue;
    const path = u.replace(BASE, "").split("#")[0].split("?")[0].replaceAll("&amp;", "&");
    if (path) await check(path.startsWith("/") ? path : "/" + path, p);
  }
}
// image paths named in the data files
const data = fs.readFileSync("src/data/menu.json", "utf8") + [...fs.readFileSync("src/data/savoury.ts", "utf8").matchAll(/photo: ("\/img\/[^"]+")/g)].map((m) => m[1]).join("\n");
for (const m of data.matchAll(/"(\/img\/[^"]+\.(?:webp|png|jpg))"/g)) { await check(m[1], "data"); await check(m[1].replace(/\.webp$/, "-sm.webp"), "data (-sm)"); }
console.log(`${pages.length} pages, ${seen.size} unique URLs checked, ${bad} failures`);
process.exit(bad ? 1 : 0);
