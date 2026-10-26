import { describe, expect, it } from "vitest";
import { contactSchema } from "@/lib/contact/schema";

const valid = {
  name: "Jane Cooper",
  email: "jane@example.com",
  phone: "",
  subject: "General enquiry",
  message: "Do you have a table for six on Friday?",
  newsletter: false,
};

describe("contactSchema", () => {
  it("accepts a valid message and drops an empty phone", () => {
    const result = contactSchema.safeParse(valid);

    expect(result.success).toBe(true);
    expect(result.data?.phone).toBeUndefined();
  });

  it("trims whitespace before validating the email", () => {
    const result = contactSchema.safeParse({
      ...valid,
      email: "  jane@example.com ",
    });

    expect(result.data?.email).toBe("jane@example.com");
  });

  it.each([
    ["name", { name: " J " }],
    ["email", { email: "not-an-email" }],
    ["phone", { phone: "call me maybe" }],
    ["subject", { subject: "Something else" }],
    ["message", { message: "Hi" }],
  ])("rejects an invalid %s", (field, override) => {
    const result = contactSchema.safeParse({ ...valid, ...override });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual([field]);
  });
});
