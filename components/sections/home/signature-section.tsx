import Image from "next/image";
import { DishCard } from "@/components/sections/home/dish-card";
import { ButtonLink } from "@/components/ui/button-link";
import { siteConfig } from "@/config/site";

const dishes = [
  {
    category: "Signature",
    name: "Seared Steak",
    description:
      "Perfectly seared beef, roasted potatoes, seasonal vegetables, and a rich pan jus.",
    image: "/images/home/seared-steak-plate.webp",
    imageAlt: "Sliced seared steak with roasted potatoes and vegetables",
    offset: "",
  },
  {
    category: "Comfort",
    name: "Fettuccine Alfredo",
    description:
      "Silky ribbons of pasta, velvety Alfredo sauce, fresh herbs, and Parmigiano.",
    image: "/images/home/fettuccine-alfredo-plate.webp",
    imageAlt: "Fettuccine Alfredo topped with herbs and Parmigiano",
    offset: "lg:mt-17.25",
  },
  {
    category: "Fresh",
    name: "Caesar Salad",
    description:
      "Crisp romaine, shaved Parmesan, golden croutons, and our house dressing.",
    image: "/images/home/caesar-salad-plate.webp",
    imageAlt: "Caesar salad with romaine, shaved Parmesan and croutons",
    offset: "lg:mt-6.75",
  },
];

export function SignatureSection() {
  return (
    <section
      aria-labelledby="signature-heading"
      className="relative overflow-hidden bg-surface"
    >
      <Image
        src="/images/home/signature-backdrop.svg"
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
      />

      <div className="relative mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:pt-25 lg:pb-20">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-serif text-2xl leading-[1.21] font-medium text-gold italic">
              From our kitchen
            </p>
            <h2
              id="signature-heading"
              className="mt-2.75 font-serif text-[clamp(2.75rem,5.278vw,4.75rem)] leading-[1.06] font-medium tracking-[-1px] text-ivory"
            >
              The <em className="text-gold italic">signature</em> collection
            </h2>
            <p className="mt-6.25 max-w-130 text-base leading-[1.68] text-mist lg:text-lg">
              Twelve favorites, each made with care and a little bit of magic.
              Discover a new reason to stay awhile.
            </p>
          </div>
          <ButtonLink
            href={siteConfig.links.menu}
            variant="ghost"
            className="self-start lg:-mb-3.5 lg:self-auto"
          >
            Explore the menu
          </ButtonLink>
        </div>

        <ul className="mt-14 grid gap-16 sm:grid-cols-2 lg:mt-13.75 lg:grid-cols-3 lg:gap-15">
          {dishes.map(({ offset, ...dish }) => (
            <li key={dish.name} className={offset}>
              <DishCard {...dish} href={siteConfig.links.menu} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
