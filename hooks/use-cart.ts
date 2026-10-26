"use client";

import { useSyncExternalStore } from "react";
import {
  clearCart,
  getServerSnapshot,
  getSnapshot,
  setQuantity,
  subscribe,
} from "@/lib/cart/store";

export function useCart() {
  const lines = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const count = lines.reduce((sum, line) => sum + line.quantity, 0);
  const totalCents = lines.reduce(
    (sum, line) => sum + line.priceCents * line.quantity,
    0,
  );
  return { lines, count, totalCents, setQuantity, clearCart };
}
