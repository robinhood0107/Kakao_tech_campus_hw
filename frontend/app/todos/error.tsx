"use client";

export default function TodosError({ reset }: { reset: () => void }) {
  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 text-slate-950 sm:px-6">
      <section className="mx-auto grid w-full max-w-2xl gap-4 rounded-lg border border-rose-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-black text-slate-950">Todo를 불러오지 못했습니다</h1>
        <button
          className="w-fit rounded-md bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-700"
          type="button"
          onClick={reset}
        >
          다시 시도
        </button>
      </section>
    </main>
  );
}
