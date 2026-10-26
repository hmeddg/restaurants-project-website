import type { SVGProps } from "react";

type CheckIconProps = SVGProps<SVGSVGElement>;

export function CheckIcon(props: CheckIconProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M3.5 8.5l3 3 6-7" />
    </svg>
  );
}
