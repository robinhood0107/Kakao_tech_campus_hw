"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import type { Todo } from "@/app/lib/types";

type TodoFormProps = {
  mode: "create" | "edit";
  initialDate: string;
  todo?: Todo;
};

export function TodoForm({ mode, initialDate, todo }: TodoFormProps) {
  const router = useRouter();
  const [text, setText] = useState(todo?.text ?? "");
  const [date, setDate] = useState(todo?.date ?? initialDate);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      setIsReady(true);
    }, 0);

    return () => window.clearTimeout(timerId);
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextText = text.trim();

    if (!nextText) {
      setMessage("Todo 내용을 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    const response = await fetch(mode === "create" ? "/api/todos" : `/api/todos/${todo?.id}`, {
      method: mode === "create" ? "POST" : "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: nextText, date }),
    });

    setIsSubmitting(false);

    if (!response.ok) {
      setMessage("Todo 저장에 실패했습니다.");
      return;
    }

    router.push(`/todos?date=${date}`);
  }

  return (
    <form className="grid gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm" onSubmit={handleSubmit}>
      <div className="grid gap-2">
        <label className="text-sm font-bold text-slate-700" htmlFor="todo-text">
          Todo 내용
        </label>
        <input
          id="todo-text"
          className="rounded-md border border-slate-300 px-3 py-3 text-base text-slate-950 outline-none transition focus:border-slate-950 focus:ring-2 focus:ring-slate-200"
          type="text"
          value={text}
          onChange={(event) => setText(event.target.value)}
          autoComplete="off"
          disabled={!isReady || isSubmitting}
        />
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-bold text-slate-700" htmlFor="todo-form-date">
          날짜
        </label>
        <input
          id="todo-form-date"
          className="rounded-md border border-slate-300 px-3 py-3 text-base text-slate-950 outline-none transition focus:border-slate-950 focus:ring-2 focus:ring-slate-200"
          type="date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
          disabled={!isReady || isSubmitting}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          className="rounded-md bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
          type="submit"
          disabled={!isReady || isSubmitting}
        >
          {mode === "create" ? "저장" : "수정 완료"}
        </button>
        <button
          className="rounded-md bg-slate-100 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-200"
          type="button"
          onClick={() => router.push(`/todos?date=${date}`)}
          disabled={!isReady || isSubmitting}
        >
          취소
        </button>
      </div>

      <p className="min-h-5 text-sm font-bold text-rose-600" aria-live="polite">
        {message}
      </p>
    </form>
  );
}
