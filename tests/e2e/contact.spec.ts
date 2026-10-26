import { expect, test } from "@playwright/test";

test.describe("contact page", () => {
  test("renders a single h1, section headings and contact details", async ({
    page,
  }) => {
    await page.goto("/contact");

    await expect(page.locator("h1")).toHaveCount(1);
    await expect(
      page.getByRole("heading", { level: 1, name: /Contact/i }),
    ).toBeVisible();
    for (const name of [/We'd love to hear/, /Send us a message/]) {
      await expect(page.getByRole("heading", { level: 2, name })).toBeVisible();
    }
    await expect(
      page.getByRole("link", { name: "+1 (212) 555-0148" }),
    ).toHaveAttribute("href", "tel:+12125550148");
  });

  test("marks Contact as the current nav link", async ({ page }) => {
    test.skip(
      (page.viewportSize()?.width ?? 0) < 1280,
      "desktop nav is hidden below xl",
    );
    await page.goto("/contact");

    const nav = page.getByRole("navigation", { name: "Main" });
    await expect(nav.getByRole("link", { name: "Contact" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  test("shows server validation errors next to the field and keeps input", async ({
    page,
  }) => {
    await page.goto("/contact");

    await page.getByLabel("Full name").fill("Jane Cooper");
    await page.getByLabel("Email").fill("jane@example.com");
    await page.getByLabel("Phone (optional)").fill("call me maybe");
    await page
      .getByLabel("Message")
      .fill("Do you have a table for six on Friday?");
    await page.getByRole("button", { name: "Send message" }).click();

    const phone = page.getByLabel("Phone (optional)");
    await expect(phone).toHaveAttribute("aria-invalid", "true");
    await expect(page.locator("#contact-phone-error")).toHaveText(
      "Please enter a valid phone number.",
    );
    await expect(page.getByRole("status")).toHaveText(
      "Please check the highlighted fields.",
    );
    await expect(page.getByLabel("Full name")).toHaveValue("Jane Cooper");
    await expect(phone).toHaveValue("call me maybe");
  });

  test("saves a message and shows the confirmation", async ({ page }) => {
    await page.goto("/contact");

    await page.getByLabel("Full name").fill("Jane Cooper");
    await page.getByLabel("Email").fill("jane@example.com");
    await page.getByLabel("Subject").selectOption("Private dining");
    await page
      .getByLabel("Message")
      .fill("Could we book the back room for twelve people?");
    await page.getByRole("button", { name: "Send message" }).click();

    const heading = page.getByRole("heading", {
      name: "Thank you for writing.",
    });
    await expect(heading).toBeVisible();
    await expect(heading).toBeFocused();
    await expect(page.getByText("jane@example.com")).toBeVisible();
  });

  test("has no horizontal scroll at common widths", async ({ page }) => {
    for (const width of [320, 375, 768, 1024, 1440, 1920]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/contact");

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth,
      );
      expect(overflow, `horizontal overflow at ${width}px`).toBeLessThanOrEqual(
        0,
      );
    }
  });
});
