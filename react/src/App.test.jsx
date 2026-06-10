import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'

import App from './App'

describe('React Todo 앱', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('빈 입력으로 추가하면 Todo를 만들지 않고 안내 메시지를 보여준다', async () => {
    const user = userEvent.setup()

    render(<App />)
    await user.click(screen.getByRole('button', { name: '추가' }))

    expect(screen.getByText('할 일을 입력해주세요.')).toBeInTheDocument()
    expect(screen.queryByRole('listitem', { name: /할 일 항목/ })).not.toBeInTheDocument()
  })

  it('Todo 생성, 수정, 완료, 삭제 흐름이 순서대로 동작한다', async () => {
    const user = userEvent.setup()

    render(<App />)
    await user.type(screen.getByLabelText('새 할 일'), 'React 테스트 공부')
    await user.click(screen.getByRole('button', { name: '추가' }))

    expect(screen.getByText('React 테스트 공부')).toBeInTheDocument()

    const item = screen.getByRole('listitem', { name: /React 테스트 공부/ })
    await user.click(within(item).getByRole('button', { name: '수정' }))
    await user.clear(within(item).getByLabelText('수정할 할 일'))
    await user.type(within(item).getByLabelText('수정할 할 일'), 'React Testing Library 공부')
    await user.click(within(item).getByRole('button', { name: '수정 완료' }))

    expect(screen.getByText('React Testing Library 공부')).toBeInTheDocument()

    const editedItem = screen.getByRole('listitem', { name: /React Testing Library 공부/ })
    await user.click(within(editedItem).getByRole('button', { name: '완료' }))

    expect(screen.getByText('React Testing Library 공부')).toHaveClass('line-through')

    await user.click(within(editedItem).getByRole('button', { name: '삭제' }))

    expect(screen.queryByText('React Testing Library 공부')).not.toBeInTheDocument()
  })

  it('필터 탭을 바꾼 뒤 새 Todo를 추가해도 필터 상태를 유지한다', async () => {
    const user = userEvent.setup()

    render(<App />)
    await user.type(screen.getByLabelText('새 할 일'), '진행 Todo')
    await user.click(screen.getByRole('button', { name: '추가' }))
    await user.click(screen.getByRole('button', { name: '완료' }))
    await user.click(screen.getByRole('tab', { name: '완료' }))

    expect(screen.getByRole('tab', { name: '완료' })).toHaveAttribute('aria-selected', 'true')

    await user.type(screen.getByLabelText('새 할 일'), '새 진행 Todo')
    await user.click(screen.getByRole('button', { name: '추가' }))

    expect(screen.getByRole('tab', { name: '완료' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.queryByText('새 진행 Todo')).not.toBeInTheDocument()
  })

  it('선택 날짜별로 Todo를 따로 보여주고 localStorage에 저장한다', async () => {
    const user = userEvent.setup()

    render(<App />)
    await user.type(screen.getByLabelText('새 할 일'), '오늘 Todo')
    await user.click(screen.getByRole('button', { name: '추가' }))
    await user.click(screen.getByRole('button', { name: '다음 날짜' }))
    await user.type(screen.getByLabelText('새 할 일'), '내일 Todo')
    await user.click(screen.getByRole('button', { name: '추가' }))

    expect(screen.getByText('내일 Todo')).toBeInTheDocument()
    expect(screen.queryByText('오늘 Todo')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '이전 날짜' }))

    expect(screen.getByText('오늘 Todo')).toBeInTheDocument()
    expect(screen.queryByText('내일 Todo')).not.toBeInTheDocument()
    expect(localStorage.getItem('react-todo-items')).toContain('오늘 Todo')
    expect(localStorage.getItem('react-todo-items')).toContain('내일 Todo')
  })
})
