import Image from "next/image";
import { HeroDishes } from "@/components/sections/home/hero-dishes";
import { HeroSeal } from "@/components/sections/home/hero-seal";
import { ButtonLink } from "@/components/ui/button-link";
import { siteConfig } from "@/config/site";

export function HeroSection() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden bg-deep"
    >
      <Image
        src="/images/home/hero-backdrop.svg"
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-37.5 bg-linear-to-b from-surface/0 to-surface"
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pt-[calc(env(safe-area-inset-top)+8rem)] text-center sm:px-6 lg:px-8">
        <HeroSeal className="absolute top-47.25 right-18 hidden lg:block" />

        <p className="text-xs leading-[1.3] font-bold tracking-[3.2px] text-gold uppercase">
          A celebration of taste
        </p>
        <h1
          id="hero-heading"
          className="mt-2 font-serif text-[clamp(3rem,6.25vw,5.625rem)] font-medium"
        >
          <span className="block leading-none tracking-[-1.4px] text-ivory">
            Good food.
          </span>
          <span className="-mt-1 block leading-[1.12] tracking-[-1.2px] text-gold italic">
            Beautiful moments.
          </span>
        </h1>
        <p className="mt-3.75 text-base leading-[1.55] text-mist sm:text-lg">
          Thoughtfully crafted plates,
          <br />
          unforgettable evenings.
        </p>
        <div className="mt-4.5 flex flex-wrap justify-center gap-4">
          <ButtonLink href={siteConfig.links.reserve}>
            Reserve a table
          </ButtonLink>
          <ButtonLink href={siteConfig.links.menu} variant="ghost">
            Explore the menu
          </ButtonLink>
        </div>
      </div>

      <HeroDishes className="mt-[-8.75%] ml-[-25%] w-[150%] sm:mx-auto sm:mt-[-5.833%] sm:w-full sm:max-w-360" />
    </section>
  );
}
