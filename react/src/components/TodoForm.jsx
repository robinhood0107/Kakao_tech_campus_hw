import { Plus } from 'lucide-react'

// 입력 컴포넌트: 새 Todo 텍스트를 입력받고 form submit으로 추가 이벤트를 전달합니다.
export function TodoForm({ todoText, message, onChangeText, onSubmit }) {
  return (
    <form className="grid gap-2 sm:grid-cols-[1fr_auto]" onSubmit={onSubmit}>
      <label className="sr-only" htmlFor="todo-input">
        새 할 일
      </label>
      <input
        id="todo-input"
        className="min-w-0 rounded-md border border-slate-300 bg-white px-4 py-3 text-base text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-3 focus:ring-violet-100"
        type="text"
        value={todoText}
        onChange={(event) => onChangeText(event.target.value)}
        placeholder="할 일을 입력하세요"
        autoComplete="off"
      />
      <button
        className="inline-flex items-center justify-center gap-2 rounded-md bg-violet-600 px-5 py-3 font-bold text-white transition hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500"
        type="submit"
      >
        <Plus aria-hidden="true" size={18} />
        추가
      </button>
      <p className="min-h-5 text-sm font-bold text-rose-600 sm:col-span-2" aria-live="polite">
        {message}
      </p>
    </form>
  )
}
