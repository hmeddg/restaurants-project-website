export const siteConfig = {
  name: "elever",
  url: "http://localhost:3000",
  description:
    "elever is a warm restaurant for signature dishes like seared steak, fettuccine Alfredo and Caesar salad. Reserve a table and make tonight memorable.",
  statement:
    "A place for good food, long conversations, and moments worth remembering.",
  email: "elever.res@gmail.com",
  nav: [
    { label: "The Menu", href: "/menu" },
    { label: "Our Story", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  links: {
    menu: "/menu",
    about: "/about",
    contact: "/contact",
    reserve: "/#reservation",
    login: "/login",
    register: "/register",
  },
  social: {
    instagram: "https://www.instagram.com/",
  },
} as const;
