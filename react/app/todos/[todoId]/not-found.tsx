import Link from "next/link";

export default function TodoNotFound() {
  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 text-slate-950 sm:px-6">
      <section className="mx-auto grid w-full max-w-2xl gap-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-black text-slate-950">Todo를 찾을 수 없습니다</h1>
        <Link className="font-bold text-slate-700 hover:text-slate-950" href="/todos">
          Todo 목록으로 이동
        </Link>
      </section>
    </main>
  );
}
