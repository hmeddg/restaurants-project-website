import type { ReactNode } from "react";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

const { address, phone, email, hours } = siteConfig;

const linkClass =
  "-my-2 inline-block rounded-md py-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold";

const details: { label: string; value: ReactNode }[] = [
  {
    label: "Visit us",
    value: (
      <address className="not-italic">
        <span className="block">{address.street}</span>
        <span className="block">
          {address.locality}, {address.region} {address.postalCode}
        </span>
      </address>
    ),
  },
  {
    label: "Call us",
    value: (
      <a href={phone.href} className={linkClass}>
        {phone.display}
      </a>
    ),
  },
  {
    label: "Email",
    value: (
      <a href={`mailto:${email}`} className={cn(linkClass, "break-all")}>
        {email}
      </a>
    ),
  },
  {
    label: "Opening hours",
    value: hours.map((slot) => (
      <span key={slot.days} className="block">
        {slot.days}
        <span className="ml-2.5">{slot.time}</span>
      </span>
    )),
  },
];

export function ContactInfo() {
  return (
    <div className="min-w-0">
      <p className="text-[11px] font-semibold tracking-[1.76px] text-gold uppercase">
        Get in touch
      </p>
      <h2 className="mt-4 font-serif text-[clamp(2.25rem,3.056vw,2.75rem)] leading-[1.14] font-semibold text-gold">
        <span className="block">We&apos;d love to hear</span>
        <span className="block">from you.</span>
      </h2>
      <p className="mt-4 text-base leading-6 text-ivory/72 lg:text-[15px]">
        Questions about the menu, a private dinner or a special occasion? Send
        us a note or drop by, we&apos;re always happy to talk food.
      </p>

      <dl className="mt-10 border-t border-ivory/14">
        {details.map((detail) => (
          <div
            key={detail.label}
            className="flex flex-col gap-1 border-b border-ivory/14 py-4.5 sm:flex-row sm:gap-6"
          >
            <dt className="shrink-0 text-[11px] leading-6.5 font-semibold tracking-[1.54px] text-gold uppercase sm:w-35">
              {detail.label}
            </dt>
            <dd className="min-w-0 font-serif text-[22px] leading-7 font-medium text-ivory">
              {detail.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
