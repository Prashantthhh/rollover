// Bakes the print-style treatments into the hero video and poster with ffmpeg, so the browser does no extra work.
//   node scripts/bake-hero.mjs            writes public/video/hero-duotone.mp4, hero-halftone.mp4 and matching posters
// Source: source-assets/video/background.mp4 (the same three cuts used for the plain hero.mp4).
// duotone : greyscale mapped to maroon (shadows) and pink (highlights)
// halftone: greyscale thresholded against a 45-degree dot screen (dot size follows brightness), then the same two colours
import { execFileSync } from "child_process";
import sharp from "sharp";
import fs from "fs";

const MAROON = [52, 10, 27], PINK = [235, 53, 146];
const SRC = "source-assets/video/background.mp4";
const cuts = (w, h, fps) => `[0:v]split=3[a][b][c];[a]trim=8:9.3,setpts=PTS-STARTPTS[v1];[b]trim=3:5,setpts=PTS-STARTPTS[v2];[c]trim=13:15.5,setpts=PTS-STARTPTS[v3];[v1][v2][v3]concat=n=3:v=1:a=0,scale=${w}:${h},fps=${fps}`;
const lut = `lutrgb=r='${MAROON[0]}+val*${PINK[0] - MAROON[0]}/255':g='${MAROON[1]}+val*${PINK[1] - MAROON[1]}/255':b='${MAROON[2]}+val*${PINK[2] - MAROON[2]}/255'`;
// 45-degree dot screen. The halftone is rendered at 960x540 and 12 fps (a printed-flipbook feel) because a dot screen
// is the hardest thing for H.264 to compress: at 1280x720/24fps it came out at 6.9 MB, over the 2 MB limit.
const PERIOD = 7;
const K = (2 * Math.PI) / PERIOD;
const screen = `st(0,(X+Y)*0.7071*${K.toFixed(5)});st(1,(X-Y)*0.7071*${K.toFixed(5)});gt(lum(X,Y)/255,(cos(ld(0))+cos(ld(1)))/4+0.5)`;
const spec = { duotone: { w: 1280, h: 720, fps: 24, crf: 27 }, halftone: { w: 960, h: 540, fps: 12, crf: 31 } };
const chains = {
  duotone: `eq=contrast=1.3:brightness=0.05:saturation=0,format=gbrp,${lut},format=yuv420p`,
  halftone: `eq=contrast=1.45:brightness=0.04:saturation=0,gblur=sigma=0.8,format=gray,geq=lum='255*(${screen})',format=gbrp,${lut},format=yuv420p`,
};

for (const [name, chain] of Object.entries(chains)) {
  const out = `public/video/hero-${name}.mp4`;
  execFileSync("ffmpeg", ["-v", "error", "-y", "-i", SRC, "-filter_complex", `${cuts(spec[name].w, spec[name].h, spec[name].fps)}[o];[o]${chain}[f]`, "-map", "[f]", "-c:v", "libx264", "-crf", String(spec[name].crf), "-preset", "slow", "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-an", out]);
  execFileSync("ffmpeg", ["-v", "error", "-y", "-ss", "0.2", "-i", out, "-frames:v", "1", `public/video/_${name}.png`]);
  await sharp(`public/video/_${name}.png`).webp({ quality: 80 }).toFile(`public/video/hero-poster-${name}.webp`);
  await sharp(`public/video/_${name}.png`).resize({ width: 640 }).webp({ quality: 76 }).toFile(`public/video/hero-poster-${name}-sm.webp`);
  fs.unlinkSync(`public/video/_${name}.png`);
  console.log(name, Math.round(fs.statSync(out).size / 1024) + " KB");
}
