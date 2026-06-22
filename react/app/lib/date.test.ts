import { describe, expect, it } from "vitest";

import { addDaysToDate, formatDateKey, getTodayDateKey, isDateKey } from "./date";

describe("date helpers", () => {
  it("formats a local Date object as YYYY-MM-DD", () => {
    expect(formatDateKey(new Date(2026, 5, 22))).toBe("2026-06-22");
  });

  it("moves a date key by day count", () => {
    expect(addDaysToDate("2026-06-22", 1)).toBe("2026-06-23");
    expect(addDaysToDate("2026-06-22", -1)).toBe("2026-06-21");
  });

  it("checks whether a value is a YYYY-MM-DD date key", () => {
    expect(isDateKey("2026-06-22")).toBe(true);
    expect(isDateKey("2026-6-22")).toBe(false);
    expect(isDateKey("not-a-date")).toBe(false);
  });

  it("returns today as a date key", () => {
    expect(getTodayDateKey()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
