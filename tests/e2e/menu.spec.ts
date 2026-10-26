import { expect, test } from "@playwright/test";

test.describe("menu page", () => {
  test("redirects to salads and marks the active tab", async ({ page }) => {
    await page.goto("/menu");

    await expect(page).toHaveURL(/\/menu\/salad$/);
    await expect(page.locator("h1")).toHaveCount(1);
    const tabs = page.getByRole("navigation", { name: "Menu categories" });
    await expect(tabs.getByRole("link", { name: "Salad" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    await expect(
      page.getByRole("heading", { level: 3, name: "Caesar Salad" }),
    ).toBeVisible();
  });

  test("builds an order across tabs and places it", async ({ page }) => {
    await page.goto("/menu/salad");
    const order = page.getByRole("complementary", { name: "Your order" });

    await page
      .getByRole("button", { name: "Add Caesar Salad to your order" })
      .click();
    const more = page.getByRole("button", {
      name: "Add one more Caesar Salad",
    });
    await expect(more).toBeFocused();
    await more.click();

    await page
      .getByRole("navigation", { name: "Menu categories" })
      .getByRole("link", { name: "Steak" })
      .click();
    await expect(page).toHaveURL(/\/menu\/steak$/);
    await page
      .getByRole("button", { name: "Add Ribeye Steak to your order" })
      .click();

    await expect(order.getByText("3 items")).toBeVisible();
    await expect(order.getByText("$46.97")).toBeVisible();

    await order.getByRole("button", { name: "Checkout" }).click();
    await order.getByLabel("Full name").fill("Jane Cooper");
    await order.getByLabel("Phone").fill("+1 (212) 555-0100");
    await order.getByRole("button", { name: /Place order/ }).click();

    const heading = order.getByRole("heading", { name: "Thank you, Jane." });
    await expect(heading).toBeVisible();
    await expect(heading).toBeFocused();
    await expect(order.getByText(/^Order #\d+$/)).toBeVisible();
    await expect(order.getByText("$46.97")).toBeVisible();

    await order.getByRole("button", { name: "Start a new order" }).click();
    await expect(order.getByText("0 items")).toBeVisible();
  });

  test("keeps the order after a reload", async ({ page }) => {
    await page.goto("/menu/drinks");
    await page
      .getByRole("button", { name: "Add Iced Latte to your order" })
      .click();

    await page.reload();
    const order = page.getByRole("complementary", { name: "Your order" });
    await expect(order.getByText("Iced Latte")).toBeVisible();
    await expect(order.getByText("1 item", { exact: true })).toBeVisible();
  });

  test("drops dishes that left the menu instead of blocking checkout", async ({
    page,
  }) => {
    await page.goto("/menu/salad");
    await page.evaluate(() =>
      localStorage.setItem(
        "elever:cart:v1",
        JSON.stringify([
          {
            id: "lobster-thermidor",
            name: "Lobster Thermidor",
            priceCents: 5900,
            image: "/images/menu/caesar-salad.webp",
            quantity: 1,
          },
        ]),
      ),
    );
    await page.reload();
    await page
      .getByRole("button", { name: "Add Caesar Salad to your order" })
      .click();

    const order = page.getByRole("complementary", { name: "Your order" });
    await order.getByRole("button", { name: "Checkout" }).click();
    await order.getByLabel("Full name").fill("Jane Cooper");
    await order.getByLabel("Phone").fill("+1 (212) 555-0100");
    await order.getByRole("button", { name: /Place order/ }).click();

    await expect(order.getByText(/no longer on the menu/)).toBeVisible();
    await expect(
      order.getByText("Lobster Thermidor", { exact: true }),
    ).toHaveCount(0);
    await expect(
      order.getByText("Caesar Salad", { exact: true }),
    ).toBeVisible();

    await order.getByRole("button", { name: "Checkout" }).click();
    await order.getByLabel("Full name").fill("Jane Cooper");
    await order.getByLabel("Phone").fill("+1 (212) 555-0100");
    await order.getByRole("button", { name: /Place order/ }).click();
    await expect(
      order.getByRole("heading", { name: "Thank you, Jane." }),
    ).toBeVisible();
  });

  test("refreshes prices saved in an old cart", async ({ page }) => {
    await page.goto("/menu/salad");
    await page.evaluate(() =>
      localStorage.setItem(
        "elever:cart:v1",
        JSON.stringify([
          {
            id: "caesar-salad",
            name: "Caesar Salad",
            priceCents: 1,
            image: "/images/menu/caesar-salad.webp",
            quantity: 2,
          },
        ]),
      ),
    );
    await page.reload();

    const order = page.getByRole("complementary", { name: "Your order" });
    await expect(order.getByText("2 × $8.99")).toBeVisible();
    await expect(order.getByText("$17.98").first()).toBeVisible();
  });

  test("unknown categories return 404", async ({ page }) => {
    const response = await page.goto("/menu/desserts");
    expect(response?.status()).toBe(404);
  });

  test("has no horizontal scroll at common widths", async ({ page }) => {
    for (const width of [320, 375, 768, 1024, 1440, 1920]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/menu/salad");

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth,
      );
      expect(overflow, `horizontal overflow at ${width}px`).toBeLessThanOrEqual(
        0,
      );
    }
  });
});
