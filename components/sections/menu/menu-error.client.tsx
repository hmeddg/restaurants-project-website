"use client";

import { catchError, type ErrorInfo } from "next/error";

function MenuErrorFallback(_props: object, { retry }: ErrorInfo) {
  return (
    <div
      role="alert"
      className="rounded-[1.25rem] border border-ivory/14 px-6 py-10 text-center"
    >
      <p className="font-serif text-2xl font-semibold text-ivory">
        We couldn&apos;t load the menu.
      </p>
      <p className="mt-2 text-base text-ivory/70">
        Please try again in a moment.
      </p>
      <button
        type="button"
        onClick={() => retry()}
        className="mt-5 inline-flex min-h-11 items-center rounded-full border border-gold/40 px-6 text-sm font-medium text-ivory focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
      >
        Try again
      </button>
    </div>
  );
}

export const MenuErrorBoundary = catchError(MenuErrorFallback);
