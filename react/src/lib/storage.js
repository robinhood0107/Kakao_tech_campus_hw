export const TODO_STORAGE_KEY = 'react-todo-items'
export const SELECTED_DATE_STORAGE_KEY = 'react-selected-date'
export const WEEK_START_STORAGE_KEY = 'react-week-start-date'

// 저장소 함수: localStorage에서 Todo 목록을 읽고, 잘못된 데이터면 빈 배열로 복구합니다.
export function loadTodosFromStorage(storage = window.localStorage, fallbackDateKey) {
  const savedTodos = storage.getItem(TODO_STORAGE_KEY)

  if (!savedTodos) {
    return []
  }

  try {
    const parsedTodos = JSON.parse(savedTodos)

    if (!Array.isArray(parsedTodos)) {
      return []
    }

    return parsedTodos
      .filter((todo) => todo && typeof todo.text === 'string')
      .map((todo) => ({
        id: String(todo.id ?? ''),
        text: todo.text,
        completed: Boolean(todo.completed),
        date: todo.date || fallbackDateKey,
        createdAt: todo.createdAt || '',
      }))
      .filter((todo) => todo.id)
  } catch {
    return []
  }
}

// 저장소 함수: Todo 배열을 JSON 문자열로 바꿔 저장합니다.
export function saveTodosToStorage(storage = window.localStorage, todos) {
  storage.setItem(TODO_STORAGE_KEY, JSON.stringify(todos))
}

// 저장소 함수: 선택 날짜나 주간 시작일처럼 문자열 상태를 읽습니다.
export function loadStringFromStorage(storage = window.localStorage, key, fallbackValue) {
  return storage.getItem(key) || fallbackValue
}

// 저장소 함수: 선택 날짜나 주간 시작일처럼 문자열 상태를 저장합니다.
export function saveStringToStorage(storage = window.localStorage, key, value) {
  storage.setItem(key, value)
}
