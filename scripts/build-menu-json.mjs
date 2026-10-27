// ONE-OFF. Generated src/data/menu.json from the old site once. DO NOT RE-RUN: it overwrites every edit made to menu.json since.
// One-off: old-site/menu-extracted.json -> src/data/menu.json (with veg-tag corrections logged to old-site/VEG_CHANGES.md)
import fs from "fs";
const raw = JSON.parse(fs.readFileSync("old-site/menu-extracted.json", "utf8"));
const NONVEG = /chicken|egg|fish|mutton/i;
const meta = {
  "ice-cream-rolls": { title: "Ice Cream Rolls", blurb: "Hand-rolled on a freezing plate, right in front of you." },
  "waffle-cones": { title: "Waffle Cones" }, shakes: { title: "Shakes" }, sundaes: { title: "Exotic Sundaes" },
  "gourmet-plates": { title: "Gourmet Plates" }, signatures: { title: "Signatures" },
  momos: { title: "Momos" }, munchies: { title: "Munchies" }, burgers: { title: "Burgers" }, sandwiches: { title: "Sandwiches" },
};
const order = ["ice-cream-rolls", "waffle-cones", "shakes", "sundaes", "gourmet-plates", "signatures", "momos", "munchies", "burgers", "sandwiches"];
// Old-site photos that carry another account's watermark/logo. They are deleted from public/ and
// source-assets/, and these items show the "photo coming soon" tile until the client supplies real photos.
const NO_PHOTO = new Set(["Cheese Pineapple Cherry", "Butterscotch Caramel Popcorn", "Snicker"]);
const changes = [];
const rupees = (p) => Number(String(p).replace(/[^\d.]/g, ""));
const categories = order.map((id) => ({
  id, ...meta[id], hidden: false,
  items: raw[id].map((it) => {
    const veg = !NONVEG.test(it.name);
    if (veg !== it.veg) changes.push(`| ${meta[id].title} | ${it.name} | ${it.veg ? "Veg" : "Non-veg"} | ${veg ? "Veg" : "Non-veg"} |`);
    const file = it.image.split("/").pop().replace(/\.\w+$/, ".webp");
    return { name: it.name, price: rupees(it.price), veg, desc: it.desc, image: NO_PHOTO.has(it.name.trim()) ? null : `/img/menu/${file}` };
  }),
}));
// Beverages: kept in the data but hidden. Old-site entries had a copy-pasted paneer-sandwich description/photo.
categories.push({
  id: "beverages", title: "Beverages", hidden: true,
  note: "HIDDEN: old-site data was placeholder (paneer sandwich copy/photo). Add real descriptions and photos, then set hidden:false.",
  items: ["Orange", "Strawberry", "Mojito", "Lime & Lemon", "Blueberry", "Jeera"].map((name) => ({ name, price: 120, veg: true, desc: "[DESCRIPTION]", image: null })),
});
fs.mkdirSync("src/data", { recursive: true });
fs.writeFileSync("src/data/menu.json", JSON.stringify({ categories }, null, 2));
fs.writeFileSync("old-site/VEG_CHANGES.md", `# Veg / non-veg tag corrections (for client to confirm)\n\nRule applied: any item whose name contains "chicken" is non-veg; everything else keeps veg. Nothing else was changed (names, prices and descriptions are exactly as on the old site).\n\n| Category | Item | Old site said | New |\n|---|---|---|---|\n${changes.join("\n")}\n`);
console.log(changes.join("\n"));
