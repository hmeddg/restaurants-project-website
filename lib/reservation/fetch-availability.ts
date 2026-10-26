import type { Availability } from "@/types/api";

// Runs in the browser, so it checks the shape by hand instead of shipping zod.
function isSlot(value: unknown): value is Availability["slots"][number] {
  return (
    typeof value === "object" &&
    value !== null &&
    "time" in value &&
    typeof value.time === "string" &&
    "available" in value &&
    typeof value.available === "boolean"
  );
}

function isAvailability(value: unknown): value is Availability {
  return (
    typeof value === "object" &&
    value !== null &&
    "date" in value &&
    typeof value.date === "string" &&
    "guests" in value &&
    typeof value.guests === "number" &&
    "slots" in value &&
    Array.isArray(value.slots) &&
    value.slots.every(isSlot)
  );
}

export async function fetchAvailability(
  date: string,
  guests: number,
  signal: AbortSignal,
): Promise<Availability> {
  const params = new URLSearchParams({ date, guests: String(guests) });
  const response = await fetch(`/api/reservations/availability?${params}`, {
    signal,
  });
  const data: unknown = await response.json();
  if (!response.ok || !isAvailability(data)) {
    throw new Error("Availability request failed");
  }
  return data;
}
