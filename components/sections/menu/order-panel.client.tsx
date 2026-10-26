"use client";

import Image from "next/image";
import { useState } from "react";
import type { OrderFormState } from "@/app/menu/actions";
import { CheckoutForm } from "@/components/sections/menu/checkout-form.client";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SuccessPanel } from "@/components/ui/success-panel.client";
import { useCart } from "@/hooks/use-cart";
import { formatPickup } from "@/lib/dates";
import { formatPrice } from "@/lib/format";

type PlacedOrder = Extract<OrderFormState, { ok: true }>["order"];

type OrderPanelProps = {
  timeZone: string;
  pickupAddress: string;
};

function itemLabel(count: number) {
  return `${count} ${count === 1 ? "item" : "items"}`;
}

export function OrderPanel({ timeZone, pickupAddress }: OrderPanelProps) {
  const { lines, count, totalCents, setQuantity, clearCart } = useCart();
  const [view, setView] = useState<"cart" | "checkout">("cart");
  const [placed, setPlaced] = useState<PlacedOrder | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  function handlePlaced(order: PlacedOrder) {
    setPlaced(order);
    setNotice(null);
    setView("cart");
    clearCart();
  }

  // Dishes taken off the menu can't be reached from any tab, so remove them
  // here and send the guest back to review what is left.
  function handleUnavailable(itemIds: string[]) {
    const removed = lines.filter((line) => itemIds.includes(line.id));
    removed.forEach((line) => setQuantity(line, 0));
    const names = removed.map((line) => line.name).join(", ");
    const what =
      removed.length === 1
        ? `${names} is no longer on the menu, so we removed it.`
        : removed.length > 1
          ? `${names} are no longer on the menu, so we removed them.`
          : "Some dishes are no longer on the menu.";
    setNotice(`${what} Please check your order and place it again.`);
    setView("cart");
  }

  return (
    <aside
      aria-label="Your order"
      className="flex min-w-0 flex-col gap-5 rounded-3xl border border-gold/22 bg-ivory/4 p-5 sm:p-7 lg:sticky lg:top-28 lg:min-h-168.75"
    >
      {placed ? (
        <SuccessPanel
          eyebrow={`Order #${placed.number}`}
          title={`Thank you, ${placed.name.split(" ")[0]}.`}
          message={
            <p>
              We&apos;ve received your order. Collect it from {pickupAddress}{" "}
              and pay when you pick it up.
            </p>
          }
          details={[
            { label: "Items", value: itemLabel(placed.itemCount) },
            { label: "Total", value: formatPrice(placed.totalCents) },
            {
              label: "Pickup",
              value: formatPickup(timeZone, placed.readyAt),
            },
          ]}
        >
          <PrimaryButton
            type="button"
            onClick={() => setPlaced(null)}
            className="w-full"
          >
            Start a new order
          </PrimaryButton>
        </SuccessPanel>
      ) : (
        <>
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-serif text-[30px] leading-[1.21] font-semibold text-ivory lowercase">
              {view === "checkout" ? "Checkout" : "My orders"}
            </h2>
            <p
              aria-live="polite"
              className="text-[13px] font-medium text-ivory/60"
            >
              {itemLabel(count)}
            </p>
          </div>

          {view === "checkout" && lines.length > 0 ? (
            <CheckoutForm
              lines={lines}
              totalCents={totalCents}
              onBack={() => setView("cart")}
              onPlaced={handlePlaced}
              onUnavailable={handleUnavailable}
            />
          ) : (
            <>
              <p
                role="status"
                className="text-sm leading-snug text-danger empty:hidden"
              >
                {notice}
              </p>
              {lines.length === 0 ? (
                <p className="text-base leading-6 text-ivory/60 lg:text-sm">
                  Your order is empty. Add a dish from the menu to get started.
                </p>
              ) : (
                <ul className="divide-y divide-ivory/10">
                  {lines.map((line) => (
                    <li
                      key={line.id}
                      className="flex items-center gap-3 py-3.5"
                    >
                      <Image
                        src={line.image}
                        alt=""
                        width={48}
                        height={48}
                        sizes="48px"
                        className="size-12 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-serif text-[19px] leading-[1.21] font-semibold text-ivory">
                          {line.name}
                        </p>
                        <p className="text-xs text-ivory/55">
                          {line.quantity} × {formatPrice(line.priceCents)}
                        </p>
                      </div>
                      <p className="shrink-0 font-serif text-xl font-semibold text-gold">
                        {formatPrice(line.priceCents * line.quantity)}
                      </p>
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-auto flex flex-col gap-5">
                <div className="flex items-center justify-between border-t border-ivory/14 pt-4">
                  <p className="text-sm font-medium text-ivory/70">Total</p>
                  <p className="font-serif text-[34px] leading-[1.21] font-semibold text-ivory">
                    {formatPrice(totalCents)}
                  </p>
                </div>
                <PrimaryButton
                  type="button"
                  disabled={lines.length === 0}
                  onClick={() => {
                    setNotice(null);
                    setView("checkout");
                  }}
                  className="w-full disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Checkout
                </PrimaryButton>
              </div>
            </>
          )}
        </>
      )}
    </aside>
  );
}
