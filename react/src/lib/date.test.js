import { describe, expect, it } from 'vitest'

import {
  addDaysToDate,
  formatDateKey,
  getMondayOfWeek,
  getWeekDateKeys,
  parseDateKey,
} from './date'

describe('날짜 함수', () => {
  it('Date 객체를 로컬 기준 YYYY-MM-DD 문자열로 바꾼다', () => {
    const date = new Date(2026, 5, 10)

    expect(formatDateKey(date)).toBe('2026-06-10')
  })

  it('YYYY-MM-DD 문자열을 로컬 Date 객체로 되돌린다', () => {
    const date = parseDateKey('2026-06-10')

    expect(date.getFullYear()).toBe(2026)
    expect(date.getMonth()).toBe(5)
    expect(date.getDate()).toBe(10)
  })

  it('선택 날짜에서 원하는 일수만큼 이동한다', () => {
    expect(addDaysToDate('2026-06-10', 1)).toBe('2026-06-11')
    expect(addDaysToDate('2026-06-10', -1)).toBe('2026-06-09')
  })

  it('선택 날짜가 속한 주의 월요일을 구한다', () => {
    expect(getMondayOfWeek('2026-06-10')).toBe('2026-06-08')
    expect(getMondayOfWeek('2026-06-14')).toBe('2026-06-08')
  })

  it('월요일부터 일요일까지 7개의 날짜 키를 만든다', () => {
    expect(getWeekDateKeys('2026-06-08')).toEqual([
      '2026-06-08',
      '2026-06-09',
      '2026-06-10',
      '2026-06-11',
      '2026-06-12',
      '2026-06-13',
      '2026-06-14',
    ])
  })
})
