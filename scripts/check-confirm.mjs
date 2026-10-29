// Launch gate: no "[CONFIRM" marker may be on the built site.
//   node scripts/check-confirm.mjs        runs after `next build` (see package.json "build")
// Every placeholder that still needs the owner's sign-off is written as "[CONFIRM ...]" in the page text (hours, rating, a
// partner link that may not be live, the doodle slots' bestseller). This scans every built HTML file, including the inline
// structured data and the page payload, and:
//   - FAILS (exit 1) on a production build: VERCEL_ENV=production, or LAUNCH_CHECK=1 for any other CI/host;
//   - only WARNS on previews and local builds, so work in progress can still be reviewed.
// To clear it: confirm the fact, remove the marker (src/data/site.ts has HOURS_CONFIRMED, RATING_CONFIRMED and the partner
// flag), and rebuild.
import fs from "fs";
import path from "path";

const out = "out";
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
const hits = [];
for (const f of walk(out).filter((f) => f.endsWith(".html") || f.endsWith(".txt") || f.endsWith(".xml") || f.endsWith(".webmanifest"))) {
  const text = fs.readFileSync(f, "utf8");
  for (const m of text.matchAll(/\[CONFIRM[^\]<"]*\]?/gi)) hits.push([f.replace(/\\/g, "/"), m[0]]);
}

const strict = process.env.VERCEL_ENV === "production" || process.env.LAUNCH_CHECK === "1";
if (!hits.length) { console.log("check-confirm: no [CONFIRM markers on the built site."); process.exit(0); }

const byFile = new Map();
for (const [f, t] of hits) byFile.set(f, [...(byFile.get(f) ?? []), t]);
const lines = [...byFile].map(([f, ts]) => `  ${f}: ${[...new Set(ts)].map((t) => `"${t}"`).join(", ")} (${ts.length})`);
if (strict) {
  console.error(`check-confirm: FAILED. ${hits.length} "[CONFIRM" marker(s) are still on the page. Every one must be resolved before launch:\n${lines.join("\n")}`);
  process.exit(1);
}
console.warn(`check-confirm: warning, ${hits.length} "[CONFIRM" marker(s) on the page (this is a preview/local build; a production build would fail):\n${lines.join("\n")}`);
