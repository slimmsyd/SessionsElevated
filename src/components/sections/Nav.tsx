"use client";
import { useEffect, useState } from "react";
import { LINKS } from "@/lib/links";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const overHero = !scrolled;

  return (
    <nav
      className="nav"
      style={{
        background: overHero ? "transparent" : "linear-gradient(to bottom, var(--bg) 60%, transparent)",
        borderBottom: scrolled ? "1px solid var(--line)" : "1px solid transparent",
      }}
    >
      <div className="shell nav-row">
        <a
          href="#hero"
          className="brand"
          style={{
            textDecoration: "none",
            color: overHero ? "#f4ede0" : "var(--ink)",
            transition: "color 400ms ease",
          }}
        >
          <span
            className="brand-mark"
            style={{ background: overHero ? "#f4ede0" : "var(--ink)" }}
          />
          Elevated Sessions
        </a>
        <div
          className="nav-links"
          style={{ color: overHero ? "rgba(244,237,224,0.85)" : "var(--ink-soft)" }}
        >
          <a href="#what" className="nav-secondary" style={{ color: "inherit" }}>
            Welcome
          </a>
          <a href="#sessions" style={{ color: "inherit" }}>
            Events
          </a>
          <a href="#practitioners" className="nav-secondary" style={{ color: "inherit" }}>
            Practitioners
          </a>
          <a href="#partners" className="nav-secondary" style={{ color: "inherit" }}>
            Partners
          </a>
          <a href="#faq" className="nav-secondary" style={{ color: "inherit" }}>
            FAQ
          </a>
          <a
            href={LINKS.rsvp}
            target="_blank"
            rel="noopener noreferrer"
            className="btn"
            style={{
              padding: "10px 20px",
              fontSize: 14,
              borderColor: overHero ? "#f4ede0" : "var(--ink)",
              color: overHero ? "#f4ede0" : "var(--ink)",
              background: "transparent",
              transition: "all 400ms ease",
            }}
          >
            RSVP <span className="arrow">→</span>
          </a>
        </div>
      </div>
    </nav>
  );
}
