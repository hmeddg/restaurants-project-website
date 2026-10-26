"use client";

import { useEffect, useRef } from "react";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { useCart } from "@/hooks/use-cart";
import type { CartItem } from "@/lib/cart/store";
import { maxQuantity } from "@/lib/order/limits";

type CartControlProps = {
  item: CartItem;
};

export function CartControl({ item }: CartControlProps) {
  const { lines, setQuantity } = useCart();
  const line = lines.find((cartLine) => cartLine.id === item.id);
  const quantity = line?.quantity ?? 0;

  // A cart saved in an earlier visit may hold an old price or name; the card
  // shows the current menu, so bring the saved line up to date.
  useEffect(() => {
    if (
      line &&
      (line.priceCents !== item.priceCents ||
        line.name !== item.name ||
        line.image !== item.image)
    ) {
      setQuantity(item, line.quantity);
    }
  }, [line, item, setQuantity]);

  const addRef = useRef<HTMLButtonElement>(null);
  const increaseRef = useRef<HTMLButtonElement>(null);
  const focusAfterSwap = useRef(false);

  // "Add" and the stepper replace each other; keep keyboard focus on the control.
  useEffect(() => {
    if (!focusAfterSwap.current) return;
    focusAfterSwap.current = false;
    (quantity > 0 ? increaseRef : addRef).current?.focus();
  }, [quantity]);

  function change(next: number) {
    if ((quantity === 0) !== (next === 0)) focusAfterSwap.current = true;
    setQuantity(item, next);
  }

  if (quantity === 0) {
    return (
      <button
        ref={addRef}
        type="button"
        onClick={() => change(1)}
        aria-label={`Add ${item.name} to your order`}
        className="relative inline-flex items-center gap-1.5 rounded-full bg-deep py-2 pr-4 pl-3.5 text-ivory before:absolute before:-inset-1 before:content-[''] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-deep"
      >
        <span aria-hidden="true" className="text-base leading-5 font-medium">
          +
        </span>
        <span className="text-[13px] leading-5 font-semibold">Add</span>
      </button>
    );
  }

  return (
    <QuantityStepper
      value={quantity}
      min={0}
      max={maxQuantity}
      onChange={change}
      decreaseLabel={`Remove one ${item.name}`}
      increaseLabel={`Add one more ${item.name}`}
      tone="onLight"
      increaseRef={increaseRef}
      className="rounded-full border border-deep/25 p-1"
    >
      <span className="sr-only">{item.name} quantity: </span>
      {quantity}
    </QuantityStepper>
  );
}
