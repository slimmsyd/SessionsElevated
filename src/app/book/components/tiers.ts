export type TierMode = "admission" | "partnership";

export type Tier = {
  id: string;
  mode: TierMode;
  name: string;
  rsvpCount: number;
  price: number;
  blurb: string;
  includes: string[];
  badge?: string;
};

export const ADMISSION_TIER: Tier = {
  id: "general",
  mode: "admission",
  name: "General Admission",
  rsvpCount: 1,
  price: 65,
  blurb:
    "Full access to all programmed sessions — breathwork, sound bath, movement, and seasonal nourishment.",
  includes: [
    "Entry to all programmed sessions",
    "Curated welcome tea & light bites",
    "Take-home seasonal keepsake",
  ],
};

export const PARTNERSHIP_TIERS: Tier[] = [
  {
    id: "small_vendor",
    mode: "partnership",
    name: "Small Business Vendor",
    rsvpCount: 2,
    price: 75,
    blurb:
      "For independent makers and small businesses who want to vend at the gathering.",
    includes: [
      "1 Team Member Pass with full session access",
      "1 Complimentary Guest RSVP with full session access",
      "4 ft × 4 ft exhibit space — skirted table & 1 chair",
      "Logo placement: site, email, registration, social",
      "Bring your own pop-up banner, table cover, display stands",
      "Standard power available for an additional cost",
    ],
  },
  {
    id: "exhibitor",
    mode: "partnership",
    name: "Exhibitor / Vendor",
    rsvpCount: 4,
    price: 150,
    blurb: "A larger footprint for established vendors and brands.",
    includes: [
      "2 Team Member Passes with full session access",
      "2 Complimentary Guest RSVPs with full session access",
      "6 ft × 6 ft exhibit space — 6 ft skirted table & 2 chairs",
      "Logo placement: site, email, registration, social",
      "Bring your own pop-up banner, table cover, display stands",
      "Standard power available for an additional cost",
    ],
  },
  {
    id: "official_partner",
    mode: "partnership",
    name: "Official Partner",
    rsvpCount: 6,
    price: 350,
    blurb: "An elevated presence and an expanded team package.",
    includes: [
      "2 Team Member Passes with full session access",
      "4 Complimentary Guest RSVPs with full session access",
      "6 ft × 6 ft exhibit space — 6 ft skirted table & 2 chairs",
      "Logo placement: site, email, registration, social",
      "Bring your own pop-up banner, table cover, display stands",
      "Standard power available for an additional cost",
    ],
  },
  {
    id: "featured_partner",
    mode: "partnership",
    name: "Featured Partner",
    rsvpCount: 8,
    price: 500,
    blurb:
      "Our highest tier — a programmed wellness segment, premium signage, and a wide footprint.",
    badge: "Headline tier",
    includes: [
      "2 Team Member Passes with full session access",
      "6 Complimentary Guest RSVPs with full session access",
      "10 ft × 15 ft exhibit space — two 6 ft skirted tables & 4 chairs",
      "Opportunity to facilitate a 30–45 minute wellness segment",
      "Logo placement: site, email, registration, social",
      "Pre-printed branded signage",
      "Branded banner on mobile RSVPs",
      "Bring your own pop-up banner, table cover, display stands",
      "Standard power available for an additional cost",
    ],
  },
];

export const ALL_TIERS: Tier[] = [ADMISSION_TIER, ...PARTNERSHIP_TIERS];

export const PARTNERSHIP_NOTE =
  "Partnership reservations are reserved for those who want to be an official exhibitor, vendor, or partner. A Participation and Liability Form must be completed before your reservation is considered valid — we'll send it with your confirmation.";

export type QtyMap = Record<string, number>;

export const initialQty = (mode: TierMode): QtyMap => {
  const map: QtyMap = {
    general: 0,
    small_vendor: 0,
    exhibitor: 0,
    official_partner: 0,
    featured_partner: 0,
  };
  if (mode === "admission") map.general = 1;
  return map;
};

export const FEE_RATE = 0.029;
export const FEE_FLAT = 0.5;
export const MAX_QTY = 8;
