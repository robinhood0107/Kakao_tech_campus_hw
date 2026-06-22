import { getTodayDateKey, isDateKey } from "./date";
import type { TodoFilter, TodoQuery } from "./types";

export const TODO_FILTERS = {
  all: "all",
  active: "active",
  completed: "completed",
} as const;

export const FILTER_LABELS: Record<TodoFilter, string> = {
  all: "전체",
  active: "진행",
  completed: "완료",
};

const FILTER_VALUES = new Set<string>(Object.values(TODO_FILTERS));

export function normalizeFilter(value: string | string[] | undefined): TodoFilter {
  const nextValue = Array.isArray(value) ? value[0] : value;

  if (nextValue && FILTER_VALUES.has(nextValue)) {
    return nextValue as TodoFilter;
  }

  return TODO_FILTERS.all;
}

export function normalizeSearch(value: string | string[] | undefined) {
  const nextValue = Array.isArray(value) ? value[0] : value;

  return nextValue?.trim() ?? "";
}

export function normalizeDate(value: string | string[] | undefined) {
  const nextValue = Array.isArray(value) ? value[0] : value;

  return isDateKey(nextValue) ? nextValue : getTodayDateKey();
}

export function buildTodosQueryString(query: Partial<TodoQuery>) {
  const params = new URLSearchParams();

  if (query.filter && query.filter !== TODO_FILTERS.all) {
    params.set("filter", query.filter);
  }

  if (query.search) {
    params.set("search", query.search);
  }

  if (query.date) {
    params.set("date", query.date);
  }

  const queryString = params.toString();

  return queryString ? `?${queryString}` : "";
}
