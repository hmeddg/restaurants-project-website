"use client";

import { useActionState, useRef, useState } from "react";
import {
  submitReservation,
  type ReservationFormState,
} from "@/app/reserve/actions";
import { BookingCalendar } from "@/components/sections/reserve/booking-calendar.client";
import { TimeSlots } from "@/components/sections/reserve/time-slots.client";
import { ButtonLink } from "@/components/ui/button-link";
import { Field } from "@/components/ui/field";
import { inputClass } from "@/components/ui/field-styles";
import { PrimaryButton } from "@/components/ui/primary-button";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { SelectInput } from "@/components/ui/select-input";
import { SuccessPanel } from "@/components/ui/success-panel.client";
import {
  formatLongDate,
  formatShortDate,
  formatSlotTime,
  monthOf,
} from "@/lib/dates";
import {
  holdMinutes,
  maxGuests,
  minGuests,
  occasions,
} from "@/lib/reservation/constants";
import { fetchAvailability } from "@/lib/reservation/fetch-availability";
import type { ReservationField } from "@/lib/reservation/schema";
import { cn } from "@/lib/utils";
import type { Availability, Reservation } from "@/types/api";

type Confirmation = Pick<
  Reservation,
  "code" | "date" | "time" | "guests" | "name" | "occasion"
>;

type BookingFormProps = {
  today: string;
  maxDate: string;
  initialDate: string;
  initialAvailability: Availability | null;
  menuHref: string;
  phone: { display: string; href: string };
};

const defaultGuests = 2;

function guestLabel(count: number) {
  return `${count} ${count === 1 ? "guest" : "guests"}`;
}

export function BookingForm({
  today,
  maxDate,
  initialDate,
  initialAvailability,
  menuHref,
  phone,
}: BookingFormProps) {
  const [month, setMonth] = useState(monthOf(initialDate));
  const [date, setDate] = useState(initialDate);
  const [guests, setGuests] = useState(defaultGuests);
  const [time, setTime] = useState<string | null>(null);
  const [availability, setAvailability] = useState(initialAvailability);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(initialAvailability === null);
  const [confirmed, setConfirmed] = useState<Confirmation | null>(null);
  const requestRef = useRef<AbortController | null>(null);

  async function loadAvailability(nextDate: string, nextGuests: number) {
    requestRef.current?.abort();
    const controller = new AbortController();
    requestRef.current = controller;
    setLoading(true);
    setFailed(false);
    try {
      const result = await fetchAvailability(
        nextDate,
        nextGuests,
        controller.signal,
      );
      setAvailability(result);
      setTime((current) =>
        result.slots.some((slot) => slot.time === current && slot.available)
          ? current
          : null,
      );
    } catch {
      if (!controller.signal.aborted) setFailed(true);
    } finally {
      if (requestRef.current === controller) setLoading(false);
    }
  }

  const [state, formAction, pending] = useActionState(
    async (previous: ReservationFormState, formData: FormData) => {
      const result = await submitReservation(previous, formData);
      if (result?.ok) {
        setConfirmed(result.reservation);
        return null;
      }
      if (result?.slotTaken) {
        setTime(null);
        void loadAvailability(date, guests);
      }
      return result;
    },
    null,
  );

  const failedState = state?.ok === false ? state : undefined;
  const values = failedState?.values;

  function errorFor(field: ReservationField) {
    return failedState?.fieldErrors?.[field]?.[0];
  }

  function a11yProps(field: ReservationField) {
    const error = errorFor(field);
    return {
      id: `reserve-${field}`,
      name: field,
      "aria-invalid": error ? true : undefined,
      "aria-describedby": error ? `reserve-${field}-error` : undefined,
    };
  }

  function selectDate(nextDate: string) {
    setDate(nextDate);
    setTime(null);
    void loadAvailability(nextDate, guests);
  }

  function changeGuests(nextGuests: number) {
    setGuests(nextGuests);
    void loadAvailability(date, nextGuests);
  }

  function bookAnother() {
    setConfirmed(null);
    setTime(null);
    void loadAvailability(date, guests);
  }

  if (confirmed) {
    return (
      <SuccessPanel
        eyebrow="Reservation confirmed"
        title="Your table is booked."
        message={
          <p>
            Thank you, {confirmed.name}. We&apos;ll hold your table for{" "}
            {holdMinutes} minutes after your booking time. To change or cancel,
            call us on{" "}
            <a
              href={phone.href}
              className="text-gold underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              {phone.display}
            </a>
            .
          </p>
        }
        details={[
          { label: "Date", value: formatLongDate(confirmed.date) },
          { label: "Time", value: formatSlotTime(confirmed.time) },
          { label: "Guests", value: guestLabel(confirmed.guests) },
          ...(confirmed.occasion
            ? [{ label: "Occasion", value: confirmed.occasion }]
            : []),
          {
            label: "Confirmation",
            value: (
              <span className="font-sans text-lg font-semibold tracking-[1.5px] text-gold">
                {confirmed.code}
              </span>
            ),
          },
        ]}
      >
        <PrimaryButton type="button" onClick={bookAnother}>
          Book another table
        </PrimaryButton>
        <ButtonLink href={menuHref} variant="ghost">
          Explore the menu
        </ButtonLink>
      </SuccessPanel>
    );
  }

  const slots =
    availability && availability.date === date ? availability.slots : null;
  const summary = [
    formatShortDate(date),
    time ? formatSlotTime(time) : "Choose a time",
    guestLabel(guests),
  ].join(" · ");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-serif text-[2rem] leading-[1.21] font-semibold text-ivory">
          Your reservation
        </h2>
        <p className="mt-1.5 text-sm text-ivory/60">
          Pick a date, a time and your party size.
        </p>
      </div>

      <div className="@container">
        <div className="grid gap-8 @min-[34rem]:grid-cols-[16.875rem_minmax(0,1fr)]">
          <BookingCalendar
            month={month}
            onMonthChange={setMonth}
            today={today}
            maxDate={maxDate}
            selected={date}
            onSelect={selectDate}
            error={errorFor("date")}
          />

          <div className="flex min-w-0 flex-col gap-5">
            <div
              role="group"
              aria-labelledby="reserve-guests-label"
              className="flex flex-col gap-2"
            >
              <p
                id="reserve-guests-label"
                className="text-xs font-medium text-ivory/70"
              >
                Guests
              </p>
              <div className="flex h-13 items-center rounded-xl border border-ivory/14 bg-ivory/5 px-2.5">
                <QuantityStepper
                  value={guests}
                  min={minGuests}
                  max={maxGuests}
                  onChange={changeGuests}
                  decreaseLabel="Remove a guest"
                  increaseLabel="Add a guest"
                  tone="onDark"
                  className="w-full justify-between"
                >
                  {guestLabel(guests)}
                </QuantityStepper>
              </div>
              {guests === maxGuests && (
                <p className="text-[13px] leading-snug text-ivory/60">
                  For {maxGuests + 1} or more guests, please call us on{" "}
                  <a
                    href={phone.href}
                    className="text-gold underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                  >
                    {phone.display}
                  </a>
                  .
                </p>
              )}
            </div>

            <TimeSlots
              slots={slots}
              loading={loading}
              failed={failed}
              onRetry={() => void loadAvailability(date, guests)}
              selected={time}
              onSelect={setTime}
              error={errorFor("time")}
            />
          </div>
        </div>
      </div>

      <div aria-hidden="true" className="h-px bg-ivory/14" />

      <form action={formAction} className="flex flex-col gap-6">
        <p
          role="status"
          aria-live="polite"
          className="text-sm leading-snug text-danger empty:hidden"
        >
          {failedState?.error}
        </p>

        <input type="hidden" name="date" value={date} />
        <input type="hidden" name="time" value={time ?? ""} />
        <input type="hidden" name="guests" value={guests} />

        {/* Honeypot: hidden from people and assistive tech, filled only by bots. */}
        <div aria-hidden="true" className="sr-only">
          <label htmlFor="reserve-website">Website</label>
          <input
            id="reserve-website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 sm:gap-4">
          <Field id="reserve-name" label="Full name" error={errorFor("name")}>
            <input
              {...a11yProps("name")}
              type="text"
              autoComplete="name"
              required
              minLength={2}
              maxLength={100}
              placeholder="Jane Cooper"
              defaultValue={values?.name}
              className={cn(inputClass, "h-13")}
            />
          </Field>
          <Field id="reserve-phone" label="Phone" error={errorFor("phone")}>
            <input
              {...a11yProps("phone")}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              required
              minLength={7}
              maxLength={30}
              placeholder="+1 (000) 000-0000"
              defaultValue={values?.phone}
              className={cn(inputClass, "h-13")}
            />
          </Field>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 sm:gap-4">
          <Field id="reserve-email" label="Email" error={errorFor("email")}>
            <input
              {...a11yProps("email")}
              type="email"
              autoComplete="email"
              required
              maxLength={254}
              placeholder="you@example.com"
              defaultValue={values?.email}
              className={cn(inputClass, "h-13")}
            />
          </Field>
          <Field
            id="reserve-occasion"
            label="Occasion (optional)"
            error={errorFor("occasion")}
          >
            <SelectInput
              {...a11yProps("occasion")}
              defaultValue={values?.occasion ?? ""}
            >
              <option value="" className="bg-deep">
                Select an occasion
              </option>
              {occasions.map((occasion) => (
                <option key={occasion} value={occasion} className="bg-deep">
                  {occasion}
                </option>
              ))}
            </SelectInput>
          </Field>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-5">
          <div>
            <p className="text-[11px] font-semibold tracking-[1.54px] text-gold uppercase">
              Your booking
            </p>
            <p
              aria-live="polite"
              className="mt-1 font-serif text-xl leading-[1.21] font-semibold text-ivory"
            >
              {summary}
            </p>
          </div>
          <PrimaryButton disabled={pending}>
            {pending ? "Booking…" : "Confirm reservation"}
          </PrimaryButton>
        </div>
      </form>
    </div>
  );
}
