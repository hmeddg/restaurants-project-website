"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { CloseIcon } from "@/components/icons/close-icon";
import { MenuIcon } from "@/components/icons/menu-icon";
import { ButtonLink } from "@/components/ui/button-link";
import { siteConfig } from "@/config/site";

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold";

const menuLinks = siteConfig.nav;

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const button = buttonRef.current;
    const panel = panelRef.current;
    const getFocusable = () => [
      ...(button ? [button] : []),
      ...(panel
        ? Array.from(panel.querySelectorAll<HTMLElement>("a[href]"))
        : []),
    ];

    getFocusable()[1]?.focus();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        button?.focus();
        return;
      }
      if (event.key !== "Tab") return;

      const items = getFocusable();
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }

    // Close if the viewport grows past the mobile breakpoint while open.
    const desktop = window.matchMedia("(min-width: 80rem)");
    function onBreakpoint(event: MediaQueryListEvent) {
      if (event.matches) setOpen(false);
    }

    document.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", onBreakpoint);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onBreakpoint);
    };
  }, [open]);

  return (
    <div className="xl:hidden">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((value) => !value)}
        className={`flex size-14 items-center justify-center rounded-full bg-gold/14 text-gold ${focusRing}`}
      >
        {open ? (
          <CloseIcon className="size-6" />
        ) : (
          <MenuIcon className="size-6" />
        )}
      </button>

      <div
        ref={panelRef}
        id={panelId}
        hidden={!open}
        className="absolute inset-x-0 top-full mt-2 max-h-[calc(100dvh-6.5rem-env(safe-area-inset-top))] overflow-y-auto rounded-3xl border border-gold/20 bg-deep p-4"
      >
        <nav aria-label="Mobile">
          <ul className="flex flex-col gap-1">
            {menuLinks.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`flex min-h-12 items-center rounded-2xl px-4 text-base font-medium text-ivory ${focusRing}`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <ButtonLink
            href={siteConfig.links.reserve}
            onClick={() => setOpen(false)}
            className="mt-4 w-full justify-between"
          >
            Reserve a table
          </ButtonLink>
        </nav>
      </div>
    </div>
  );
}
