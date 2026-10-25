import type { ComponentProps } from "react";
import {
  textLinkClass,
  textLinkDashClass,
} from "@/components/ui/text-link-styles";
import { cn } from "@/lib/utils";

type AnchorTextLinkProps = ComponentProps<"a"> & {
  external?: boolean;
};

export function AnchorTextLink({
  external = false,
  className,
  children,
  ...props
}: AnchorTextLinkProps) {
  return (
    <a
      className={cn(textLinkClass, className)}
      {...(external && { target: "_blank", rel: "noopener noreferrer" })}
      {...props}
    >
      {children}
      <span aria-hidden="true" className={textLinkDashClass} />
    </a>
  );
}
