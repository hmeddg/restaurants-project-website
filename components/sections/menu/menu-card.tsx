import Image from "next/image";
import { CartControl } from "@/components/sections/menu/cart-control.client";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { MenuItem } from "@/types/api";

type MenuCardProps = {
  item: MenuItem;
  preload?: boolean;
};

export function MenuCard({ item, preload = false }: MenuCardProps) {
  return (
    <article
      aria-labelledby={`dish-${item.id}`}
      className={cn(
        "relative flex h-full min-h-120 flex-col items-center gap-5 rounded-[1.25rem] px-4.5 pt-6 pb-5 text-deep",
        item.chefsPick ? "bg-gold" : "bg-ivory",
      )}
    >
      {item.chefsPick && (
        <p className="absolute top-3.5 left-3.5 z-10 rounded-xl bg-deep px-2.5 py-1.25 text-[10px] leading-none font-semibold tracking-[0.8px] text-gold uppercase">
          Chef&apos;s pick
        </p>
      )}

      {/* The image carries its own plate shadow, so it overflows the 184px box. */}
      <div className="relative size-46 shrink-0">
        <Image
          src={item.image}
          alt={item.name}
          width={232}
          height={232}
          preload={preload}
          sizes="232px"
          className="absolute top-[-5.43%] left-[-13.04%] w-[126.08%] max-w-none"
        />
      </div>

      <div className="flex w-full flex-col gap-2 text-center">
        <h3
          id={`dish-${item.id}`}
          className="font-serif text-[25px] leading-[1.21] font-semibold"
        >
          {item.name}
        </h3>
        <p className="text-base leading-5 text-deep/70 sm:text-[13px]">
          {item.description}
        </p>
      </div>

      <div className="mt-auto w-full border-t border-deep/12 pt-5">
        <div className="flex items-center justify-between gap-3">
          <p className="font-serif text-[28px] leading-[1.21] font-semibold">
            {formatPrice(item.priceCents)}
          </p>
          <CartControl
            item={{
              id: item.id,
              name: item.name,
              priceCents: item.priceCents,
              image: item.image,
            }}
          />
        </div>
      </div>
    </article>
  );
}
