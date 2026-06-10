// 날짜 함수: 브라우저 로컬 시간 기준으로 오늘 날짜를 YYYY-MM-DD 문자열로 만듭니다.
export function getTodayDateKey() {
  return formatDateKey(new Date())
}

// 날짜 함수: Date 객체를 로컬 날짜 기준 YYYY-MM-DD 문자열로 바꿉니다.
export function formatDateKey(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

// 날짜 함수: YYYY-MM-DD 문자열을 로컬 Date 객체로 되돌립니다.
export function parseDateKey(dateKey) {
  const [year, month, day] = dateKey.split('-').map(Number)

  return new Date(year, month - 1, day)
}

// 날짜 함수: 선택 날짜에서 원하는 일수만큼 이동한 날짜 키를 만듭니다.
export function addDaysToDate(dateKey, dayCount) {
  const date = parseDateKey(dateKey)
  date.setDate(date.getDate() + dayCount)

  return formatDateKey(date)
}

// 날짜 함수: 선택 날짜가 속한 주의 월요일 날짜 키를 구합니다.
export function getMondayOfWeek(dateKey) {
  const date = parseDateKey(dateKey)
  const dayOfWeek = date.getDay()
  const distanceFromMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek

  date.setDate(date.getDate() + distanceFromMonday)

  return formatDateKey(date)
}

// 날짜 함수: 월요일부터 일요일까지 주간 뷰에 보여줄 7개의 날짜 키를 만듭니다.
export function getWeekDateKeys(weekStartDate) {
  return Array.from({ length: 7 }, (_, dayIndex) => addDaysToDate(weekStartDate, dayIndex))
}

// 날짜 표시 함수: 화면에 보여줄 한국어 날짜 문구를 만듭니다.
export function formatDateLabel(dateKey) {
  const date = parseDateKey(dateKey)
  const formatter = new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  })

  return formatter.format(date)
}

// 날짜 표시 함수: 주간 날짜 버튼에 보여줄 짧은 요일 이름을 만듭니다.
export function formatWeekdayName(dateKey) {
  const date = parseDateKey(dateKey)
  const formatter = new Intl.DateTimeFormat('ko-KR', { weekday: 'short' })

  return formatter.format(date)
}
