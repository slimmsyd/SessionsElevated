// Partners - featured cards with real logos + past-vendor rows with logo thumbnails

type Featured = { name: string; handle: string; logo: string | null };
type Past = { name: string; logo: string | null; url: string | null };

const handleToInstagram = (h: string) => `https://instagram.com/${h.replace(/^@/, "")}`;

const featured: Featured[] = [
  { name: "Smiles & Good Times", handle: "@smilesngoodtimes", logo: "/assets/partners/smiles-good-times.png" },
  { name: "Dayo's Healing Garden", handle: "@dayoshealinggarden_", logo: null },
  { name: "3Experiences", handle: "@3Experiences", logo: "/assets/partners/3experiences.png" },
  { name: "BtheCr8tor", handle: "@b.thecr8tor", logo: "/assets/partners/bthecr8tor.png" },
];

const past: Past[] = [
  { name: "Rebound Clinics DMV", logo: "/assets/partners/rebound-chiro.jpg", url: "https://reboundclinicsdmv.com/" },
  { name: "Grow Rise Cannabis", logo: null, url: null },
  { name: "Lit by LeRue", logo: "/assets/partners/lit-by-lerue.png", url: "https://litlerue.com/" },
  { name: "Anderson James Farm", logo: null, url: "https://marylandsbest.maryland.gov/item/anderson-james-farm-co/" },
  { name: "Mimi Michelle Wellbeing", logo: null, url: null },
];

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 3);
}

export default function Partners() {
  return (
    <section id="partners" style={{ background: "var(--bg-deep)" }}>
      <div className="shell">
        <div
          className="reveal grid-2-80"
          style={{
            marginBottom: 64,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 80,
          }}
        >
          <div>
            <div className="label" style={{ marginBottom: 16 }}>§ 06 - Partners</div>
            <h2 className="h2" style={{ maxWidth: "18ch" }}>
              Brands that{" "}
              <em>
                celebrate
                <br />
                Black culture.
              </em>
            </h2>
          </div>
          <p className="body" style={{ alignSelf: "end", maxWidth: "44ch", fontSize: 18 }}>
            We collaborate with brands that understand and celebrate Black culture, creating an inclusive, authentic experience where participants can explore mindfulness, holistic practices, and personal transformation with confidence, support, and cultural resonance with professional care.
          </p>
        </div>

        <div
          className="reveal partner-grid"
          style={{ ["--delay" as string]: "120ms" } as React.CSSProperties}
        >
          {featured.map((p, i) => (
            <div key={i} className="partner-card">
              <div className="mono">0{i + 1}</div>
              <div className="partner-logo">
                {p.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.logo} alt={`${p.name} logo`} />
                ) : (
                  <div className="partner-logo-placeholder">
                    <span
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: 24,
                        fontStyle: "italic",
                        color: "var(--accent)",
                      }}
                    >
                      {initials(p.name)}
                    </span>
                  </div>
                )}
              </div>
              <div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 22, lineHeight: 1.1, marginBottom: 6 }}>
                  {p.name}
                </div>
                <a
                  href={handleToInstagram(p.handle)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mono"
                  style={{ color: "var(--accent)", textDecoration: "none" }}
                >
                  {p.handle}
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Why Partner With Us */}
        <div
          className="reveal"
          style={{ ["--delay" as string]: "180ms", marginTop: 96, marginBottom: 56 } as React.CSSProperties}
        >
          <div className="label" style={{ marginBottom: 16 }}>Why partner with us?</div>
          <h3 className="h2" style={{ fontSize: "clamp(28px, 3vw, 40px)", maxWidth: "26ch" }}>
            <em>
              Learn about current
              <br />
              partnership opportunities.
            </em>
          </h3>
        </div>

        <div
          className="reveal grid-2-60"
          style={
            {
              ["--delay" as string]: "240ms",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 60,
              marginBottom: 96,
            } as React.CSSProperties
          }
        >
          <div style={{ borderTop: "1px solid var(--line)", paddingTop: 28 }}>
            <div className="label" style={{ marginBottom: 12 }}>Curated Community</div>
            <p className="body" style={{ fontSize: 17, marginBottom: 16 }}>
              Gain direct access to an intimate, invite-only audience who are intentional, influential, and ready to invest in elevating their well-being.
            </p>
            <p className="body" style={{ fontSize: 17 }}>
              Our gatherings foster authentic connections, ensuring your brand is seen, experienced, and remembered.
            </p>
          </div>
          <div style={{ borderTop: "1px solid var(--line)", paddingTop: 28 }}>
            <div className="label" style={{ marginBottom: 12 }}>Culturally Rooted Wellness</div>
            <p className="body" style={{ fontSize: 17, marginBottom: 16 }}>
              Our skilled team brings specialized knowledge and experience to provide top-notch solutions tailored to our guests&apos; needs.
            </p>
            <p className="body" style={{ fontSize: 17 }}>
              Align your brand with a collective of Black entrepreneurs, wellness leaders, and healers reshaping how wellness is experienced in our communities.
            </p>
          </div>
        </div>

        {/* Past Vendors */}
        <div
          className="reveal"
          style={{ ["--delay" as string]: "320ms" } as React.CSSProperties}
        >
          <div className="label" style={{ marginBottom: 32 }}>Past partners &amp; wellness showcase vendors</div>
          <div style={{ borderTop: "1px solid var(--line)" }}>
            {past.map((p, i) => {
              const inner = (
                <>
                  <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                    <div className="past-vendor-logo">
                      {p.logo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.logo} alt={`${p.name} logo`} />
                      ) : (
                        <span style={{ fontFamily: "var(--font-body)", fontStyle: "italic", color: "var(--ink-mute)", fontSize: 14 }}>-</span>
                      )}
                    </div>
                    <span style={{ fontFamily: "var(--font-display)", fontSize: "clamp(22px, 2.4vw, 30px)" }}>
                      {p.name}
                    </span>
                  </div>
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontStyle: "italic",
                      color: p.url ? "var(--accent)" : "var(--ink-mute)",
                      fontSize: 16,
                    }}
                  >
                    {p.url ? "Connect Directly →" : "Coming soon"}
                  </span>
                </>
              );
              return p.url ? (
                <a
                  key={i}
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="past-vendor-row"
                >
                  {inner}
                </a>
              ) : (
                <div key={i} className="past-vendor-row" style={{ cursor: "default" }}>
                  {inner}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
