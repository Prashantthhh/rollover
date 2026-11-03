// Hero readability check on the real video: for every sampled frame of hero.mp4 (ffmpeg, 2 fps) the frame is put behind the
// live hero (same object-cover crop and 40% ink layer), the hero text is hidden, and the pixels under each text block are measured.
// Reports the worst-case contrast of the white text against the brightest 5% of the pixels behind it, at 1440 and 390 px.
// Usage: node scripts/hero-frames.mjs <frames-dir>   (frames-dir holds f001.jpg ...; site served on :4173)
import fs from "fs"; import path from "path";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const sharp = require("sharp");
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || "playwright");
const dir = process.argv[2];
const frames = fs.readdirSync(dir).filter((f) => f.endsWith(".jpg")).sort();
const lum = (r, g, b) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
const browser = await chromium.launch();
const out = {};
for (const [w, h, tag, mobile] of [[1440, 900, "1440", false], [390, 844, "390", true]]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, hasTouch: mobile, isMobile: mobile, reducedMotion: "reduce" });
  const p = await ctx.newPage();
  await p.goto(process.env.URL || "http://localhost:4173/", { waitUntil: "load" });
  await p.waitForTimeout(1500);
  const blocks = await p.evaluate(() => {
    const hero = document.querySelector(".hero"); const hr = hero.getBoundingClientRect();
    return [...hero.querySelectorAll("h1 .wipe-line, p, a.caption, a.btn, button")].filter((e) => e.getBoundingClientRect().width).map((e) => {
      const r = document.createRange(); r.selectNodeContents(e); const b = r.getBoundingClientRect(), s = getComputedStyle(e);
      return { text: e.textContent.trim().slice(0, 28), x: b.x - hr.x, y: b.y - hr.y, w: b.width, h: b.height, size: parseFloat(s.fontSize), pink: e.closest(".text-pink") !== null || e.matches(".btn-pink,.btn-pink *"), isBtn: !!e.closest(".btn") };
    }).filter((b) => !b.isBtn);
  });
  await p.addStyleTag({ content: ".hero video{display:none!important}.hero h1,.hero p,.hero a,.hero button{visibility:hidden!important}.hero img:not(#fr){display:none!important}" });
  let worst = {};
  for (const f of frames) {
    const data = "data:image/jpeg;base64," + fs.readFileSync(path.join(dir, f)).toString("base64");
    await p.evaluate((d) => { let i = document.getElementById("fr"); if (!i) { i = document.createElement("img"); i.id = "fr"; i.style.cssText = "position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block"; document.querySelector(".hero").prepend(i); } i.src = d; }, data);
    await p.waitForTimeout(120);
    const png = await p.screenshot({ clip: { x: 0, y: 56, width: w, height: h - 56 } }); // hero starts under the 56px nav
    const img = sharp(png); const { width, height } = await img.metadata(); const raw = await img.raw().toBuffer({ resolveWithObject: true });
    const heroTop = await p.evaluate(() => document.querySelector(".hero").getBoundingClientRect().top + scrollY);
    for (const b of blocks) {
      const x0 = Math.max(0, Math.floor(b.x)), x1 = Math.min(width, Math.ceil(b.x + b.w)), y0 = Math.max(0, Math.floor(b.y + heroTop - 56)), y1 = Math.min(height, Math.ceil(b.y + heroTop - 56 + b.h));
      const ls = [];
      for (let y = y0; y < y1; y += 2) for (let x = x0; x < x1; x += 2) { const o = (y * width + x) * raw.info.channels; ls.push(lum(raw.data[o], raw.data[o + 1], raw.data[o + 2])); }
      if (!ls.length) continue; ls.sort((a, b2) => a - b2);
      const p95 = ls[Math.floor(ls.length * 0.95)], textL = b.pink ? lum(235, 53, 146) : 1;
      const ratio = (Math.max(textL, p95) + 0.05) / (Math.min(textL, p95) + 0.05);
      const need = b.size >= 24 ? 3 : 4.5;
      const k = b.text; if (!worst[k] || ratio < worst[k].ratio) worst[k] = { ratio: +ratio.toFixed(2), need, frame: f, size: Math.round(b.size) };
    }
  }
  out[tag] = worst;
  console.log(`== ${tag}px, ${frames.length} frames`);
  for (const [k, v] of Object.entries(worst)) console.log(`${v.ratio >= v.need ? "ok  " : "LOW "} ${v.ratio}:1 (need ${v.need}, ${v.size}px) worst at ${v.frame}  "${k}"`);
}
await browser.close();
