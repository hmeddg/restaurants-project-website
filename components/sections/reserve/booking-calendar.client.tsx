"use client";

import Image from "next/image";
import {
  addMonths,
  formatLongDate,
  formatMonth,
  monthGrid,
  monthOf,
} from "@/lib/dates";
import { cn } from "@/lib/utils";

const weekdays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

const arrowClass =
  "relative rounded-full before:absolute before:-inset-2 before:content-[''] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold disabled:cursor-not-allowed disabled:opacity-35";

type BookingCalendarProps = {
  month: string;
  onMonthChange: (month: string) => void;
  today: string;
  maxDate: string;
  selected: string;
  onSelect: (date: string) => void;
  error?: string;
};

export function BookingCalendar({
  month,
  onMonthChange,
  today,
  maxDate,
  selected,
  onSelect,
  error,
}: BookingCalendarProps) {
  const cells = monthGrid(month).flat();

  return (
    <fieldset
      className="w-full max-w-67.5 min-w-0"
      aria-describedby={error ? "reserve-date-error" : undefined}
    >
      <legend className="sr-only">Date</legend>
      <div className="flex items-center justify-between">
        <p
          aria-live="polite"
          className="font-serif text-[22px] leading-[1.21] font-semibold text-ivory"
        >
          {formatMonth(month)}
        </p>
        <div className="flex gap-1.5">
          <button
            type="button"
            aria-label="Previous month"
            disabled={month <= monthOf(today)}
            onClick={() => onMonthChange(addMonths(month, -1))}
            className={arrowClass}
          >
            <Image
              src="/images/reserve/calendar-prev.svg"
              alt=""
              width={28}
              height={28}
            />
          </button>
          <button
            type="button"
            aria-label="Next month"
            disabled={month >= monthOf(maxDate)}
            onClick={() => onMonthChange(addMonths(month, 1))}
            className={arrowClass}
          >
            <Image
              src="/images/reserve/calendar-next.svg"
              alt=""
              width={28}
              height={28}
            />
          </button>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="mt-3 grid grid-cols-7 gap-0.75 text-center text-[11px] leading-4.5 font-medium text-ivory/45"
      >
        {weekdays.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-7 gap-0.75">
        {cells.map((date, index) =>
          date ? (
            <label
              key={date}
              className="relative flex aspect-square w-full cursor-pointer has-disabled:cursor-not-allowed"
            >
              <input
                type="radio"
                name="booking-date"
                value={date}
                checked={selected === date}
                disabled={date < today || date > maxDate}
                onChange={() => onSelect(date)}
                aria-label={formatLongDate(date)}
                className="peer sr-only"
              />
              <span
                aria-hidden="true"
                className={cn(
                  "flex size-full items-center justify-center rounded-full text-[13px] font-medium text-ivory/90 peer-checked:bg-gold peer-checked:font-semibold peer-checked:text-deep peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-gold peer-disabled:text-ivory/25",
                  date === today && "border border-gold/60",
                )}
              >
                {Number(date.slice(8))}
              </span>
            </label>
          ) : (
            <span key={`empty-${index}`} aria-hidden="true" />
          ),
        )}
      </div>

      {error && (
        <p id="reserve-date-error" className="mt-2 text-[13px] text-danger">
          {error}
        </p>
      )}
    </fieldset>
  );
}
