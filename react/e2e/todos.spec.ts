import { expect, test } from "@playwright/test";

async function clearTodos(page: import("@playwright/test").Page) {
  const response = await page.request.get("/api/todos");
  const todos = await response.json();

  await Promise.all(
    todos.map((todo: { id: number }) => page.request.delete(`/api/todos/${todo.id}`)),
  );
}

test.beforeEach(async ({ page }) => {
  await clearTodos(page);
});

test("Todo 생성, 수정, 완료, 삭제 흐름이 Next.js 화면과 FastAPI DB에서 동작한다", async ({
  page,
}) => {
  const consoleErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") {
      consoleErrors.push(message.text());
    }
  });

  await page.goto("/todos");
  await expect(page.getByRole("heading", { name: "Next.js Todo" })).toBeVisible();
  await expect(page.getByText("표시할 Todo가 없습니다.")).toBeVisible();

  await page.getByRole("link", { name: "새 Todo" }).click();
  await page.getByLabel("Todo 내용").fill("Next.js App Router 공부");
  await page.getByRole("button", { name: "저장" }).click();

  await expect(page).toHaveURL(/\/todos\?date=2026-06-22$/);
  await expect(page.getByText("Next.js App Router 공부")).toBeVisible();

  await page.getByRole("link", { name: "수정" }).click();
  await expect(page).toHaveURL(/\/todos\/\d+$/);
  await expect(page.getByLabel("Todo 내용")).toHaveValue("Next.js App Router 공부");
  await page.getByLabel("Todo 내용").fill("Server Action과 Route Handler 정리");
  await expect(page.getByLabel("Todo 내용")).toHaveValue("Server Action과 Route Handler 정리");
  await page.getByRole("button", { name: "수정 완료" }).click();

  await expect(page).toHaveURL(/\/todos\?date=2026-06-22$/);
  await expect(page.getByText("Server Action과 Route Handler 정리")).toBeVisible();

  await page
    .getByLabel("Todo 항목: Server Action과 Route Handler 정리")
    .getByRole("button", { name: "완료" })
    .click();
  await expect(page.getByText("Server Action과 Route Handler 정리")).toHaveClass(
    /line-through/,
  );

  await page.reload();
  await expect(page.getByText("Server Action과 Route Handler 정리")).toBeVisible();

  await page.getByRole("button", { name: "삭제" }).click();
  await expect(page.getByText("표시할 Todo가 없습니다.")).toBeVisible();
  expect(consoleErrors).toEqual([]);
});

test("필터, 검색, 날짜 상태가 URL에 유지되고 서버 결과를 다시 불러온다", async ({ page }) => {
  await page.goto("/todos/new");
  await page.getByLabel("Todo 내용").fill("진행 중인 Next.js 개념 정리");
  await page.getByLabel("날짜").fill("2026-06-22");
  await page.getByRole("button", { name: "저장" }).click();

  await page.goto("/todos/new");
  await page.getByLabel("Todo 내용").fill("완료된 FastAPI 검색 구현");
  await page.getByLabel("날짜").fill("2026-06-22");
  await page.getByRole("button", { name: "저장" }).click();
  await page
    .getByLabel("Todo 항목: 완료된 FastAPI 검색 구현")
    .getByRole("button", { name: "완료" })
    .click();

  await page.getByRole("tab", { name: "완료" }).click();
  await expect(page).toHaveURL(/filter=completed/);
  await expect(page.getByText("완료된 FastAPI 검색 구현")).toBeVisible();
  await expect(page.getByText("진행 중인 Next.js 개념 정리")).toBeHidden();

  await page.getByLabel("검색어").fill("FastAPI");
  await page.getByRole("button", { name: "검색" }).click();
  await expect(page).toHaveURL(/filter=completed/);
  await expect(page).toHaveURL(/search=FastAPI/);
  await expect(page.getByText("완료된 FastAPI 검색 구현")).toBeVisible();

  await page.getByLabel("날짜").fill("2026-06-23");
  await page.getByRole("button", { name: "날짜 적용" }).click();
  await expect(page).toHaveURL(/date=2026-06-23/);
  await expect(page.getByText("표시할 Todo가 없습니다.")).toBeVisible();

  await page.goto("/todos?filter=active&search=Next.js&date=2026-06-22");
  await expect(page.getByRole("tab", { name: "진행" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await expect(page.getByText("진행 중인 Next.js 개념 정리")).toBeVisible();
  await expect(page.getByText("완료된 FastAPI 검색 구현")).toBeHidden();

  await page.goto("/todos?date=2026-06-22");
  await page.getByRole("tab", { name: "진행" }).click();
  await page.getByLabel("검색어").fill("Next.js");
  await page.getByRole("button", { name: "검색" }).click();
  await expect(page).toHaveURL(/filter=active/);
  await expect(page).toHaveURL(/search=Next\.js/);
  await expect(page.getByText("진행 중인 Next.js 개념 정리")).toBeVisible();
});
