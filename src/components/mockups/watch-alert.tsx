import { PhoneFrame } from "@/components/mockups/app-screen";

/** Member home on mobile. Keeps the original 287/327px wrapper so GSAP layouts that measure it stay put. */
const WatchAlert = () => (
  <div className="relative mx-auto flex w-[287px] justify-center select-none md:w-[327px]">
    <div
      aria-hidden="true"
      className="bg-foreground/5 pointer-events-none absolute inset-0 -z-10 rounded-[3.5rem] blur-3xl"
    />
    <PhoneFrame
      src="/images/phone/balance.png"
      alt="Elivate Wallet member home on mobile showing available balance"
      className="w-[176px] md:w-[205px]"
    />
  </div>
);

export default WatchAlert;
