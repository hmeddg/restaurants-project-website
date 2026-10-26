import { notFound } from "next/navigation";
import { Suspense } from "react";
import { MenuErrorBoundary } from "@/components/sections/menu/menu-error.client";
import { MenuGrid } from "@/components/sections/menu/menu-grid";
import { MenuGridSkeleton } from "@/components/sections/menu/menu-grid-skeleton";
import { MenuTabs } from "@/components/sections/menu/menu-tabs";
import { isMenuCategory } from "@/lib/menu/categories";

type MenuCategoryContentProps = Pick<PageProps<"/menu/[category]">, "params">;

// Everything that depends on the URL lives here, behind the page's Suspense
// boundary, so the shared App Shell stays the same for every category.
export async function MenuCategoryContent({
  params,
}: MenuCategoryContentProps) {
  const { category } = await params;
  if (!isMenuCategory(category)) notFound();

  return (
    <>
      <MenuTabs active={category} className="mt-11" />
      <div className="mt-8">
        <MenuErrorBoundary>
          <Suspense fallback={<MenuGridSkeleton />}>
            <MenuGrid category={category} />
          </Suspense>
        </MenuErrorBoundary>
      </div>
    </>
  );
}
