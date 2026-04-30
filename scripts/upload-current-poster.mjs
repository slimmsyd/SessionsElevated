#!/usr/bin/env node
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";
import pkg from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
const { PrismaClient } = pkg;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const BUCKET = "session-posters";

function extFor(localPath) {
  const e = path.extname(localPath).slice(1).toLowerCase();
  if (["png", "jpg", "jpeg", "webp", "avif"].includes(e)) {
    return e === "jpeg" ? "jpg" : e;
  }
  return "bin";
}

function mimeFor(ext) {
  return {
    png: "image/png",
    jpg: "image/jpeg",
    webp: "image/webp",
    avif: "image/avif",
  }[ext];
}

async function main() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const dbUrl = process.env.DATABASE_URL;
  if (!supabaseUrl) throw new Error("NEXT_PUBLIC_SUPABASE_URL not set");
  if (!serviceKey) throw new Error("SUPABASE_SERVICE_ROLE_KEY not set");
  if (!dbUrl) throw new Error("DATABASE_URL not set");

  const adapter = new PrismaPg({ connectionString: dbUrl });
  const prisma = new PrismaClient({ adapter });
  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const session = await prisma.session.findFirst();
  if (!session) {
    throw new Error("No session row in DB. Seed first.");
  }
  const posterField = session.poster ?? "";

  // If already a Supabase URL, skip
  if (posterField.startsWith("http")) {
    console.log(`session.poster is already a URL — nothing to migrate:\n  ${posterField}`);
    await prisma.$disconnect();
    return;
  }

  // Treat as path under /public
  const localPath = path.join(ROOT, "public", posterField.replace(/^\/+/, ""));
  console.log(`Reading local file: ${localPath}`);
  const buffer = await fs.readFile(localPath);
  const ext = extFor(localPath);
  const mime = mimeFor(ext) ?? "application/octet-stream";
  const filename = `${session.id}-${Date.now()}.${ext}`;

  console.log(`Uploading ${buffer.length} bytes as ${filename} (${mime})...`);
  const { error: upErr } = await supabase.storage
    .from(BUCKET)
    .upload(filename, buffer, {
      contentType: mime,
      cacheControl: "3600",
      upsert: false,
    });
  if (upErr) {
    console.error("Upload failed:", upErr.message);
    process.exit(1);
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(filename);
  const publicUrl = data.publicUrl;
  console.log(`Public URL: ${publicUrl}`);

  await prisma.session.update({
    where: { id: session.id },
    data: { poster: publicUrl },
  });
  console.log(`Updated session.${session.id}.poster to bucket URL.`);

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
