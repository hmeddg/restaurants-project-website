import Image from "next/image";
import { siteConfig } from "@/config/site";
import { holdMinutes, maxGuests } from "@/lib/reservation/constants";

export function ReserveInfo() {
  return (
    <div className="flex min-w-0 flex-col gap-8.25">
      <div>
        <p className="text-[11px] font-semibold tracking-[1.76px] text-gold uppercase">
          Book your evening
        </p>
        <h2 className="mt-4 font-serif text-[clamp(2.25rem,3.056vw,2.75rem)] leading-[1.14] font-semibold text-gold">
          <span className="block">A table is waiting</span>
          <span className="block">for you.</span>
        </h2>
        <p className="mt-4 text-base leading-6 text-ivory/72 lg:text-[15px]">
          Choose a date, a time and how many guests are joining. We&apos;ll hold
          your table for {holdMinutes} minutes after your booking time.
        </p>
      </div>

      <div className="relative aspect-456/361 w-full overflow-hidden rounded-[1.25rem]">
        <Image
          src="/images/reserve/restaurant-dining-room.webp"
          alt={`Candlelit dining room at ${siteConfig.name} with green velvet booths and set tables`}
          fill
          preload
          sizes="(min-width: 1440px) 456px, (min-width: 1024px) 40vw, 100vw"
          className="object-cover"
        />
      </div>

      <dl className="grid gap-6 sm:grid-cols-2">
        <div>
          <dt className="text-[11px] font-semibold tracking-[1.54px] text-gold uppercase">
            Large parties
          </dt>
          <dd className="mt-2 font-serif text-xl leading-6.5 font-medium text-ivory">
            <span className="block">Groups of {maxGuests + 1} or more,</span>
            <a
              href={siteConfig.phone.href}
              className="underline decoration-gold/50 underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              please call us.
            </a>
          </dd>
        </div>
        <div>
          <dt className="text-[11px] font-semibold tracking-[1.54px] text-gold uppercase">
            Dress code
          </dt>
          <dd className="mt-2 font-serif text-xl leading-6.5 font-medium text-ivory">
            <span className="block">Smart casual,</span>
            <span className="block">no rush, no fuss.</span>
          </dd>
        </div>
      </dl>
    </div>
  );
}
