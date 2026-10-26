import { expect, test, type Page } from "@playwright/test";

const timeZone = "America/New_York";

function isoInDays(days: number) {
  const today = new Intl.DateTimeFormat("en-CA", { timeZone }).format(
    new Date(),
  );
  const date = new Date(`${today}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function longLabel(isoDate: string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${isoDate}T00:00:00Z`));
}

async function pickDate(page: Page, isoDate: string) {
  // The booking form streams in after the shell; wait until it is interactive.
  await page.waitForLoadState("networkidle");
  await expect(page.getByRole("button", { name: "Next month" })).toBeVisible();
  const day = page.getByRole("radio", { name: longLabel(isoDate) });
  if (!(await day.count())) {
    await page.getByRole("button", { name: "Next month" }).click();
  }
  await day.check({ force: true });
  await expect(day).toBeChecked();
}

test.describe("reserve page", () => {
  test("renders headings and the booking form", async ({ page }) => {
    await page.goto("/reserve");

    await expect(page.locator("h1")).toHaveCount(1);
    await expect(
      page.getByRole("heading", { level: 2, name: /A table is waiting/ }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 2, name: "Your reservation" }),
    ).toBeVisible();
  });

  test("books a table and shows the confirmation", async ({ page }) => {
    await page.goto("/reserve");

    await pickDate(page, isoInDays(5));
    await page.getByRole("button", { name: "Add a guest" }).click();
    await expect(page.getByText("3 guests", { exact: true })).toBeVisible();

    // Earlier runs may have filled some slots, so take the first open one.
    const slot = page
      .getByRole("group", { name: "Time" })
      .getByRole("radio", { disabled: false })
      .first();
    await expect(slot).toBeVisible();
    const slotLabel = (await slot.locator("xpath=..").innerText()).trim();
    await slot.check({ force: true });

    await page.getByLabel("Full name").fill("Jane Cooper");
    await page.getByLabel("Phone").fill("+1 (212) 555-0100");
    await page.getByLabel("Email").fill("jane@example.com");
    await page.getByLabel("Occasion (optional)").selectOption("Birthday");
    await expect(page.getByText(`· ${slotLabel} · 3 guests`)).toBeVisible();
    await page.getByRole("button", { name: "Confirm reservation" }).click();

    const heading = page.getByRole("heading", {
      name: "Your table is booked.",
    });
    await expect(heading).toBeVisible();
    await expect(heading).toBeFocused();
    await expect(page.getByText(/^EL-[A-Z2-9]{6}$/)).toBeVisible();
    await expect(page.getByText("3 guests")).toBeVisible();
  });

  test("asks for a time before booking", async ({ page }) => {
    await page.goto("/reserve");

    await pickDate(page, isoInDays(6));
    await page.getByLabel("Full name").fill("Jane Cooper");
    await page.getByLabel("Phone").fill("+1 (212) 555-0100");
    await page.getByLabel("Email").fill("jane@example.com");
    await page.getByRole("button", { name: "Confirm reservation" }).click();

    await expect(page.locator("#reserve-time-error")).toHaveText(
      "Please choose a time.",
    );
    await expect(page.getByLabel("Full name")).toHaveValue("Jane Cooper");
  });

  test("has no horizontal scroll at common widths", async ({ page }) => {
    for (const width of [320, 375, 768, 1024, 1440, 1920]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/reserve");

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth,
      );
      expect(overflow, `horizontal overflow at ${width}px`).toBeLessThanOrEqual(
        0,
      );
    }
  });
});
