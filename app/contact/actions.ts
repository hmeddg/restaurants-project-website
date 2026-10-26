"use server";

import { z } from "zod";
import { ApiError } from "@/lib/api/client";
import { sendContactMessage } from "@/lib/api/contact";
import { contactSchema, type ContactField } from "@/lib/contact/schema";

export type ContactFormValues = Record<
  Exclude<ContactField, "newsletter">,
  string
> & { newsletter: boolean };

export type ContactFormState =
  | { ok: true; email: string }
  | {
      ok: false;
      error: string;
      fieldErrors?: Partial<Record<ContactField, string[]>>;
      values: ContactFormValues;
    }
  | null;

function readText(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

export async function submitContactForm(
  _previous: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  // Honeypot: real visitors never see or fill this field.
  if (readText(formData, "website")) {
    return { ok: true, email: readText(formData, "email") };
  }

  const values: ContactFormValues = {
    name: readText(formData, "name"),
    email: readText(formData, "email"),
    phone: readText(formData, "phone"),
    subject: readText(formData, "subject"),
    message: readText(formData, "message"),
    newsletter: formData.get("newsletter") === "on",
  };

  const parsed = contactSchema.safeParse(values);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please check the highlighted fields.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
      values,
    };
  }

  try {
    await sendContactMessage(parsed.data);
    return { ok: true, email: parsed.data.email };
  } catch (error) {
    const status = error instanceof ApiError ? error.status : undefined;
    console.error("Contact message failed", { status: status ?? "network" });

    return {
      ok: false,
      error:
        status === 429
          ? "Too many messages in a short time. Please try again in a few minutes."
          : "Sorry, we couldn't send your message. Please try again or email us directly.",
      values,
    };
  }
}
