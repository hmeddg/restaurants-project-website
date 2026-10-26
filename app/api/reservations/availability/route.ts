import type { NextRequest } from "next/server";
import { z } from "zod";
import { getAvailability } from "@/lib/api/reservations";
import { maxGuests, minGuests } from "@/lib/reservation/constants";

const querySchema = z.object({
  date: z.iso.date(),
  guests: z.coerce.number().int().min(minGuests).max(maxGuests),
});

// Proxies availability for the booking calendar so the API key stays on the server.
export async function GET(request: NextRequest) {
  const query = querySchema.safeParse(
    Object.fromEntries(request.nextUrl.searchParams),
  );
  if (!query.success) {
    return Response.json({ error: "invalid_query" }, { status: 400 });
  }

  try {
    const availability = await getAvailability(
      query.data.date,
      query.data.guests,
    );
    return Response.json(availability, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return Response.json({ error: "unavailable" }, { status: 502 });
  }
}
