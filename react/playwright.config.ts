import { defineConfig, devices } from "@playwright/test";

const backendPort = process.env.BACKEND_PORT ?? "9010";

export default defineConfig({
  testDir: "./e2e",
  timeout: 60_000,
  workers: 1,
  webServer: [
    {
      command: "node ./scripts/start-backend-for-playwright.mjs",
      url: `http://127.0.0.1:${backendPort}/docs`,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
    {
      command: "npm run dev",
      url: "http://127.0.0.1:3000",
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
  ],
  use: {
    baseURL: "http://127.0.0.1:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
