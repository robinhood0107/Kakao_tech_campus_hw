# Next.js + FastAPI Todo 과제

2차 과제의 React/Vite Todo 앱을 Next.js App Router와 FastAPI 서버 구조로 다시 만든 3차 과제입니다. 핵심은 브라우저의 `localStorage`에 직접 저장하던 흐름을 FastAPI + SQLite API 흐름으로 옮기고, Next.js의 Server Component, Client Component, Route Handler, Server Action 역할을 구분해보는 것입니다.

## 실행 방법

### 백엔드

```bash
cd backend
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements.txt
cp .env.example .env.local
.venv/bin/python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

- API 서버: `http://127.0.0.1:8000`
- API 문서: `http://127.0.0.1:8000/docs`

### 프론트엔드

```bash
cd frontend
npm ci
cp .env.example .env.local
npm run dev
```

- Next.js 앱: `http://127.0.0.1:3000/todos`

## 구현 기능

- Todo 생성, 목록 조회, 수정, 완료 토글, 삭제
- `date` 기준 일간 Todo 조회
- `filter=all | active | completed` URL 파라미터 기반 상태 필터
- `search=키워드` URL 파라미터 기반 서버 검색
- `filter`, `search`, `date` 복합 조건 서버 조회
- FastAPI SQLite 저장으로 새로고침 후 데이터 유지
- Next.js `app/api/todos/route.ts` 프록시로 브라우저 요청과 FastAPI 서버 분리
- `app/actions.ts`에서 Server Component가 FastAPI 데이터를 직접 조회
- `loading.tsx`, `error.tsx`, 동적 라우트 `[todoId]` 적용

## React와 Next.js 개념 정리

### React 상태와 Client Component

입력값, 버튼 클릭, 검색어 변경, 완료 토글처럼 사용자가 직접 조작하는 부분은 Client Component에서 처리했습니다. `TodoForm`, `TodoList`, `TodoControls`는 `"use client"`를 선언하고 `useState`, `useRouter`, `useSearchParams`를 사용합니다.

중요한 점은 모든 컴포넌트를 클라이언트로 만들지 않는 것입니다. 사용자 이벤트가 필요한 작은 컴포넌트만 Client Component로 분리하고, 목록 페이지 자체는 Server Component로 유지했습니다.

### Server Component

`app/todos/page.tsx`는 Server Component입니다. 브라우저에 보내기 전에 서버에서 `getTodos()`를 실행해 FastAPI 데이터를 가져옵니다. 그래서 목록 조회 로직은 브라우저 번들에 들어가지 않고, 화면에는 결과만 전달됩니다.

### Route Handler

`app/api/todos/route.ts`와 `app/api/todos/[todoId]/route.ts`는 Next.js 서버에서 실행되는 API Route입니다. 브라우저는 `/api/todos`로 요청하고, 이 파일이 FastAPI의 `/todos`로 요청을 전달합니다.

이 구조를 쓰면 브라우저 코드에 실제 백엔드 주소를 직접 넣지 않아도 됩니다. CORS와 환경변수 관리도 더 명확해집니다.

### Server Action 파일

`app/actions.ts`는 Server Component가 사용할 서버 함수를 모아둔 파일입니다. 목록 페이지와 수정 페이지는 이 함수를 통해 FastAPI 데이터를 읽습니다.

이번 과제에서는 사용자 입력으로 발생하는 생성, 수정, 삭제, 완료 토글은 Client Component에서 `/api/todos` Route Handler를 호출하게 했습니다. 반대로 서버에서 바로 읽어도 되는 목록/상세 조회는 `actions.ts`를 사용했습니다.

### URL 상태

2차 React 과제에서는 필터 상태를 `useState`로만 관리했습니다. 이번에는 `filter`, `search`, `date`를 URL 파라미터에 저장했습니다.

```text
/todos?filter=completed&search=FastAPI&date=2026-06-22
```

이렇게 하면 새로고침, 뒤로가기, 링크 공유 후에도 같은 조건이 유지됩니다. 상태가 브라우저 메모리가 아니라 URL에 들어가기 때문입니다.

### localStorage와 서버 DB 차이

2차 과제의 `localStorage`는 브라우저 안에만 데이터가 있었습니다. 이번 과제에서는 FastAPI가 SQLite에 Todo를 저장합니다.

- React/Vite/localStorage: 브라우저가 직접 데이터 저장
- Next.js/FastAPI/SQLite: 브라우저 → Next Route Handler → FastAPI → SQLite 순서로 저장

그래서 프론트엔드는 데이터를 직접 소유하지 않고, 서버 API에 요청해서 최신 상태를 다시 받아옵니다.

## 테스트 방법

```bash
# backend
cd backend
.venv/bin/python -m pytest

# frontend
cd frontend
npm run lint
npm run typecheck
npm run test
npm run build
npm run test:e2e
```

- 백엔드 테스트: CRUD, 빈 입력 검증, 404, 필터/검색/날짜 조회
- 프론트 단위 테스트: 날짜 함수, URL 쿼리 함수
- Playwright E2E: 생성, 수정, 완료, 삭제, 필터, 검색, 날짜 URL 유지

## 자주 헷갈린 점

- `page.tsx`는 URL 화면이고, `route.ts`는 HTTP API입니다.
- Server Component에서는 `onClick` 같은 이벤트 핸들러를 직접 쓸 수 없습니다.
- `"use client"`는 파일 단위 선언이라 필요한 컴포넌트에만 붙이는 것이 좋습니다.
- `.env.local`을 수정한 뒤에는 개발 서버를 다시 시작해야 합니다.
- `NEXT_PUBLIC_`이 없는 환경변수는 서버에서만 읽는 값입니다.
