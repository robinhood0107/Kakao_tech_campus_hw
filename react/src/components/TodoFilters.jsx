import { TODO_FILTERS } from '../lib/todo'

const filters = [
  { value: TODO_FILTERS.all, label: '전체' },
  { value: TODO_FILTERS.active, label: '진행' },
  { value: TODO_FILTERS.completed, label: '완료' },
]

// 필터 컴포넌트: Todo 원본을 바꾸지 않고 화면에 보여줄 기준만 선택합니다.
export function TodoFilters({ currentFilter, onChangeFilter }) {
  return (
    <div className="flex gap-2" role="tablist" aria-label="할 일 필터">
      {filters.map((filter) => {
        const isSelected = currentFilter === filter.value

        return (
          <button
            key={filter.value}
            className={[
              'rounded-md px-3 py-2 text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-violet-500',
              isSelected
                ? 'bg-violet-600 text-white shadow-sm'
                : 'bg-violet-50 text-violet-700 hover:bg-violet-100',
            ].join(' ')}
            type="button"
            role="tab"
            aria-selected={isSelected}
            onClick={() => onChangeFilter(filter.value)}
          >
            {filter.label}
          </button>
        )
      })}
    </div>
  )
}
