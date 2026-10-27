// Accessibility audit of the built site. Needs Playwright (not a project dependency):
//   npm i --no-save playwright && npx playwright install chromium
//   npx serve out -l 4173   (in another terminal)   then   node scripts/audit-a11y.mjs
// Set PLAYWRIGHT_MODULE=<path to playwright/index.mjs> to use an existing install.
// It runs: axe-core (WCAG 2.0/2.1 A+AA + best practice), a contrast check of every text/background pair,
// an alt-text / label inventory, and a keyboard-only walkthrough (Tab order, visible focus, Esc behaviour,
// tab arrow keys) at desktop and phone width.
import fs from "fs";
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || "playwright");
const URL = process.env.URL || "http://localhost:4173/";
const axeSrc = fs.readFileSync("node_modules/axe-core/axe.min.js", "utf8");
const browser = await chromium.launch();
let failures = 0;
const fail = (m) => { failures++; console.log("  FAIL", m); };

for (const [name, opts] of [["desktop 1440x900", { viewport: { width: 1440, height: 900 } }], ["phone 390x844", { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }]]) {
  console.log(`\n===== ${name} =====`);
  const ctx = await browser.newContext(opts);
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: "networkidle" });
  await page.evaluate(() => document.documentElement.classList.add("cv-off")); // render every section
  await page.waitForTimeout(500);

  // ---- 1. axe ----
  await page.addScriptTag({ content: axeSrc });
  const axe = await page.evaluate(() => axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"] } }).then((r) => ({ v: r.violations.map((x) => ({ id: x.id, impact: x.impact, n: x.nodes.length, sample: x.nodes[0].target.join(" ") + " :: " + x.nodes[0].html.slice(0, 110), help: x.help })), passes: r.passes.length, incomplete: r.incomplete.map((x) => x.id) })));
  console.log(`axe: ${axe.v.length} violations, ${axe.passes} rules passed, incomplete (needs a human): ${axe.incomplete.join(", ") || "none"}`);
  axe.v.forEach((x) => fail(`axe ${x.id} (${x.impact}) x${x.n}: ${x.help} -> ${x.sample}`));

  // ---- 2. contrast of every text/background pair ----
  const contrast = await page.evaluate(() => {
    const parse = (c) => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null; const [r, g, b, a = 1] = m[1].split(/[ ,/]+/).filter(Boolean).map(Number); return { r, g, b, a }; };
    const lum = ({ r, g, b }) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
    const over = (top, bottom) => ({ r: top.r * top.a + bottom.r * (1 - top.a), g: top.g * top.a + bottom.g * (1 - top.a), b: top.b * top.a + bottom.b * (1 - top.a), a: 1 });
    const bgOf = (el) => { const stack = []; for (let e = el; e; e = e.parentElement) { const s = getComputedStyle(e); if (s.backgroundImage !== "none" && !/gradient/.test(s.backgroundImage)) return { skip: "background image" }; const c = parse(s.backgroundColor); if (c && c.a > 0) { stack.push(c); if (c.a === 1) break; } } let base = { r: 255, g: 255, b: 255, a: 1 }; for (const c of stack.reverse()) base = over(c, base); return base; };
    const opacityOf = (el) => { let o = 1; for (let e = el; e; e = e.parentElement) o *= +getComputedStyle(e).opacity; return o; };
    const out = []; const seen = new Set();
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let n; (n = walker.nextNode()); ) {
      const t = n.textContent.trim(); if (!t) continue;
      const el = n.parentElement; if (!el || el.closest("script,style,noscript,[hidden],svg")) continue;
      const r = el.getBoundingClientRect(); if (!r.width || !r.height) continue;
      const s = getComputedStyle(el); if (s.visibility === "hidden" || el.closest("[aria-hidden='true']") && !el.closest("a,button")) { if (el.closest(".sr-only")) continue; }
      if (el.closest(".sr-only")) continue;
      const bg = bgOf(el); if (bg.skip) { out.push({ text: t.slice(0, 30), skip: bg.skip }); continue; }
      const op = opacityOf(el); if (op < 0.05) continue; // not visible in its current state (e.g. pop-in stickers before they appear)
      let fg = parse(s.color); fg = { ...fg, a: fg.a * op };
      const eff = over(fg, bg);
      const l1 = lum(eff), l2 = lum(bg); const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
      const size = parseFloat(s.fontSize), bold = +s.fontWeight >= 700;
      const large = size >= 24 || (size >= 18.66 && bold);
      const need = large ? 3 : 4.5;
      const key = s.color + "|" + JSON.stringify(bg) + "|" + large;
      if (seen.has(key)) continue; seen.add(key);
      out.push({ text: t.slice(0, 34), ratio: +ratio.toFixed(2), need, large, size: Math.round(size), fg: s.color, bg: `rgb(${Math.round(bg.r)},${Math.round(bg.g)},${Math.round(bg.b)})`, tag: el.tagName.toLowerCase() + "." + String(el.className).split(" ")[0].slice(0, 24) });
    }
    return out;
  });
  const checked = contrast.filter((c) => c.ratio), skipped = contrast.filter((c) => c.skip);
  console.log(`contrast: ${checked.length} distinct text/background pairs checked, ${skipped.length} skipped (text over an image)`);
  checked.filter((c) => c.ratio < c.need).forEach((c) => fail(`contrast ${c.ratio}:1 < ${c.need}:1 "${c.text}" (${c.tag}, ${c.size}px, ${c.fg} on ${c.bg})`));
  console.log("  lowest ratios:", checked.sort((a, b) => a.ratio - b.ratio).slice(0, 4).map((c) => `${c.ratio}:1 (need ${c.need}) "${c.text}"`).join(" | "));
  skipped.forEach((c) => console.log(`  needs eyes: "${c.text}" sits on ${c.skip}`));

  // ---- 3. images, svgs, media, controls ----
  const inv = await page.evaluate(() => {
    const imgs = [...document.images].map((i) => ({ src: i.getAttribute("src")?.split("/").pop().slice(0, 40), alt: i.getAttribute("alt"), hidden: !!i.closest("[aria-hidden='true']") }));
    const svgsNoHide = [...document.querySelectorAll("svg")].filter((s) => s.getAttribute("aria-hidden") !== "true" && !s.getAttribute("aria-label") && !s.querySelector("title") && !s.closest("[aria-hidden='true']")).length;
    const unnamed = [...document.querySelectorAll("a,button,[role=tab],input,select,textarea,iframe,video")].filter((e) => { if (e.closest("[hidden],[aria-hidden='true']")) return false; const r = e.getBoundingClientRect(); if (!r.width) return false; const name = (e.getAttribute("aria-label") || e.getAttribute("title") || e.textContent || "").trim(); return !name && !e.querySelector("img[alt]:not([alt=''])"); }).map((e) => e.outerHTML.slice(0, 90));
    return { imgs, svgsNoHide, unnamed };
  });
  const noAlt = inv.imgs.filter((i) => i.alt === null), emptyAlt = inv.imgs.filter((i) => i.alt === "" && !i.hidden);
  console.log(`images: ${inv.imgs.length} total, ${noAlt.length} without an alt attribute, ${inv.imgs.filter((i) => i.alt).length} with text alt, ${inv.imgs.filter((i) => i.alt === "").length} decorative (empty alt)`);
  noAlt.forEach((i) => fail(`image without alt: ${i.src}`));
  emptyAlt.forEach((i) => console.log(`  review: empty alt on a visible, non-hidden image: ${i.src}`));
  if (inv.svgsNoHide) fail(`${inv.svgsNoHide} svg(s) are neither aria-hidden nor labelled`);
  inv.unnamed.forEach((h) => fail(`control with no accessible name: ${h}`));

  // ---- 4. keyboard-only walkthrough ----
  await page.close();
  const kp = await ctx.newPage();
  await kp.goto(URL, { waitUntil: "networkidle" });
  await kp.waitForTimeout(600);
  const stops = [];
  for (let i = 0; i < 400; i++) {
    await kp.keyboard.press("Tab");
    // let the smooth scroll that follows focus finish before measuring
    let prev = -1;
    for (let k = 0; k < 30; k++) { await kp.waitForTimeout(120); const y = await kp.evaluate(() => Math.round(scrollY)); if (y === prev) break; prev = y; }
    await kp.waitForTimeout(200);
    const s = await kp.evaluate(() => {
      const e = document.activeElement; if (!e || e === document.body) return null;
      const cs = getComputedStyle(e), r = e.getBoundingClientRect();
      const label = (e.getAttribute("aria-label") || e.textContent || e.getAttribute("alt") || e.tagName).trim().replace(/\s+/g, " ").slice(0, 38);
      const cx = Math.min(innerWidth - 1, Math.max(0, r.x + r.width / 2)), cy = Math.min(innerHeight - 1, Math.max(0, r.y + r.height / 2));
      const top = document.elementFromPoint(cx, cy);
      return { tag: e.tagName.toLowerCase(), role: e.getAttribute("role"), label, outline: `${cs.outlineStyle} ${cs.outlineWidth} ${cs.outlineColor}`, hasOutline: cs.outlineStyle !== "none" && parseFloat(cs.outlineWidth) >= 2, inView: r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth, covered: !(top === e || e.contains(top) || (top && top.contains(e))), id: e.id, hidden: !!e.closest("[hidden],[aria-hidden='true']") };
    });
    if (!s) { if (stops.length > 5) break; continue; }
    if (stops.length && stops.at(-1).label === s.label && stops.at(-1).tag === s.tag && i > 5 && stops.some((x) => x.label === s.label && x.first)) { }
    stops.push(s);
    if (stops.length > 8 && stops[0].label === s.label && stops[0].tag === s.tag) { stops.pop(); break; } // wrapped around
  }
  console.log(`keyboard: ${stops.length} Tab stops before the cycle repeats`);
  stops.filter((s) => !s.hasOutline).forEach((s) => fail(`no visible focus outline on <${s.tag}> "${s.label}" (${s.outline})`));
  stops.filter((s) => !s.inView).forEach((s) => fail(`focused element not scrolled into view: <${s.tag}> "${s.label}"`));
  stops.filter((s) => s.covered).forEach((s) => fail(`focused element is covered by something else (sticky bar?): <${s.tag}> "${s.label}"`));
  stops.filter((s) => s.hidden).forEach((s) => fail(`focus landed inside a hidden/aria-hidden region: <${s.tag}> "${s.label}"`));
  console.log("  order:", stops.map((s) => s.label.slice(0, 18)).join(" > ").slice(0, 900));

  // ---- 5. interactions by keyboard ----
  await kp.evaluate(() => { document.activeElement?.blur(); window.scrollTo(0, 0); });
  const order = kp.locator("header button:has-text('Order')");
  await order.focus(); await kp.keyboard.press("Enter"); await kp.waitForTimeout(150);
  const opened = await kp.locator("header a:has-text('Order on Swiggy')").isVisible();
  await kp.keyboard.press("Escape"); await kp.waitForTimeout(150);
  const closedBack = await kp.evaluate(() => /^Order/i.test(document.activeElement?.textContent?.trim() ?? ""));
  console.log(`Order now: Enter opens=${opened}, Esc closes and returns focus to the button=${closedBack}`);
  if (!opened || !closedBack) fail("Order now keyboard behaviour");
  if (opts.isMobile) {
    const burger = kp.locator("button[aria-label='Open menu']");
    await burger.focus(); await kp.keyboard.press("Enter"); await kp.waitForTimeout(500);
    const links = await kp.locator("#mobile-menu a").count();
    await kp.keyboard.press("Tab"); const inMenu = await kp.evaluate(() => !!document.activeElement.closest("#mobile-menu"));
    await kp.keyboard.press("Escape"); await kp.waitForTimeout(400);
    const back = await kp.evaluate(() => document.activeElement?.getAttribute("aria-label"));
    console.log(`mobile menu: opens with Enter (${links} links), Tab enters the panel=${inMenu}, Esc returns focus to "${back}"`);
    if (!links || !inMenu || !/menu/i.test(back || "")) fail("mobile menu keyboard behaviour");
  }
  await kp.evaluate(() => { document.documentElement.classList.add("cv-off"); document.getElementById("menu").scrollIntoView(); });
  await kp.waitForTimeout(500);
  const tab = kp.locator("[role=tab]").first();
  await tab.focus(); await kp.keyboard.press("ArrowRight"); await kp.keyboard.press("ArrowRight"); await kp.keyboard.press("End"); await kp.keyboard.press("Home");
  const sel = await kp.evaluate(() => ({ selected: document.querySelector("[role=tab][aria-selected=true]").textContent, panelsShown: [...document.querySelectorAll("[role=tabpanel]")].filter((p) => !p.hidden).length }));
  console.log(`menu tabs: arrows/Home/End work, selected "${sel.selected}", visible panels=${sel.panelsShown}`);
  if (sel.panelsShown !== 1 || !/Rolls/.test(sel.selected)) fail("menu tabs keyboard behaviour");
  await ctx.close();
}
console.log(failures ? `\n${failures} FAILURE(S)` : "\nALL CHECKS PASSED");
await browser.close();
process.exit(failures ? 1 : 0);
