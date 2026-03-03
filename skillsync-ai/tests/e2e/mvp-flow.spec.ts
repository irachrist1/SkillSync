import { expect, test } from "@playwright/test";

test("welcome to skills assessment flow", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /your skills/i })).toBeVisible();

  await page.getByRole("button", { name: /start skill assessment/i }).click();
  await expect(page.getByRole("heading", { name: /skills assessment/i })).toBeVisible();
});

test("demo action preloads profile", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /see demo/i }).click();
  await expect(page.getByRole("heading", { name: /skills assessment/i })).toBeVisible();
  await expect(page.getByText(/selected skills/i)).toBeVisible();
});

test("discover intro appears after continuing from skills", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /see demo/i }).click();
  await page.getByRole("button", { name: /continue to discovery/i }).click();
  await expect(page.getByRole("button", { name: /start discover assessment/i })).toBeVisible({ timeout: 15000 });
});

test("full flow: skills -> discover (25) -> analysis tabs", async ({ page }) => {
  test.setTimeout(120000);
  await page.goto("/");
  await page.getByRole("button", { name: /see demo/i }).click();
  await page.getByRole("button", { name: /continue to discovery/i }).click();

  await page.getByRole("button", { name: /start discover assessment/i }).click();

  for (let index = 0; index < 24; index += 1) {
    await page.getByRole("button", { name: /^neutral$/i }).click();
    await page.getByRole("button", { name: /^next$/i }).click();
  }

  await page.getByRole("button", { name: /^neutral$/i }).click();
  await page.getByRole("button", { name: /finish and analyze/i }).click();

  await expect(page.getByRole("heading", { name: /your career analysis/i })).toBeVisible({ timeout: 45000 });
  await page.getByRole("button", { name: /career discovery/i }).click();
  await expect(page.getByRole("heading", { name: /riasec profile/i })).toBeVisible();
});

test("skip path: discover -> analysis skill-only", async ({ page }) => {
  test.setTimeout(90000);
  await page.goto("/");
  await page.getByRole("button", { name: /see demo/i }).click();
  await page.getByRole("button", { name: /continue to discovery/i }).click();

  await page.getByRole("button", { name: /skip assessment/i }).click();
  await expect(page.getByRole("heading", { name: /your career analysis/i })).toBeVisible({ timeout: 45000 });

  await page.getByRole("button", { name: /career discovery/i }).click();
  await expect(page.getByText(/you skipped discover this time/i)).toBeVisible();
});
