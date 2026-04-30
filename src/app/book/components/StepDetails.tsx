"use client";
import { type ChangeEvent } from "react";
import Field from "./Field";
import styles from "../book.module.css";

export type Details = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  pronouns: string;
  dietary: string;
  referral: string;
};

type Props = {
  details: Details;
  setDetails: (updater: (d: Details) => Details) => void;
};

export default function StepDetails({ details, setDetails }: Props) {
  const set =
    (k: keyof Details) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setDetails((d) => ({ ...d, [k]: e.target.value }));

  return (
    <div>
      <h2 className={`h3 ${styles.stepHeading}`}>Tell us who&apos;s coming</h2>
      <p className={`body ${styles.stepIntroWide}`}>
        We&apos;ll send your confirmation, the venue address, and a short note from
        the practitioners to this email.
      </p>

      <div className={styles.formGrid}>
        <Field
          label="First name"
          required
          value={details.firstName}
          onChange={set("firstName")}
        />
        <Field
          label="Last name"
          required
          value={details.lastName}
          onChange={set("lastName")}
        />
        <Field
          label="Email"
          required
          type="email"
          value={details.email}
          onChange={set("email")}
          fullWidth
        />
        <Field
          label="Phone (optional)"
          type="tel"
          value={details.phone}
          onChange={set("phone")}
        />
        <Field
          label="Pronouns (optional)"
          value={details.pronouns}
          onChange={set("pronouns")}
          placeholder="she/her, they/them…"
        />
        <Field
          label="Dietary or accessibility notes"
          value={details.dietary}
          onChange={set("dietary")}
          placeholder="Anything we should hold in mind for you?"
          fullWidth
          textarea
        />
        <Field
          label="How did you hear about us?"
          value={details.referral}
          onChange={set("referral")}
          placeholder="A friend, Instagram, a past session…"
          fullWidth
        />
      </div>
    </div>
  );
}
