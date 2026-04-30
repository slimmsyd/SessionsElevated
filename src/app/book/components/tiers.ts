export type TierMode = "admission" | "partnership";

export type Tier = {
  id: string;
  mode: TierMode;
  name: string;
  rsvpCount: number;
  price: number;
  capacity: number | null; // null = unlimited
  blurb: string;
  includes: string[];
  badge?: string;
};

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
