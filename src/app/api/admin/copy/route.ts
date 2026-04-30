import { NextResponse } from "next/server";
import { store } from "@/lib/admin-store";
import { requireAdminSession } from "@/lib/admin-auth";
import type { Session } from "@/lib/sessions";

const FIELD_LIMITS: Record<keyof Session, number> = {
  id: 100,
  title: 200,
  subtitle: 300,
  date: 100,
  time: 100,
  doors: 100,
  location: 300,
  poster: 500,
};

function validatePatch(patch: unknown): {
  ok: true;
  value: Partial<Session>;
} | { ok: false; error: string } {
  if (!patch || typeof patch !== "object") {
    return { ok: false, error: "Invalid patch" };
  }
  const out: Partial<Session> = {};
  const p = patch as Record<string, unknown>;
  const editableKeys = (Object.keys(FIELD_LIMITS) as (keyof Session)[]).filter(
    (k) => k !== "id",
  );

  for (const key of editableKeys) {
    if (key in p) {
      const v = p[key];
      if (typeof v !== "string") {
        return { ok: false, error: `${key} must be a string` };
      }
      if (v.length > FIELD_LIMITS[key]) {
        return {
          ok: false,
          error: `${key} must be at most ${FIELD_LIMITS[key]} characters`,
        };
      }
      out[key] = v;
    }
  }
  if (Object.keys(out).length === 0) {
    return { ok: false, error: "No editable fields provided" };
  }
  return { ok: true, value: out };
}

export async function GET(req: Request) {
  const session = await requireAdminSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data = await store.getSession();
  return NextResponse.json({ session: data });
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

  const b = body as { patch?: unknown };
  const validation = validatePatch(b.patch);
  if (!validation.ok) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  try {
    const updated = await store.updateSession(validation.value);
    return NextResponse.json({ session: updated });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Update failed";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
