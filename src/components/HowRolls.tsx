import SplitHeading from "./SplitHeading";
import StepsPinned from "./StepsPinned";
import StepsStacked from "./StepsStacked";

const Heading = () => (
  <>
    <p className="text-sm font-bold uppercase tracking-[0.14em] sm:text-base">How rolls are made</p>
    <SplitHeading text="Watch it get rolled" className="mt-2 font-display text-[3rem] leading-[1.02] sm:text-6xl lg:text-[4.2rem]" />
  </>
);

/** Desktop: pinned recipe card with a picture block that swaps as you scroll. Everywhere else (and with reduced motion): the strip, stacked. */
export default function HowRolls() {
  return (
    <section id="how" className="relative bg-cream">
      <StepsPinned heading={<Heading />} />
      <div className="steps-stacked-wrap mx-auto max-w-6xl px-4 py-16 lg:hidden">
        <Heading />
        <StepsStacked />
      </div>
    </section>
  );
}
