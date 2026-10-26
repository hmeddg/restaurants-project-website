import { describe, expect, it } from "vitest";
import {
  addDays,
  addMonths,
  formatPickup,
  formatShortDate,
  formatSlotTime,
  monthGrid,
  todayIn,
} from "@/lib/dates";

const timeZone = "America/New_York";

describe("date helpers", () => {
  it("lays out October 2026 starting on Thursday, Monday first", () => {
    const weeks = monthGrid("2026-10");

    expect(weeks[0]).toEqual([
      null,
      null,
      null,
      "2026-10-01",
      "2026-10-02",
      "2026-10-03",
      "2026-10-04",
    ]);
    expect(weeks.at(-1)?.slice(-2)).toEqual(["2026-10-31", null]);
    expect(weeks.every((week) => week.length === 7)).toBe(true);
  });

  it("crosses month and year boundaries", () => {
    expect(addDays("2026-12-30", 3)).toBe("2027-01-02");
    expect(addMonths("2026-12", 1)).toBe("2027-01");
    expect(addMonths("2026-01", -1)).toBe("2025-12");
  });

  it("uses the restaurant's date, not the visitor's", () => {
    // 02:00 UTC is still the previous evening in New York.
    expect(todayIn(timeZone, new Date("2026-10-27T02:00:00Z"))).toBe(
      "2026-10-26",
    );
  });

  it("formats dates and slot times like the design", () => {
    expect(formatShortDate("2026-10-17")).toBe("Sat, Oct 17");
    expect(formatSlotTime("19:00")).toBe("7:00 PM");
    expect(formatSlotTime("17:30")).toBe("5:30 PM");
  });

  it("names the pickup day relative to today", () => {
    const now = new Date("2026-10-26T15:00:00Z");

    expect(formatPickup(timeZone, "2026-10-26T21:25:00Z", now)).toBe(
      "Today, 5:25 PM",
    );
    expect(formatPickup(timeZone, "2026-10-27T21:25:00Z", now)).toBe(
      "Tomorrow, 5:25 PM",
    );
    expect(formatPickup(timeZone, "2026-11-01T21:25:00Z", now)).toBe(
      "Sun, Nov 1, 4:25 PM",
    );
  });
});
