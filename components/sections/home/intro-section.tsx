import Image from "next/image";

export function IntroSection() {
  return (
    <section
      aria-labelledby="intro-heading"
      className="relative overflow-hidden bg-deep"
    >
      <Image
        src="/images/home/intro-backdrop.svg"
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
      />

      <div className="relative mx-auto grid w-full max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:gap-0 lg:px-8 lg:pt-28 lg:pb-18.5">
        <div className="min-w-0">
          <h2
            id="intro-heading"
            className="font-serif text-[clamp(2.75rem,5.556vw,5rem)] leading-[1.06] font-medium tracking-[-1.2px] text-ivory"
          >
            <span className="block">A place where</span>
            <span className="block">every meal becomes</span>
            <span className="block">
              a <em className="text-gold italic">memory.</em>
            </span>
          </h2>
          <p className="mt-10 max-w-125 text-base leading-[1.68] text-mist lg:mt-17.25 lg:text-lg">
            We bring people together over honest ingredients, exquisite flavors
            and the simple joy of sharing a table. Come hungry. Leave with a
            story.
          </p>
        </div>

        <div className="relative aspect-623/385 w-full overflow-hidden rounded-photo lg:mt-5 min-[90rem]:ml-17.25 min-[90rem]:w-155.75 min-[90rem]:max-w-none">
          <Image
            src="/images/home/friends-sharing-a-meal.webp"
            alt="Friends sharing burgers, fries and drinks around a restaurant table"
            fill
            sizes="(min-width: 1440px) 623px, (min-width: 1024px) 50vw, 100vw"
            className="object-cover object-top"
          />
        </div>
      </div>
    </section>
  );
}
