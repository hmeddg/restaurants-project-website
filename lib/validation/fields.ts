import { z } from "zod";

export const nameField = z
  .string()
  .trim()
  .min(2, "Please enter your name.")
  .max(100, "Please keep your name under 100 characters.");

export const emailField = z
  .string()
  .trim()
  .max(254, "Please enter a shorter email address.")
  .pipe(z.email("Please enter a valid email address."));

const phonePattern = /^[+\d\s().-]+$/;

export const phoneField = z
  .string()
  .trim()
  .min(7, "Please enter a phone number we can reach you on.")
  .max(30, "Please enter a shorter phone number.")
  .regex(phonePattern, "Please enter a valid phone number.");

/** Empty input becomes undefined so the API receives no value at all. */
export function optional<T extends z.ZodType<unknown, string>>(field: T) {
  return z
    .string()
    .trim()
    .transform((value) => value || undefined)
    .pipe(field.optional());
}
