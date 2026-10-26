"use client";

import { formatSlotTime } from "@/lib/dates";
import { slotTimes } from "@/lib/reservation/constants";
import { cn } from "@/lib/utils";
import type { Availability } from "@/types/api";

type TimeSlotsProps = {
  slots: Availability["slots"] | null;
  loading: boolean;
  failed: boolean;
  onRetry: () => void;
  selected: string | null;
  onSelect: (time: string) => void;
  error?: string;
};

export function TimeSlots({
  slots,
  loading,
  failed,
  onRetry,
  selected,
  onSelect,
  error,
}: TimeSlotsProps) {
  const noneLeft = slots !== null && slots.every((slot) => !slot.available);

  return (
    <fieldset
      aria-busy={loading}
      aria-describedby={error ? "reserve-time-error" : undefined}
      className="min-w-0"
    >
      <legend className="text-xs font-medium text-ivory/70">Time</legend>

      {failed ? (
        <div role="alert" className="mt-2 text-sm leading-snug text-danger">
          We couldn&apos;t load available times.{" "}
          <button
            type="button"
            onClick={onRetry}
            className="font-medium text-gold underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          >
            Try again
          </button>
        </div>
      ) : (
        <div
          className={cn(
            "mt-2 flex flex-wrap gap-2 transition-opacity duration-200",
            loading && slots && "opacity-50",
          )}
        >
          {(slots ?? slotTimes.map((time) => ({ time, available: false }))).map(
            (slot) =>
              slots ? (
                <label
                  key={slot.time}
                  className="relative cursor-pointer before:absolute before:-inset-1 before:content-[''] has-disabled:cursor-not-allowed"
                >
                  <input
                    type="radio"
                    name="booking-time"
                    value={slot.time}
                    checked={selected === slot.time}
                    disabled={!slot.available || loading}
                    onChange={() => onSelect(slot.time)}
                    className="peer sr-only"
                  />
                  <span className="flex h-9 w-20.5 items-center justify-center rounded-full border border-ivory/20 text-xs font-medium text-ivory/90 peer-checked:border-gold peer-checked:bg-gold peer-checked:font-semibold peer-checked:text-deep peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-gold peer-disabled:border-ivory/8 peer-disabled:text-ivory/30 peer-disabled:line-through">
                    {formatSlotTime(slot.time)}
                    {!slot.available && (
                      <span className="sr-only">, unavailable</span>
                    )}
                  </span>
                </label>
              ) : (
                <span
                  key={slot.time}
                  aria-hidden="true"
                  className="h-9 w-20.5 rounded-full bg-ivory/8 motion-safe:animate-pulse"
                />
              ),
          )}
        </div>
      )}

      {noneLeft && !loading && !failed && (
        <p className="mt-2 text-[13px] leading-snug text-ivory/60">
          No times left on this date. Please choose another day.
        </p>
      )}
      {error && (
        <p id="reserve-time-error" className="mt-2 text-[13px] text-danger">
          {error}
        </p>
      )}
    </fieldset>
  );
}
