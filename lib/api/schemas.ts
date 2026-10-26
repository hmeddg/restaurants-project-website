import "server-only";
import { z } from "zod";
import { menuCategories } from "@/lib/menu/categories";
import { occasions } from "@/lib/reservation/constants";

const isoDate = z.iso.date();

export const MenuItemSchema = z.object({
  id: z.string(),
  category: z.enum(menuCategories.map((category) => category.slug)),
  name: z.string(),
  description: z.string(),
  priceCents: z.number().int().nonnegative(),
  image: z.string().startsWith("/"),
  chefsPick: z.boolean(),
});

export const MenuItemListSchema = z.array(MenuItemSchema);

export const AvailabilitySchema = z.object({
  date: isoDate,
  guests: z.number().int(),
  slots: z.array(z.object({ time: z.string(), available: z.boolean() })),
});

export const ReservationSchema = z.object({
  id: z.string(),
  code: z.string(),
  status: z.literal("confirmed"),
  date: isoDate,
  time: z.string(),
  guests: z.number().int(),
  name: z.string(),
  occasion: z.enum(occasions).nullable(),
  createdAt: z.iso.datetime({ offset: true }),
});

export const OrderSchema = z.object({
  id: z.string(),
  number: z.number().int(),
  status: z.literal("received"),
  items: z.array(
    z.object({
      menuItemId: z.string(),
      name: z.string(),
      quantity: z.number().int(),
      unitPriceCents: z.number().int(),
      lineTotalCents: z.number().int(),
    }),
  ),
  totalCents: z.number().int(),
  name: z.string(),
  readyAt: z.iso.datetime({ offset: true }),
  createdAt: z.iso.datetime({ offset: true }),
});

export const ApiErrorDetailSchema = z.object({
  detail: z.object({
    code: z.string(),
    /** Ids the error refers to, e.g. menu items that are no longer available. */
    items: z.array(z.string()).optional(),
  }),
});
