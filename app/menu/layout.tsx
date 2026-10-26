import Image from "next/image";
import { OrderPanel } from "@/components/sections/menu/order-panel.client";
import { siteConfig } from "@/config/site";

const { address } = siteConfig;

// Shared by every category so the order panel keeps its state across tabs.
export default function MenuLayout({ children }: LayoutProps<"/menu">) {
  return (
    <section
      aria-labelledby="menu-heading"
      className="relative overflow-hidden bg-deep"
    >
      {/* Position and size taken from the 1440px-wide Figma frame. */}
      <Image
        src="/images/menu/emerald-glow.svg"
        alt=""
        width={1100}
        height={700}
        className="absolute top-121.75 left-[37.639%] w-[76.389%] max-w-none min-w-160"
      />

      <div className="relative mx-auto w-full max-w-7xl px-4 pt-[calc(env(safe-area-inset-top)+9rem)] pb-20 sm:px-6 lg:px-8 lg:pb-10">
        <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_20rem] lg:px-6.25">
          <div className="min-w-0">{children}</div>
          <OrderPanel
            timeZone={siteConfig.timeZone}
            pickupAddress={`${address.street}, ${address.locality}`}
          />
        </div>
      </div>
    </section>
  );
}
