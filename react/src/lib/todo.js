// Todo 상수: 필터 값은 오타를 줄이기 위해 한 곳에서 관리합니다.
export const TODO_FILTERS = {
  all: 'all',
  active: 'active',
  completed: 'completed',
}

// Todo 생성 함수: 입력 텍스트와 선택 날짜를 하나의 Todo 객체로 묶습니다.
export function createTodo(text, date, options = {}) {
  return {
    id: options.id ?? createTodoId(),
    text,
    completed: false,
    date,
    createdAt: options.createdAt ?? new Date().toISOString(),
  }
}

// Todo 생성 함수: 새 Todo를 목록 앞에 추가하고 기존 배열은 직접 바꾸지 않습니다.
export function addTodo(todos, text, date, options = {}) {
  return [createTodo(text, date, options), ...todos]
}

// Todo 수정 함수: id가 일치하는 Todo의 text만 새 값으로 교체합니다.
export function updateTodoText(todos, todoId, updatedText) {
  return todos.map((todo) => (todo.id === todoId ? { ...todo, text: updatedText } : todo))
}

// Todo 완료 함수: completed 값을 true/false로 반전합니다.
export function toggleTodoCompleted(todos, todoId) {
  return todos.map((todo) =>
    todo.id === todoId ? { ...todo, completed: !todo.completed } : todo,
  )
}

// Todo 삭제 함수: id가 일치하지 않는 Todo만 남깁니다.
export function deleteTodo(todos, todoId) {
  return todos.filter((todo) => todo.id !== todoId)
}

// 파생 데이터 함수: 선택 날짜와 현재 필터에 맞는 Todo만 계산합니다.
export function filterTodos(todos, selectedDateKey, filter) {
  const todosByDate = todos.filter((todo) => todo.date === selectedDateKey)

  if (filter === TODO_FILTERS.active) {
    return todosByDate.filter((todo) => !todo.completed)
  }

  if (filter === TODO_FILTERS.completed) {
    return todosByDate.filter((todo) => todo.completed)
  }

  return todosByDate
}

// 파생 데이터 함수: 특정 날짜에 들어있는 Todo 개수를 계산합니다.
export function countTodosByDate(todos, dateKey) {
  return todos.filter((todo) => todo.date === dateKey).length
}

function createTodoId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}
