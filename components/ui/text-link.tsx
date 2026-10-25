import Link from "next/link";
import type { ComponentProps } from "react";
import {
  textLinkClass,
  textLinkDashClass,
} from "@/components/ui/text-link-styles";
import { cn } from "@/lib/utils";

type TextLinkProps = ComponentProps<typeof Link>;

export function TextLink({ className, children, ...props }: TextLinkProps) {
  return (
    <Link className={cn(textLinkClass, className)} {...props}>
      {children}
      <span aria-hidden="true" className={textLinkDashClass} />
    </Link>
  );
}
