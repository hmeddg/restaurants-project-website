import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type PageTitleProps = {
  id: string;
  children: ReactNode;
  underlineSrc: string;
  underlineWidth: number;
  className?: string;
};

export function PageTitle({
  id,
  children,
  underlineSrc,
  underlineWidth,
  className,
}: PageTitleProps) {
  return (
    <div className={cn("lg:pl-6.25", className)}>
      <h1
        id={id}
        className="font-serif text-5xl leading-[1.21] font-normal text-ivory lowercase"
      >
        {children}
      </h1>
      <Image
        src={underlineSrc}
        alt=""
        width={underlineWidth}
        height={1}
        className="mt-2"
      />
    </div>
  );
}
