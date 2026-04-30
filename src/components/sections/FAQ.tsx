"use client";
import { useState } from "react";
import Link from "next/link";
import { LINKS } from "@/lib/links";
import { trackRsvp } from "@/lib/analytics";

const faqs = [
  {
    q: "What happens during a Session?",
    a: "Each gathering is a curated mix of restorative practices - breathwork, sound healing, meditation, and other grounding experiences - guided by licensed therapists and holistic wellness practitioners. Sessions also include a seasonally inspired tasting menu and conclude with a private networking moment among guests, vendors, and brands.",
  },
  {
    q: "What time does it start, and when should I arrive?",
    a: "Sessions run from 10:00 AM to 2:00 PM, with doors opening at 9:00 AM. We recommend arriving early to settle in, meet vendors in the wellness showcase, and find your space before the practice begins.",
  },
  {
    q: "Is the tasting menu included?",
    a: "Yes. Each Session features a seasonally inspired infused menu, included with your reservation. Past gatherings have featured produce from Black-owned farms - including Anderson James Farms - woven into a menu designed to deepen the seasonal practice.",
  },
  {
    q: "What is the vendor showcase?",
    a: "Each Session closes with a private networking moment alongside a curated circle of luxury wellness brands and elevated at-home care products - past partners have included Rebound Clinics DMV, Grow Rise Cannabis, Lit by LeRue, and MiMi Michelle Wellbeing.",
  },
  {
    q: "How do I reserve a seat?",
    a: "Reservations are made directly here on the site - tap RSVP to choose your tier, share a few details, and pay securely. Spring Awakening (May 24, 2026) is currently open. Seats are intentionally limited - once a Session is full, registration closes.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number>(0);

  return (
    <section id="faq" style={{ background: "var(--paper)" }}>
      <div className="shell">
        <div
          className="reveal grid-2-80"
          style={{
            marginBottom: 80,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 80,
          }}
        >
          <div>
            <div className="label" style={{ marginBottom: 16 }}>§ 06 - Practical Notes</div>
            <h2 className="h2" style={{ maxWidth: "16ch" }}>
              Before you<br />
              <em>arrive.</em>
            </h2>
          </div>
          <p className="body" style={{ alignSelf: "end", maxWidth: "44ch", fontSize: 18 }}>
            A few questions we hear most often. If something else is on your mind, reach out - we&apos;d rather you ask than wonder.
          </p>
        </div>

        <div
          className="reveal"
          style={
            {
              ["--delay" as string]: "120ms",
              borderTop: "1px solid var(--line)",
            } as React.CSSProperties
          }
        >
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={i} style={{ borderBottom: "1px solid var(--line)" }}>
                <button
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  style={{
                    width: "100%",
                    display: "grid",
                    gridTemplateColumns: "48px 1fr 32px",
                    alignItems: "baseline",
                    gap: 24,
                    padding: "32px 0",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    color: "var(--ink)",
                  }}
                  aria-expanded={isOpen}
                >
                  <span className="mono">{String(i + 1).padStart(2, "0")}</span>
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 300,
                      fontSize: "clamp(22px, 2.4vw, 32px)",
                      lineHeight: 1.15,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {f.q}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontStyle: "italic",
                      fontSize: 28,
                      color: "var(--accent)",
                      transition: "transform 320ms ease",
                      transform: isOpen ? "rotate(45deg)" : "rotate(0)",
                      justifySelf: "end",
                      lineHeight: 1,
                    }}
                  >
                    +
                  </span>
                </button>
                <div
                  style={{
                    display: "grid",
                    gridTemplateRows: isOpen ? "1fr" : "0fr",
                    transition: "grid-template-rows 420ms cubic-bezier(0.2, 0.7, 0.2, 1)",
                  }}
                >
                  <div style={{ overflow: "hidden" }}>
                    <div style={{ paddingLeft: 72, paddingRight: 56, paddingBottom: 32, maxWidth: "70ch" }}>
                      <p className="body" style={{ fontSize: 17, margin: 0 }}>
                        {f.a}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div
          className="reveal"
          style={
            {
              ["--delay" as string]: "240ms",
              marginTop: 64,
              display: "flex",
              gap: 16,
              flexWrap: "wrap",
            } as React.CSSProperties
          }
        >
          <Link
            href={LINKS.rsvp}
            onClick={() => trackRsvp("faq_bottom", LINKS.rsvp)}
            className="btn"
            style={{ background: "var(--ink)", color: "var(--bg)" }}
          >
            RSVP for Spring Awakening <span className="arrow">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
