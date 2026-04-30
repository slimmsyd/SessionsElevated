"use client";
import { type ChangeEvent } from "react";
import { PaymentElement } from "@stripe/react-stripe-js";
import Field from "./Field";
import TermsBlock from "./TermsBlock";
import styles from "../book.module.css";

export type Pay = {
  name: string;
  zip: string;
  agree: boolean;
  optIn: boolean;
};

type Props = {
  pay: Pay;
  setPay: (updater: (p: Pay) => Pay) => void;
  error?: string;
};

export default function StepPayment({ pay, setPay, error }: Props) {
  const setText =
    (k: keyof Pay) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setPay((p) => ({ ...p, [k]: e.target.value }));

  return (
    <div>
      <h2 className={`h3 ${styles.stepHeading}`}>Payment</h2>
      <p className={`body ${styles.stepIntroWide}`}>
        Your card is processed securely via Stripe. You&apos;ll receive a
        confirmation immediately and a gentle reminder one week before the
        session.
      </p>

      <div className={styles.formGrid}>
        <Field
          label="Name on card"
          required
          value={pay.name}
          onChange={setText("name")}
          fullWidth
        />

        {/* Stripe Elements — PCI-compliant card input */}
        <div className={`${styles.field} ${styles.fieldFull}`}>
          <span className={styles.fieldLabel}>Card details<span className={styles.fieldRequiredMark}>*</span></span>
          <div className={styles.stripeElementWrap}>
            <PaymentElement
              options={{
                layout: "tabs",
                fields: {
                  billingDetails: {
                    address: {
                      postalCode: "never",
                    },
                  },
                },
              }}
            />
          </div>
        </div>

        <Field
          label="Billing ZIP / Postcode"
          required
          value={pay.zip}
          onChange={setText("zip")}
          fullWidth
        />
      </div>

      {error && (
        <div className={styles.paymentError} role="alert">
          {error}
        </div>
      )}

      <label className={styles.optInBox}>
        <input
          type="checkbox"
          checked={pay.optIn}
          onChange={(e) => setPay((p) => ({ ...p, optIn: e.target.checked }))}
          className={styles.checkbox}
        />
        <span className="body" style={{ fontSize: 14, margin: 0 }}>
          <strong className={styles.optInLead}>Receive email updates.</strong>{" "}
          Yes, send me emails with future events, news, promotions, and more.
        </span>
      </label>

      <TermsBlock />

      <label className={styles.agreeBox}>
        <input
          type="checkbox"
          checked={pay.agree}
          onChange={(e) => setPay((p) => ({ ...p, agree: e.target.checked }))}
          className={styles.checkbox}
        />
        <span className="body" style={{ fontSize: 14, margin: 0 }}>
          I have read and agree to the <em>Terms &amp; Conditions</em> above,
          including the non-refundable ticket policy, age requirement (21+), and
          photography/video consent.
        </span>
      </label>
    </div>
  );
}
