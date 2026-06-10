# React + Vite Todo 과제

1차 과제의 `todo-vanilla/` Todo 앱을 React 방식으로 옮긴 과제입니다. 핵심 목표는 DOM을 직접 찾고 수정하는 방식에서 벗어나, 상태를 바꾸면 화면이 다시 계산되어 그려지는 React 흐름을 익히는 것입니다.

## 실행 방법

```bash
npm install
npm run dev
```

- 개발 서버: `http://127.0.0.1:15173`
- 기본 Vite 포트 `5173`에서 1만을 올려 `15173`을 사용합니다.
- preview 서버는 기본 `4173`에서 1만을 올려 `14173`을 사용합니다.

## 구현 기능

- Todo 생성: 빈 입력은 저장하지 않고 안내 메시지를 보여줍니다.
- Todo 읽기: 선택한 날짜와 필터 상태에 맞는 Todo만 목록으로 보여줍니다.
- Todo 수정: `prompt()` 대신 `editingTodoId` 상태로 인라인 입력 UI를 켭니다.
- Todo 완료: 완료 상태를 토글하고 취소선으로 시각적으로 구분합니다.
- Todo 삭제: `filter()`로 해당 id만 제외한 새 배열을 만듭니다.
- 상태별 필터: 전체 / 진행 중 / 완료 탭을 `filter` 상태로 관리합니다.
- 일간 뷰: `selectedDateKey`에 맞는 Todo만 보여줍니다.
- 주간 뷰: 월요일 기준 7일을 표시하고 날짜별 Todo 개수를 보여줍니다.
- localStorage 저장: `useState(() => 초기값)`으로 처음 한 번 읽고, `useEffect([todos])`로 변경 때마다 저장합니다.
- Tailwind CSS: React 상태에 따라 `className`을 바꾸는 방식으로 UI 상태를 표현합니다.

## 상태 설계

```jsx
const [todos, setTodos] = useState(() => loadTodosFromStorage(window.localStorage, selectedDateKey))
const [filter, setFilter] = useState(TODO_FILTERS.all)
const [selectedDateKey, setSelectedDateKey] = useState(() => loadStringFromStorage(...))
const [weekStartDate, setWeekStartDate] = useState(() => loadStringFromStorage(...))
const [editingTodoId, setEditingTodoId] = useState(null)
const [editingText, setEditingText] = useState('')
```

여기서 중요한 점은 화면에 보이는 목록을 별도 state로 저장하지 않는 것입니다. 화면 목록은 `todos`, `filter`, `selectedDateKey`에서 계산한 파생 데이터입니다.

```jsx
const visibleTodos = filterTodos(todos, selectedDateKey, filter)
```

이렇게 두면 원본 데이터는 하나만 유지되고, 필터나 날짜가 바뀔 때 React가 다시 렌더링하면서 필요한 목록만 계산합니다.

## 테스트 방법

```bash
npm run lint
npm run test
npm run build
npm run test:e2e
```

- 단위 테스트: `src/lib/date.test.js`, `src/lib/todo.test.js`, `src/lib/storage.test.js`
- 컴포넌트 테스트: `src/App.test.jsx`
- E2E 테스트: `e2e/todo.spec.js`

테스트를 나눠서 작성한 이유는 검증하려는 대상이 다르기 때문입니다. 날짜 계산과 Todo 수정처럼 입력과 출력이 명확한 코드는 단위 테스트로 빠르게 확인합니다. 사용자가 입력하고 클릭하는 화면 흐름은 컴포넌트 테스트로 확인합니다. 브라우저에서 실제 dev server가 뜨고 localStorage가 유지되는 흐름은 E2E 테스트로 확인합니다.

## 자주 만나는 오류 메모

```jsx
{todos.map((todo) => (
  <TodoItem key={todo.id} todo={todo} />
))}
```

리스트 렌더링에는 `key`가 꼭 필요합니다. index를 쓰면 수정/삭제/정렬 때 React가 어떤 항목을 유지해야 하는지 헷갈릴 수 있으므로, Todo 생성 시 만든 고유한 `id`를 사용합니다.

```jsx
<button onClick={() => handleDeleteTodo(todo.id)}>삭제</button>
```

이벤트 핸들러에는 실행 결과가 아니라 함수를 넘깁니다. `onClick={handleDeleteTodo(todo.id)}`처럼 쓰면 렌더링 중에 함수가 바로 실행되어 상태 변경이 반복될 수 있습니다.

```jsx
useEffect(() => {
  saveTodosToStorage(window.localStorage, todos)
}, [todos])
```

저장 로직은 추가/수정/삭제 함수마다 직접 호출하지 않고, `todos`가 바뀔 때 한 곳에서 처리합니다. 그래서 저장 기준이 흩어지지 않습니다.

## GitHub 이슈 학습 기록

이 과제는 기능 부모 이슈와 개념 서브이슈로 나누어 기록합니다. 각 이슈는 한국어로 작성하고, 구현 이유, Vanilla JS와 React의 차이, 테스트 관점, 자주 만나는 오류를 함께 정리합니다.

- 부모 이슈: 기능 단위 구현 기록
- 서브이슈: `useState`, `useEffect`, `key`, 파생 데이터, 테스트 코드 같은 개념 설명
- 커밋 메시지: 관련 이슈를 `Refs #이슈번호`로 연결
- PR 본문: 최종 완료 이슈를 `Closes #이슈번호`로 연결
