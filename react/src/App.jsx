import { useEffect, useMemo, useState } from 'react'

import { DateNavigator } from './components/DateNavigator'
import { TodoFilters } from './components/TodoFilters'
import { TodoForm } from './components/TodoForm'
import { TodoList } from './components/TodoList'
import { WeekCalendar } from './components/WeekCalendar'
import {
  addDaysToDate,
  formatDateLabel,
  getMondayOfWeek,
  getTodayDateKey,
  getWeekDateKeys,
} from './lib/date'
import {
  SELECTED_DATE_STORAGE_KEY,
  WEEK_START_STORAGE_KEY,
  loadStringFromStorage,
  loadTodosFromStorage,
  saveStringToStorage,
  saveTodosToStorage,
} from './lib/storage'
import {
  TODO_FILTERS,
  addTodo,
  deleteTodo,
  filterTodos,
  toggleTodoCompleted,
  updateTodoText,
} from './lib/todo'

function App() {
  const todayDateKey = getTodayDateKey()

  // 상태 설명: 현재 사용자가 보고 있는 날짜입니다.
  const [selectedDateKey, setSelectedDateKey] = useState(() =>
    loadStringFromStorage(window.localStorage, SELECTED_DATE_STORAGE_KEY, todayDateKey),
  )

  // 상태 설명: 주간 뷰의 시작 날짜입니다. 월요일을 기준으로 저장합니다.
  const [weekStartDate, setWeekStartDate] = useState(() =>
    loadStringFromStorage(
      window.localStorage,
      WEEK_START_STORAGE_KEY,
      getMondayOfWeek(selectedDateKey),
    ),
  )

  // 상태 설명: Todo 원본 배열입니다. 화면 필터 결과는 이 값에서 계산합니다.
  const [todos, setTodos] = useState(() => loadTodosFromStorage(window.localStorage, selectedDateKey))

  // 상태 설명: 입력창, 필터, 수정 모드, 안내 메시지는 각각 독립된 화면 상태입니다.
  const [todoText, setTodoText] = useState('')
  const [filter, setFilter] = useState(TODO_FILTERS.all)
  const [editingTodoId, setEditingTodoId] = useState(null)
  const [editingText, setEditingText] = useState('')
  const [message, setMessage] = useState('')

  // 저장소 설명: todos가 바뀔 때마다 React가 자동으로 localStorage 저장을 실행합니다.
  useEffect(() => {
    saveTodosToStorage(window.localStorage, todos)
  }, [todos])

  useEffect(() => {
    saveStringToStorage(window.localStorage, SELECTED_DATE_STORAGE_KEY, selectedDateKey)
  }, [selectedDateKey])

  useEffect(() => {
    saveStringToStorage(window.localStorage, WEEK_START_STORAGE_KEY, weekStartDate)
  }, [weekStartDate])

  // 파생 데이터 설명: 화면에 보여줄 Todo 목록은 원본 todos와 현재 필터/날짜에서 계산합니다.
  const visibleTodos = useMemo(
    () => filterTodos(todos, selectedDateKey, filter),
    [todos, selectedDateKey, filter],
  )

  const weekDates = useMemo(() => getWeekDateKeys(weekStartDate), [weekStartDate])
  const remainingCount = todos.filter((todo) => todo.date === selectedDateKey && !todo.completed).length

  function handleSubmitTodo(event) {
    event.preventDefault()

    const nextText = todoText.trim()

    if (!nextText) {
      setMessage('할 일을 입력해주세요.')
      return
    }

    setTodos((currentTodos) => addTodo(currentTodos, nextText, selectedDateKey))
    setTodoText('')
    setMessage('')
  }

  function handleStartEdit(todo) {
    setEditingTodoId(todo.id)
    setEditingText(todo.text)
    setMessage('내용을 수정한 뒤 수정 완료 버튼을 눌러주세요.')
  }

  function handleSaveEdit(todoId) {
    const nextText = editingText.trim()

    if (!nextText) {
      setMessage('수정할 내용을 입력해주세요.')
      return
    }

    setTodos((currentTodos) => updateTodoText(currentTodos, todoId, nextText))
    setEditingTodoId(null)
    setEditingText('')
    setMessage('')
  }

  function handleCancelEdit() {
    setEditingTodoId(null)
    setEditingText('')
    setMessage('')
  }

  function handleToggleTodo(todoId) {
    setTodos((currentTodos) => toggleTodoCompleted(currentTodos, todoId))
  }

  function handleDeleteTodo(todoId) {
    setTodos((currentTodos) => deleteTodo(currentTodos, todoId))

    if (editingTodoId === todoId) {
      handleCancelEdit()
    }
  }

  function handleSelectDate(dateKey) {
    setSelectedDateKey(dateKey)
    setWeekStartDate(getMondayOfWeek(dateKey))
    handleCancelEdit()
  }

  function handleMoveDate(dayCount) {
    handleSelectDate(addDaysToDate(selectedDateKey, dayCount))
  }

  function handleMoveWeek(weekCount) {
    const nextWeekStartDate = addDaysToDate(weekStartDate, weekCount * 7)
    setWeekStartDate(nextWeekStartDate)
    setSelectedDateKey(nextWeekStartDate)
    handleCancelEdit()
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 text-slate-950 sm:px-6">
      <section className="mx-auto grid w-full max-w-4xl gap-5">
        <header className="grid gap-3 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-extrabold text-violet-600">React + Vite Todo</p>
          <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            오늘의 할 일
          </h1>
          <p className="max-w-2xl text-sm font-medium leading-6 text-slate-600">
            Vanilla JS에서 직접 DOM을 고치던 Todo 앱을 React 상태, 파생 데이터, useEffect 저장
            흐름으로 옮긴 과제 화면입니다.
          </p>
        </header>

        <DateNavigator
          dateLabel={formatDateLabel(selectedDateKey)}
          isToday={selectedDateKey === todayDateKey}
          onMoveDate={handleMoveDate}
        />

        <WeekCalendar
          weekDates={weekDates}
          selectedDateKey={selectedDateKey}
          todos={todos}
          onSelectDate={handleSelectDate}
          onMoveWeek={handleMoveWeek}
        />

        <section className="grid gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <TodoForm
            todoText={todoText}
            message={message}
            onChangeText={setTodoText}
            onSubmit={handleSubmitTodo}
          />

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <TodoFilters currentFilter={filter} onChangeFilter={setFilter} />
            <p className="text-sm font-bold text-slate-500">남은 할 일 {remainingCount}개</p>
          </div>

          <TodoList
            todos={visibleTodos}
            editingTodoId={editingTodoId}
            editingText={editingText}
            onStartEdit={handleStartEdit}
            onChangeEditingText={setEditingText}
            onSaveEdit={handleSaveEdit}
            onCancelEdit={handleCancelEdit}
            onToggle={handleToggleTodo}
            onDelete={handleDeleteTodo}
          />
        </section>
      </section>
    </main>
  )
}

export default App
