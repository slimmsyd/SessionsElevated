import { prisma } from "@/lib/prisma";
import type { Tier, TierMode } from "@/app/book/components/tiers";
import type { Session } from "@/lib/sessions";

export interface AdminStore {
  getTiers(): Promise<Tier[]>;
  updateTier(id: string, patch: Partial<Tier>): Promise<Tier>;
  getSession(): Promise<Session>;
  updateSession(patch: Partial<Session>): Promise<Session>;
}

type PrismaTier = {
  id: string;
  mode: string;
  name: string;
  rsvpCount: number;
  price: number;
  capacity: number | null;
  blurb: string;
  includes: string[];
  badge: string | null;
};

type PrismaSession = {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  time: string;
  doors: string;
  location: string;
  poster: string;
};

function toTier(row: PrismaTier): Tier {
  return {
    id: row.id,
    mode: row.mode as TierMode,
    name: row.name,
    rsvpCount: row.rsvpCount,
    price: row.price,
    capacity: row.capacity,
    blurb: row.blurb,
    includes: row.includes,
    badge: row.badge ?? undefined,
  };
}

function toSession(row: PrismaSession): Session {
  return {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle,
    date: row.date,
    time: row.time,
    doors: row.doors,
    location: row.location,
    poster: row.poster,
  };
}

export function createPrismaStore(): AdminStore {
  return {
    async getTiers() {
      const rows = await prisma.tier.findMany({
        orderBy: [{ position: "asc" }, { id: "asc" }],
      });
      return rows.map(toTier);
    },

    async updateTier(id, patch) {
      const data: Record<string, unknown> = {};
      if (patch.name !== undefined) data.name = patch.name;
      if (patch.price !== undefined) data.price = patch.price;
      if (patch.blurb !== undefined) data.blurb = patch.blurb;
      if (patch.includes !== undefined) data.includes = patch.includes;
      if (patch.rsvpCount !== undefined) data.rsvpCount = patch.rsvpCount;
      if ("capacity" in patch) data.capacity = patch.capacity ?? null;
      if ("badge" in patch) data.badge = patch.badge ?? null;
      const row = await prisma.tier.update({ where: { id }, data });
      return toTier(row);
    },

    async getSession() {
      const row = await prisma.session.findFirst();
      if (!row) {
        throw new Error("No session configured. Seed the database first.");
      }
      return toSession(row);
    },

    async updateSession(patch) {
      const current = await prisma.session.findFirst();
      if (!current) {
        throw new Error("No session configured. Seed the database first.");
      }
      const data: Record<string, unknown> = {};
      for (const key of [
        "title",
        "subtitle",
        "date",
        "time",
        "doors",
        "location",
        "poster",
      ] as const) {
        if (patch[key] !== undefined) data[key] = patch[key];
      }
      const row = await prisma.session.update({
        where: { id: current.id },
        data,
      });
      return toSession(row);
    },
  };
}

export const store = createPrismaStore();
