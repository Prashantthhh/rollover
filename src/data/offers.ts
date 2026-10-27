// Prizes and rules carried over from the old site's spin-the-wheel (components/SpinningWheel).
// [CONFIRM OFFERS ACTIVE] They date from 2023. Edit, remove or add prizes here; the wheel adapts.
// Every prize with a minimum order is claimed by showing the result screen at the counter.
/**
 * Master switch for the spin-the-wheel. While false, the "Feeling lucky?" banner and the sheet are not rendered
 * at all (not in the HTML, no JavaScript on the page). Flip to true only after the cafe has confirmed every prize
 * and minimum order below, and how staff will check a win.
 */
export const OFFERS_CONFIRMED = false;

export type Prize = {
  id: string;
  label: string[]; // wheel label, one string per line
  title: string; // result headline
  minOrder?: number; // rupees
  spinAgain?: boolean;
};

export const prizes: Prize[] = [
  { id: "d5", label: ["5%", "off"], title: "5% off your bill", minOrder: 399 },
  { id: "mocktail", label: ["Free", "mocktail"], title: "A free mocktail", minOrder: 349 },
  { id: "luck", label: ["Better", "luck next", "time"], title: "Better luck next time" },
  { id: "scoop", label: ["Free", "scoop"], title: "A free scoop of ice cream", minOrder: 249 },
  { id: "fries", label: ["Free small", "fries"], title: "Free small fries", minOrder: 399 },
  { id: "d10", label: ["10%", "off"], title: "10% off your bill", minOrder: 749 },
  { id: "cash", label: ["₹100", "cashback"], title: "₹100 cashback", minOrder: 999 },
  { id: "again", label: ["Spin", "again"], title: "Spin again!", spinAgain: true },
];

export const LOCK_HOURS = 2; // after a win, the wheel waits this long before offering another spin
