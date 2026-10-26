import Image from "next/image";
import { ContactForm } from "@/components/sections/contact/contact-form.client";
import { ContactInfo } from "@/components/sections/contact/contact-info";
import { PageTitle } from "@/components/ui/page-title";

export function ContactSection() {
  return (
    <section
      aria-labelledby="contact-heading"
      className="relative overflow-hidden bg-deep"
    >
      {/* Position and size taken from the 1440px-wide Figma frame. */}
      <Image
        src="/images/contact/emerald-glow.svg"
        alt=""
        width={1100}
        height={700}
        className="absolute top-48.5 left-[11.944%] w-[76.389%] max-w-none min-w-160"
      />

      <div className="relative mx-auto w-full max-w-7xl px-4 pt-[calc(env(safe-area-inset-top)+9rem)] pb-20 sm:px-6 lg:px-8 lg:pb-48">
        <PageTitle
          id="contact-heading"
          underlineSrc="/images/contact/title-underline.svg"
          underlineWidth={140}
        >
          Contact
        </PageTitle>

        <div className="mt-11 grid gap-12 lg:grid-cols-[minmax(0,456fr)_minmax(0,640fr)] lg:gap-18 lg:px-6.25">
          <ContactInfo />

          <div className="min-w-0 rounded-3xl border border-gold/22 bg-ivory/4 p-5 sm:p-10">
            <h2 className="font-serif text-[2rem] leading-[1.21] font-semibold text-ivory">
              Send us a message
            </h2>
            <p className="mt-1.5 text-sm text-ivory/60">
              We usually reply within 24 hours.
            </p>
            <ContactForm className="mt-6" />
          </div>
        </div>
      </div>
    </section>
  );
}
