import type { Metadata } from "next";
import CheckoutNav from "./components/CheckoutNav";

export const metadata: Metadata = {
  title: "Reserve your seat",
  description:
    "Reserve a seat for Spring Awakening — Sunday, May 24, 2026. Guest admission and partnership tiers available.",
  robots: { index: false, follow: true },
};

export default function BookLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CheckoutNav />
      {children}
    </>
  );
}
