import Image from "next/image";
import { CircularText } from "@/components/ui/circular-text";
import { cn } from "@/lib/utils";

type HeroSealProps = {
  className?: string;
};

export function HeroSeal({ className }: HeroSealProps) {
  return (
    <div aria-hidden="true" className={cn("size-37.5", className)}>
      <CircularText
        id="hero-seal-path"
        text="ELEVER  GOOD FOOD  BEAUTIFUL MOMENTS  "
        size={150}
        radius={61}
        fontSize={10}
        className="absolute inset-0 size-full"
      />
      <Image
        src="/images/home/seal-core.svg"
        alt=""
        width={84}
        height={84}
        className="absolute top-8.25 left-8.25 size-21"
      />
      <span className="absolute inset-0 flex items-center justify-center pb-1 font-serif text-[46px] leading-none font-medium text-gold italic">
        e
      </span>
    </div>
  );
}
