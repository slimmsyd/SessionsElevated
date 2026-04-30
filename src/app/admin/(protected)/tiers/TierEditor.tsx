"use client";
import { useState, useTransition, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import type { Tier } from "@/app/book/components/tiers";
import styles from "./tiers.module.css";

type Draft = {
  name: string;
  price: string;
  rsvpCount: string;
  blurb: string;
  badge: string;
  includesText: string;
};

function tierToDraft(t: Tier): Draft {
  return {
    name: t.name,
    price: String(t.price),
    rsvpCount: String(t.rsvpCount),
    blurb: t.blurb,
    badge: t.badge ?? "",
    includesText: t.includes.join("\n"),
  };
}

function draftToPatch(d: Draft): {
  ok: boolean;
  patch?: Partial<Tier>;
  error?: string;
} {
  const price = Number(d.price);
  if (!Number.isInteger(price) || price < 1) {
    return { ok: false, error: "Price must be a whole number" };
  }
  const rsvpCount = Number(d.rsvpCount);
  if (!Number.isInteger(rsvpCount) || rsvpCount < 1) {
    return { ok: false, error: "RSVP count must be a whole number" };
  }
  if (!d.name.trim()) return { ok: false, error: "Name is required" };
  return {
    ok: true,
    patch: {
      name: d.name,
      price,
      rsvpCount,
      blurb: d.blurb,
      badge: d.badge.trim() ? d.badge.trim() : undefined,
      includes: d.includesText
        .split("\n")
        .map((s) => s.trim())
        .filter((s) => s.length > 0),
    },
  };
}

export default function TierEditor({ tier }: { tier: Tier }) {
  const router = useRouter();
  const [original, setOriginal] = useState<Tier>(tier);
  const [draft, setDraft] = useState<Draft>(() => tierToDraft(tier));
  const [error, setError] = useState("");
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  const dirty =
    JSON.stringify(draft) !== JSON.stringify(tierToDraft(original));

  function update<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
    setError("");
    setSavedAt(null);
  }

  async function handleSave() {
    setError("");
    const result = draftToPatch(draft);
    if (!result.ok) {
      setError(result.error || "Invalid input");
      return;
    }
    try {
      const res = await fetch("/api/admin/tiers", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: tier.id, patch: result.patch }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Save failed");
        return;
      }
      setOriginal(data.tier);
      setDraft(tierToDraft(data.tier));
      setSavedAt(Date.now());
      startTransition(() => {
        router.refresh();
      });
    } catch {
      setError("Network error");
    }
  }

  function handleRevert() {
    setDraft(tierToDraft(original));
    setError("");
    setSavedAt(null);
  }

  const onText =
    (k: keyof Draft) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      update(k, e.target.value);

  return (
    <div className={styles.tier}>
      <div className={styles.tierHeader}>
        <span className={`label`}>{tier.id}</span>
        {savedAt && !dirty && (
          <span className={styles.savedBadge}>Saved</span>
        )}
      </div>

      <div className={styles.row}>
        <label className={styles.field} style={{ flex: 2 }}>
          <span className="label">Name</span>
          <input
            type="text"
            value={draft.name}
            onChange={onText("name")}
            className={styles.input}
            maxLength={200}
          />
        </label>
        <label className={styles.field}>
          <span className="label">Price (USD)</span>
          <input
            type="number"
            inputMode="numeric"
            value={draft.price}
            onChange={onText("price")}
            className={styles.input}
            min={1}
            max={99999}
            step={1}
          />
        </label>
        <label className={styles.field}>
          <span className="label">RSVP count</span>
          <input
            type="number"
            inputMode="numeric"
            value={draft.rsvpCount}
            onChange={onText("rsvpCount")}
            className={styles.input}
            min={1}
            max={50}
            step={1}
          />
        </label>
      </div>

      <label className={styles.field}>
        <span className="label">Blurb</span>
        <textarea
          value={draft.blurb}
          onChange={onText("blurb")}
          className={styles.textarea}
          rows={2}
          maxLength={2000}
        />
      </label>

      <label className={styles.field}>
        <span className="label">Includes (one per line)</span>
        <textarea
          value={draft.includesText}
          onChange={onText("includesText")}
          className={styles.textarea}
          rows={6}
        />
      </label>

      <label className={styles.field}>
        <span className="label">Badge (optional)</span>
        <input
          type="text"
          value={draft.badge}
          onChange={onText("badge")}
          className={styles.input}
          maxLength={50}
          placeholder="e.g. Headline tier"
        />
      </label>

      {error && (
        <div role="alert" className={styles.error}>
          {error}
        </div>
      )}

      <div className={styles.actions}>
        <button
          type="button"
          onClick={handleRevert}
          disabled={!dirty || isPending}
          className={`btn btn-ghost ${styles.ghost}`}
        >
          Revert
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={!dirty || isPending}
          className={`btn ${styles.primary}`}
        >
          {isPending ? "Saving…" : "Save changes"}
        </button>
      </div>
    </div>
  );
}
