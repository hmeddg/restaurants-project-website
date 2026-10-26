import { connection } from "next/server";
import { BookingForm } from "@/components/sections/reserve/booking-form.client";
import { siteConfig } from "@/config/site";
import { ApiError } from "@/lib/api/client";
import { getAvailability } from "@/lib/api/reservations";
import { addDays, todayIn } from "@/lib/dates";
import { bookingWindowDays } from "@/lib/reservation/constants";

const defaultGuests = 2;

async function initialAvailability(today: string) {
  try {
    const todays = await getAvailability(today, defaultGuests);
    if (todays.slots.some((slot) => slot.available)) return todays;
    // Late in the evening every slot today has gone, so open on tomorrow.
    return await getAvailability(addDays(today, 1), defaultGuests);
  } catch (error) {
    console.error("Initial availability failed", {
      status: error instanceof ApiError ? error.status : "network",
    });
    return null;
  }
}

export async function BookingCard() {
  // "Today" depends on the request time, so this part renders per request.
  await connection();
  const today = todayIn(siteConfig.timeZone);
  const availability = await initialAvailability(today);

  return (
    <BookingForm
      today={today}
      maxDate={addDays(today, bookingWindowDays)}
      initialDate={availability?.date ?? today}
      initialAvailability={availability}
      menuHref={siteConfig.links.menu}
      phone={siteConfig.phone}
    />
  );
}
