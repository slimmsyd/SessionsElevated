// Welcome / What is a Session - banner removed per v2 design discussion;
// the section breathes on its own with a hairline rule and seasons grid as the visual anchor.

const seasons = [
  { name: "Fall", line: "Release" },
  { name: "Winter", line: "Ground + Seed" },
  { name: "Spring", line: "Awaken + Blossom" },
  { name: "Summer", line: "Expand + Flourish in Abundance" },
];

export default function WhatIsASession() {
  return (
    <section id="what">
      <div className="shell">
        <div className="reveal" style={{ marginBottom: 56 }}>
          <div className="label" style={{ marginBottom: 16 }}>§ 01 - Welcome</div>
          <h2 className="h2" style={{ maxWidth: "20ch" }}>
            A wellness series<br />
            <em>designed for the culture.</em>
          </h2>
        </div>

        <div
          className="reveal"
          style={{ ["--delay" as string]: "120ms", maxWidth: "60ch", marginBottom: 96 } as React.CSSProperties}
        >
          <p className="lede" style={{ maxWidth: "100%" }}>
            Step into a journey of intentional living - an exclusive experience blending meditation, nature, and holistic practices in rhythm with the seasons.
          </p>
        </div>

        <div className="hairline reveal" style={{ marginBottom: 56 }} />

        <div
          className="reveal grid-4"
          style={{
            marginBottom: 96,
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 32,
          }}
        >
          {seasons.map((s, i) => (
            <div key={i} style={{ borderTop: "1px solid var(--line)", paddingTop: 20 }}>
              <div className="mono">0{i + 1}</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 32, marginTop: 8 }}>{s.name}</div>
              <div
                style={{
                  fontFamily: "var(--font-body)",
                  fontStyle: "italic",
                  fontSize: 22,
                  color: "var(--accent)",
                  marginTop: 4,
                }}
              >
                {s.line}
              </div>
            </div>
          ))}
        </div>

        <div
          className="reveal grid-2-80"
          style={
            {
              ["--delay" as string]: "180ms",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 80,
            } as React.CSSProperties
          }
        >
          <p className="body" style={{ fontSize: 18, maxWidth: "44ch" }}>
            Guided by licensed therapists and holistic wellness practitioners, each session invites guests into the art of release, renewal, and balance. Through a curated mix of restorative practices - including breathwork, sound healing, meditation, and other grounding experiences - guests also enjoy a seasonally inspired tasting menu that enhances the journey.
          </p>
          <p className="body" style={{ fontSize: 18, maxWidth: "44ch" }}>
            Each gathering concludes with a private networking moment, offering space to connect with a curated circle of luxury wellness brands and elevated at-home care products.
          </p>
        </div>
      </div>
    </section>
  );
}
