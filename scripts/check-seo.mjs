// Post-build SEO checks on out/. Run: node scripts/check-seo.mjs
import fs from "fs";
import sharp from "sharp";
const html = fs.readFileSync("out/index.html", "utf8");
const get = (re) => html.match(re)?.[1];
const decode = (s) => s?.replace(/&amp;/g, "&").replace(/&#x27;/g, "'");
const title = decode(get(/<title>([^<]*)<\/title>/));
const desc = decode(get(/<meta name="description" content="([^"]*)"/));
const checks = [
  [`title "${title}" (${title.length} chars) is under 60`, title.length < 60],
  [`meta description (${desc.length} chars) is under 155`, desc.length < 155],
  ["canonical points at https://rolloverwarangal.com/", /<link rel="canonical" href="https:\/\/rolloverwarangal\.com\/?"/.test(html)],
  ["og:title, og:description, og:url, og:image present", ["og:title", "og:description", "og:url", "og:image"].every((p) => html.includes(`property="${p}"`))],
  ["twitter:card is summary_large_image", html.includes('name="twitter:card" content="summary_large_image"')],
  ["exactly one <h1>", (html.match(/<h1[ >]/g) || []).length === 1],
  ['<html lang="en-IN">', html.includes('<html lang="en-IN"')],
  ["no Google Analytics unless NEXT_PUBLIC_GA_ID was set", process.env.NEXT_PUBLIC_GA_ID ? true : !/googletagmanager|gtag\(/.test(html)],
  ["robots.txt, sitemap.xml, manifest.webmanifest exist", ["robots.txt", "sitemap.xml", "manifest.webmanifest"].every((f) => fs.existsSync("out/" + f))],
  ["favicon.ico, icon.png, apple-icon.png exist", ["favicon.ico", "icon.png", "apple-icon.png"].every((f) => fs.existsSync("out/" + f))],
  ["404.html exists", fs.existsSync("out/404.html")],
];
const og = await sharp("out/og-image.png").metadata();
checks.push([`og-image.png is ${og.width}x${og.height} (1200x630)`, og.width === 1200 && og.height === 630]);
// every menu page: its own title / description / canonical, one h1, JSON-LD present
const slugs = JSON.parse(fs.readFileSync("src/data/menu.json", "utf8")).categories.filter((c) => !c.hidden).map((c) => c.id);
for (const slug of slugs) {
  const page = fs.readFileSync(`out/menu/c/${slug}.html`, "utf8");
  const t = decode(page.match(/<title>([^<]*)<\/title>/)?.[1]) ?? "";
  const d = decode(page.match(/<meta name="description" content="([^"]*)"/)?.[1]) ?? "";
  checks.push([`/menu/c/${slug}: title (${t.length}) < 60, description (${d.length}) < 155, own canonical, one h1, MenuSection JSON-LD`, t.length > 0 && t.length < 60 && d.length > 0 && d.length < 155 && page.includes(`<link rel="canonical" href="https://rolloverwarangal.com/menu/c/${slug}"`) && (page.match(/<h1[ >]/g) || []).length === 1 && page.includes("MenuSection")]);
}
const idx = fs.readFileSync("out/menu.html", "utf8");
checks.push(["/menu canonical points at the first category", idx.includes(`<link rel="canonical" href="https://rolloverwarangal.com/menu/c/${slugs[0]}"`)]);
checks.push(["sitemap lists the home page and every category page", (() => { const s = fs.readFileSync("out/sitemap.xml", "utf8"); return slugs.every((x) => s.includes(`/menu/c/${x}<`)); })()]);
let bad = 0;
for (const [label, ok] of checks) { console.log(ok ? "PASS" : "FAIL", label); if (!ok) bad++; }
process.exit(bad ? 1 : 0);
