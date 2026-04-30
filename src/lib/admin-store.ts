import { promises as fs } from "node:fs";
import path from "node:path";
import { ALL_TIERS, type Tier } from "@/app/book/components/tiers";
import { CURRENT_SESSION, type Session } from "@/lib/sessions";

const DATA_DIR = path.join(process.cwd(), "src", "data");
const TIERS_PATH = path.join(DATA_DIR, "tiers.json");
const SESSION_PATH = path.join(DATA_DIR, "session.json");

export interface AdminStore {
  getTiers(): Promise<Tier[]>;
  updateTier(id: string, patch: Partial<Tier>): Promise<Tier>;
  getSession(): Promise<Session>;
  updateSession(patch: Partial<Session>): Promise<Session>;
}

async function readJsonOrFallback<T>(file: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(file, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeJsonAtomic(file: string, value: unknown): Promise<void> {
  await fs.mkdir(path.dirname(file), { recursive: true });
  const tmp = `${file}.${process.pid}.${Date.now()}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(value, null, 2) + "\n", "utf8");
  await fs.rename(tmp, file);
}

export function createFileStore(): AdminStore {
  return {
    async getTiers() {
      return readJsonOrFallback<Tier[]>(TIERS_PATH, ALL_TIERS);
    },

    async updateTier(id, patch) {
      const tiers = await readJsonOrFallback<Tier[]>(TIERS_PATH, ALL_TIERS);
      const idx = tiers.findIndex((t) => t.id === id);
      if (idx === -1) throw new Error(`Unknown tier: ${id}`);
      const current = tiers[idx];
      const next: Tier = {
        ...current,
        ...patch,
        id: current.id,
        mode: current.mode,
      };
      tiers[idx] = next;
      await writeJsonAtomic(TIERS_PATH, tiers);
      return next;
    },

    async getSession() {
      return readJsonOrFallback<Session>(SESSION_PATH, CURRENT_SESSION);
    },

    async updateSession(patch) {
      const current = await readJsonOrFallback<Session>(
        SESSION_PATH,
        CURRENT_SESSION,
      );
      const next: Session = { ...current, ...patch, id: current.id };
      await writeJsonAtomic(SESSION_PATH, next);
      return next;
    },
  };
}

export const store = createFileStore();
