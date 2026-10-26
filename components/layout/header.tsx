import Link from "next/link";
import { Suspense } from "react";
import { MobileMenu } from "@/components/layout/mobile-menu.client";
import { NavLink } from "@/components/layout/nav-link.client";
import { ButtonLink } from "@/components/ui/button-link";
import { TextLink } from "@/components/ui/text-link";
import { siteConfig } from "@/config/site";

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold";

export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 pt-[calc(env(safe-area-inset-top)+1.25rem)]">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between gap-4 rounded-full border border-gold/20 bg-deep/58 py-1 pr-1 pl-6 backdrop-blur-md sm:pl-9">
          <Link
            href="/"
            className={`rounded-md font-serif text-[34px] leading-none font-medium tracking-[-0.4px] text-gold italic ${focusRing}`}
          >
            {siteConfig.name}
          </Link>

          <nav
            aria-label="Main"
            className="absolute top-1/2 left-1/2 hidden -translate-1/2 xl:block"
          >
            <ul className="flex gap-7">
              {siteConfig.nav.map((item) => (
                <li key={item.href} className="w-22">
                  <Suspense
                    fallback={
                      <TextLink href={item.href}>{item.label}</TextLink>
                    }
                  >
                    <NavLink href={item.href}>{item.label}</NavLink>
                  </Suspense>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <ButtonLink
              href={siteConfig.links.reserve}
              className="hidden sm:inline-flex"
            >
              Reserve a table
            </ButtonLink>
            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
