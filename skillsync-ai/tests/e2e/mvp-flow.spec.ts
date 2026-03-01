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
