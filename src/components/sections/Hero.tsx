"use client";
// Hero - 08a Full-bleed top-anchored, side-flanked. Looping video at 0.5x.
import { useEffect, useRef } from "react";
import Link from "next/link";
import { LINKS } from "@/lib/links";
import { trackRsvp } from "@/lib/analytics";

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) videoRef.current.playbackRate = 0.5;
  }, []);

  return (
    <section
      id="hero"
      className="hero-fullbleed"
      style={{ position: "relative", height: "100vh", minHeight: 720, padding: 0, overflow: "hidden" }}
    >
      <video
        ref={videoRef}
        src="/assets/hero-video.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="/assets/hero-circle.png"
        aria-label="A small group seated in a circle in a sunlit forest, mid-practice"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }}
      />

      {/* Scrims */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "linear-gradient(180deg, rgba(20,15,10,0.65) 0%, rgba(20,15,10,0.18) 26%, rgba(20,15,10,0) 48%, rgba(20,15,10,0) 76%, rgba(20,15,10,0.55) 100%)",
        }}
      />

      {/* Top-anchored centered headline */}
      <div
        className="reveal"
        style={
          {
            "--delay": "200ms",
            position: "absolute",
            top: 132,
            left: 56,
            right: 56,
            textAlign: "center",
            color: "#f4ede0",
            zIndex: 2,
          } as React.CSSProperties
        }
      >
        <div
          className="label"
          style={{ color: "rgba(244,237,224,0.7)", marginBottom: 22 }}
        >
          - Vol. 07 · Spring 2026 · Now Open -
        </div>
        <h1
          style={{
            fontFamily: "var(--font-body)",
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: "clamp(56px, 8vw, 120px)",
            lineHeight: 1.0,
            letterSpacing: "-0.02em",
            margin: 0,
            color: "#f4ede0",
            textWrap: "balance",
          }}
        >
          Stillness,{" "}
          <span style={{ color: "#e6b48a" }}>held in community.</span>
        </h1>
      </div>

      {/* Left flank */}
      <div
        className="reveal hero-flank-left"
        style={
          {
            "--delay": "500ms",
            position: "absolute",
            left: 56,
            top: "52%",
            transform: "translateY(-50%)",
            maxWidth: 280,
            color: "#f4ede0",
            zIndex: 2,
          } as React.CSSProperties
        }
      >
        <div className="label" style={{ color: "rgba(244,237,224,0.6)", marginBottom: 12 }}>
          The Practice
        </div>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontWeight: 300,
            fontSize: 18,
            lineHeight: 1.5,
            color: "rgba(244,237,224,0.9)",
            margin: 0,
            textWrap: "pretty",
          }}
        >
          A seasonal morning of breath, sound, and silence - paced like a song, held in a small circle.
        </p>
      </div>

      {/* Right flank - Spring Awakening featured Session */}
      <div
        className="reveal hero-flank-right"
        style={
          {
            "--delay": "650ms",
            position: "absolute",
            right: 56,
            top: "52%",
            transform: "translateY(-50%)",
            maxWidth: 280,
            color: "#f4ede0",
            textAlign: "right",
            zIndex: 2,
          } as React.CSSProperties
        }
      >
        <div className="label" style={{ color: "rgba(244,237,224,0.6)", marginBottom: 12 }}>
          Now Open
        </div>
        <div
          style={{
            fontFamily: "var(--font-body)",
            fontStyle: "italic",
            fontSize: 34,
            color: "#e6b48a",
            marginBottom: 8,
            lineHeight: 1,
          }}
        >
          Spring Awakening
        </div>
        <div
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 16,
            lineHeight: 1.55,
            color: "rgba(244,237,224,0.9)",
          }}
        >
          Sunday, May 24, 2026 · 10:00 AM
          <br />
          Doors open at 9:00 AM
        </div>
      </div>

      {/* Bottom rail */}
      <div
        className="reveal hero-rail"
        style={
          {
            "--delay": "820ms",
            position: "absolute",
            left: 56,
            right: 56,
            bottom: 36,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "#f4ede0",
            zIndex: 2,
            gap: 16,
          } as React.CSSProperties
        }
      >
        <Link
          href={LINKS.rsvp}
          onClick={() => trackRsvp("hero_bottom_rail", LINKS.rsvp)}
          className="hero-cta"
        >
          Reserve a seat{" "}
          <span style={{ fontFamily: "serif", fontStyle: "italic" }}>→</span>
        </Link>
        <span className="mono" style={{ color: "rgba(244,237,224,0.65)" }}>
          ON-SITE CHECKOUT
        </span>
      </div>
    </section>
  );
}
