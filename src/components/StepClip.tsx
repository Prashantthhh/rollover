import type { StepId } from "../data/steps";
import LoopVideo from "./LoopVideo";

/** The real clip for a step (2-3 s loop from the cafe's own footage), filling its picture block. Plays only while on screen and `active`. */
export default function StepClip({ id, active = true }: { id: StepId; active?: boolean }) {
  return <LoopVideo src={`/video/step-${id}.mp4`} poster={`/video/step-${id}.webp`} active={active} className="h-full w-full border-[3px] border-maroon object-cover" />;
}
