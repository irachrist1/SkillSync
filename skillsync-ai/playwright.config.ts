import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  retries: 0,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:3111",
    trace: "on-first-retry",
  },
  webServer: {
    command: "npx convex dev --typecheck=disable --run-sh \"npm run dev -- --port 3111\"",
    url: "http://127.0.0.1:3111",
    reuseExistingServer: false,
    timeout: 120000,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
