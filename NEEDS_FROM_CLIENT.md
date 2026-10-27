# Needed from the client

## Photos and video
- **Interior + board game photos (priority).** The Vibe section currently has no real interior or board-game photo: a designed dice tile stands in for the games. We need: the dining area and seating, people playing board games, the game shelf, a family at a table, the counter with the freezing plates in action. Landscape and portrait, 2000 px or larger.
- **High-res product photos** (min 1200 px on the long side, ideally 2000 px):
  - Ice cream rolls, one clean shot per flavour (11 flavours). The old photos are 230–280 px wide, and several carry other accounts' watermarks (`@urwashi_17` on Butterscotch Caramel, `@myspicyfork` on Cheese Pineapple Cherry, an "Ice Cream Roll" logo on Snicker). These are not ours to reuse.
  - Waffle cones, shakes, momos, burgers and sandwiches, if the existing photos are not theirs.
  - Photos on a plain background (or with a few seconds spare) are easiest to cut out for the sticker look.
- **Vibe section photos.** The tiles currently use stills from the old About video (shop sign, interior table, rolls on the plate) and two old dessert photos. Replace with new shots.
- **New hero footage**: a 10–15 s clip of a roll being made (pour, chop, spread, roll, plate), **1080p or higher, shot both portrait (9:16) and landscape (16:9)**. The current hero is old, upscaled SD footage taken from the old site's About video, which is why it is tinted pink and inset on desktop.
- **Beverages**: photos and descriptions for Orange, Strawberry, Mojito, Lime & Lemon, Blueberry and Jeera, so the hidden category can be switched on.

## Photos removed (watermarked, need real replacements)
These three old-site photos carried another account's watermark or logo, so they have been deleted from the
site. Their menu cards show a "Photo coming soon" tile until real photos arrive:
- Cheese Pineapple Cherry (watermark "@myspicyfork")
- Butterscotch Caramel Popcorn (repost watermark "@urwashi_17")
- Snicker (corner logo "Ice Cream Roll")

## Copy for sign-off: "How rolls are made"
General description of the process shown in the cafe's own video. No temperatures, timings or ingredient
claims. Please confirm or correct each step (source: `src/data/steps.ts`).

1. **Pour & Chop**: "A creamy milk base is poured onto an ice-cold steel plate, then chopped and mixed with your flavour."
2. **Spread**: "It is spread paper-thin across the plate and the cold does the rest."
3. **Roll**: "Scraped into tight rolls, then finished with sauces and toppings, right in front of you."

Section intro line: "Three steps, done right in front of you."

## Offers (the spin-the-wheel is switched OFF until these are answered)
The "Feeling lucky?" banner and the wheel are hidden completely while `OFFERS_CONFIRMED` is `false` in
`src/data/offers.ts` (nothing is rendered, nothing is in the page HTML). Please decide:
1. **Is the wheel wanted at all, or only a plain offers banner?** (A banner would just list the current offer, no spinning.)
2. **Confirm each prize and its minimum order still stands.** These come from the 2023 site: 5% off at ₹399+, free mocktail at ₹349+, free scoop at ₹249+, free small fries at ₹399+, 10% off at ₹749+, ₹100 cashback at ₹999+, plus "better luck next time" and "spin again". Remove or change any that are not honoured.
3. **How will staff verify a win?** A win shows a short code (for example RO-4F7K) with the date and time. The code is random and made on the visitor's phone, so the site cannot check it is genuine. Staff need a simple rule, for example: write the code and time in a log book, accept one per phone per 2 hours, and check the time on the screen is recent while watching the screen live. If the cafe wants real verification (a code that cannot be faked), that needs a small back end and is a separate piece of work.
4. **Is "one win per 2 hours" right?** (`LOCK_HOURS`; it is remembered in the visitor's browser only, so it is easy to get around.)

## Facts to confirm
- **Opening hours** (`src/data/site.ts`, copied from the old site: Mon–Fri 11 AM–11 PM, Sat–Sun 10 AM–11 PM). Until `HOURS_CONFIRMED` is set to `true`, the "Open now" chip is hidden, the hours lists say "Hours may vary", and no opening hours go into the Google structured data.
- **Rating.** The site shows 4.2★ "on Google · 1,300+ reviews" (`rating` in `src/data/site.ts`), checked on 27 Oct 2026 against the Google Maps listing. The brief had said 4.3. Re-check before launch and confirm the "Read reviews on Google" link opens the right place (`maps.reviewsUrl`).
- **3–4 real reviews** (name, their words, optional stars and date) for `src/data/reviews.ts`. The cards stay hidden until there are some.
- **"Partner with us".** Is the old Ambassador / partner programme still running? The footer link (WhatsApp with a pre-filled message) shows a visible `[CONFIRM IF ACTIVE]` tag until `partner.active` is `true`.
- **Veg / non-veg corrections:** see `old-site/VEG_CHANGES.md`.
- **Google Analytics:** a GA4 measurement ID, set as `NEXT_PUBLIC_GA_ID` in Vercel (nothing loads without it).
- **Google Business Profile:** confirm the name, address, phone and hours there match the site exactly (this drives the map pack and the structured data).
