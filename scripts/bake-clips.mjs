// Cuts the photo-band video, the three "How rolls are made" step loops and the strip frames from the cafe's own footage
// (source-assets/video/background.mp4: no other account's marks in these shots). Needs ffmpeg on PATH and sharp.
//   node scripts/bake-clips.mjs
// Outputs (public/video/): band.mp4 + band-poster.webp, step-{pour,spread,roll}.mp4 + .webp posters.
// Outputs (public/img/strip/): frame-*.webp, cropped 4:5 stills from the same footage.
// Shot boundaries come from ffmpeg scene detection; all trims below sit inside or on whole shots.
import { execFileSync } from "child_process";
import fs from "fs";
import sharp from "sharp";

const SRC = "source-assets/video/background.mp4";
const V = "public/video", S = "public/img/strip";
fs.mkdirSync(V, { recursive: true });
fs.mkdirSync(S, { recursive: true });
const ff = (...a) => execFileSync("ffmpeg", ["-v", "error", "-y", ...a], { stdio: "inherit" });
const enc = (crf, maxrate) => ["-an", "-c:v", "libx264", "-preset", "slow", "-crf", String(crf), "-maxrate", maxrate, "-bufsize", "2M", "-pix_fmt", "yuv420p", "-movflags", "+faststart"];

/** Trim [a,b) of the source, slowed by `slow`, as a labelled filter-graph piece. */
const piece = (label, a, b, slow = 1) => `[0:v]trim=${a}:${b},setpts=(PTS-STARTPTS)*${slow}[${label}]`;

// ---- Photo band: chop, spread, roll, plate (10.33-15.5), a roll being pushed (3.27-4.73), sauce over a plate (8.07-8.5). ~7 s.
{
  const graph = [piece("a", 10.33, 15.5), piece("b", 3.27, 4.73), piece("c", 8.07, 8.5, 1.6), "[a][b][c]concat=n=3:v=1:a=0,scale=1280:720,fps=24[v]"].join(";");
  ff("-i", SRC, "-filter_complex", graph, "-map", "[v]", ...enc(27, "1500k"), `${V}/band.mp4`);
  ff("-ss", "2.2", "-i", `${V}/band.mp4`, "-frames:v", "1", `${V}/_band.png`);
  await sharp(`${V}/_band.png`).webp({ quality: 72 }).toFile(`${V}/band-poster.webp`);
  fs.rmSync(`${V}/_band.png`);
}

// ---- Step loops: 4:3, 640x480, muted, 2-3 s, slowed so the action is readable.
const crop43 = "crop=ih*4/3:ih,scale=640:480";
const steps = {
  // pour + chop: close-up of toppings and batter, then both staff chopping
  pour: `${piece("a", 11.47, 12.93, 1.6)};[a]${crop43},fps=24[v]`,
  // spread: scraper on the tray, played forward then back so it loops without a jump
  spread: `${piece("a", 13.0, 13.6, 2.4)};[a]${crop43},fps=24,split[f][g];[g]reverse[r];[f][r]concat=n=2:v=1:a=0[v]`,
  // roll: scraper pushes a roll, then the finished rolls on the tray
  roll: `${piece("a", 3.27, 3.8, 2.2)};${piece("b", 13.67, 14.13, 2.4)};[a][b]concat=n=2:v=1:a=0,${crop43},fps=24[v]`,
};
for (const [id, graph] of Object.entries(steps)) {
  ff("-i", SRC, "-filter_complex", graph, "-map", "[v]", ...enc(28, "600k"), `${V}/step-${id}.mp4`);
  ff("-ss", "0.5", "-i", `${V}/step-${id}.mp4`, "-frames:v", "1", `${V}/_${id}.png`);
  await sharp(`${V}/_${id}.png`).webp({ quality: 72 }).toFile(`${V}/step-${id}.webp`);
  fs.rmSync(`${V}/_${id}.png`);
}

// ---- Strip frames: 4:5 crops (x as a fraction of the 1920 frame, centre of the crop) from 1080p stills.
const frames = [
  { name: "plated-chips", t: 5.4, cx: 0.62 },
  { name: "lava-and-rolls", t: 8.2, cx: 0.4 },
  { name: "rolls-on-tray", t: 14.0, cx: 0.3 },
  { name: "plated-nuts", t: 14.9, cx: 0.55 },
  { name: "plating-banana", t: 4.6, cx: 0.5 },
];
for (const f of frames) {
  const png = `${S}/_${f.name}.png`;
  ff("-ss", String(f.t), "-i", SRC, "-frames:v", "1", png);
  const w = Math.round(1080 * 0.8), left = Math.max(0, Math.min(1920 - w, Math.round(f.cx * 1920 - w / 2)));
  const crop = sharp(png).extract({ left, top: 0, width: w, height: 1080 });
  await crop.clone().resize(448, 560).webp({ quality: 80 }).toFile(`${S}/frame-${f.name}.webp`);
  await crop.clone().resize(320, 400).webp({ quality: 78 }).toFile(`${S}/frame-${f.name}-sm.webp`); // the image loader serves -sm at <= 640 px
  fs.rmSync(png);
}
console.log("done");
