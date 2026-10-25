import Image from "next/image";
import Link from "next/link";
import { ArrowUpRightIcon } from "@/components/icons/arrow-up-right-icon";
import { cn } from "@/lib/utils";

type DishCardProps = {
  category: string;
  name: string;
  description: string;
  image: string;
  imageAlt: string;
  href: string;
  className?: string;
};

export function DishCard({
  category,
  name,
  description,
  image,
  imageAlt,
  href,
  className,
}: DishCardProps) {
  return (
    <article className={cn("relative", className)}>
      <div
        aria-hidden="true"
        className="absolute -top-2.5 left-[-7.895%] hidden w-[115.789%] lg:block"
      >
        <Image
          src="/images/home/halo-ring.webp"
          alt=""
          width={880}
          height={880}
          sizes="(min-width: 1280px) 422px, 33vw"
          className="w-full"
        />
        <Image
          src="/images/home/halo-dot.svg"
          alt=""
          width={7}
          height={7}
          className="absolute top-[-3.5px] left-1/2 -translate-x-1/2"
        />
      </div>

      <div className="relative mt-4 aspect-380/350 rounded-t-full border border-gold/28 bg-radial-[62%_62%_at_50%_52%] from-arch-inner via-arch-mid to-arch-outer">
        <div className="absolute top-[14.286%] left-[11.579%] aspect-square w-[76.842%]">
          <Image
            src={image}
            alt={imageAlt}
            fill
            sizes="(min-width: 1280px) 280px, (min-width: 1024px) 24vw, (min-width: 640px) 37vw, 77vw"
            className="object-contain"
          />
        </div>
      </div>

      <p className="relative mt-4.5 font-serif text-[22px] leading-[1.2] tracking-[0.2px] text-gold italic">
        {category}
      </p>
      <h3 className="relative mt-1 font-serif text-[clamp(1.875rem,2.639vw,2.375rem)] leading-[1.1] font-medium tracking-[-0.4px] text-ivory">
        {name}
      </h3>
      <p className="relative mt-2.5 max-w-85 text-base leading-[1.6] text-mist lg:text-[15px]">
        {description}
      </p>
      <Link
        href={href}
        className="group relative mt-5 inline-flex min-h-11 items-center gap-2 text-sm leading-[1.2] font-medium tracking-[0.4px] text-ivory focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
      >
        View dish<span className="sr-only">: {name}</span>
        <ArrowUpRightIcon className="size-3.5 text-gold" />
        <span
          aria-hidden="true"
          className="absolute bottom-1.5 left-0 h-px w-full origin-left scale-x-0 bg-gold transition-transform duration-300 group-hover:scale-x-100 group-focus-visible:scale-x-100 motion-reduce:transition-none"
        />
      </Link>
    </article>
  );
}
