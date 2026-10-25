import type { SVGProps } from "react";
import { cn } from "@/lib/utils";

type CircularTextProps = SVGProps<SVGSVGElement> & {
  id: string;
  text: string;
  size: number;
  radius: number;
  fontSize: number;
};

export function CircularText({
  id,
  text,
  size,
  radius,
  fontSize,
  className,
  ...props
}: CircularTextProps) {
  const c = size / 2;

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      aria-hidden="true"
      className={cn("overflow-visible", className)}
      {...props}
    >
      <defs>
        <path
          id={id}
          d={`M ${c} ${c - radius} A ${radius} ${radius} 0 1 1 ${c} ${c + radius} A ${radius} ${radius} 0 1 1 ${c} ${c - radius}`}
        />
      </defs>
      <text
        fontSize={fontSize}
        className="fill-gold font-sans font-bold tracking-[0.3em] whitespace-pre"
      >
        <textPath
          href={`#${id}`}
          textLength={2 * Math.PI * radius}
          lengthAdjust="spacing"
        >
          {text}
        </textPath>
      </text>
    </svg>
  );
}
