import { test, expect } from "@playwright/test";

test.describe("Menu Page", () => {
  test("should display menu items", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator("text=Our Menu")).toBeVisible();
    await expect(page.locator("text=Loading menu...").or(page.locator("[class*=grid]"))).toBeVisible({ timeout: 10000 });
  });

  test("should show navigation links", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator("text=FoodOrder")).toBeVisible();
    await expect(page.locator("nav >> text=Menu")).toBeVisible();
    await expect(page.locator("nav >> text=Admin")).toBeVisible();
  });

  test("should navigate to admin page", async ({ page }) => {
    await page.goto("/");

    await page.click("nav >> text=Admin");
    await expect(page).toHaveURL(/\/admin/);
    await expect(page.locator("text=Admin Dashboard")).toBeVisible({ timeout: 10000 });
  });
});

test.describe("Checkout Page", () => {
  test("should show empty cart message", async ({ page }) => {
    await page.goto("/checkout");

    await expect(page.locator("text=Your cart is empty")).toBeVisible();
  });

  test("should have Browse Menu button when empty", async ({ page }) => {
    await page.goto("/checkout");

    const browseBtn = page.locator("text=Browse Menu");
    await expect(browseBtn).toBeVisible();

    await browseBtn.click();
    await expect(page).toHaveURL("/");
  });
});

test.describe("Admin Page", () => {
  test("should display dashboard with stats", async ({ page }) => {
    await page.goto("/admin");

    await expect(page.locator("text=Admin Dashboard")).toBeVisible({ timeout: 10000 });
    await expect(page.locator("text=Total Orders")).toBeVisible();
    await expect(page.locator("text=Active Orders")).toBeVisible();
    await expect(page.locator("text=Total Revenue")).toBeVisible();
  });

  test("should show filter buttons", async ({ page }) => {
    await page.goto("/admin");

    await expect(page.locator("text=All")).toBeVisible({ timeout: 10000 });
    await expect(page.locator("button >> text=Received").first()).toBeVisible();
    await expect(page.locator("button >> text=Preparing").first()).toBeVisible();
  });
});
