import type { Metadata } from "next";
import { ContactSection } from "@/components/sections/contact/contact-section";
import { siteConfig } from "@/config/site";

const title = "Contact Us — Questions, Private Dinners and Events";
const description = `Contact ${siteConfig.name} about the menu, a private dinner or a special occasion. Find our address, phone number and opening hours, or send us a message.`;
const path = siteConfig.links.contact;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: {
    type: "website",
    url: path,
    siteName: siteConfig.name,
    title,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

const { address } = siteConfig;

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: siteConfig.name,
  url: siteConfig.url,
  email: siteConfig.email,
  telephone: siteConfig.phone.href.replace("tel:", ""),
  address: {
    "@type": "PostalAddress",
    streetAddress: address.street,
    addressLocality: address.locality,
    addressRegion: address.region,
    postalCode: address.postalCode,
    addressCountry: address.country,
  },
  openingHours: siteConfig.hours.map((slot) => slot.schema),
};

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <ContactSection />
    </>
  );
}
