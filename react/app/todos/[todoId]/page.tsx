import Link from "next/link";
import { notFound } from "next/navigation";

import { getTodo } from "@/app/actions";
import { TodoForm } from "@/app/components/TodoForm";

type EditTodoPageProps = {
  params: Promise<{
    todoId: string;
  }>;
};

export default async function EditTodoPage({ params }: EditTodoPageProps) {
  const { todoId } = await params;
  const parsedTodoId = Number(todoId);

  if (!Number.isInteger(parsedTodoId)) {
    notFound();
  }

  const todo = await getTodo(parsedTodoId).catch(() => null);

  if (!todo) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 text-slate-950 sm:px-6">
      <section className="mx-auto grid w-full max-w-2xl gap-5">
        <header className="grid gap-2">
          <Link
            className="text-sm font-bold text-slate-600 hover:text-slate-950"
            href={`/todos?date=${todo.date}`}
          >
            Todo 목록
          </Link>
          <h1 className="text-3xl font-black tracking-normal text-slate-950">Todo 수정</h1>
        </header>
        <TodoForm mode="edit" todo={todo} initialDate={todo.date} />
      </section>
    </main>
  );
}
