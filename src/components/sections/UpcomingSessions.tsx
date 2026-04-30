"use client";
// Sessions - poster-led 2-column rows with session artwork
import Link from "next/link";
import { LINKS } from "@/lib/links";
import { trackRsvp, type RsvpLocation } from "@/lib/analytics";

type Session = {
  season: string;
  title: string;
  quote: string;
  date: string;
  time: string;
  cta: string;
  status: "open" | "soon" | "closed";
  poster: string;
  url?: string;
  external?: boolean;
  trackingLocation?: RsvpLocation;
};

const sessions: Session[] = [
  {
    season: "Spring",
    title: "Spring Awakening: A Journey into Renewal",
    quote: "Awaken your spirit and embrace growth as the season unfolds.",
    date: "Sunday, May 24, 2026",
    time: "10:00 AM – 2:00 PM (Doors open at 9:00 AM)",
    cta: "RSVP Today",
    status: "open",
    poster: "/assets/sessions/winter-ground-seed.png",
    url: LINKS.rsvp,
    trackingLocation: "session_row_spring",
  },
  {
    season: "Winter",
    title: "Winter Roots: Ground & Seed",
    quote: "Plant the seeds of intention and cultivate balance for the months ahead.",
    date: "Saturday, March 7, 2026",
    time: "10:00 AM – 2:00 PM (Doors open at 9:00 AM)",
    cta: "Closed",
    status: "closed",
    poster: "/assets/sessions/spring-awaken-blossom.png",
    url: LINKS.pastWinter,
    external: true,
    trackingLocation: "session_row_winter_closed",
  },
  {
    season: "Summer",
    title: "Summer Radiance: A Celebration of Vitality",
    quote: "Celebrate fullness, joy, and radiant living under the summer sun.",
    date: "Coming Soon",
    time: "TBA",
    cta: "Coming Soon",
    status: "soon",
    poster: "/assets/sessions/summer-coming-soon.png",
  },
  {
    season: "Fall",
    title: "Breathe and Blow: A Wellness Release",
    quote: "Let go of what no longer serves you and step into seasonal renewal.",
    date: "Saturday, September 20, 2025",
    time: "10:00 AM – 2:00 PM (Doors open at 9:00 AM)",
    cta: "Closed",
    status: "closed",
    poster: "/assets/sessions/fall-breathe-blow.png",
    url: LINKS.pastBreatheAndBlow,
    external: true,
    trackingLocation: "session_row_fall_closed",
  },
];

export default function UpcomingSessions() {
  return (
    <section id="sessions">
      <div className="shell">
        <div className="reveal" style={{ marginBottom: 24 }}>
          <div className="label" style={{ marginBottom: 16 }}>§ 03 - Current &amp; Past Events</div>
          <h2 className="h2" style={{ maxWidth: "16ch" }}>
            Our seasonal<br />
            <em>gatherings.</em>
          </h2>
        </div>

        {sessions.map((s, i) => (
          <div
            key={i}
            className={`session-row reveal${i % 2 === 1 ? " session-row-flip" : ""}`}
            style={{ ["--delay" as string]: `${i * 80}ms` } as React.CSSProperties}
          >
            <div className="session-poster">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.poster} alt={`${s.title} poster`} />
              {s.status === "closed" && <div className="session-poster-overlay">Closed</div>}
              {s.status === "soon" && (
                <div className="session-poster-overlay soon">Coming Soon</div>
              )}
            </div>

            <div className="session-main">
              <div className="label" style={{ marginBottom: 16 }}>{s.season} Session</div>
              <h3
                className="h2"
                style={{
                  fontSize: "clamp(36px, 4.2vw, 56px)",
                  marginBottom: 20,
                  maxWidth: "16ch",
                }}
              >
                <em>{s.title}</em>
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontStyle: "italic",
                  fontSize: 20,
                  lineHeight: 1.5,
                  color: "var(--ink-soft)",
                  margin: "0 0 32px",
                  maxWidth: "38ch",
                }}
              >
                &ldquo;{s.quote}&rdquo;
              </p>
              <div className="session-details">
                <div>
                  <div className="label">Date</div>
                  <div className="body" style={{ color: "var(--ink)", marginTop: 6 }}>{s.date}</div>
                </div>
                <div>
                  <div className="label">Time</div>
                  <div className="body" style={{ color: "var(--ink)", marginTop: 6 }}>{s.time}</div>
                </div>
              </div>

              <div style={{ marginTop: 28 }}>
                {s.status === "open" && s.url && (
                  s.external ? (
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => s.trackingLocation && trackRsvp(s.trackingLocation, s.url!)}
                      className="btn"
                      style={{ background: "var(--ink)", color: "var(--bg)" }}
                    >
                      {s.cta} <span className="arrow">→</span>
                    </a>
                  ) : (
                    <Link
                      href={s.url}
                      onClick={() => s.trackingLocation && trackRsvp(s.trackingLocation, s.url!)}
                      className="btn"
                      style={{ background: "var(--ink)", color: "var(--bg)" }}
                    >
                      {s.cta} <span className="arrow">→</span>
                    </Link>
                  )
                )}
                {s.status === "soon" && (
                  <span className="btn btn-ghost" style={{ pointerEvents: "none", opacity: 0.7 }}>
                    {s.cta}
                  </span>
                )}
                {s.status === "closed" && s.url && (
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => s.trackingLocation && trackRsvp(s.trackingLocation, s.url!)}
                    className="btn btn-ghost"
                    style={{ opacity: 0.6 }}
                  >
                    {s.cta} <span className="arrow">→</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
