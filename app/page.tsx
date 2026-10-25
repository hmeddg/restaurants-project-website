import type { Metadata } from "next";
import { HeroSection } from "@/components/sections/home/hero-section";
import { IntroSection } from "@/components/sections/home/intro-section";
import { MarqueeSection } from "@/components/sections/home/marquee-section";
import { ReservationSection } from "@/components/sections/home/reservation-section";
import { SignatureSection } from "@/components/sections/home/signature-section";
import { StorySection } from "@/components/sections/home/story-section";
import { ValuesSection } from "@/components/sections/home/values-section";
import { siteConfig } from "@/config/site";

const title = "elever Restaurant | Good Food and Beautiful Moments";

export const metadata: Metadata = {
  title: { absolute: title },
  description: siteConfig.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: siteConfig.name,
    title,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: siteConfig.description,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: siteConfig.name,
  url: siteConfig.url,
  email: siteConfig.email,
  description: siteConfig.description,
  sameAs: [siteConfig.social.instagram],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <HeroSection />
      <MarqueeSection />
      <IntroSection />
      <SignatureSection />
      <StorySection />
      <ValuesSection />
      <ReservationSection />
    </>
  );
}
