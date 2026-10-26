import { connection } from "next/server";
import { MenuCard } from "@/components/sections/menu/menu-card";
import { getMenuItems } from "@/lib/api/menu";
import type { MenuCategory } from "@/lib/menu/categories";

export const menuGridClass =
  "grid grid-cols-[repeat(auto-fill,minmax(14.5rem,1fr))] gap-7";

type MenuGridProps = {
  category: MenuCategory;
};

export async function MenuGrid({ category }: MenuGridProps) {
  // Rendered per request (from the "use cache" entry) so builds never depend
  // on the API being reachable.
  await connection();
  const items = await getMenuItems(category);

  if (items.length === 0) {
    return (
      <p className="rounded-[1.25rem] border border-ivory/14 px-6 py-10 text-center text-base text-ivory/70">
        Nothing on this part of the menu right now. Please check back soon.
      </p>
    );
  }

  return (
    <ul className={menuGridClass}>
      {items.map((item, index) => (
        <li key={item.id}>
          <MenuCard item={item} preload={index === 0} />
        </li>
      ))}
    </ul>
  );
}
