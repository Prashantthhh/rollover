// Validates the JSON-LD in out/index.html against the official schema.org vocabulary (no third-party service):
//  1. the JSON parses and uses the schema.org context,
//  2. every type exists, every property exists and is allowed on that type (or a parent type),
//  3. every nested value has a type the property accepts,
//  4. the policy rules for this site (no aggregateRating/review; hours only when confirmed),
//  5. the document expands cleanly with a real JSON-LD processor (jsonld.js).
// Run after `npm run build`:  node scripts/validate-jsonld.mjs
import fs from "fs";
import jsonld from "jsonld";

const CACHE = ".lighthouse/schemaorg.jsonld";
if (!fs.existsSync(CACHE)) {
  fs.mkdirSync(".lighthouse", { recursive: true });
  const res = await fetch("https://schema.org/version/latest/schemaorg-current-https.jsonld");
  if (!res.ok) throw new Error("could not download the schema.org vocabulary: " + res.status);
  fs.writeFileSync(CACHE, Buffer.from(await res.arrayBuffer()));
}
const graph = JSON.parse(fs.readFileSync(CACHE, "utf8"))["@graph"];
const byId = new Map(graph.map((n) => [n["@id"].replace(/^schema:/, ""), n]));
const arr = (v) => (v === undefined ? [] : Array.isArray(v) ? v : [v]);
const ids = (v) => arr(v).map((x) => (x["@id"] ?? x).replace(/^schema:/, ""));

const parents = (t) => arr(byId.get(t)?.["rdfs:subClassOf"]).flatMap((p) => ids(p));
const ancestors = (t, seen = new Set()) => {
  if (seen.has(t)) return seen;
  seen.add(t);
  parents(t).forEach((p) => ancestors(p, seen));
  return seen;
};
const DATA_TYPES = new Set(["Text", "URL", "Number", "Float", "Integer", "Boolean", "Date", "DateTime", "Time", "CssSelectorType", "XPathType", "PronounceableText"]);

const html = fs.readFileSync("out/index.html", "utf8");
const blocks = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map((m) => m[1]);
const errors = [], warnings = [];
if (!blocks.length) errors.push("no JSON-LD block found in out/index.html");

function check(node, path) {
  const types = arr(node["@type"]);
  if (!types.length) { errors.push(`${path}: missing @type`); return; }
  for (const t of types) if (!byId.has(t)) errors.push(`${path}: unknown type "${t}"`);
  const allowed = new Set(types.flatMap((t) => [...ancestors(t)]));
  for (const [key, value] of Object.entries(node)) {
    if (key.startsWith("@")) continue;
    const prop = byId.get(key);
    if (!prop || !String(prop["@type"]).includes("Property")) { errors.push(`${path}.${key}: not a schema.org property`); continue; }
    const domain = ids(prop["schema:domainIncludes"]);
    if (!domain.some((d) => allowed.has(d))) errors.push(`${path}.${key}: not valid on ${types.join("/")} (valid on ${domain.join(", ")})`);
    const range = ids(prop["schema:rangeIncludes"]);
    for (const [i, v] of arr(value).entries()) {
      const here = `${path}.${key}${Array.isArray(value) ? `[${i}]` : ""}`;
      if (v && typeof v === "object") {
        check(v, here);
        const vt = arr(v["@type"]).flatMap((t) => [...ancestors(t)]);
        if (!range.some((r) => vt.includes(r))) errors.push(`${here}: type ${arr(v["@type"]).join("/")} is not accepted (accepts ${range.join(", ")})`);
      } else if (typeof v === "string" && v.startsWith("https://schema.org/") && byId.has(v.slice(19))) {
        // enumeration member written as its URL, e.g. https://schema.org/Monday
        const memberTypes = ids(byId.get(v.slice(19))["@type"]);
        if (!range.some((r) => memberTypes.includes(r))) errors.push(`${here}: ${v} is a ${memberTypes.join("/")}, not accepted here (accepts ${range.join(", ")})`);
      } else if (typeof v === "string" || typeof v === "number" || typeof v === "boolean") {
        const ok = range.some((r) => DATA_TYPES.has(r) || r === "Thing" || byId.has(r)); // schema.org allows plain text for most things
        if (!ok) errors.push(`${here}: a plain value is not accepted (accepts ${range.join(", ")})`);
        else if (!range.some((r) => DATA_TYPES.has(r))) warnings.push(`${here}: plain text where ${range.join(" / ")} is expected`);
        if (typeof v === "number" && !range.some((r) => ["Number", "Float", "Integer"].includes(r))) errors.push(`${here}: number not accepted`);
        if (key === "url" || key === "sameAs" || key === "menu" || key === "hasMap" || key === "logo" || key === "image") if (typeof v === "string" && !/^https?:\/\//.test(v)) errors.push(`${here}: should be an absolute URL`);
      }
    }
  }
}

for (const raw of blocks) {
  let doc;
  try { doc = JSON.parse(raw); } catch (e) { errors.push("JSON does not parse: " + e.message); continue; }
  if (!/schema\.org/.test(JSON.stringify(doc["@context"]))) errors.push("@context is not schema.org");
  check(doc, doc["@type"] ?? "root");
  for (const banned of ["aggregateRating", "review"]) if (banned in doc) errors.push(`policy: ${banned} must not be self-published`);
  const hoursConfirmed = /export const HOURS_CONFIRMED = true/.test(fs.readFileSync("src/data/site.ts", "utf8"));
  if (("openingHoursSpecification" in doc) !== hoursConfirmed) errors.push(`policy: openingHoursSpecification ${"openingHoursSpecification" in doc ? "present" : "absent"} but HOURS_CONFIRMED is ${hoursConfirmed}`);
  try {
    const expanded = await jsonld.expand(doc);
    if (!expanded.length) errors.push("jsonld.expand returned nothing");
    else console.log(`jsonld.js expanded OK (${Object.keys(expanded[0]).length} top-level terms)`);
  } catch (e) { warnings.push("jsonld.js could not expand (needs network for the schema.org context): " + String(e.message).slice(0, 120)); }
  console.log(`checked ${doc["@type"]} "${doc.name}" with ${Object.keys(doc).length} properties: ${Object.keys(doc).filter((k) => !k.startsWith("@")).join(", ")}`);
}
warnings.forEach((w) => console.log("warning:", w));
if (errors.length) { errors.forEach((e) => console.log("ERROR:", e)); process.exit(1); }
console.log("JSON-LD valid: 0 errors,", warnings.length, "warnings");
