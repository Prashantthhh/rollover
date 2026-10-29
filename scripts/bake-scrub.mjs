// Cuts the "How it's made" scrub clip and its still frames from the cafe's own footage (source-assets/video/background.mp4).
//   node scripts/bake-scrub.mjs        needs ffmpeg on PATH and sharp
// Outputs (public/video/): how-scrub.mp4, how-{pour,spread,roll}.webp (stills: poster, and the reduced-motion figures).
//
// how-scrub.mp4 is ALL-INTRA (-g 1, no B-frames): every frame is a keyframe, so HowScrub.tsx can set video.currentTime
// to any frame while scrolling, forwards or backwards, without the decoder replaying a GOP. The price is size (about
// 2.4 MB for 5.1 s at 1280x720, crf 27); the clip only downloads when the section is near the viewport.
// Source span 10.36 s to 15.41 s (the shot before it ends at 10.33, so starting earlier puts a cake in frame 0) (one continuous take of the process, no cut to another shot):
//   10.3-12.6 pour & chop, 12.6-13.45 spread, 13.45-15.4 rolls on the tray, plating. HowScrub's CUTS match these.
import { execFileSync } from "child_process";
import sharp from "sharp";
import fs from "fs";

const SRC = "source-assets/video/background.mp4", V = "public/video";
const ff = (...a) => execFileSync("ffmpeg", ["-v", "error", "-y", ...a], { stdio: "inherit" });
ff("-ss", "10.36", "-t", "5.05", "-i", SRC, "-an", "-vf", "scale=1280:720,fps=30", "-c:v", "libx264", "-g", "1", "-bf", "0", "-crf", "27", "-preset", "slow", "-pix_fmt", "yuv420p", "-movflags", "+faststart", `${V}/how-scrub.mp4`);
for (const [name, t] of [["pour", 10.35], ["spread", 13.2], ["roll", 14.0]]) {
  ff("-ss", String(t), "-i", SRC, "-frames:v", "1", "-vf", "scale=1280:-1", `${V}/_${name}.png`);
  await sharp(`${V}/_${name}.png`).webp({ quality: 78 }).toFile(`${V}/how-${name}.webp`);
  fs.rmSync(`${V}/_${name}.png`);
}
