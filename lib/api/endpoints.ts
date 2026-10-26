import "server-only";

export const endpoints = {
  contactMessages: "/contact-messages",
  menuItems: "/menu-items",
  orders: "/orders",
  reservations: "/reservations",
  availability: "/reservations/availability",
} as const;
