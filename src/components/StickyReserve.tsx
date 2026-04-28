"use client";
import { useEffect, useState } from "react";
import { LINKS } from "@/lib/links";

export default function StickyReserve() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show once the user has scrolled past most of the hero (which is 100vh).
    const onScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.85);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      href={LINKS.rsvp}
      target="_blank"
      rel="noopener noreferrer"
      className={`sticky-reserve${visible ? " visible" : ""}`}
      aria-label="Reserve a seat for Spring Awakening"
    >
      Reserve a seat <span className="arrow">→</span>
    </a>
  );
}
