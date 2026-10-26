import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { apiRequest } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import { MenuItemListSchema } from "@/lib/api/schemas";
import type { MenuCategory } from "@/lib/menu/categories";

export async function getMenuItems(category: MenuCategory) {
  "use cache";
  cacheLife("hours");
  cacheTag("menu", `menu:${category}`);

  const params = new URLSearchParams({ category });
  return apiRequest(`${endpoints.menuItems}?${params}`, {
    schema: MenuItemListSchema,
    cachedBy: "use cache",
  });
}
