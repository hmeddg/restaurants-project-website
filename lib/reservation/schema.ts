import { z } from "zod";
import {
  maxGuests,
  minGuests,
  occasions,
  slotTimes,
} from "@/lib/reservation/constants";
import {
  emailField,
  nameField,
  optional,
  phoneField,
} from "@/lib/validation/fields";

export const reservationSchema = z.object({
  date: z.iso.date("Please choose a date."),
  time: z.enum(slotTimes, "Please choose a time."),
  guests: z.coerce
    .number()
    .int()
    .min(minGuests)
    .max(maxGuests, `For ${maxGuests + 1} or more guests, please call us.`),
  name: nameField,
  phone: phoneField,
  email: emailField,
  occasion: optional(z.enum(occasions, "Please choose an occasion.")),
});

export type ReservationInput = z.infer<typeof reservationSchema>;
export type ReservationField = keyof ReservationInput;
