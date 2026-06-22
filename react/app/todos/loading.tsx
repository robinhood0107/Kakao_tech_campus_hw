export default function TodosLoading() {
  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 text-slate-950 sm:px-6">
      <section className="mx-auto grid w-full max-w-4xl gap-5">
        <div className="h-28 animate-pulse rounded-lg bg-white shadow-sm" />
        <div className="h-32 animate-pulse rounded-lg bg-white shadow-sm" />
        <div className="h-24 animate-pulse rounded-lg bg-white shadow-sm" />
      </section>
    </main>
  );
}
