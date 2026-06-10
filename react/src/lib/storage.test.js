import { describe, expect, it } from 'vitest'

import { loadTodosFromStorage, saveTodosToStorage } from './storage'

function createStorage(initialValues = {}) {
  const store = new Map(Object.entries(initialValues))

  return {
    getItem(key) {
      return store.has(key) ? store.get(key) : null
    },
    setItem(key, value) {
      store.set(key, value)
    },
  }
}

describe('localStorage 저장소 함수', () => {
  it('저장된 JSON 배열을 Todo 배열로 복원한다', () => {
    const storage = createStorage({
      'react-todo-items': JSON.stringify([
        { id: 'todo-1', text: '저장된 Todo', completed: false, date: '2026-06-10' },
      ]),
    })

    expect(loadTodosFromStorage(storage, '2026-06-10')).toEqual([
      {
        id: 'todo-1',
        text: '저장된 Todo',
        completed: false,
        date: '2026-06-10',
        createdAt: '',
      },
    ])
  })

  it('잘못된 JSON이면 빈 배열로 복구한다', () => {
    const storage = createStorage({ 'react-todo-items': '{잘못된 JSON' })

    expect(loadTodosFromStorage(storage, '2026-06-10')).toEqual([])
  })

  it('date가 없는 예전 Todo는 현재 선택 날짜로 보정한다', () => {
    const storage = createStorage({
      'react-todo-items': JSON.stringify([{ id: 'todo-1', text: '예전 Todo', completed: false }]),
    })

    expect(loadTodosFromStorage(storage, '2026-06-10')[0].date).toBe('2026-06-10')
  })

  it('Todo 배열을 JSON 문자열로 저장한다', () => {
    const storage = createStorage()

    saveTodosToStorage(storage, [{ id: 'todo-1', text: '저장', completed: false }])

    expect(storage.getItem('react-todo-items')).toBe(
      JSON.stringify([{ id: 'todo-1', text: '저장', completed: false }]),
    )
  })
})
