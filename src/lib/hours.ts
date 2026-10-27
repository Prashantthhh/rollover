import { site } from "../data/site";

// [CONFIRM HOURS] Everything here reads site.hours (from the old site's footer). If the cafe's hours differ,
// change them in src/data/site.ts and this, the Visit section and the footer all follow.

type Slot = (typeof site.hours)[number];

/** "23:00" -> "11 PM", "10:30" -> "10:30 AM" */
export function to12h(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}${m ? ":" + String(m).padStart(2, "0") : ""} ${suffix}`;
}

/** Which slot applies on a given weekday (0 = Sunday ... 6 = Saturday). Slots are labelled "Mon–Fri", "Sat–Sun". */
export function slotFor(day: number): Slot {
  const weekend = day === 0 || day === 6;
  return (site.hours.find((h) => (weekend ? /sat|sun/i.test(h.days) : /mon|fri/i.test(h.days))) ?? site.hours[0]) as Slot;
}

/** Current Indian time, independent of the visitor's own time zone. */
export function nowInIndia(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata", weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)!.value;
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
  return { day, minutes: Number(get("hour")) * 60 + Number(get("minute")) };
}

const mins = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

export function openStatus(date = new Date()) {
  const { day, minutes } = nowInIndia(date);
  const today = slotFor(day);
  if (minutes >= mins(today.opens) && minutes < mins(today.closes)) return { open: true, text: `Open now, until ${to12h(today.closes)}` };
  if (minutes < mins(today.opens)) return { open: false, text: `Closed now, opens ${to12h(today.opens)}` };
  return { open: false, text: `Closed now, opens ${to12h(slotFor((day + 1) % 7).opens)} tomorrow` };
}
