export const menuCategories = [
  { slug: "salad", label: "Salad" },
  { slug: "steak", label: "Steak" },
  { slug: "pasta", label: "Pasta" },
  { slug: "drinks", label: "Drinks" },
] as const;

export type MenuCategory = (typeof menuCategories)[number]["slug"];

export function isMenuCategory(value: string): value is MenuCategory {
  return menuCategories.some((category) => category.slug === value);
}
