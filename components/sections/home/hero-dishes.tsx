import Image from "next/image";
import { cn } from "@/lib/utils";

// Positions are percentages of the 1440×540 dish area in the Figma hero,
// so the composition scales with the viewport. Labels and arrows are
// percentages of their own plate.
const dishes = [
  {
    src: "/images/home/seared-steak-plate.webp",
    alt: "Seared steak with roasted potatoes and seasonal vegetables",
    position: "top-[31.111%] left-[8.472%] w-[18.4375%]",
    plate: "aspect-square",
    sizes: "(min-width: 1440px) 266px, 19vw",
    labels: [
      { text: "Seared steak", position: "top-[33.22%] left-[-27.119%]" },
      { text: "Roasted potatoes", position: "top-[43.39%] left-[101.017%]" },
      { text: "Seasonal vegetables", position: "top-[84.068%] left-[81.695%]" },
    ],
    arrows: [
      {
        src: "/images/home/label-arrow-seared-steak.svg",
        width: 90,
        height: 19.8,
        position: "top-[43.655%] left-[-7.102%] w-[33.898%] rotate-[24.55deg]",
      },
      {
        src: "/images/home/label-arrow-roasted-potatoes.svg",
        width: 75.6,
        height: 70.2,
        position: "top-[28.136%] left-[71.525%] w-[28.475%]",
      },
      {
        src: "/images/home/label-arrow-seasonal-vegetables.svg",
        width: 81.9,
        height: 83.7,
        position: "top-[55.254%] left-[76.61%] w-[30.847%]",
      },
    ],
  },
  {
    src: "/images/home/fettuccine-alfredo-plate.webp",
    alt: "Fettuccine Alfredo with fresh herbs and shaved Parmesan",
    position: "top-[19.444%] left-[34.722%] w-[30.556%]",
    plate: "aspect-[440/429.44]",
    sizes: "(min-width: 1440px) 440px, 31vw",
    preload: true,
    labels: [
      { text: "Fettuccine", position: "top-[12.91%] left-[10.2%]" },
      { text: "Alfredo sauce", position: "top-[79.098%] left-[-16.2%]" },
      { text: "Parmesan", position: "top-[82.172%] left-[90.6%]" },
    ],
    arrows: [
      {
        src: "/images/home/label-arrow-fettuccine.svg",
        width: 108.24,
        height: 32.56,
        position: "top-[22.745%] left-[6.2%] w-[24.6%] rotate-[38.83deg]",
      },
      {
        src: "/images/home/label-arrow-alfredo-sauce.svg",
        width: 73.04,
        height: 59.84,
        position: "top-[68.238%] left-[6.2%] w-[16.6%]",
      },
      {
        src: "/images/home/label-arrow-alfredo-parmesan.svg",
        width: 179.52,
        height: 190.08,
        position: "top-[37.91%] left-[53.8%] w-[40.8%]",
      },
    ],
  },
  {
    src: "/images/home/caesar-salad-plate.webp",
    alt: "Caesar salad with romaine lettuce, croutons and Parmesan",
    position: "top-[29.63%] left-[73.958%] w-[17.375%]",
    plate: "aspect-square",
    sizes: "(min-width: 1440px) 250px, 18vw",
    labels: [
      { text: "Romaine lettuce", position: "top-[71.223%] left-[-21.223%]" },
      { text: "Croutons", position: "top-[51.079%] left-[106.835%]" },
      { text: "Parmesan", position: "top-[103.957%] left-[60.432%]" },
    ],
    arrows: [
      {
        src: "/images/home/label-arrow-romaine-lettuce.svg",
        width: 69.3,
        height: 30.6,
        position: "top-[57.914%] left-[-4.676%] w-[27.698%]",
      },
      {
        src: "/images/home/label-arrow-croutons.svg",
        width: 106.2,
        height: 38.7,
        position: "top-[43.525%] left-[64.388%] w-[42.446%]",
      },
      {
        src: "/images/home/label-arrow-caesar-parmesan.svg",
        width: 72,
        height: 130.5,
        position: "top-[55.036%] left-[34.892%] w-[28.777%]",
      },
    ],
  },
];

const steams = [
  "top-[29.63%] left-[13.75%]",
  "top-[29.63%] left-[44.097%] [animation-delay:-0.8s]",
];

type HeroDishesProps = {
  className?: string;
};

export function HeroDishes({ className }: HeroDishesProps) {
  return (
    <div className={cn("@container relative aspect-1440/540", className)}>
      <Image
        src="/images/home/hero-rings.svg"
        alt=""
        width={640}
        height={640}
        className="absolute top-0 left-[27.778%] w-[44.444%]"
      />

      {dishes.map((dish) => (
        <div key={dish.src} className={cn("absolute", dish.position)}>
          <div
            className={cn(
              "relative transition-transform duration-400 ease-out hover:scale-108 hover:rotate-12 motion-reduce:transition-none",
              dish.plate,
            )}
          >
            <Image
              src={dish.src}
              alt={dish.alt}
              fill
              sizes={dish.sizes}
              preload={dish.preload}
              className="object-contain"
            />
          </div>
          {dish.arrows.map((arrow) => (
            <Image
              key={arrow.src}
              src={arrow.src}
              alt=""
              width={arrow.width}
              height={arrow.height}
              className={cn("absolute hidden h-auto xl:block", arrow.position)}
            />
          ))}
          {dish.labels.map((label) => (
            <p
              key={label.text}
              className={cn(
                "absolute hidden text-[0.75cqw] leading-[1.2] font-medium tracking-[0.03em] whitespace-nowrap text-ivory xl:block",
                label.position,
              )}
            >
              {label.text}
            </p>
          ))}
        </div>
      ))}

      {steams.map((position) => (
        <Image
          key={position}
          src="/images/home/steam.svg"
          alt=""
          width={160}
          height={240}
          className={cn(
            "pointer-events-none absolute w-[11.111%] motion-safe:animate-steam",
            position,
          )}
        />
      ))}

      <div
        aria-hidden="true"
        className="absolute top-[75.806%] left-[39.788%] aspect-42/77 w-[2.917%] rotate-[-88.73deg]"
      >
        <Image
          src="/images/home/basil-leaf.svg"
          alt=""
          width={73.632}
          height={121.177}
          className="absolute top-[-4.2%] left-[-17.5%] h-[110.16%] w-[122.72%] max-w-none"
        />
      </div>
    </div>
  );
}
