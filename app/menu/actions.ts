"use server";

import { z } from "zod";
import { ApiError } from "@/lib/api/client";
import { placeOrder } from "@/lib/api/orders";
import { orderSchema, type OrderField } from "@/lib/order/schema";
import type { Order } from "@/types/api";

export type OrderFormValues = Record<Exclude<OrderField, "items">, string>;

export type OrderFormState =
  | {
      ok: true;
      order: Pick<Order, "number" | "totalCents" | "readyAt" | "name"> & {
        itemCount: number;
      };
    }
  | {
      ok: false;
      error: string;
      fieldErrors?: Partial<Record<OrderField, string[]>>;
      /** Dishes the API no longer sells; the client drops them from the cart. */
      unavailableItemIds?: string[];
      values: OrderFormValues;
    }
  | null;

function readText(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

function readItems(formData: FormData): unknown {
  try {
    return JSON.parse(readText(formData, "items"));
  } catch {
    return [];
  }
}

export async function submitOrder(
  _previous: OrderFormState,
  formData: FormData,
): Promise<OrderFormState> {
  const values: OrderFormValues = {
    name: readText(formData, "name"),
    phone: readText(formData, "phone"),
    email: readText(formData, "email"),
    notes: readText(formData, "notes"),
  };

  // Honeypot: real visitors never see or fill this field.
  if (readText(formData, "website")) {
    return { ok: false, error: "Sorry, we couldn't place that order.", values };
  }

  const parsed = orderSchema.safeParse({
    ...values,
    items: readItems(formData),
  });
  if (!parsed.success) {
    const fieldErrors = z.flattenError(parsed.error).fieldErrors;
    return {
      ok: false,
      error: fieldErrors.items
        ? "Your order is empty or could not be read. Please add your dishes again."
        : "Please check the highlighted fields.",
      fieldErrors,
      values,
    };
  }

  try {
    const order = await placeOrder(parsed.data);
    return {
      ok: true,
      order: {
        number: order.number,
        totalCents: order.totalCents,
        readyAt: order.readyAt,
        name: order.name,
        itemCount: order.items.reduce((sum, line) => sum + line.quantity, 0),
      },
    };
  } catch (error) {
    const apiError = error instanceof ApiError ? error : undefined;
    if (apiError?.code === "unknown_items") {
      return {
        ok: false,
        error:
          "Some dishes in your order are no longer available. Please review your order.",
        unavailableItemIds: apiError.items ?? [],
        values,
      };
    }
    console.error("Order failed", { status: apiError?.status ?? "network" });
    return {
      ok: false,
      error:
        apiError?.status === 429
          ? "Too many orders in a short time. Please try again in a few minutes."
          : "Sorry, we couldn't place your order. Please try again or call us.",
      values,
    };
  }
}
