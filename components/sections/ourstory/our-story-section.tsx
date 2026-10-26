import Image from "next/image";
import { siteConfig } from "@/config/site";

const chapters = [
  {
    title: "Born from a love of long dinners.",
    body: `${siteConfig.name} started with a simple idea: a great meal is less about the plate and more about the people around it. Everything we do is in service of that feeling.`,
  },
  {
    title: "Our beginnings",
    lead: "A small kitchen with a big table.",
  },
  {
    title: "Recipes worth repeating",
    body: "The dishes people kept asking for became our signatures: a seared steak, a silky Alfredo and a Caesar done properly.",
  },
  {
    title: "How we cook",
    lead: "Simple food, done properly.",
    body: "We cook the way we like to eat. Produce that is good that week, patient technique, and nothing on the plate that has not earned its place. Sauces are built slowly, steak is rested, and salads are dressed at the last moment.",
  },
];

const beliefs = [
  "Honest ingredients. Fresh, carefully selected produce that lets every flavor speak for itself.",
  "Crafted with care. Thoughtful cooking, refined details, and familiar favorites made memorable.",
  "A warm welcome. Unhurried evenings, good conversation, and a space that feels like yours.",
];

const headingClass =
  "font-serif text-[clamp(2rem,2.778vw,2.5rem)] leading-[1.2] font-semibold tracking-[-0.4px] text-gold";

const bodyClass = "font-serif text-base leading-[1.3] font-medium text-ivory";

export function OurStorySection() {
  return (
    <section
      aria-labelledby="our-story-heading"
      className="relative overflow-hidden bg-deep"
    >
      {/* Position and size taken from the 1440px-wide Figma frame. */}
      <Image
        src="/images/our-story/emerald-glow.svg"
        alt=""
        width={1100}
        height={700}
        className="absolute top-145.75 left-[-24.653%] w-[76.389%] max-w-none min-w-160"
      />

      <div className="relative mx-auto w-full max-w-7xl px-4 pt-[calc(env(safe-area-inset-top)+9rem)] pb-16 sm:px-6 lg:px-8 lg:pb-8">
        <div className="lg:pl-6.25">
          <h1
            id="our-story-heading"
            className="font-serif text-5xl leading-[1.21] font-normal text-ivory lowercase"
          >
            Our story
          </h1>
          <Image
            src="/images/our-story/title-underline.svg"
            alt=""
            width={170}
            height={1}
            className="mt-2"
          />
        </div>

        <div className="mx-auto mt-10 flex max-w-2xl flex-col gap-14 text-center">
          {chapters.map((chapter) => (
            <article key={chapter.title}>
              <h2 className={headingClass}>{chapter.title}</h2>
              <div className="mt-4 space-y-1">
                {chapter.lead && <p className={bodyClass}>{chapter.lead}</p>}
                {chapter.body && <p className={bodyClass}>{chapter.body}</p>}
              </div>
            </article>
          ))}

          <article>
            <h2 className={headingClass}>What we believe</h2>
            <ul className="mx-auto mt-4 max-w-140 list-disc space-y-4 pl-6 text-left">
              {beliefs.map((belief) => (
                <li key={belief} className={bodyClass}>
                  {belief}
                </li>
              ))}
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}
