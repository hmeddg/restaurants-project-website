import Image from "next/image";
import { CircularText } from "@/components/ui/circular-text";
import { TextLink } from "@/components/ui/text-link";
import { siteConfig } from "@/config/site";

const sealText = "MADE WITH INTENTION  SERVED WITH WARMTH  ".repeat(4);

export function StorySection() {
  return (
    <section
      id="story"
      aria-labelledby="story-heading"
      className="relative overflow-hidden bg-deep lg:grid lg:grid-cols-2"
    >
      {/* Positions are percentages of the 720×720 plate panel in Figma. */}
      <div className="relative aspect-square w-full lg:max-w-180 lg:justify-self-end">
        <Image
          src="/images/home/story-glow.svg"
          alt=""
          width={1000}
          height={1000}
          className="absolute top-[-19.444%] left-[-19.444%] w-[138.889%] max-w-none"
        />
        <Image
          src="/images/home/story-plate-glow.svg"
          alt=""
          width={560}
          height={560}
          className="absolute top-[11.111%] left-[11.111%] w-[77.778%]"
        />
        <CircularText
          id="story-seal-path"
          text={sealText}
          size={600}
          radius={285}
          fontSize={11}
          className="absolute top-[8.333%] left-[8.333%] w-[83.333%]"
        />
        <Image
          src="/images/home/story-plate-ring.svg"
          alt=""
          width={520}
          height={520}
          className="absolute top-[13.889%] left-[13.889%] w-[72.222%]"
        />
        <Image
          src="/images/home/story-plate-orbit.svg"
          alt=""
          width={520}
          height={524}
          className="absolute top-[13.333%] left-[13.889%] w-[72.222%]"
        />
        <div className="absolute top-[20.139%] left-[20.139%] aspect-square w-[59.722%]">
          <Image
            src="/images/home/fettuccine-alfredo-plate.webp"
            alt="Fettuccine Alfredo with Parmigiano on a speckled ceramic plate"
            fill
            sizes="(min-width: 1440px) 430px, (min-width: 1024px) 30vw, 60vw"
            className="object-contain"
          />
        </div>
      </div>

      <div className="relative bg-surface px-4 py-16 sm:px-6 lg:px-12 lg:pt-32 lg:pb-40.75 xl:px-25">
        <h2
          id="story-heading"
          className="font-serif text-[clamp(2.75rem,5.139vw,4.625rem)] leading-[1.06] font-medium tracking-[-1px] text-ivory"
        >
          <span className="block">An invitation to</span>
          <em className="block text-gold italic">slow down.</em>
        </h2>
        <p className="mt-10.25 max-w-120 text-base leading-[1.7] text-mist lg:text-[17px]">
          At {siteConfig.name}, the best moments happen around a table. We take
          familiar dishes and make them feel extraordinary through thoughtful
          technique, fresh produce and genuine hospitality.
        </p>
        <p className="mt-5.5 max-w-120 text-base leading-[1.7] text-mist lg:text-[17px]">
          Every detail, from the first welcome to the last bite, is designed to
          feel like it belongs to you.
        </p>
        <TextLink href={siteConfig.links.about} className="mt-5">
          Discover the experience ↗
        </TextLink>
      </div>
    </section>
  );
}
