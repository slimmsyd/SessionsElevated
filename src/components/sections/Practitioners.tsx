// Practitioners - sourced from page
const people = [
  {
    name: "Nia-Dayo Taylor, LBS",
    role: "Mindfulness Facilitator & Licensed Therapist",
    photo: "/assets/practitioners/nia-dayo-taylor.jpg",
    bio: "Nia-Dayo is a Licensed Behavioral Specialist and Licensed Master Social Worker with over 20 years of experience supporting children, adults, and families. Her career has focused on outpatient counseling, where she has guided clients in strengthening communication, building relationships, and achieving their therapeutic goals through evidence-based practices. Believing in the incredible power of the individual, Nia-Dayo empowers each client to take control of their healing journey. She integrates breathwork and talk therapy to create a holistic, mindful approach that fosters personal growth, balance, and resilience.",
  },
  {
    name: "Dr. Dominic Austin, DC",
    role: "Doctor of Chiropractic",
    photo: "/assets/practitioners/dr-dominic-austin.png",
    bio: "Dr. Dominic D. Austin was born and raised in Nassau, New Providence (Bahamas). He moved to Florida after high school to attend Florida Memorial University, where he graduated with his Bachelor of Science in Biology. After obtaining his Chiropractic Doctoral degree from Sherman College (South Carolina), he practiced in South Florida for seven years before relocating to Maryland. Dr. Austin is board-certified with chiropractic licenses in both Maryland and Florida.",
  },
  {
    name: "Javaz Huntington",
    role: "Yoga Teacher & Breathwork Practitioner",
    photo: "/assets/practitioners/javaz-huntington.jpg",
    bio: "Javaz is a Certified Yoga Instructor, Breathwork Practitioner, and founder of Chloe Alchemy, a wellness brand born from her passion for holistic well-being and soulful living. She believes in the transformative power of mindful movement, breathwork, and intentional rituals to support personal growth and self-discovery. Through her classes and sessions, Javaz helps participants release tension, feel more at home in their bodies, and cultivate joy, presence, and balance. Her approach is accessible, affirming, and infused with warmth, empowering each person to reconnect with their most grounded and empowered self.",
  },
];

export default function Practitioners() {
  return (
    <section id="practitioners" style={{ background: "var(--paper)" }}>
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
            <div className="label" style={{ marginBottom: 16 }}>§ 04 - Licensed Therapists &amp; Facilitators</div>
            <h2 className="h2">
              <em>
                Meet our
                <br />
              </em>
              practitioners.
            </h2>
          </div>
          <p className="body" style={{ alignSelf: "end", maxWidth: "44ch", fontSize: 18 }}>
            We partner with licensed therapists to ensure our events provide safe, evidence-based guidance and meaningful growth.
          </p>
        </div>

        <div className="practitioner-grid">
          {people.map((p, i) => (
            <div
              key={i}
              className="practitioner reveal"
              style={{ ["--delay" as string]: `${i * 120}ms` } as React.CSSProperties}
            >
              <div className="practitioner-photo">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.photo} alt={`Portrait of ${p.name.split(",")[0]}`} />
              </div>
              <h3
                className="h3"
                style={{ fontStyle: "italic", fontFamily: "var(--font-body)", marginBottom: 8 }}
              >
                {p.name}
              </h3>
              <div className="label" style={{ marginBottom: 16 }}>{p.role}</div>
              <p className="body" style={{ margin: 0, marginBottom: 16 }}>{p.bio}</p>
              <a
                href="#"
                style={{
                  fontFamily: "var(--font-body)",
                  fontStyle: "italic",
                  color: "var(--accent)",
                  textDecoration: "none",
                  fontSize: 16,
                }}
              >
                Connect →
              </a>
            </div>
          ))}
        </div>

        <div
          className="reveal"
          style={{
            marginTop: 80,
            padding: 40,
            border: "1px solid var(--line)",
            borderRadius: 2,
            textAlign: "center",
          }}
        >
          <div className="label" style={{ marginBottom: 12 }}>More Facilitators Announced Soon</div>
          <p className="body" style={{ fontSize: 18, margin: 0, maxWidth: "56ch", marginInline: "auto" }}>
            Exciting new voices and wellness experts will be joining us - stay tuned for the full lineup of our next sessions &amp; experts.
          </p>
        </div>
      </div>
    </section>
  );
}
