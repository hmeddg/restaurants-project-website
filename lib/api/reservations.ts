import "server-only";
import { apiRequest } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import { AvailabilitySchema, ReservationSchema } from "@/lib/api/schemas";
import type { ReservationInput } from "@/lib/reservation/schema";

export async function getAvailability(date: string, guests: number) {
  const params = new URLSearchParams({ date, guests: String(guests) });
  return apiRequest(`${endpoints.availability}?${params}`, {
    schema: AvailabilitySchema,
    cache: "no-store",
  });
}

export async function createReservation(input: ReservationInput) {
  return apiRequest(endpoints.reservations, {
    method: "POST",
    body: input,
    schema: ReservationSchema,
    cache: "no-store",
  });
}
