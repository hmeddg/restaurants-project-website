import type { Metadata } from "next";
import { ReserveSection } from "@/components/sections/reserve/reserve-section";
import { siteConfig } from "@/config/site";

const title = "Reserve a Table — Book Your Evening Online Today";
const description = `Book a table at ${siteConfig.name} in New York. Choose a date, a time and your party size, and get an instant confirmation for a relaxed evening with us.`;
const path = siteConfig.links.reserve;

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

export default function ReservePage() {
  return <ReserveSection />;
}
