"use server";

import { z } from "zod";
import { ApiError } from "@/lib/api/client";
import { createReservation } from "@/lib/api/reservations";
import {
  reservationSchema,
  type ReservationField,
} from "@/lib/reservation/schema";
import type { Reservation } from "@/types/api";

export type ReservationFormValues = Record<
  Exclude<ReservationField, "date" | "time" | "guests">,
  string
>;

export type ReservationFormState =
  | {
      ok: true;
      reservation: Pick<
        Reservation,
        "code" | "date" | "time" | "guests" | "name" | "occasion"
      >;
    }
  | {
      ok: false;
      error: string;
      fieldErrors?: Partial<Record<ReservationField, string[]>>;
      /** The chosen time was taken by someone else; availability must refresh. */
      slotTaken?: boolean;
      values: ReservationFormValues;
    }
  | null;

function readText(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

export async function submitReservation(
  _previous: ReservationFormState,
  formData: FormData,
): Promise<ReservationFormState> {
  const values: ReservationFormValues = {
    name: readText(formData, "name"),
    phone: readText(formData, "phone"),
    email: readText(formData, "email"),
    occasion: readText(formData, "occasion"),
  };

  // Honeypot: real visitors never see or fill this field.
  if (readText(formData, "website")) {
    return { ok: false, error: "Sorry, we couldn't book that table.", values };
  }

  const parsed = reservationSchema.safeParse({
    ...values,
    date: readText(formData, "date"),
    time: readText(formData, "time"),
    guests: readText(formData, "guests"),
  });
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please check the highlighted fields.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
      values,
    };
  }

  try {
    const reservation = await createReservation(parsed.data);
    return {
      ok: true,
      reservation: {
        code: reservation.code,
        date: reservation.date,
        time: reservation.time,
        guests: reservation.guests,
        name: reservation.name,
        occasion: reservation.occasion,
      },
    };
  } catch (error) {
    const status = error instanceof ApiError ? error.status : undefined;
    if (status === 409) {
      return {
        ok: false,
        error: "That time was just booked. Please choose another time.",
        fieldErrors: { time: ["That time is no longer available."] },
        slotTaken: true,
        values,
      };
    }
    console.error("Reservation failed", { status });
    return {
      ok: false,
      error:
        status === 429
          ? "Too many attempts in a short time. Please try again in a few minutes."
          : "Sorry, we couldn't book your table. Please try again or call us.",
      values,
    };
  }
}
