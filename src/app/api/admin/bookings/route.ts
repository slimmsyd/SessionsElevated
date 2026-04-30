import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-auth";
import { fetchBookings } from "@/lib/admin-bookings";

export async function GET(req: Request) {
  const session = await requireAdminSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await fetchBookings();
    return NextResponse.json(data);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to fetch bookings";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
