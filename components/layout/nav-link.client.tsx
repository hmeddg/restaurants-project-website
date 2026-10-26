"use client";

import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";
import { TextLink } from "@/components/ui/text-link";
import { cn } from "@/lib/utils";

type NavLinkProps = ComponentProps<typeof TextLink> & {
  href: string;
};

export function NavLink({ href, className, ...props }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <TextLink
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={cn(isActive && "text-gold", className)}
      {...props}
    />
  );
}
