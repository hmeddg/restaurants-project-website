import Image from "next/image";
import type { ComponentProps } from "react";
import { inputClass } from "@/components/ui/field-styles";
import { cn } from "@/lib/utils";

type SelectInputProps = ComponentProps<"select">;

export function SelectInput({
  className,
  children,
  ...props
}: SelectInputProps) {
  return (
    <div className="relative">
      <select
        className={cn(inputClass, "h-13 appearance-none pr-10", className)}
        {...props}
      >
        {children}
      </select>
      <Image
        src="/images/ui/select-chevron.svg"
        alt=""
        width={11.5}
        height={6.5}
        className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2"
      />
    </div>
  );
}
