"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import type { Session } from "@/lib/sessions";
import { trackBooking } from "@/lib/analytics";
import {
  FEE_FLAT,
  FEE_RATE,
  MAX_QTY,
  initialQty,
  type QtyMap,
  type Tier,
  type TierMode,
} from "./components/tiers";
import StepIndicator from "./components/StepIndicator";
import StepSelect from "./components/StepSelect";
import StepDetails, { type Details } from "./components/StepDetails";
import StepPayment, { type Pay } from "./components/StepPayment";
import StepConfirmation from "./components/StepConfirmation";
import OrderSummary from "./components/OrderSummary";
import StripeProvider from "./components/StripeProvider";
import styles from "./book.module.css";

/* ── Inner payment wrapper (needs Stripe context) ─────────────────────── */

function PaymentStep({
  pay,
  setPay,
  paymentError,
  submitting,
  canSubmit,
  total,
  onSubmit,
  onBack,
}: {
  pay: Pay;
  setPay: (u: (p: Pay) => Pay) => void;
  paymentError: string;
  submitting: boolean;
  canSubmit: boolean;
  total: number;
  onSubmit: () => void;
  onBack: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = useCallback(async () => {
    if (!stripe || !elements || !canSubmit || submitting) return;
    onSubmit();
  }, [stripe, elements, canSubmit, submitting, onSubmit]);

  const continueDisabled = !canSubmit || submitting || !stripe || !elements;

  return (
    <>
      <StepPayment pay={pay} setPay={setPay} error={paymentError} />
      <div className={styles.stepNav}>
        <button
          type="button"
          onClick={onBack}
          className="btn btn-ghost"
          style={{ background: "transparent" }}
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={continueDisabled}
          className={`btn ${continueDisabled ? styles.btnDisabled : styles.btnPrimary
            }`}
        >
          {submitting ? "Processing…" : `Pay $${total.toFixed(2)}`}{" "}
          {!submitting && <span className="arrow">→</span>}
        </button>
      </div>
    </>
  );
}

/* ── Main booking flow ────────────────────────────────────────────────── */

export default function BookingFlow({
  session,
  tiers,
  remainingByTierId,
}: {
  session: Session;
  tiers: Tier[];
  remainingByTierId: Record<string, number | null>;
}) {
  const admissionTier = tiers.find((t) => t.mode === "admission");
  const partnershipTiers = tiers.filter((t) => t.mode === "partnership");

  const [step, setStep] = useState(1);
  const [mode, setMode] = useState<TierMode>("admission");
  const [qty, setQty] = useState<QtyMap>(() => initialQty("admission"));
  const [details, setDetails] = useState<Details>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    pronouns: "",
    dietary: "",
    referral: "",
  });
  const [pay, setPay] = useState<Pay>({
    name: "",
    zip: "",
    agree: false,
    optIn: true,
  });
  const [submitting, setSubmitting] = useState(false);
  const [clientSecret, setClientSecret] = useState<string>("");
  const [confirmationCode, setConfirmationCode] = useState<string>("");
  const [paymentError, setPaymentError] = useState<string>("");
  const [creatingIntent, setCreatingIntent] = useState(false);

  const subtotal = tiers.reduce(
    (s, t) => s + t.price * (qty[t.id] ?? 0),
    0,
  );
  const totalQty = Object.values(qty).reduce((a, b) => a + b, 0);
  const fees =
    subtotal > 0 ? Number((subtotal * FEE_RATE + FEE_FLAT).toFixed(2)) : 0;
  const total = Number((subtotal + fees).toFixed(2));
  const tierCount = tiers.filter((t) => (qty[t.id] ?? 0) > 0).length;

  const canProceed1 = totalQty > 0;
  const canProceed2 =
    Boolean(details.firstName) &&
    Boolean(details.lastName) &&
    details.email.includes("@");
  const canSubmit = Boolean(pay.name) && Boolean(pay.zip) && pay.agree;

  const incCapFor = (id: string): number => {
    const remaining = remainingByTierId[id];
    if (remaining == null) return MAX_QTY;
    return Math.min(MAX_QTY, remaining);
  };

  const inc = (id: string) => {
    setQty((q) => {
      const next = Math.min((q[id] ?? 0) + 1, incCapFor(id));
      trackBooking({ name: "booking_tier_change", tier_id: id, qty: next });
      return { ...q, [id]: next };
    });
  };
  const dec = (id: string) => {
    setQty((q) => {
      const next = Math.max((q[id] ?? 0) - 1, 0);
      trackBooking({ name: "booking_tier_change", tier_id: id, qty: next });
      return { ...q, [id]: next };
    });
  };

  const switchMode = (m: TierMode) => {
    setMode(m);
    setQty(initialQty(m));
  };

  const scrollTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goNext = async () => {
    trackBooking({ name: "booking_submit_attempt", step });

    // When moving from step 2 → step 3, create a PaymentIntent
    if (step === 2) {
      setCreatingIntent(true);
      setPaymentError("");
      try {
        const items = tiers
          .filter((t) => (qty[t.id] ?? 0) > 0)
          .map((t) => ({ tier_id: t.id, qty: qty[t.id] }));

        const res = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items,
            details: {
              firstName: details.firstName,
              lastName: details.lastName,
              email: details.email,
              phone: details.phone,
            },
            optIn: pay.optIn,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          setPaymentError(data.error || "Failed to initialize payment");
          setCreatingIntent(false);
          return;
        }

        setClientSecret(data.clientSecret);
        setConfirmationCode(data.referenceCode);
      } catch {
        setPaymentError("Network error — please try again");
        setCreatingIntent(false);
        return;
      }
      setCreatingIntent(false);
    }

    setStep((s) => Math.min(s + 1, 4));
    scrollTop();
  };

  const goBack = () => {
    setStep((s) => Math.max(s - 1, 1));
    // Clear Stripe state when going back from payment
    if (step === 3) {
      setClientSecret("");
      setPaymentError("");
    }
    scrollTop();
  };

  // Called when "Pay" button is clicked inside PaymentStep (within Stripe context)
  const submitPayment = useCallback(async () => {
    setSubmitting(true);
    setPaymentError("");
    trackBooking({ name: "booking_submit_attempt", step: 3 });

    // We need access to stripe & elements from inside the StripeProvider.
    // This is handled via a ref pattern — the PaymentStep calls this,
    // and we use a custom event to trigger confirmation from inside the Elements context.
    const event = new CustomEvent("stripe-confirm-payment");
    window.dispatchEvent(event);
  }, []);

  // Listen for payment result from StripeConfirmHandler
  useEffect(() => {
    const onSuccess = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setConfirmationCode(detail.referenceCode || confirmationCode);
      setSubmitting(false);
      setStep(4);
      scrollTop();
    };

    const onError = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setPaymentError(detail.message || "Payment failed");
      setSubmitting(false);
    };

    window.addEventListener("stripe-payment-success", onSuccess);
    window.addEventListener("stripe-payment-error", onError);
    return () => {
      window.removeEventListener("stripe-payment-success", onSuccess);
      window.removeEventListener("stripe-payment-error", onError);
    };
  }, [confirmationCode]);

  useEffect(() => {
    trackBooking({ name: "booking_step_view", step, mode });
    if (step === 4) {
      trackBooking({
        name: "booking_complete",
        subtotal,
        total,
        tier_count: tierCount,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const continueDisabled =
    (step === 1 && !canProceed1) ||
    (step === 2 && (!canProceed2 || creatingIntent));

  return (
    <main>
      <section className={styles.bookShell}>
        <div className="shell">
          <div className={styles.headerWrap}>
            <Link href="/" className={`label ${styles.returnLink}`}>
              ← Return to site
            </Link>
            <div className="label" style={{ marginBottom: 16 }}>
              § Reserve your seat
            </div>
            <h1 className={`h2 ${styles.title}`}>
              {session.title}
              <br />
              <em>{session.subtitle.toLowerCase()}.</em>
            </h1>
          </div>

          <StepIndicator step={step} />

          <div className={styles.grid}>
            <div>
              {step === 1 && admissionTier && (
                <StepSelect
                  admissionTier={admissionTier}
                  partnershipTiers={partnershipTiers}
                  remainingByTierId={remainingByTierId}
                  mode={mode}
                  setMode={switchMode}
                  qty={qty}
                  inc={inc}
                  dec={dec}
                />
              )}
              {step === 2 && (
                <StepDetails details={details} setDetails={setDetails} />
              )}
              {step === 3 && clientSecret && (
                <StripeProvider clientSecret={clientSecret}>
                  <StripeConfirmHandler
                    pay={pay}
                    confirmationCode={confirmationCode}
                  />
                  <PaymentStep
                    pay={pay}
                    setPay={setPay}
                    paymentError={paymentError}
                    submitting={submitting}
                    canSubmit={canSubmit}
                    total={total}
                    onSubmit={submitPayment}
                    onBack={goBack}
                  />
                </StripeProvider>
              )}
              {step === 4 && (
                <StepConfirmation
                  session={session}
                  code={confirmationCode}
                  email={details.email}
                />
              )}

              {step < 3 && (
                <div className={styles.stepNav}>
                  {step > 1 ? (
                    <button
                      type="button"
                      onClick={goBack}
                      className="btn btn-ghost"
                      style={{ background: "transparent" }}
                    >
                      ← Back
                    </button>
                  ) : (
                    <span />
                  )}

                  <button
                    type="button"
                    onClick={goNext}
                    disabled={continueDisabled}
                    className={`btn ${continueDisabled ? styles.btnDisabled : styles.btnPrimary
                      }`}
                  >
                    {step === 1 && (
                      <>
                        Continue to attendee details{" "}
                        <span className="arrow">→</span>
                      </>
                    )}
                    {step === 2 &&
                      (creatingIntent ? (
                        "Preparing checkout…"
                      ) : (
                        <>
                          Continue to payment{" "}
                          <span className="arrow">→</span>
                        </>
                      ))}
                  </button>
                </div>
              )}
            </div>

            <aside>
              <OrderSummary
                session={session}
                tiers={tiers}
                qty={qty}
                subtotal={subtotal}
                fees={fees}
                total={total}
              />
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ── Hidden component inside Stripe Elements that listens for confirm events ── */

function StripeConfirmHandler({
  pay,
  confirmationCode,
}: {
  pay: Pay;
  confirmationCode: string;
}) {
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    const handler = async () => {
      if (!stripe || !elements) {
        window.dispatchEvent(
          new CustomEvent("stripe-payment-error", {
            detail: { message: "Payment system not ready — please try again" },
          }),
        );
        return;
      }

      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          payment_method_data: {
            billing_details: {
              name: pay.name,
              address: { postal_code: pay.zip },
            },
          },
          return_url: window.location.href,
        },
        redirect: "if_required",
      });

      if (error) {
        window.dispatchEvent(
          new CustomEvent("stripe-payment-error", {
            detail: { message: error.message },
          }),
        );
      } else {
        window.dispatchEvent(
          new CustomEvent("stripe-payment-success", {
            detail: { referenceCode: confirmationCode },
          }),
        );
      }
    };

    window.addEventListener("stripe-confirm-payment", handler);
    return () => window.removeEventListener("stripe-confirm-payment", handler);
  }, [stripe, elements, pay, confirmationCode]);

  return null;
}
