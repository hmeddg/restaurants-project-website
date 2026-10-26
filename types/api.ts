import type { z } from "zod";
import type {
  AvailabilitySchema,
  MenuItemSchema,
  OrderSchema,
  ReservationSchema,
} from "@/lib/api/schemas";

export type MenuItem = z.infer<typeof MenuItemSchema>;
export type Availability = z.infer<typeof AvailabilitySchema>;
export type Reservation = z.infer<typeof ReservationSchema>;
export type Order = z.infer<typeof OrderSchema>;
