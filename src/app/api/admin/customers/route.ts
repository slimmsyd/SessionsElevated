import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/admin-auth";

type CustomerRow = Prisma.BookingGetPayload<{
  select: {
    id: true;
    paymentIntentId: true;
    referenceCode: true;
    customerName: true;
    customerEmail: true;
    customerPhone: true;
    optIn: true;
    amountCents: true;
    currency: true;
    lineItems: true;
    tierQty: true;
    sessionId: true;
    status: true;
    createdAt: true;
  };
}>;

function csvEscape(v: unknown): string {
  if (v === null || v === undefined) return "";
  const s = String(v);
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export async function GET(req: Request) {
  const session = await requireAdminSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const format = url.searchParams.get("format");

  const bookings: CustomerRow[] = await prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
    take: 1000,
    select: {
      id: true,
      paymentIntentId: true,
      referenceCode: true,
      customerName: true,
      customerEmail: true,
      customerPhone: true,
      optIn: true,
      amountCents: true,
      currency: true,
      lineItems: true,
      tierQty: true,
      sessionId: true,
      status: true,
      createdAt: true,
    },
  });

  if (format === "csv") {
    const header = [
      "reference",
      "name",
      "email",
      "phone",
      "opt_in",
      "amount",
      "currency",
      "line_items",
      "session",
      "status",
      "created_at",
    ];
    const rows = bookings.map((b: CustomerRow) => [
      b.referenceCode,
      b.customerName,
      b.customerEmail,
      b.customerPhone ?? "",
      b.optIn ? "yes" : "no",
      (b.amountCents / 100).toFixed(2),
      b.currency.toUpperCase(),
      b.lineItems,
      b.sessionId,
      b.status,
      b.createdAt.toISOString(),
    ]);
    const csv = [header, ...rows]
      .map((r) => r.map(csvEscape).join(","))
      .join("\n");
    return new Response(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="elevated-sessions-customers-${
          new Date().toISOString().split("T")[0]
        }.csv"`,
      },
    });
  }

  return NextResponse.json({
    count: bookings.length,
    bookings: bookings.map((b: CustomerRow) => ({
      ...b,
      createdAt: b.createdAt.toISOString(),
    })),
  });
}
