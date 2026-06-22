import Link from "next/link";

import { getTodos } from "@/app/actions";
import { TodoControls } from "@/app/components/TodoControls";
import { TodoList } from "@/app/components/TodoList";
import { normalizeDate, normalizeFilter, normalizeSearch } from "@/app/lib/query";

export const dynamic = "force-dynamic";

type TodosPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function TodosPage({ searchParams }: TodosPageProps) {
  const params = await searchParams;
  const query = {
    filter: normalizeFilter(params.filter),
    search: normalizeSearch(params.search),
    date: normalizeDate(params.date),
  };
  const todos = await getTodos(query);

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 text-slate-950 sm:px-6">
      <section className="mx-auto grid w-full max-w-4xl gap-5">
        <header className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="grid gap-1">
            <h1 className="text-3xl font-black tracking-normal text-slate-950 sm:text-4xl">
              Next.js Todo
            </h1>
            <p className="text-sm font-semibold text-slate-500">{query.date}</p>
          </div>
          <Link
            className="inline-flex items-center justify-center rounded-md bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500"
            href={`/todos/new?date=${query.date}`}
          >
            새 Todo
          </Link>
        </header>

        <TodoControls key={`${query.filter}-${query.search}-${query.date}`} query={query} />
        <TodoList todos={todos} />
      </section>
    </main>
  );
}
