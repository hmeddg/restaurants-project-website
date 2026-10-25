import Image from "next/image";
import { ButtonLink } from "@/components/ui/button-link";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

// Leaf boxes are percentages of the 1440×620 Figma section.
const leaves = [
  "top-[65.442%] left-[13.513%] rotate-[-32deg]",
  "top-[20.453%] left-[82.624%] rotate-[38deg]",
];

export function ReservationSection() {
  return (
    <section
      id="reservation"
      aria-labelledby="reservation-heading"
      className="relative overflow-hidden bg-deep"
    >
      <Image
        src="/images/home/reservation-backdrop.svg"
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
      />
      {leaves.map((position) => (
        <div
          key={position}
          aria-hidden="true"
          className={cn(
            "absolute hidden aspect-60/110 w-[4.167%] lg:block",
            position,
          )}
        >
          <Image
            src="/images/home/basil-leaf.svg"
            alt=""
            width={73.632}
            height={121.177}
            className="absolute top-[-4.2%] left-[-17.5%] h-[110.16%] w-[122.72%] max-w-none"
          />
        </div>
      ))}

      <div className="relative mx-auto w-full max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8 lg:pt-30 lg:pb-34">
        <p className="font-serif text-[26px] leading-[1.21] font-medium text-gold italic">
          Your table is waiting
        </p>
        <h2
          id="reservation-heading"
          className="mt-3.25 font-serif text-[clamp(3rem,6.667vw,6rem)] leading-[1.06] font-medium tracking-[-1.4px] text-ivory"
        >
          Make tonight <em className="text-gold italic">memorable.</em>
        </h2>
        <p className="mx-auto mt-10.5 max-w-160 text-base leading-[1.68] text-mist lg:text-lg">
          Whether it is a celebration or simply the pleasure of being together,
          we would love to welcome you.
        </p>
        <ButtonLink href={siteConfig.links.reserve} className="mt-15">
          Reserve a table
        </ButtonLink>
      </div>
    </section>
  );
}
