"use client";
import { useState } from "react";
import styles from "../book.module.css";

const TERMS: { heading: string; body: string[] }[] = [
  {
    heading: "General Terms",
    body: [
      "By purchasing a ticket and attending an Elevated Sessions event, you agree to participate voluntarily and at your own risk. Elevated Sessions and its organizers are not responsible for any injury, illness, lost/stolen property, or other incidents that may occur during the event. Attendees are expected to follow all venue rules and event guidelines.",
    ],
  },
  {
    heading: "Refund Policy",
    body: [
      "All tickets are strictly non-refundable. By purchasing a ticket, you acknowledge that refunds will not be issued under any circumstances, including personal emergencies, illness, or changes in plans.",
    ],
  },
  {
    heading: "Cancellation Policy",
    body: [
      "Elevated Sessions reserves the right to cancel or reschedule events due to unforeseen circumstances. In the rare case of event cancellation, ticket holders will be notified and will receive a credit toward a future event. Elevated Sessions is not liable for travel or accommodation costs.",
    ],
  },
  {
    heading: "Item Transfer Policy",
    body: [
      "Tickets may be transferred to another person only if the request is submitted via email at least 24 hours prior to the event start time. To request a transfer, email lifted@elevatedsessions.com with your request. The new attendee must meet all age requirements and provide accurate information.",
    ],
  },
  {
    heading: "Age Restriction",
    body: [
      "All attendees must be 21 years of age or older. Guests may be required to show valid government-issued ID at check-in. Misrepresentation of age may result in denied entry without refund.",
    ],
  },
  {
    heading: "Miscellaneous Policies",
    body: [
      "By purchasing this ticket, you confirm that you are of sound mind, body, and spirit to attend this health and wellness event. Elevated Sessions, its organizers, and partners are not liable for injuries, lost or misplaced items, or reactions to food or other substances. By attending, you release Elevated Sessions, its organizers, and partners from any liability arising from participation in this event.",
      "By attending this event, you consent to being photographed and/or recorded on video. Your image or likeness may be used for promotional purposes, including marketing and advertising for future events.",
    ],
  },
];

export default function TermsBlock() {
  const [open, setOpen] = useState(false);
  return (
    <div className={styles.termsBlock}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={styles.termsHeader}
      >
        <span>
          Terms &amp; Conditions
          <span className={`label ${styles.termsSubLabel}`}>
            Please review before continuing
          </span>
        </span>
        <span
          className={`${styles.termsChevron} ${
            open ? styles.termsChevronOpen : ""
          }`}
          aria-hidden="true"
        >
          →
        </span>
      </button>
      {open && (
        <div className={styles.termsBody}>
          {TERMS.map((t) => (
            <div key={t.heading} className={styles.termsSection}>
              <h4 className={styles.termsHeading}>{t.heading}</h4>
              {t.body.map((p, j) => (
                <p key={j} className={`body ${styles.termsParagraph}`}>
                  {p}
                </p>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
