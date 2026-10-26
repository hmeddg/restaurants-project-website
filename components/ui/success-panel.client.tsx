"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { CheckIcon } from "@/components/icons/check-icon";
import { cn } from "@/lib/utils";

type SuccessPanelProps = {
  eyebrow: string;
  title: string;
  message: ReactNode;
  details?: { label: string; value: ReactNode }[];
  children?: ReactNode;
  className?: string;
};

export function SuccessPanel({
  eyebrow,
  title,
  message,
  details,
  children,
  className,
}: SuccessPanelProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  // The form that triggered this view is gone, so move focus here for keyboard
  // and screen reader users instead of leaving it on <body>.
  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <div className={cn("@container flex flex-col items-start", className)}>
      <span className="flex size-14 items-center justify-center rounded-full border border-gold/40 bg-gold/14 text-gold motion-safe:animate-pop-in">
        <CheckIcon className="size-6" />
      </span>
      <p className="mt-6 text-[11px] font-semibold tracking-[1.76px] text-gold uppercase">
        {eyebrow}
      </p>
      <h2
        ref={headingRef}
        tabIndex={-1}
        className="mt-3 font-serif text-[clamp(2rem,3vw,2.5rem)] leading-[1.15] font-semibold text-ivory outline-none"
      >
        {title}
      </h2>
      <div className="mt-3 max-w-120 text-base leading-6 text-ivory/72 lg:text-[15px]">
        {message}
      </div>

      {details && details.length > 0 && (
        <dl className="mt-8 w-full border-t border-ivory/14">
          {details.map((detail) => (
            <div
              key={detail.label}
              className="flex flex-col gap-1 border-b border-ivory/14 py-3.5 @sm:flex-row @sm:items-baseline @sm:gap-6"
            >
              <dt className="shrink-0 text-[11px] font-semibold tracking-[1.54px] text-gold uppercase @sm:w-35">
                {detail.label}
              </dt>
              <dd className="min-w-0 font-serif text-xl leading-6.5 font-medium break-words text-ivory">
                {detail.value}
              </dd>
            </div>
          ))}
        </dl>
      )}

      {children && (
        <div className="mt-8 flex flex-wrap items-center gap-3">{children}</div>
      )}
    </div>
  );
}
