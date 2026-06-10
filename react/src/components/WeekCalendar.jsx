import { ChevronLeft, ChevronRight } from 'lucide-react'

import { formatWeekdayName, getTodayDateKey } from '../lib/date'
import { countTodosByDate } from '../lib/todo'

// 주간 컴포넌트: 7일 날짜 버튼과 날짜별 Todo 개수를 보여줍니다.
export function WeekCalendar({ weekDates, selectedDateKey, todos, onSelectDate, onMoveWeek }) {
  const todayDateKey = getTodayDateKey()

  return (
    <section className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <button
          className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
          type="button"
          onClick={() => onMoveWeek(-1)}
        >
          <ChevronLeft aria-hidden="true" size={16} />
          이전 주
        </button>
        <h2 className="text-sm font-extrabold text-slate-700">주간 보기</h2>
        <button
          className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
          type="button"
          onClick={() => onMoveWeek(1)}
        >
          다음 주
          <ChevronRight aria-hidden="true" size={16} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-7" aria-label="주간 날짜 목록">
        {weekDates.map((dateKey) => {
          const isSelected = selectedDateKey === dateKey
          const isToday = todayDateKey === dateKey

          return (
            <button
              key={dateKey}
              className={[
                'grid min-h-20 gap-1 rounded-md border px-2 py-3 text-center transition focus:outline-none focus:ring-2 focus:ring-violet-500',
                isSelected
                  ? 'border-violet-600 bg-violet-600 text-white shadow-sm'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100',
                isToday && !isSelected ? 'border-violet-400' : '',
              ].join(' ')}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onSelectDate(dateKey)}
            >
              <span className="text-xs font-bold">{formatWeekdayName(dateKey)}</span>
              <strong className="text-lg">{dateKey.slice(-2)}</strong>
              <span className={isSelected ? 'text-xs font-bold text-white' : 'text-xs font-bold text-slate-500'}>
                {countTodosByDate(todos, dateKey)}개
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
