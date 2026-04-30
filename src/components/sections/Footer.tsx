"use client";
import Link from "next/link";
import { LINKS } from "@/lib/links";
import { trackRsvp } from "@/lib/analytics";

const linkStyle: React.CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: 16,
  color: "var(--ink-soft)",
  textDecoration: "none",
};

export default function Footer() {
  return (
    <footer>
      <div className="shell">
        <div
          className="reveal grid-2-80"
          style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr 1fr",
            gap: 60,
            marginBottom: 80,
          }}
        >
          <div>
            <div className="brand" style={{ fontSize: 26 }}>
              <span className="brand-mark" style={{ width: 26, height: 26 }} />
              Elevated Sessions
            </div>
            <p className="body" style={{ marginTop: 28, maxWidth: "32ch" }}>
              Join the movement. A wellness series designed for the culture, in rhythm with the seasons.
            </p>
            <Link
              href={LINKS.rsvp}
              onClick={() => trackRsvp("footer_button", LINKS.rsvp)}
              className="btn"
              style={{ marginTop: 24, background: "var(--ink)", color: "var(--bg)" }}
            >
              RSVP for Spring Awakening <span className="arrow">→</span>
            </Link>
          </div>
          <div>
            <div className="label" style={{ marginBottom: 20 }}>The Site</div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
              <li><a href="#what" style={linkStyle}>Welcome</a></li>
              <li><a href="#sessions" style={linkStyle}>Events</a></li>
              <li><a href="#practitioners" style={linkStyle}>Practitioners</a></li>
              <li><a href="#partners" style={linkStyle}>Partners</a></li>
              <li><a href="#faq" style={linkStyle}>FAQ</a></li>
            </ul>
          </div>
          <div>
            <div className="label" style={{ marginBottom: 20 }}>Connect</div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
              <li><Link href={LINKS.rsvp} onClick={() => trackRsvp("footer_link", LINKS.rsvp)} style={linkStyle}>Reserve a seat →</Link></li>
            </ul>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: 32,
            borderTop: "1px solid var(--line)",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div className="mono">© Elevated Sessions, MMXXVI</div>
          <div className="mono">Join the movement</div>
          <div className="mono">
            Built by{" "}
            <a
              href="https://www.0ncode.com/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--accent)", textDecoration: "none" }}
            >
              ONCODE ↗
            </a>
          </div>
        </div>

        <div
          style={{
            marginTop: 80,
            fontFamily: "var(--font-display)",
            fontWeight: 300,
            fontSize: "clamp(80px, 18vw, 280px)",
            lineHeight: 0.85,
            letterSpacing: "-0.04em",
            color: "var(--ink)",
            opacity: 0.92,
            textAlign: "left",
          }}
        >
          Elevated
          <br />
          <em style={{ fontFamily: "var(--font-body)", color: "var(--accent)" }}>Sessions</em>
        </div>
      </div>
    </footer>
  );
}
