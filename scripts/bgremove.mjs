// One-off tool (not a project dependency: it pulls ~300 MB of ONNX runtime). To use: npm i --no-save @imgly/background-removal-node
// Usage: node tools-bgremove.mjs <in-dir> <out-dir>   (run trim in Python: sharp clashes with imgly's libvips)
import { removeBackground } from "@imgly/background-removal-node";
import fs from "fs"; import path from "path";
const [inDir, outDir] = process.argv.slice(2);
for (const f of fs.readdirSync(inDir)) {
  const blob = await removeBackground(new Blob([fs.readFileSync(path.join(inDir, f))], { type: "image/png" }), { output: { format: "image/png" } });
  fs.writeFileSync(path.join(outDir, f), Buffer.from(await blob.arrayBuffer()));
  console.log("ok", f);
}
