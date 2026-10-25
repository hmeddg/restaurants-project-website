import Image from "next/image";

const values = [
  {
    title: "Honest ingredients",
    description:
      "Fresh, carefully selected produce that lets every flavor speak for itself.",
  },
  {
    title: "Crafted with care",
    description:
      "Thoughtful cooking, refined details, and familiar favorites made memorable.",
  },
  {
    title: "A warm welcome",
    description:
      "Unhurried evenings, good conversation, and a space that feels like yours.",
  },
];

export function ValuesSection() {
  return (
    <section
      aria-labelledby="values-heading"
      className="relative overflow-hidden bg-surface"
    >
      <Image
        src="/images/home/values-backdrop.svg"
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
      />
      <Image
        src="/images/home/ghost-ring.webp"
        alt=""
        width={1120}
        height={1120}
        sizes="39vw"
        className="absolute top-[35.714%] left-[-13.194%] hidden w-[38.889%] lg:block"
      />

      <div className="relative mx-auto grid w-full max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:pt-30 lg:pb-17.5">
        <h2
          id="values-heading"
          className="font-serif text-[clamp(3.5rem,6.944vw,6.25rem)] leading-none font-medium tracking-[-1.6px] text-ivory lg:pt-7.5"
        >
          <span className="block">More than</span>
          <span className="block">
            a <em className="text-gold italic">meal.</em>
          </span>
        </h2>

        <ul className="w-full lg:max-w-160 lg:justify-self-end">
          {values.map((value) => (
            <li
              key={value.title}
              className="border-b border-gold/16 pt-2 pb-8 last:border-b-0 lg:min-h-42.5"
            >
              <h3 className="font-serif text-[clamp(1.875rem,2.778vw,2.5rem)] leading-[1.15] font-medium tracking-[-0.4px] text-ivory">
                {value.title}
              </h3>
              <p className="mt-5 max-w-135 text-base leading-[1.65] text-mist">
                {value.description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
