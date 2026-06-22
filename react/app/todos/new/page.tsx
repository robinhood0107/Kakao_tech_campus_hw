import Link from "next/link";

import { TodoForm } from "@/app/components/TodoForm";
import { normalizeDate } from "@/app/lib/query";

type NewTodoPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function NewTodoPage({ searchParams }: NewTodoPageProps) {
  const params = await searchParams;
  const initialDate = normalizeDate(params.date);

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 text-slate-950 sm:px-6">
      <section className="mx-auto grid w-full max-w-2xl gap-5">
        <header className="grid gap-2">
          <Link className="text-sm font-bold text-slate-600 hover:text-slate-950" href="/todos">
            Todo 목록
          </Link>
          <h1 className="text-3xl font-black tracking-normal text-slate-950">새 Todo</h1>
        </header>
        <TodoForm mode="create" initialDate={initialDate} />
      </section>
    </main>
  );
}
