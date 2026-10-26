import Image from "next/image";
import { Suspense } from "react";
import { BookingCard } from "@/components/sections/reserve/booking-card";
import { BookingSkeleton } from "@/components/sections/reserve/booking-skeleton";
import { ReserveInfo } from "@/components/sections/reserve/reserve-info";
import { PageTitle } from "@/components/ui/page-title";

export function ReserveSection() {
  return (
    <section
      aria-labelledby="reserve-heading"
      className="relative overflow-hidden bg-deep"
    >
      {/* Position and size taken from the 1440px-wide Figma frame. */}
      <Image
        src="/images/reserve/emerald-glow.svg"
        alt=""
        width={1100}
        height={700}
        className="absolute top-128 left-[-14.236%] w-[76.389%] max-w-none min-w-160"
      />

      <div className="relative mx-auto w-full max-w-7xl px-4 pt-[calc(env(safe-area-inset-top)+7.5rem)] pb-20 sm:px-6 lg:px-8 lg:pb-12.5">
        <PageTitle
          id="reserve-heading"
          underlineSrc="/images/reserve/title-underline.svg"
          underlineWidth={266}
        >
          Reserve a table
        </PageTitle>

        <div className="mt-12.5 grid items-start gap-12 lg:grid-cols-[minmax(0,457fr)_minmax(0,642fr)] lg:gap-18 lg:px-6.25">
          <ReserveInfo />

          <div className="min-w-0 rounded-lg border border-gold/22 bg-ivory/4 p-5 sm:p-9">
            <Suspense fallback={<BookingSkeleton />}>
              <BookingCard />
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  );
}
