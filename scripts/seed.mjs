#!/usr/bin/env node
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pkg from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
const { PrismaClient } = pkg;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL not set. Run via: npx dotenv -e .env.local -- node scripts/seed.mjs");
  }
  const adapter = new PrismaPg({ connectionString });
  const prisma = new PrismaClient({ adapter });

  const tiersJson = JSON.parse(
    await fs.readFile(path.join(ROOT, "src/data/tiers.json"), "utf8"),
  );
  const sessionJson = JSON.parse(
    await fs.readFile(path.join(ROOT, "src/data/session.json"), "utf8"),
  );

  console.log(`Seeding ${tiersJson.length} tiers (prices zeroed) + 1 session...`);

  for (let i = 0; i < tiersJson.length; i++) {
    const t = tiersJson[i];
    await prisma.tier.upsert({
      where: { id: t.id },
      create: {
        id: t.id,
        mode: t.mode,
        name: t.name,
        rsvpCount: t.rsvpCount,
        price: 0,
        blurb: t.blurb,
        includes: t.includes,
        badge: t.badge ?? null,
        position: i,
      },
      update: {
        mode: t.mode,
        name: t.name,
        rsvpCount: t.rsvpCount,
        price: 0,
        blurb: t.blurb,
        includes: t.includes,
        badge: t.badge ?? null,
        position: i,
      },
    });
    console.log(`  ✓ ${t.id} (${t.name}) — price reset to 0`);
  }

  await prisma.session.upsert({
    where: { id: sessionJson.id },
    create: sessionJson,
    update: sessionJson,
  });
  console.log(`  ✓ session ${sessionJson.id} (${sessionJson.title})`);

  await prisma.$disconnect();
  console.log("\nseeded ok. set tier prices via /admin/tiers before going live.");
}

main().catch(async (err) => {
  console.error(err);
  process.exit(1);
});
