// Copy for "How rolls are made". General description of the process shown in the cafe's own video;
// no temperatures, timings or ingredient claims. [CONFIRM COPY] with the cafe before launch.
export const steps = [
  { id: "pour", title: "Pour & Chop", text: "A creamy milk base is poured onto an ice-cold steel plate, then chopped and mixed with your flavour." },
  { id: "spread", title: "Spread", text: "It is spread paper-thin across the plate and the cold does the rest." },
  { id: "roll", title: "Roll", text: "Scraped into tight rolls, then finished with sauces and toppings, right in front of you." },
] as const;

export type StepId = (typeof steps)[number]["id"];
