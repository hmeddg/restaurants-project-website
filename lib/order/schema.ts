import { z } from "zod";
import { maxLines, maxQuantity } from "@/lib/order/limits";
import {
  emailField,
  nameField,
  optional,
  phoneField,
} from "@/lib/validation/fields";

export const orderItemsSchema = z
  .array(
    z.object({
      menuItemId: z.string().min(1).max(64),
      quantity: z.number().int().min(1).max(maxQuantity),
    }),
  )
  .min(1, "Your order is empty.")
  .max(maxLines);

export const orderSchema = z.object({
  items: orderItemsSchema,
  name: nameField,
  phone: phoneField,
  email: optional(emailField),
  notes: optional(
    z.string().max(500, "Please keep notes under 500 characters."),
  ),
});

export type OrderInput = z.infer<typeof orderSchema>;
export type OrderField = keyof OrderInput;
