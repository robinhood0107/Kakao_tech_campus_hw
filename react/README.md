# React Todo

2차 React Todo를 Next.js App Router와 FastAPI 구조로 확장한 과제입니다.

## 실행

백엔드는 Windows CMD에서 실행합니다. 마지막 명령은 서버를 켜는 명령이라 터미널이 계속 실행된 상태로 남아 있습니다.

```cmd
cd /d C:\Users\pjjpj\source\repos\RedBull-Monster-HOT6\Kakao_tech_campus\Kakao_tech_campus_hw\backend
py -3 -m venv .venv-win
.venv-win\Scripts\python.exe -m pip install -r requirements.txt
.venv-win\Scripts\python.exe -m uvicorn main:app --reload --host 127.0.0.1 --port 9010
```

프론트엔드는 새 CMD를 열고 실행합니다.

```cmd
cd /d C:\Users\pjjpj\source\repos\RedBull-Monster-HOT6\Kakao_tech_campus\Kakao_tech_campus_hw\react
npm ci
npm run dev
```

- 앱: `http://127.0.0.1:3000/todos`
- API 문서: `http://127.0.0.1:9010/docs`

## 구현 기능

- Todo 생성, 조회, 수정, 완료 토글, 삭제
- 날짜별 Todo 조회
- 진행 상태 필터
- 검색어 기반 Todo 검색
- SQLite 저장
- Next.js API Route를 통한 FastAPI 연결

## 테스트

```cmd
cd /d C:\Users\pjjpj\source\repos\RedBull-Monster-HOT6\Kakao_tech_campus\Kakao_tech_campus_hw\backend
.venv-win\Scripts\python.exe -m pytest -q -s

cd /d C:\Users\pjjpj\source\repos\RedBull-Monster-HOT6\Kakao_tech_campus\Kakao_tech_campus_hw\react
npm run lint
npm run typecheck
npm run test
npm run build
npm run test:e2e
```
