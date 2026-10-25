import type { SVGProps } from "react";

type ArrowUpRightIconProps = SVGProps<SVGSVGElement>;

export function ArrowUpRightIcon(props: ArrowUpRightIconProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M4.5 11.5l7-7M5.5 4.5h6v6" />
    </svg>
  );
}
