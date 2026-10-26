import type { Metadata } from "next";
import { Suspense } from "react";
import { MenuCategoryContent } from "@/components/sections/menu/menu-category-content";
import { MenuGridSkeleton } from "@/components/sections/menu/menu-grid-skeleton";
import { MenuTabs } from "@/components/sections/menu/menu-tabs";
import { PageTitle } from "@/components/ui/page-title";
import { siteConfig } from "@/config/site";
import {
  isMenuCategory,
  menuCategories,
  type MenuCategory,
} from "@/lib/menu/categories";

const seo: Record<MenuCategory, { title: string; description: string }> = {
  salad: {
    title: "Salads — Caesar, Greek and Mediterranean Bliss",
    description: `Fresh salads at ${siteConfig.name}: a classic Caesar, a Greek salad with kalamata olives and feta, and our Mediterranean Bliss. Order online for pickup.`,
  },
  steak: {
    title: "Steaks — Ribeye, Filet Mignon and New York Strip",
    description: `Seared steaks at ${siteConfig.name}: ribeye with herb butter, filet mignon with red wine jus and a New York strip with peppercorn sauce. Order online for pickup.`,
  },
  pasta: {
    title: "Fresh Pasta — Carbonara, Alfredo and Arrabbiata",
    description: `Fresh pasta at ${siteConfig.name}: spaghetti carbonara, our signature fettuccine Alfredo and a spicy penne arrabbiata. Add them to your order for pickup today.`,
  },
  drinks: {
    title: "Drinks — Lemonade, Virgin Mojito and Iced Latte",
    description: `Drinks at ${siteConfig.name}: freshly pressed lemonade, an alcohol-free virgin mojito and a double-espresso iced latte. Add them to your pickup order today.`,
  },
};

export function generateStaticParams() {
  return menuCategories.map((category) => ({ category: category.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/menu/[category]">): Promise<Metadata> {
  const { category } = await params;
  if (!isMenuCategory(category)) return {};

  const { title, description } = seo[category];
  const path = `${siteConfig.links.menu}/${category}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      url: path,
      siteName: siteConfig.name,
      title,
      description,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default function MenuCategoryPage({
  params,
}: PageProps<"/menu/[category]">) {
  return (
    <>
      <PageTitle
        id="menu-heading"
        underlineSrc="/images/menu/title-underline.svg"
        underlineWidth={105}
        className="lg:pl-0"
      >
        Menu
      </PageTitle>
      <Suspense
        fallback={
          <>
            <MenuTabs className="mt-11" />
            <div className="mt-8">
              <MenuGridSkeleton />
            </div>
          </>
        }
      >
        <MenuCategoryContent params={params} />
      </Suspense>
      <p className="mt-8 text-sm text-ivory/50 lg:text-[13px]">
        Every dish is prepared fresh to order. Please let us know about any
        allergies.
      </p>
    </>
  );
}
