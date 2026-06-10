import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'

// 날짜 컴포넌트: 선택된 날짜와 하루 단위 이동 버튼을 보여줍니다.
export function DateNavigator({ dateLabel, isToday, onMoveDate }) {
  return (
    <section
      className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
      aria-label="날짜 선택"
    >
      <div className="flex items-center justify-between gap-3">
        <button
          className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
          type="button"
          onClick={() => onMoveDate(-1)}
        >
          <ChevronLeft aria-hidden="true" size={16} />
          이전 날짜
        </button>

        <div className="grid gap-1 text-center">
          <span className="inline-flex items-center justify-center gap-1 text-xs font-bold uppercase tracking-wide text-violet-600">
            <CalendarDays aria-hidden="true" size={15} />
            선택 날짜
          </span>
          <strong className="text-base font-bold text-slate-950 sm:text-lg">
            {isToday ? `${dateLabel} (오늘)` : dateLabel}
          </strong>
        </div>

        <button
          className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
          type="button"
          onClick={() => onMoveDate(1)}
        >
          다음 날짜
          <ChevronRight aria-hidden="true" size={16} />
        </button>
      </div>
    </section>
  )
}
