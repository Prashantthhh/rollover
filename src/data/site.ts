// Single place for business facts. Edit here, not in components.

export const site = {
  name: "RollOver Warangal",
  tagline: "Ice creams, hand crafted",
  url: "https://rolloverwarangal.com",
  phone: "+91 86880 66805",
  phoneHref: "tel:+918688066805",
  whatsappHref: "https://wa.me/918688066805",
  address: {
    line: "1-1-3&4, V S M Complex, Chaitanyapuri Colony",
    locality: "Hanamkonda",
    region: "Telangana",
    postalCode: "506004",
  },
  // [CONFIRM HOURS] Taken from the old site footer (Mon–Fri 11am–11pm, Sat–Sun 10am–11pm).
  // The brief said "around 10 AM–11 PM, weekends maybe till midnight", so verify before launch.
  hours: [
    { days: "Mon–Fri", opens: "11:00", closes: "23:00" },
    { days: "Sat–Sun", opens: "10:00", closes: "23:00" },
  ],
  // Rating shown across the site. Checked against the Google Maps listing on 27 Oct 2026: 4.2 stars, about
  // 1,300 reviews (the brief had said 4.3). Re-check before launch. Change it here and everywhere follows.
  rating: { value: 4.2, label: "on Google · 1,300+ reviews" },
  order: {
    swiggy: "https://www.swiggy.com/restaurants/roll-over-opp-tara-gardens-prashanthnagar-colony-warangal-75960?sld=false",
    zomato: "https://www.zomato.com/warangal/roll-over-hanamakonda/order",
  },
  social: {
    instagram: "https://instagram.com/rolloverwarangal",
    facebook: "https://www.facebook.com/Rollovernitw/",
    youtube: "https://youtube.com/channel/UChySNfbzG3o5qI6tdlSasZA",
  },
  // Location. Coordinates and place id come from the Google Maps embed on the old site.
  geo: { lat: 17.990184585161202, lng: 79.53094107472351 },
  maps: {
    // [CONFIRM ON GOOGLE MAPS] The place link and reviews link are built from the place id in the old embed.
    placeUrl: "https://www.google.com/maps?cid=7251468792292519586",
    reviewsUrl: "https://www.google.com/maps?cid=7251468792292519586",
    directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=17.990184585161202,79.53094107472351",
    embedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3794.753870135992!2d79.53094107472351!3d17.990184585161202!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a334fc0d9dd43e9%3A0x64a26472586d2ea2!2sRollOver%20Warangal!5e0!3m2!1sen!2sin!4v1694512394133!5m2!1sen!2sin",
  },
  // "Partner with us" footer link. [CONFIRM IF ACTIVE]: the old site had an Ambassador programme page that was
  // not linked from its navigation. Set active:true (and fix the link) once the cafe confirms it still runs.
  partner: {
    label: "Partner with us",
    href: "https://wa.me/918688066805?text=Hi%20RollOver%2C%20I%27d%20like%20to%20partner%20with%20you",
    active: false,
  },
};

/**
 * Hours are copied from the old site's footer and have not been confirmed with the cafe.
 * While false: the "Open now" chip is hidden, the hours lists carry a "Hours may vary" note, and no
 * openingHoursSpecification is put into the structured data. Set to true once the cafe confirms src/data/site.ts hours.
 */
export const HOURS_CONFIRMED = false;
