"use client";

import { FormEvent, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { FILTER_LABELS, TODO_FILTERS } from "@/app/lib/query";
import type { TodoFilter, TodoQuery } from "@/app/lib/types";

type TodoControlsProps = {
  query: TodoQuery;
};

const filterValues = [TODO_FILTERS.all, TODO_FILTERS.active, TODO_FILTERS.completed];

export function TodoControls({ query }: TodoControlsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(query.search);
  const [date, setDate] = useState(query.date);
  const selectedFilterRef = useRef(query.filter);

  const currentParams = useMemo(() => new URLSearchParams(searchParams.toString()), [searchParams]);

  function setFilterParam(nextParams: URLSearchParams, filter: TodoFilter) {
    if (filter === TODO_FILTERS.all) {
      nextParams.delete("filter");
    } else {
      nextParams.set("filter", filter);
    }
  }

  function replaceParams(nextParams: URLSearchParams) {
    const queryString = nextParams.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  }

  function handleFilterChange(filter: TodoFilter) {
    const nextParams = new URLSearchParams(currentParams);
    selectedFilterRef.current = filter;

    setFilterParam(nextParams, filter);

    replaceParams(nextParams);
  }

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextParams = new URLSearchParams(currentParams);
    const nextSearch = search.trim();

    setFilterParam(nextParams, selectedFilterRef.current);

    if (nextSearch) {
      nextParams.set("search", nextSearch);
    } else {
      nextParams.delete("search");
    }

    replaceParams(nextParams);
  }

  function handleDateSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextParams = new URLSearchParams(currentParams);

    setFilterParam(nextParams, selectedFilterRef.current);

    if (date) {
      nextParams.set("date", date);
    } else {
      nextParams.delete("date");
    }

    replaceParams(nextParams);
  }

  return (
    <section className="grid gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Todo 상태 필터">
        {filterValues.map((filter) => {
          const isSelected = query.filter === filter;

          return (
            <button
              key={filter}
              className={[
                "rounded-md px-4 py-2 text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-slate-500",
                isSelected
                  ? "bg-slate-950 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200",
              ].join(" ")}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => handleFilterChange(filter)}
            >
              {FILTER_LABELS[filter]}
            </button>
          );
        })}
      </div>

      <div className="grid gap-3 md:grid-cols-[1fr_auto]">
        <form className="grid gap-2 sm:grid-cols-[1fr_auto]" onSubmit={handleSearchSubmit}>
          <label className="sr-only" htmlFor="todo-search">
            검색어
          </label>
          <input
            id="todo-search"
            className="min-w-0 rounded-md border border-slate-300 px-3 py-2 text-base text-slate-950 outline-none transition focus:border-slate-950 focus:ring-2 focus:ring-slate-200"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="검색어"
          />
          <button
            className="rounded-md bg-slate-950 px-4 py-2 text-sm font-bold text-white transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500"
            type="submit"
          >
            검색
          </button>
        </form>

        <form className="grid gap-2 sm:grid-cols-[auto_auto]" onSubmit={handleDateSubmit}>
          <label className="sr-only" htmlFor="todo-date">
            날짜
          </label>
          <input
            id="todo-date"
            className="rounded-md border border-slate-300 px-3 py-2 text-base text-slate-950 outline-none transition focus:border-slate-950 focus:ring-2 focus:ring-slate-200"
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
          <button
            className="rounded-md bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-500"
            type="submit"
          >
            날짜 적용
          </button>
        </form>
      </div>
    </section>
  );
}
