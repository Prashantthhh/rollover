// Stock placeholders (Pexels, free commercial licence; credits in credits/photo-sources.md).
// Downloads each photo into source-assets/stock/ (raw, not shipped), then writes the shipped webp files:
//  - menu items: public/img/menu/<name>.webp (720 square) + -sm.webp (480), same sizes as the other menu photos
//  - home slots:  public/img/savoury/<name>.webp (1400 wide, 4:3-ish crop kept loose) + -sm.webp
// A light warm grade (a touch warmer, slightly less saturated, fine grain) so they sit with the paper tones.
// Run: node scripts/process-stock.mjs
import sharp from "sharp"; import fs from "fs"; import path from "path";
const jobs = [
  { id: 5609525, out: "savoury/burgers", kind: "home" },
  { id: 18803174, out: "savoury/momos", kind: "home" },
  { id: 12946719, out: "savoury/munchies", kind: "home" },
  { id: 7729372, out: "savoury/sandwiches", kind: "home" },
  { id: 792024, out: "menu/munchies-chicken-cheese-balls", kind: "menu" },
  { id: 12635411, out: "menu/waffle-cones-american-nuts", kind: "menu" },
  { id: 6416553, out: "menu/beverages-orange", kind: "menu" },
  { id: 3615219, out: "menu/beverages-strawberry", kind: "menu" },
  { id: 4051212, out: "menu/beverages-mojito", kind: "menu" },
  { id: 6303519, out: "menu/beverages-lime-and-lemon", kind: "menu" },
  { id: 11135665, out: "menu/beverages-blueberry", kind: "menu" },
];
const grain = (w, h) => sharp({ create: { width: w, height: h, channels: 3, noise: { type: "gaussian", mean: 128, sigma: 14 } } }).greyscale().png().toBuffer();
for (const j of jobs) {
  const raw = `source-assets/stock/pexels-${j.id}.jpg`;
  if (!fs.existsSync(raw)) {
    const r = await fetch(`https://images.pexels.com/photos/${j.id}/pexels-photo-${j.id}.jpeg?auto=compress&cs=tinysrgb&w=1800`);
    if (!r.ok) throw new Error(`download failed ${j.id}: ${r.status}`);
    fs.writeFileSync(raw, Buffer.from(await r.arrayBuffer()));
  }
  for (const [suffix, size] of [["", j.kind === "home" ? 1400 : 720], ["-sm", j.kind === "home" ? 700 : 480]]) {
    const dest = `public/img/${j.out}${suffix}.webp`;
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    const base = sharp(raw).rotate().resize(size, size, { fit: "cover", position: "attention" }) // square crop; the Photo frame crops again for the wide slots
      .recomb([[1.04, 0, 0], [0, 1.0, 0], [0, 0, 0.95]]).modulate({ saturation: 0.94 });
    const buf = await base.toBuffer();
    const out = await sharp(buf).composite([{ input: await grain(size, size), blend: "soft-light" }]).webp({ quality: suffix ? 74 : 78 }).toBuffer();
    fs.writeFileSync(dest, out);
    console.log(dest, Math.round(out.length / 1024) + " KB");
  }
}
