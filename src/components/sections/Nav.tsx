"use client";
import { useEffect, useState } from "react";
import { LINKS } from "@/lib/links";
import { trackRsvp } from "@/lib/analytics";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close on Escape; lock body scroll while open.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const overHero = !scrolled && !menuOpen;
  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav
        className="nav"
        style={{
          background: overHero
            ? "transparent"
            : "linear-gradient(to bottom, var(--bg) 60%, transparent)",
          borderBottom: scrolled && !menuOpen ? "1px solid var(--line)" : "1px solid transparent",
        }}
      >
        <div className="shell nav-row">
        <a
          href="#hero"
          className="brand"
          onClick={closeMenu}
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

        {/* Desktop links */}
        <div
          className="nav-links nav-links-desktop"
          style={{ color: overHero ? "rgba(244,237,224,0.85)" : "var(--ink-soft)" }}
        >
          <a href="#what" style={{ color: "inherit" }}>Welcome</a>
          <a href="#sessions" style={{ color: "inherit" }}>Events</a>
          <a href="#practitioners" style={{ color: "inherit" }}>Practitioners</a>
          <a href="#partners" style={{ color: "inherit" }}>Partners</a>
          <a href="#faq" style={{ color: "inherit" }}>FAQ</a>
          <a
            href={LINKS.rsvp}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackRsvp("nav_desktop", LINKS.rsvp)}
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

        {/* Mobile hamburger */}
        <button
          type="button"
          className={`nav-hamburger${menuOpen ? " open" : ""}`}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          onClick={() => setMenuOpen((v) => !v)}
          style={{ color: overHero ? "#f4ede0" : "var(--ink)" }}
        >
          <span />
          <span />
          <span />
        </button>
        </div>
      </nav>

      {/* Mobile drawer — sibling of <nav> so its `position: fixed; inset: 0`
          escapes the nav's containing block (backdrop-filter creates one). */}
      <div
        id="mobile-nav"
        className={`nav-drawer${menuOpen ? " open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        aria-hidden={!menuOpen}
      >
        <nav className="nav-drawer-inner">
          <a href="#what" onClick={closeMenu}>Welcome</a>
          <a href="#sessions" onClick={closeMenu}>Events</a>
          <a href="#practitioners" onClick={closeMenu}>Practitioners</a>
          <a href="#partners" onClick={closeMenu}>Partners</a>
          <a href="#faq" onClick={closeMenu}>FAQ</a>
          <a
            href={LINKS.rsvp}
            target="_blank"
            rel="noopener noreferrer"
            className="btn nav-drawer-rsvp"
            onClick={() => {
              trackRsvp("nav_mobile", LINKS.rsvp);
              closeMenu();
            }}
          >
            RSVP <span className="arrow">→</span>
          </a>
        </nav>
      </div>
    </>
  );
}
