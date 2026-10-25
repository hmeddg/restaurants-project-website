import Link from "next/link";
import type { ComponentProps } from "react";
import { ArrowUpRightIcon } from "@/components/icons/arrow-up-right-icon";
import { cn } from "@/lib/utils";

type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: "primary" | "ghost";
};

export function ButtonLink({
  variant = "primary",
  className,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={cn(
        "group inline-flex shrink-0 items-center gap-5 rounded-full py-2 pr-2 pl-7 text-sm font-medium tracking-[0.3px] whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold",
        variant === "primary" && "bg-gold text-deep",
        variant === "ghost" && "border border-gold/40 text-ivory",
        className,
      )}
      {...props}
    >
      {children}
      <span
        className={cn(
          "flex size-10 items-center justify-center rounded-full text-gold",
          variant === "primary" ? "bg-deep" : "bg-gold/14",
        )}
      >
        <ArrowUpRightIcon className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-focus-visible:translate-x-0.5 group-focus-visible:-translate-y-0.5 motion-reduce:transition-none" />
      </span>
    </Link>
  );
}
