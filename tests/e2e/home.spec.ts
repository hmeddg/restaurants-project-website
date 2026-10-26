import { expect, test } from "@playwright/test";

test.describe("home page", () => {
  test("renders a single h1 and every section heading", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator("h1")).toHaveCount(1);
    await expect(
      page.getByRole("heading", { level: 1, name: /Good food\./ }),
    ).toBeVisible();
    for (const name of [
      /A place where/,
      /The signature collection/,
      /An invitation to/,
      /More than/,
      /Make tonight memorable/,
    ]) {
      await expect(page.getByRole("heading", { level: 2, name })).toBeVisible();
    }
  });

  test("skip link is the first focusable element", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");

    await expect(
      page.getByRole("link", { name: "Skip to content" }),
    ).toBeFocused();
  });

  test("has no horizontal scroll at common widths", async ({ page }) => {
    for (const width of [320, 375, 768, 1024, 1440, 1920]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth,
      );
      expect(overflow, `horizontal overflow at ${width}px`).toBeLessThanOrEqual(
        0,
      );
    }
  });
});

test.describe("header", () => {
  test("desktop nav never overlaps the reserve button", async ({ page }) => {
    for (const width of [1024, 1280, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");

      const nav = page.getByRole("navigation", { name: "Main" });
      const reserve = page
        .getByRole("banner")
        .getByRole("link", { name: "Reserve a table" });
      if (!(await nav.isVisible())) {
        await expect(
          page.getByRole("button", { name: "Open menu" }),
        ).toBeVisible();
        continue;
      }

      const navBox = await nav.boundingBox();
      const reserveBox = await reserve.boundingBox();
      expect(navBox && reserveBox, `boxes at ${width}px`).toBeTruthy();
      if (navBox && reserveBox) {
        expect(navBox.x + navBox.width, `overlap at ${width}px`).toBeLessThan(
          reserveBox.x,
        );
      }
    }
  });
});

test.describe("mobile menu", () => {
  test.skip(({ isMobile }) => !isMobile, "mobile only");

  test("opens, traps focus and closes on Escape", async ({ page }) => {
    await page.goto("/");
    const toggle = page.getByRole("button", { name: "Open menu" });
    await toggle.click();

    const menu = page.getByRole("navigation", { name: "Mobile" });
    await expect(menu).toBeVisible();
    await expect(menu.getByRole("link", { name: "The Menu" })).toBeFocused();

    await page.keyboard.press("Shift+Tab");
    await expect(
      page.getByRole("button", { name: "Close menu" }),
    ).toBeFocused();
    await page.keyboard.press("Shift+Tab");
    await expect(
      menu.getByRole("link", { name: "Reserve a table" }),
    ).toBeFocused();

    await page.keyboard.press("Escape");
    await expect(menu).toBeHidden();
    await expect(page.getByRole("button", { name: "Open menu" })).toBeFocused();
  });

  test("closes when a link is chosen", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();

    const menu = page.getByRole("navigation", { name: "Mobile" });
    await menu.getByRole("link", { name: "Reserve a table" }).click();
    await expect(menu).toBeHidden();
  });
});
