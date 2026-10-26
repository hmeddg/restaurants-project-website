import { maxQuantity } from "@/lib/order/limits";

export type CartItem = {
  id: string;
  name: string;
  priceCents: number;
  image: string;
};

export type CartLine = CartItem & { quantity: number };

// Only dish ids, names and prices live here; never personal data.
const storageKey = "elever:cart:v1";
const empty: CartLine[] = [];

let lines: CartLine[] = empty;
let loaded = false;
const listeners = new Set<() => void>();

function isCartLine(value: unknown): value is CartLine {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    typeof value.id === "string" &&
    "name" in value &&
    typeof value.name === "string" &&
    "priceCents" in value &&
    typeof value.priceCents === "number" &&
    "image" in value &&
    typeof value.image === "string" &&
    "quantity" in value &&
    typeof value.quantity === "number" &&
    Number.isInteger(value.quantity) &&
    value.quantity >= 1 &&
    value.quantity <= maxQuantity
  );
}

function read(): CartLine[] {
  try {
    const stored: unknown = JSON.parse(
      window.localStorage.getItem(storageKey) ?? "[]",
    );
    return Array.isArray(stored) ? stored.filter(isCartLine) : empty;
  } catch {
    return empty;
  }
}

function write(next: CartLine[]) {
  lines = next;
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(next));
  } catch {
    // Private mode or full storage: the cart still works for this page view.
  }
  listeners.forEach((listener) => listener());
}

function onStorage(event: StorageEvent) {
  if (event.key !== storageKey) return;
  lines = read();
  listeners.forEach((listener) => listener());
}

export function subscribe(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1) window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener("storage", onStorage);
  };
}

export function getSnapshot() {
  if (!loaded) {
    lines = read();
    loaded = true;
  }
  return lines;
}

export function getServerSnapshot() {
  return empty;
}

export function setQuantity(item: CartItem, quantity: number) {
  const clamped = Math.min(Math.max(quantity, 0), maxQuantity);
  const current = getSnapshot();
  const exists = current.some((line) => line.id === item.id);

  if (clamped === 0) {
    write(current.filter((line) => line.id !== item.id));
  } else if (exists) {
    write(
      current.map((line) =>
        line.id === item.id ? { ...line, ...item, quantity: clamped } : line,
      ),
    );
  } else {
    write([...current, { ...item, quantity: clamped }]);
  }
}

export function clearCart() {
  write(empty);
}
