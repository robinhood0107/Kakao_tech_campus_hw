import { describe, expect, it } from "vitest";

import {
  TODO_FILTERS,
  buildTodosQueryString,
  normalizeFilter,
  normalizeSearch,
} from "./query";

describe("todo query helpers", () => {
  it("falls back to all for an unknown filter", () => {
    expect(normalizeFilter("active")).toBe(TODO_FILTERS.active);
    expect(normalizeFilter("completed")).toBe(TODO_FILTERS.completed);
    expect(normalizeFilter("done")).toBe(TODO_FILTERS.all);
    expect(normalizeFilter(undefined)).toBe(TODO_FILTERS.all);
  });

  it("trims search text and omits empty search", () => {
    expect(normalizeSearch("  Next.js  ")).toBe("Next.js");
    expect(normalizeSearch("   ")).toBe("");
    expect(normalizeSearch(undefined)).toBe("");
  });

  it("builds a stable todos query string", () => {
    expect(
      buildTodosQueryString({
        filter: "completed",
        search: "FastAPI",
        date: "2026-06-22",
      }),
    ).toBe("?filter=completed&search=FastAPI&date=2026-06-22");
  });

  it("omits default or empty query values", () => {
    expect(buildTodosQueryString({ filter: "all", search: "", date: "" })).toBe("");
  });
});
