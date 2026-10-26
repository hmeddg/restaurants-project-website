"use client";

import { useActionState, useState } from "react";
import {
  submitContactForm,
  type ContactFormState,
} from "@/app/contact/actions";
import { CheckIcon } from "@/components/icons/check-icon";
import { Field } from "@/components/ui/field";
import { inputClass } from "@/components/ui/field-styles";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SelectInput } from "@/components/ui/select-input";
import { SuccessPanel } from "@/components/ui/success-panel.client";
import type { ContactField } from "@/lib/contact/schema";
import { contactSubjects } from "@/lib/contact/subjects";
import { cn } from "@/lib/utils";

type ContactFormProps = {
  className?: string;
};

export function ContactForm({ className }: ContactFormProps) {
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [state, formAction, pending] = useActionState(
    async (previous: ContactFormState, formData: FormData) => {
      const result = await submitContactForm(previous, formData);
      if (result?.ok) {
        setSentTo(result.email);
        return null;
      }
      return result;
    },
    null,
  );
  const failed = state?.ok === false ? state : undefined;
  const values = failed?.values;

  function errorFor(field: ContactField) {
    return failed?.fieldErrors?.[field]?.[0];
  }

  function a11yProps(field: ContactField) {
    const error = errorFor(field);
    return {
      id: `contact-${field}`,
      name: field,
      "aria-invalid": error ? true : undefined,
      "aria-describedby": error ? `contact-${field}-error` : undefined,
    };
  }

  if (sentTo) {
    return (
      <SuccessPanel
        eyebrow="Message sent"
        title="Thank you for writing."
        message={
          <p>
            Your message is with our team. We usually reply within 24 hours to{" "}
            <span className="wrap-anywhere text-ivory">{sentTo}</span>.
          </p>
        }
        className={className}
      >
        <PrimaryButton type="button" onClick={() => setSentTo(null)}>
          Send another message
        </PrimaryButton>
      </SuccessPanel>
    );
  }

  return (
    <form action={formAction} className={cn("flex flex-col gap-6", className)}>
      <p
        role="status"
        aria-live="polite"
        className="text-sm leading-snug text-danger empty:hidden"
      >
        {failed?.error}
      </p>

      {/* Honeypot: hidden from people and assistive tech, filled only by bots. */}
      <div aria-hidden="true" className="sr-only">
        <label htmlFor="contact-website">Website</label>
        <input
          id="contact-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 sm:gap-4">
        <Field id="contact-name" label="Full name" error={errorFor("name")}>
          <input
            {...a11yProps("name")}
            type="text"
            autoComplete="name"
            required
            minLength={2}
            maxLength={100}
            placeholder="Jane Cooper"
            defaultValue={values?.name}
            className={cn(inputClass, "h-13")}
          />
        </Field>
        <Field id="contact-email" label="Email" error={errorFor("email")}>
          <input
            {...a11yProps("email")}
            type="email"
            autoComplete="email"
            required
            maxLength={254}
            placeholder="you@example.com"
            defaultValue={values?.email}
            className={cn(inputClass, "h-13")}
          />
        </Field>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 sm:gap-4">
        <Field
          id="contact-phone"
          label="Phone (optional)"
          error={errorFor("phone")}
        >
          <input
            {...a11yProps("phone")}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            maxLength={30}
            placeholder="+1 (000) 000-0000"
            defaultValue={values?.phone}
            className={cn(inputClass, "h-13")}
          />
        </Field>
        <Field id="contact-subject" label="Subject" error={errorFor("subject")}>
          <SelectInput
            {...a11yProps("subject")}
            required
            defaultValue={values?.subject || contactSubjects[0]}
          >
            {contactSubjects.map((subject) => (
              <option key={subject} value={subject} className="bg-deep">
                {subject}
              </option>
            ))}
          </SelectInput>
        </Field>
      </div>

      <Field id="contact-message" label="Message" error={errorFor("message")}>
        <textarea
          {...a11yProps("message")}
          required
          minLength={10}
          maxLength={2000}
          rows={5}
          placeholder="Tell us a little about your visit or your question…"
          defaultValue={values?.message}
          className={cn(inputClass, "min-h-37.5 resize-y py-3.5")}
        />
      </Field>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <label className="flex min-h-11 cursor-pointer items-center gap-2.5 text-[13px] text-ivory/75">
          <span className="relative flex size-4.5 shrink-0">
            <input
              type="checkbox"
              name="newsletter"
              defaultChecked={values?.newsletter}
              className="peer size-full cursor-pointer appearance-none rounded-[5px] border border-ivory/35 checked:border-gold checked:bg-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            />
            <CheckIcon className="pointer-events-none absolute inset-0.5 hidden text-deep peer-checked:block" />
          </span>
          Keep me posted on seasonal menus
        </label>

        <PrimaryButton disabled={pending}>
          {pending ? "Sending…" : "Send message"}
        </PrimaryButton>
      </div>
    </form>
  );
}
