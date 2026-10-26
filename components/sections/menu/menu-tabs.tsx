import Link from "next/link";
import { menuCategories, type MenuCategory } from "@/lib/menu/categories";
import { cn } from "@/lib/utils";

type MenuTabsProps = {
  /** Omitted in the loading fallback, before the URL is known. */
  active?: MenuCategory;
  className?: string;
};

export function MenuTabs({ active, className }: MenuTabsProps) {
  return (
    <nav aria-label="Menu categories" className={cn("min-w-0", className)}>
      <ul className="flex gap-6 overflow-x-auto border-b border-ivory/12 sm:gap-11">
        {menuCategories.map((category) => {
          const isActive = category.slug === active;
          return (
            <li key={category.slug} className="shrink-0">
              <Link
                href={`/menu/${category.slug}`}
                aria-current={isActive ? "page" : undefined}
                scroll={false}
                className={cn(
                  "flex flex-col gap-3 rounded-sm font-serif text-2xl leading-[1.21] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-gold sm:text-[30px]",
                  isActive
                    ? "font-semibold text-gold"
                    : "font-normal text-ivory/60 transition-colors duration-200 hover:text-ivory",
                )}
              >
                {category.label}
                <span
                  aria-hidden="true"
                  className={cn("h-0.5 w-full", isActive && "bg-gold")}
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
