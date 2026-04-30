import { NextResponse } from "next/server";
import { store } from "@/lib/admin-store";
import { requireAdminSession } from "@/lib/admin-auth";
import type { Tier } from "@/app/book/components/tiers";

const MAX_PRICE = 99_999;
const MAX_NAME = 200;
const MAX_BLURB = 2000;
const MAX_INCLUDE_ITEM = 500;
const MAX_INCLUDES = 20;
const MAX_BADGE = 50;
const MAX_RSVP = 50;

function validatePatch(patch: unknown): {
  ok: true;
  value: Partial<Tier>;
} | { ok: false; error: string } {
  if (!patch || typeof patch !== "object") {
    return { ok: false, error: "Invalid patch" };
  }
  const out: Partial<Tier> = {};
  const p = patch as Record<string, unknown>;

  if ("price" in p) {
    const v = p.price;
    if (
      typeof v !== "number" ||
      !Number.isInteger(v) ||
      v < 1 ||
      v > MAX_PRICE
    ) {
      return { ok: false, error: `Price must be a whole number between 1 and ${MAX_PRICE}` };
    }
    out.price = v;
  }
  if ("name" in p) {
    if (typeof p.name !== "string" || !p.name.trim() || p.name.length > MAX_NAME) {
      return { ok: false, error: `Name must be 1–${MAX_NAME} characters` };
    }
    out.name = p.name.trim();
  }
  if ("blurb" in p) {
    if (typeof p.blurb !== "string" || p.blurb.length > MAX_BLURB) {
      return { ok: false, error: `Blurb must be a string up to ${MAX_BLURB} characters` };
    }
    out.blurb = p.blurb;
  }
  if ("includes" in p) {
    if (!Array.isArray(p.includes) || p.includes.length > MAX_INCLUDES) {
      return { ok: false, error: `Includes must be an array of up to ${MAX_INCLUDES} items` };
    }
    for (const item of p.includes) {
      if (typeof item !== "string" || item.length > MAX_INCLUDE_ITEM) {
        return { ok: false, error: "Each include item must be a string up to 500 characters" };
      }
    }
    out.includes = (p.includes as string[]).filter((s) => s.trim().length > 0);
  }
  if ("badge" in p) {
    if (p.badge === null || p.badge === "") {
      out.badge = undefined;
    } else if (typeof p.badge !== "string" || p.badge.length > MAX_BADGE) {
      return { ok: false, error: `Badge must be a string up to ${MAX_BADGE} characters` };
    } else {
      out.badge = p.badge.trim();
    }
  }
  if ("rsvpCount" in p) {
    const v = p.rsvpCount;
    if (typeof v !== "number" || !Number.isInteger(v) || v < 1 || v > MAX_RSVP) {
      return { ok: false, error: `RSVP count must be a whole number between 1 and ${MAX_RSVP}` };
    }
    out.rsvpCount = v;
  }

  if (Object.keys(out).length === 0) {
    return { ok: false, error: "No editable fields provided" };
  }
  return { ok: true, value: out };
}

export async function GET(req: Request) {
  const session = await requireAdminSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const tiers = await store.getTiers();
  return NextResponse.json({ tiers });
}

export async function PUT(req: Request) {
  const session = await requireAdminSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const b = body as { id?: unknown; patch?: unknown };
  if (typeof b.id !== "string" || !b.id) {
    return NextResponse.json({ error: "Tier id required" }, { status: 400 });
  }

  const validation = validatePatch(b.patch);
  if (!validation.ok) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  try {
    const updated = await store.updateTier(b.id, validation.value);
    return NextResponse.json({ tier: updated });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Update failed";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
