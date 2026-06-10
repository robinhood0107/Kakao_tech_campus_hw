import { describe, expect, it } from 'vitest'

import {
  addTodo,
  countTodosByDate,
  deleteTodo,
  filterTodos,
  toggleTodoCompleted,
  updateTodoText,
} from './todo'

const baseTodos = [
  {
    id: 'todo-1',
    text: 'React 상태 공부',
    completed: false,
    date: '2026-06-10',
    createdAt: '2026-06-10T00:00:00.000Z',
  },
  {
    id: 'todo-2',
    text: '완료된 Todo 복습',
    completed: true,
    date: '2026-06-10',
    createdAt: '2026-06-10T00:10:00.000Z',
  },
  {
    id: 'todo-3',
    text: '다른 날짜 Todo',
    completed: false,
    date: '2026-06-11',
    createdAt: '2026-06-11T00:00:00.000Z',
  },
]

describe('Todo 순수 함수', () => {
  it('현재 선택 날짜를 가진 Todo를 목록 앞에 추가한다', () => {
    const todos = addTodo(baseTodos, '새 Todo', '2026-06-12', {
      id: 'todo-new',
      createdAt: '2026-06-12T00:00:00.000Z',
    })

    expect(todos[0]).toEqual({
      id: 'todo-new',
      text: '새 Todo',
      completed: false,
      date: '2026-06-12',
      createdAt: '2026-06-12T00:00:00.000Z',
    })
    expect(baseTodos).toHaveLength(3)
  })

  it('id가 일치하는 Todo의 텍스트만 수정한다', () => {
    const todos = updateTodoText(baseTodos, 'todo-1', 'React useState 복습')

    expect(todos.find((todo) => todo.id === 'todo-1').text).toBe('React useState 복습')
    expect(todos.find((todo) => todo.id === 'todo-2').text).toBe('완료된 Todo 복습')
  })

  it('id가 일치하는 Todo의 완료 상태를 반전한다', () => {
    const todos = toggleTodoCompleted(baseTodos, 'todo-1')

    expect(todos.find((todo) => todo.id === 'todo-1').completed).toBe(true)
  })

  it('id가 일치하는 Todo를 삭제한다', () => {
    const todos = deleteTodo(baseTodos, 'todo-2')

    expect(todos.map((todo) => todo.id)).toEqual(['todo-1', 'todo-3'])
  })

  it('선택 날짜와 상태 필터를 함께 적용한다', () => {
    expect(filterTodos(baseTodos, '2026-06-10', 'all').map((todo) => todo.id)).toEqual([
      'todo-1',
      'todo-2',
    ])
    expect(filterTodos(baseTodos, '2026-06-10', 'active').map((todo) => todo.id)).toEqual([
      'todo-1',
    ])
    expect(filterTodos(baseTodos, '2026-06-10', 'completed').map((todo) => todo.id)).toEqual([
      'todo-2',
    ])
  })

  it('날짜별 Todo 개수를 계산한다', () => {
    expect(countTodosByDate(baseTodos, '2026-06-10')).toBe(2)
    expect(countTodosByDate(baseTodos, '2026-06-11')).toBe(1)
  })
})
