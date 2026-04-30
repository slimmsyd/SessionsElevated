#!/usr/bin/env node
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const TIERS = path.join(ROOT, "src", "data", "tiers.json");
const SESSION = path.join(ROOT, "src", "data", "session.json");

const REQUIRED_TIER_KEYS = ["id", "mode", "name", "rsvpCount", "price", "blurb", "includes"];
const REQUIRED_SESSION_KEYS = ["id", "title", "subtitle", "date", "time", "doors", "location", "poster"];

function assert(cond, msg) {
  if (!cond) {
    console.error(`✗ ${msg}`);
    process.exit(1);
  }
  console.log(`✓ ${msg}`);
}

async function writeAtomic(file, value) {
  const tmp = `${file}.${process.pid}.${Date.now()}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(value, null, 2) + "\n", "utf8");
  await fs.rename(tmp, file);
}

async function main() {
  // 1. Tiers JSON exists and is well-formed
  const tiersRaw = await fs.readFile(TIERS, "utf8");
  const tiers = JSON.parse(tiersRaw);
  assert(Array.isArray(tiers), "tiers.json parses as an array");
  assert(tiers.length === 5, `tiers.json has 5 tiers (got ${tiers.length})`);
  for (const t of tiers) {
    for (const k of REQUIRED_TIER_KEYS) {
      assert(k in t, `tier ${t.id ?? "?"} has key '${k}'`);
    }
    assert(typeof t.price === "number" && t.price > 0, `tier ${t.id} price is positive number`);
    assert(t.mode === "admission" || t.mode === "partnership", `tier ${t.id} mode is valid`);
  }

  // 2. Session JSON exists and is well-formed
  const sessionRaw = await fs.readFile(SESSION, "utf8");
  const session = JSON.parse(sessionRaw);
  for (const k of REQUIRED_SESSION_KEYS) {
    assert(k in session, `session.json has key '${k}'`);
  }

  // 3. Atomic write round-trip — mutate, read back, restore
  const general = tiers.find((t) => t.id === "general");
  assert(general, "general tier exists");
  const originalPrice = general.price;
  const probePrice = originalPrice + 1;

  const mutated = tiers.map((t) =>
    t.id === "general" ? { ...t, price: probePrice } : t,
  );
  await writeAtomic(TIERS, mutated);

  const reread = JSON.parse(await fs.readFile(TIERS, "utf8"));
  const generalAfter = reread.find((t) => t.id === "general");
  assert(generalAfter.price === probePrice, `round-trip wrote new price (${probePrice})`);

  // Restore original
  await writeAtomic(TIERS, tiers);
  const restored = JSON.parse(await fs.readFile(TIERS, "utf8"));
  const generalRestored = restored.find((t) => t.id === "general");
  assert(generalRestored.price === originalPrice, `restored original price (${originalPrice})`);

  // 4. Confirm no .tmp files remain in src/data/
  const dataFiles = await fs.readdir(path.join(ROOT, "src", "data"));
  const tmpLeft = dataFiles.filter((f) => f.includes(".tmp"));
  assert(tmpLeft.length === 0, `no .tmp files left behind (found: ${tmpLeft.join(", ") || "none"})`);

  console.log("\nstore data layer is healthy");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
