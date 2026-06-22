"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import type { Todo } from "@/app/lib/types";

type TodoListProps = {
  todos: Todo[];
};

export function TodoList({ todos }: TodoListProps) {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      setIsReady(true);
    }, 0);

    return () => window.clearTimeout(timerId);
  }, []);

  async function updateCompleted(todo: Todo) {
    await fetch(`/api/todos/${todo.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ completed: !todo.completed }),
    });
    router.refresh();
  }

  async function removeTodo(todoId: number) {
    await fetch(`/api/todos/${todoId}`, { method: "DELETE" });
    router.refresh();
  }

  if (todos.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-sm font-bold text-slate-500">
        표시할 Todo가 없습니다.
      </div>
    );
  }

  return (
    <ul className="grid gap-3" aria-live="polite">
      {todos.map((todo) => (
        <li
          key={todo.id}
          className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_auto] md:items-center"
          aria-label={`Todo 항목: ${todo.text}`}
        >
          <div className="grid gap-1">
            <span
              className={[
                "overflow-wrap-anywhere text-base font-bold",
                todo.completed ? "line-through text-slate-400" : "text-slate-950",
              ].join(" ")}
            >
              {todo.text}
            </span>
            <span className="text-xs font-semibold text-slate-500">{todo.date}</span>
          </div>

          <div className="flex flex-wrap gap-2 md:justify-end">
            <a
              className="rounded-md bg-slate-100 px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-500"
              href={`/todos/${todo.id}`}
            >
              수정
            </a>
            <button
              className="rounded-md bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-700 transition hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              type="button"
              disabled={!isReady}
              onClick={() => updateCompleted(todo)}
            >
              {todo.completed ? "되돌리기" : "완료"}
            </button>
            <button
              className="rounded-md bg-rose-50 px-3 py-2 text-sm font-bold text-rose-700 transition hover:bg-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
              type="button"
              disabled={!isReady}
              onClick={() => removeTodo(todo.id)}
            >
              삭제
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
