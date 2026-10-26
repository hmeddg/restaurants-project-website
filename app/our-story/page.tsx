import type { Metadata } from "next";
import { OurStorySection } from "@/components/sections/ourstory/our-story-section";
import { siteConfig } from "@/config/site";

const title = "Our Story — Born From a Love of Long Dinners";
const description = `Discover the story of ${siteConfig.name}: a small kitchen with a big table, recipes worth repeating, honest ingredients and a warm welcome for unhurried evenings.`;
const path = siteConfig.links.about;

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

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
    {
      "@type": "ListItem",
      position: 2,
      name: "Our Story",
      item: `${siteConfig.url}${path}`,
    },
  ],
};

export default function OurStoryPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <OurStorySection />
    </>
  );
}
