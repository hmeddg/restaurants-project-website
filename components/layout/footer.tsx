import Link from "next/link";
import { AnchorTextLink } from "@/components/ui/anchor-text-link";
import { TextLink } from "@/components/ui/text-link";
import { siteConfig } from "@/config/site";

const columns = [
  {
    title: "Explore",
    links: [
      { label: "Our Story", href: siteConfig.links.about },
      { label: "The Menu", href: siteConfig.links.menu },
    ],
  },
  {
    title: "Visit",
    links: [
      { label: "Reservations", href: siteConfig.links.reserve },
      { label: "Contact", href: siteConfig.links.contact },
    ],
  },
] as const;

export function Footer() {
  return (
    <footer className="bg-surface pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto w-full max-w-7xl px-4 pt-15.5 pb-9.5 sm:px-6 lg:px-8">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_repeat(3,11.25rem)] lg:gap-x-20">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link
              href="/"
              className="rounded-md font-serif text-[50px] leading-none font-medium tracking-[-0.6px] text-ivory italic focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              {siteConfig.name}
            </Link>
            <p className="mt-6.5 max-w-85 text-base leading-[1.65] text-mist lg:text-[15px]">
              {siteConfig.statement}
            </p>
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <h2 className="font-serif text-2xl leading-[1.21] font-medium text-gold italic">
                {column.title}
              </h2>
              <ul className="mt-3.5">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <TextLink href={link.href}>{link.label}</TextLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h2 className="font-serif text-2xl leading-[1.21] font-medium text-gold italic">
              Stay in touch
            </h2>
            <ul className="mt-3.5">
              <li>
                <AnchorTextLink href={siteConfig.social.instagram} external>
                  Instagram ↗
                </AnchorTextLink>
              </li>
              <li>
                <AnchorTextLink
                  href={`mailto:${siteConfig.email}`}
                  className="break-all"
                >
                  {siteConfig.email}
                </AnchorTextLink>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-19.5 border-t border-gold/20 pt-5">
          <p className="text-xs leading-[1.3] whitespace-pre text-smoke">
            {`© 2026 ${siteConfig.name}  design`}
          </p>
        </div>
      </div>
    </footer>
  );
}
