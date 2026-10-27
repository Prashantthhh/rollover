// Runs after `next build` (see package.json). Next 15 does not emit a font preload hint when inlineCss is on,
// so add one, for the display font only (the hero headline uses it). The body font loads when first needed.
import fs from "fs";
import path from "path";

const media = "out/_next/static/media";
const display = fs.readdirSync(media).find((f) => f.endsWith(".p.woff2")); // next/font marks the preload-worthy file with ".p"
if (!display) throw new Error("postbuild: no preloadable font found in " + media);
const tag = `<link rel="preload" href="/_next/static/media/${display}" as="font" type="font/woff2" crossorigin=""/>`;

let n = 0;
for (const f of fs.readdirSync("out").filter((f) => f.endsWith(".html"))) {
  const file = path.join("out", f);
  const html = fs.readFileSync(file, "utf8");
  if (html.includes(display) && html.includes('as="font"')) continue;
  // Next prints the canonical / og:url for the site root without its trailing slash; write the exact URL.
  const withSlash = html
    .replace('<link rel="canonical" href="https://rolloverwarangal.com"/>', '<link rel="canonical" href="https://rolloverwarangal.com/"/>')
    .replace('<meta property="og:url" content="https://rolloverwarangal.com"/>', '<meta property="og:url" content="https://rolloverwarangal.com/"/>');
  fs.writeFileSync(file, withSlash.replace("<head>", "<head>" + tag));
  n++;
}
console.log(`postbuild: preloading ${display} in ${n} page(s)`);
