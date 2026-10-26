import "server-only";
import { apiRequest } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import { OrderSchema } from "@/lib/api/schemas";
import type { OrderInput } from "@/lib/order/schema";

export async function placeOrder(input: OrderInput) {
  return apiRequest(endpoints.orders, {
    method: "POST",
    body: input,
    schema: OrderSchema,
    cache: "no-store",
  });
}
