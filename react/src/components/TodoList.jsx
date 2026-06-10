import { TodoItem } from './TodoItem'

// 목록 컴포넌트: 필터와 날짜 계산이 끝난 Todo 배열을 화면에 렌더링합니다.
export function TodoList({
  todos,
  editingTodoId,
  editingText,
  onStartEdit,
  onChangeEditingText,
  onSaveEdit,
  onCancelEdit,
  onToggle,
  onDelete,
}) {
  if (todos.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-sm font-semibold text-slate-500">
        표시할 할 일이 없습니다.
      </div>
    )
  }

  return (
    <ul className="grid gap-3" aria-live="polite">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isEditing={editingTodoId === todo.id}
          editingText={editingText}
          onStartEdit={onStartEdit}
          onChangeEditingText={onChangeEditingText}
          onSaveEdit={onSaveEdit}
          onCancelEdit={onCancelEdit}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </ul>
  )
}
