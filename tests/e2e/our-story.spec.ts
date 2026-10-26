import { expect, test } from "@playwright/test";

test.describe("our story page", () => {
  test("renders a single h1 and every section heading", async ({ page }) => {
    await page.goto("/our-story");

    await expect(page.locator("h1")).toHaveCount(1);
    await expect(
      page.getByRole("heading", { level: 1, name: /Our story/i }),
    ).toBeVisible();
    for (const name of [
      /Born from a love of long dinners/,
      /Our beginnings/,
      /Recipes worth repeating/,
      /How we cook/,
      /What we believe/,
    ]) {
      await expect(page.getByRole("heading", { level: 2, name })).toBeVisible();
    }
  });

  test("marks Our Story as the current nav link", async ({ page }) => {
    test.skip(
      (page.viewportSize()?.width ?? 0) < 1280,
      "desktop nav is hidden below xl",
    );
    await page.goto("/our-story");

    const nav = page.getByRole("navigation", { name: "Main" });
    await expect(nav.getByRole("link", { name: "Our Story" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    await expect(
      nav.getByRole("link", { name: "The Menu" }),
    ).not.toHaveAttribute("aria-current");
  });

  test("has no horizontal scroll at common widths", async ({ page }) => {
    for (const width of [320, 375, 768, 1024, 1440, 1920]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/our-story");

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth,
      );
      expect(overflow, `horizontal overflow at ${width}px`).toBeLessThanOrEqual(
        0,
      );
    }
  });
});
