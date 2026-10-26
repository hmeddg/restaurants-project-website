"use client";

import { useActionState } from "react";
import { submitOrder, type OrderFormState } from "@/app/menu/actions";
import { Field } from "@/components/ui/field";
import { inputClass } from "@/components/ui/field-styles";
import { PrimaryButton } from "@/components/ui/primary-button";
import type { CartLine } from "@/lib/cart/store";
import { formatPrice } from "@/lib/format";
import type { OrderField } from "@/lib/order/schema";
import { cn } from "@/lib/utils";

type PlacedOrder = Extract<OrderFormState, { ok: true }>["order"];

type CheckoutFormProps = {
  lines: CartLine[];
  totalCents: number;
  onBack: () => void;
  onPlaced: (order: PlacedOrder) => void;
  onUnavailable: (itemIds: string[]) => void;
};

export function CheckoutForm({
  lines,
  totalCents,
  onBack,
  onPlaced,
  onUnavailable,
}: CheckoutFormProps) {
  const [state, formAction, pending] = useActionState(
    async (previous: OrderFormState, formData: FormData) => {
      const result = await submitOrder(previous, formData);
      if (result?.ok) {
        onPlaced(result.order);
        return null;
      }
      if (result?.unavailableItemIds?.length) {
        onUnavailable(result.unavailableItemIds);
        return null;
      }
      return result;
    },
    null,
  );

  const failed = state?.ok === false ? state : undefined;
  const values = failed?.values;

  function errorFor(field: OrderField) {
    return failed?.fieldErrors?.[field]?.[0];
  }

  function a11yProps(field: OrderField) {
    const error = errorFor(field);
    return {
      id: `order-${field}`,
      name: field,
      "aria-invalid": error ? true : undefined,
      "aria-describedby": error ? `order-${field}-error` : undefined,
    };
  }

  const items = JSON.stringify(
    lines.map((line) => ({ menuItemId: line.id, quantity: line.quantity })),
  );

  return (
    <form action={formAction} className="flex flex-1 flex-col gap-5">
      <p className="text-sm leading-snug text-ivory/60">
        Pickup from the restaurant. You pay when you collect.
      </p>

      <p
        role="status"
        aria-live="polite"
        className="text-sm leading-snug text-danger empty:hidden"
      >
        {failed?.error}
      </p>

      <input type="hidden" name="items" value={items} />

      {/* Honeypot: hidden from people and assistive tech, filled only by bots. */}
      <div aria-hidden="true" className="sr-only">
        <label htmlFor="order-website">Website</label>
        <input
          id="order-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <Field id="order-name" label="Full name" error={errorFor("name")}>
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
      <Field id="order-phone" label="Phone" error={errorFor("phone")}>
        <input
          {...a11yProps("phone")}
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          required
          minLength={7}
          maxLength={30}
          placeholder="+1 (000) 000-0000"
          defaultValue={values?.phone}
          className={cn(inputClass, "h-13")}
        />
      </Field>
      <Field
        id="order-email"
        label="Email (optional)"
        error={errorFor("email")}
      >
        <input
          {...a11yProps("email")}
          type="email"
          autoComplete="email"
          maxLength={254}
          placeholder="you@example.com"
          defaultValue={values?.email}
          className={cn(inputClass, "h-13")}
        />
      </Field>
      <Field
        id="order-notes"
        label="Notes (optional)"
        error={errorFor("notes")}
      >
        <textarea
          {...a11yProps("notes")}
          maxLength={500}
          rows={3}
          placeholder="Allergies or anything we should know"
          defaultValue={values?.notes}
          className={cn(inputClass, "resize-y py-3")}
        />
      </Field>

      <div className="mt-auto flex flex-col gap-3 pt-2">
        <PrimaryButton disabled={pending} className="w-full">
          {pending
            ? "Placing order…"
            : `Place order · ${formatPrice(totalCents)}`}
        </PrimaryButton>
        <button
          type="button"
          onClick={onBack}
          className="min-h-11 rounded-full text-sm font-medium text-ivory/70 hover:text-ivory focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        >
          Back to my order
        </button>
      </div>
    </form>
  );
}
