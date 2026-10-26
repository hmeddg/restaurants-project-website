import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type PrimaryButtonProps = ComponentProps<"button">;

export function PrimaryButton({
  className,
  children,
  type = "submit",
  ...props
}: PrimaryButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "group inline-flex min-h-14 items-center justify-center gap-2.5 rounded-full bg-gold px-7 text-[15px] leading-5.5 font-semibold text-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold disabled:cursor-wait disabled:opacity-70",
        className,
      )}
      {...props}
    >
      {children}
      <span
        aria-hidden="true"
        className="text-base font-medium transition-transform duration-200 group-hover:translate-x-0.5 group-focus-visible:translate-x-0.5 motion-reduce:transition-none"
      >
        →
      </span>
    </button>
  );
}
