import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => localStorage.clear())
  await page.reload()
})

test('Todo 생성, 수정, 완료, 삭제 전체 흐름이 브라우저에서 동작한다', async ({ page }) => {
  const consoleErrors = []
  page.on('console', (message) => {
    if (message.type() === 'error') {
      consoleErrors.push(message.text())
    }
  })

  await page.getByLabel('새 할 일').fill('E2E 테스트 공부')
  await page.getByRole('button', { name: '추가' }).click()
  await expect(page.getByText('E2E 테스트 공부')).toBeVisible()

  await page.getByRole('button', { name: '수정' }).click()
  await page.getByLabel('수정할 할 일').fill('Playwright 테스트 공부')
  await page.getByRole('button', { name: '수정 완료' }).click()
  await expect(page.getByText('Playwright 테스트 공부')).toBeVisible()

  await page.getByRole('button', { name: '완료' }).click()
  await expect(page.getByText('Playwright 테스트 공부')).toHaveClass(/line-through/)

  await page.reload()
  await expect(page.getByText('Playwright 테스트 공부')).toBeVisible()

  await page.getByRole('button', { name: '삭제' }).click()
  await expect(page.getByText('Playwright 테스트 공부')).toBeHidden()
  expect(consoleErrors).toEqual([])
})

test('주간 뷰에서 날짜를 선택하면 해당 날짜 Todo만 표시된다', async ({ page }) => {
  await page.getByLabel('새 할 일').fill('오늘 할 일')
  await page.getByRole('button', { name: '추가' }).click()
  await page.getByRole('button', { name: '다음 날짜' }).click()
  await page.getByLabel('새 할 일').fill('내일 할 일')
  await page.getByRole('button', { name: '추가' }).click()

  await expect(page.getByText('내일 할 일')).toBeVisible()
  await expect(page.getByText('오늘 할 일')).toBeHidden()

  await page.getByRole('button', { name: '이전 날짜' }).click()

  await expect(page.getByText('오늘 할 일')).toBeVisible()
  await expect(page.getByText('내일 할 일')).toBeHidden()
})
