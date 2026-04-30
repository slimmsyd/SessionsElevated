import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-auth";
import { getSupabaseAdmin, POSTER_BUCKET } from "@/lib/supabase-admin";

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

function extFor(mime: string): string {
  if (mime === "image/jpeg") return "jpg";
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  if (mime === "image/avif") return "avif";
  return "bin";
}

export async function POST(req: Request) {
  const session = await requireAdminSession(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json(
      { error: "Expected multipart/form-data" },
      { status: 400 },
    );
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (file.size === 0) {
    return NextResponse.json({ error: "File is empty" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: `File is too large (max ${MAX_BYTES / 1024 / 1024} MB)` },
      { status: 400 },
    );
  }
  if (!ALLOWED_MIME.has(file.type)) {
    return NextResponse.json(
      {
        error: `Unsupported type ${file.type || "unknown"} — must be jpg, png, webp, or avif`,
      },
      { status: 400 },
    );
  }

  const sessionIdHint =
    typeof form.get("sessionId") === "string"
      ? (form.get("sessionId") as string).replace(/[^a-z0-9-]/gi, "")
      : "session";
  const filename = `${sessionIdHint || "session"}-${Date.now()}.${extFor(file.type)}`;

  const supabase = getSupabaseAdmin();
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await supabase.storage
    .from(POSTER_BUCKET)
    .upload(filename, buffer, {
      contentType: file.type,
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    return NextResponse.json(
      { error: uploadError.message || "Upload failed" },
      { status: 500 },
    );
  }

  const { data } = supabase.storage.from(POSTER_BUCKET).getPublicUrl(filename);
  return NextResponse.json({ url: data.publicUrl, filename });
}
