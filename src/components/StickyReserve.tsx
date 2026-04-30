"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { LINKS } from "@/lib/links";
import { trackRsvp } from "@/lib/analytics";

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
    <Link
      href={LINKS.rsvp}
      onClick={() => trackRsvp("sticky_reserve", LINKS.rsvp)}
      className={`sticky-reserve${visible ? " visible" : ""}`}
      aria-label="Reserve a seat for Spring Awakening"
    >
      Reserve a seat <span className="arrow">→</span>
    </Link>
  );
}
