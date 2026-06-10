import { Check, RotateCcw, Save, Trash2, X, Pencil } from 'lucide-react'

// 항목 컴포넌트: 하나의 Todo를 보기 모드 또는 인라인 수정 모드로 보여줍니다.
export function TodoItem({
  todo,
  isEditing,
  editingText,
  onStartEdit,
  onChangeEditingText,
  onSaveEdit,
  onCancelEdit,
  onToggle,
  onDelete,
}) {
  return (
    <li
      className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-[1fr_auto] sm:items-center"
      aria-label={`할 일 항목: ${todo.text}`}
    >
      {isEditing ? (
        <div className="grid gap-2">
          <label className="sr-only" htmlFor={`edit-${todo.id}`}>
            수정할 할 일
          </label>
          <input
            id={`edit-${todo.id}`}
            className="rounded-md border border-violet-300 px-3 py-2 text-base text-slate-950 outline-none focus:ring-3 focus:ring-violet-100"
            value={editingText}
            onChange={(event) => onChangeEditingText(event.target.value)}
          />
          <span className="text-xs font-semibold text-violet-600">
            내용을 고친 뒤 수정 완료를 누르면 Todo 텍스트가 바뀝니다.
          </span>
        </div>
      ) : (
        <span
          className={[
            'overflow-wrap-anywhere text-base font-semibold',
            todo.completed ? 'line-through text-slate-400' : 'text-slate-950',
          ].join(' ')}
        >
          {todo.text}
        </span>
      )}

      <div className="flex flex-wrap gap-2 sm:justify-end">
        {isEditing ? (
          <>
            <button
              className="inline-flex items-center gap-1 rounded-md bg-violet-600 px-3 py-2 text-sm font-bold text-white hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500"
              type="button"
              onClick={() => onSaveEdit(todo.id)}
            >
              <Save aria-hidden="true" size={16} />
              수정 완료
            </button>
            <button
              className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-3 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400"
              type="button"
              onClick={onCancelEdit}
            >
              <X aria-hidden="true" size={16} />
              취소
            </button>
          </>
        ) : (
          <>
            <button
              className="inline-flex items-center gap-1 rounded-md bg-violet-50 px-3 py-2 text-sm font-bold text-violet-700 hover:bg-violet-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
              type="button"
              onClick={() => onStartEdit(todo)}
            >
              <Pencil aria-hidden="true" size={16} />
              수정
            </button>
            <button
              className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-700 hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              type="button"
              onClick={() => onToggle(todo.id)}
            >
              {todo.completed ? (
                <RotateCcw aria-hidden="true" size={16} />
              ) : (
                <Check aria-hidden="true" size={16} />
              )}
              {todo.completed ? '되돌리기' : '완료'}
            </button>
            <button
              className="inline-flex items-center gap-1 rounded-md bg-rose-50 px-3 py-2 text-sm font-bold text-rose-700 hover:bg-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
              type="button"
              onClick={() => onDelete(todo.id)}
            >
              <Trash2 aria-hidden="true" size={16} />
              삭제
            </button>
          </>
        )}
      </div>
    </li>
  )
}
