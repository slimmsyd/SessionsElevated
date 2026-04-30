"use client";

import { useMemo } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import type { StripeElementsOptions } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

type Props = {
  clientSecret: string;
  children: React.ReactNode;
};

export default function StripeProvider({ clientSecret, children }: Props) {
  const options: StripeElementsOptions = useMemo(
    () => ({
      clientSecret,
      appearance: {
        theme: "flat" as const,
        variables: {
          colorPrimary: "#1a1a1a",
          colorBackground: "#faf9f6",
          colorText: "#1a1a1a",
          colorDanger: "#c0392b",
          fontFamily: '"DM Sans", system-ui, sans-serif',
          fontSizeBase: "16px",
          borderRadius: "2px",
          spacingUnit: "4px",
        },
        rules: {
          ".Input": {
            border: "1px solid #d5d0c8",
            padding: "14px 16px",
            fontSize: "16px",
            transition: "border-color 240ms ease",
          },
          ".Input:focus": {
            border: "1px solid #1a1a1a",
            boxShadow: "none",
          },
          ".Label": {
            fontFamily: '"DM Sans", system-ui, sans-serif',
            fontSize: "11px",
            letterSpacing: "0.22em",
            textTransform: "uppercase" as const,
            color: "#918a7e",
            fontWeight: "400",
          },
        },
      },
    }),
    [clientSecret],
  );

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  );
}
