// Calendar dates are plain "YYYY-MM-DD" strings. They are turned into UTC
// midnights only for arithmetic and formatting, so the visitor's own time zone
// can never shift a booking to the wrong day.

function toUtc(isoDate: string) {
  const [year = 0, month = 1, day = 1] = isoDate.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

function toIso(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function todayIn(timeZone: string, now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

export function addDays(isoDate: string, days: number) {
  const date = toUtc(isoDate);
  date.setUTCDate(date.getUTCDate() + days);
  return toIso(date);
}

/** "YYYY-MM" of the month that contains the date. */
export function monthOf(isoDate: string) {
  return isoDate.slice(0, 7);
}

export function addMonths(month: string, months: number) {
  const date = toUtc(`${month}-01`);
  date.setUTCMonth(date.getUTCMonth() + months);
  return toIso(date).slice(0, 7);
}

/** Weeks of a month, Monday first; days outside the month are null. */
export function monthGrid(month: string): (string | null)[][] {
  const first = toUtc(`${month}-01`);
  const leading = (first.getUTCDay() + 6) % 7;
  const cells: (string | null)[] = Array.from({ length: leading }, () => null);

  const cursor = new Date(first);
  while (toIso(cursor).startsWith(month)) {
    cells.push(toIso(cursor));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks: (string | null)[][] = [];
  for (let index = 0; index < cells.length; index += 7) {
    weeks.push(cells.slice(index, index + 7));
  }
  return weeks;
}

function format(isoDate: string, options: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    ...options,
  }).format(toUtc(isoDate));
}

/** "October 2026" */
export function formatMonth(month: string) {
  return format(`${month}-01`, { month: "long", year: "numeric" });
}

/** "Sat, Oct 17" */
export function formatShortDate(isoDate: string) {
  return format(isoDate, { weekday: "short", month: "short", day: "numeric" });
}

/** "Saturday, October 17, 2026" */
export function formatLongDate(isoDate: string) {
  return format(isoDate, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/** "19:00" → "7:00 PM" */
export function formatSlotTime(time: string) {
  const [hours = 0, minutes = 0] = time.split(":").map(Number);
  const suffix = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 || 12;
  return `${hour12}:${String(minutes).padStart(2, "0")} ${suffix}`;
}

/** Wall-clock time of an instant in the restaurant's time zone, e.g. "7:25 PM". */
export function formatTimeIn(timeZone: string, instant: string | Date) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(instant));
}

/** "Today, 5:25 PM", "Tomorrow, 5:25 PM" or "Sun, Nov 1, 4:25 PM". */
export function formatPickup(
  timeZone: string,
  instant: string,
  now = new Date(),
) {
  const day = todayIn(timeZone, new Date(instant));
  const today = todayIn(timeZone, now);
  const time = formatTimeIn(timeZone, instant);
  if (day === today) return `Today, ${time}`;
  if (day === addDays(today, 1)) return `Tomorrow, ${time}`;
  return `${formatShortDate(day)}, ${time}`;
}
