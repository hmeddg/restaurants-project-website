import Image from "next/image";
import { cn } from "@/lib/utils";

const dishes = [
  "Seared Steak",
  "Fettuccine Alfredo",
  "Caesar Salad",
  "Grilled Salmon",
  "Mushroom Risotto",
  "Classic Tiramisu",
  "Burrata & Tomatoes",
  "Braised Short Rib",
];

export function MarqueeSection() {
  return (
    <section
      aria-label="Signature dishes"
      className="overflow-hidden border-y border-gold/20 bg-surface py-12"
    >
      {/* The list is rendered twice so the scroll loops seamlessly. */}
      <div className="flex w-max motion-safe:animate-marquee">
        {[false, true].map((isCopy) => (
          <ul
            key={String(isCopy)}
            aria-hidden={isCopy || undefined}
            className="flex shrink-0 items-center"
          >
            {dishes.map((dish, index) => (
              <li key={dish} className="flex items-center gap-14 pr-14">
                <span
                  className={cn(
                    "font-serif text-[clamp(3rem,5.833vw,5.25rem)] leading-[1.21] font-medium tracking-[-1px] whitespace-nowrap italic",
                    index % 2 === 0
                      ? "text-ivory"
                      : "text-transparent [-webkit-text-stroke:1px_var(--color-gold)]",
                  )}
                >
                  {dish}
                </span>
                <Image
                  src="/images/home/marquee-diamond.svg"
                  alt=""
                  width={14}
                  height={14}
                />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </section>
  );
}
