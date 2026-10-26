import { menuGridClass } from "@/components/sections/menu/menu-grid";

export function MenuGridSkeleton() {
  return (
    <div aria-hidden="true" className={menuGridClass}>
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          className="flex min-h-120 flex-col items-center gap-5 rounded-[1.25rem] bg-ivory/6 px-4.5 pt-6 pb-5"
        >
          <div className="size-46 rounded-full bg-ivory/8 motion-safe:animate-pulse" />
          <div className="h-7 w-3/4 rounded-lg bg-ivory/8 motion-safe:animate-pulse" />
          <div className="h-10 w-full rounded-lg bg-ivory/8 motion-safe:animate-pulse" />
        </div>
      ))}
    </div>
  );
}
