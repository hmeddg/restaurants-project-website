export const siteConfig = {
  name: "elever",
  url: "http://localhost:3000",
  description:
    "elever is a warm restaurant for signature dishes like seared steak, fettuccine Alfredo and Caesar salad. Reserve a table and make tonight memorable.",
  statement:
    "A place for good food, long conversations, and moments worth remembering.",
  email: "elever.res@gmail.com",
  // Must match TIMEZONE in backend/.env.
  timeZone: "America/New_York",
  phone: { display: "+1 (212) 555-0148", href: "tel:+12125550148" },
  address: {
    street: "214 Hudson Lane",
    locality: "New York",
    region: "NY",
    postalCode: "10013",
    country: "US",
  },
  hours: [
    { days: "Mon–Thu", time: "5 pm – 11 pm", schema: "Mo-Th 17:00-23:00" },
    { days: "Fri–Sat", time: "5 pm – 12 am", schema: "Fr-Sa 17:00-24:00" },
    { days: "Sun", time: "4 pm – 10 pm", schema: "Su 16:00-22:00" },
  ],
  nav: [
    { label: "The Menu", href: "/menu" },
    { label: "Our Story", href: "/our-story" },
    { label: "Contact", href: "/contact" },
  ],
  links: {
    menu: "/menu",
    about: "/our-story",
    contact: "/contact",
    reserve: "/reserve",
  },
  social: {
    instagram: "https://www.instagram.com/",
  },
} as const;
