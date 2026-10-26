import type { ReactNode, Ref } from "react";
import { cn } from "@/lib/utils";

type QuantityStepperProps = {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  decreaseLabel: string;
  increaseLabel: string;
  /** "onLight" sits on ivory/gold cards, "onDark" on the deep page background. */
  tone: "onLight" | "onDark";
  children: ReactNode;
  increaseRef?: Ref<HTMLButtonElement>;
  className?: string;
};

// The visible circles are small; ::before extends each hit area to ~44px.
const buttonClass =
  "relative flex shrink-0 items-center justify-center rounded-full text-base leading-5 font-medium before:absolute before:-inset-2 before:content-[''] focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-40";

export function QuantityStepper({
  value,
  min,
  max,
  onChange,
  decreaseLabel,
  increaseLabel,
  tone,
  children,
  increaseRef,
  className,
}: QuantityStepperProps) {
  const onLight = tone === "onLight";

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <button
        type="button"
        aria-label={decreaseLabel}
        disabled={value <= min}
        onClick={() => onChange(value - 1)}
        className={cn(
          buttonClass,
          onLight
            ? "size-7 text-deep focus-visible:outline-deep"
            : "size-7.5 border border-ivory/25 text-ivory focus-visible:outline-gold",
        )}
      >
        <span aria-hidden="true">−</span>
      </button>
      <span
        aria-live="polite"
        className={cn(
          "text-sm leading-5 font-semibold tabular-nums",
          onLight ? "text-deep" : "text-ivory",
        )}
      >
        {children}
      </span>
      <button
        ref={increaseRef}
        type="button"
        aria-label={increaseLabel}
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
        className={cn(
          buttonClass,
          onLight
            ? "size-7 bg-deep text-ivory focus-visible:outline-deep"
            : "size-7.5 bg-gold text-deep focus-visible:outline-gold",
        )}
      >
        <span aria-hidden="true">+</span>
      </button>
    </div>
  );
}
