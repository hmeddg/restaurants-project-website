import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type FieldProps = {
  id: string;
  label: string;
  error?: string;
  className?: string;
  children: ReactNode;
};

export function Field({ id, label, error, className, children }: FieldProps) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-2", className)}>
      <label htmlFor={id} className="text-xs font-medium text-ivory/70">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="text-[13px] leading-snug text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
