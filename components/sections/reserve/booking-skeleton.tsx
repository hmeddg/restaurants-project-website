const block = "rounded-xl bg-ivory/8 motion-safe:animate-pulse";

export function BookingSkeleton() {
  return (
    <div aria-hidden="true" className="flex flex-col gap-6">
      <div>
        <p className="font-serif text-[2rem] leading-[1.21] font-semibold text-ivory">
          Your reservation
        </p>
        <p className="mt-1.5 text-sm text-ivory/60">
          Pick a date, a time and your party size.
        </p>
      </div>
      <div className="@container">
        <div className="grid gap-8 @min-[34rem]:grid-cols-[16.875rem_minmax(0,1fr)]">
          <div className={`${block} aspect-[270/262] w-full max-w-67.5`} />
          <div className="flex flex-col gap-5">
            <div className={`${block} h-19.5`} />
            <div className={`${block} h-32`} />
          </div>
        </div>
      </div>
      <div className="h-px bg-ivory/14" />
      <div className="grid gap-4 sm:grid-cols-2">
        <div className={`${block} h-19.5`} />
        <div className={`${block} h-19.5`} />
        <div className={`${block} h-19.5`} />
        <div className={`${block} h-19.5`} />
      </div>
    </div>
  );
}
