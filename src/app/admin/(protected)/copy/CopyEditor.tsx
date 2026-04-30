"use client";
import { useState, useTransition, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import type { Session } from "@/lib/sessions";
import styles from "./copy.module.css";

const EDITABLE_FIELDS: {
  key: keyof Omit<Session, "id">;
  label: string;
  hint?: string;
  multiline?: boolean;
  maxLength: number;
}[] = [
  { key: "title", label: "Title", maxLength: 200 },
  { key: "subtitle", label: "Subtitle", maxLength: 300 },
  { key: "date", label: "Date", hint: "e.g. Sunday, May 24, 2026", maxLength: 100 },
  { key: "time", label: "Time", hint: "e.g. 10:00 AM – 2:00 PM", maxLength: 100 },
  { key: "doors", label: "Doors", hint: "e.g. Doors open at 9:00 AM", maxLength: 100 },
  { key: "location", label: "Location", multiline: true, maxLength: 300 },
  { key: "poster", label: "Poster path", hint: "Path under /public", maxLength: 500 },
];

type Draft = Omit<Session, "id">;

function sessionToDraft(s: Session): Draft {
  const { id: _id, ...rest } = s;
  void _id;
  return rest;
}

export default function CopyEditor({ session }: { session: Session }) {
  const router = useRouter();
  const [original, setOriginal] = useState<Session>(session);
  const [draft, setDraft] = useState<Draft>(() => sessionToDraft(session));
  const [error, setError] = useState("");
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  const dirty = JSON.stringify(draft) !== JSON.stringify(sessionToDraft(original));

  const onChange =
    (k: keyof Draft) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setDraft((d) => ({ ...d, [k]: e.target.value }));
      setError("");
      setSavedAt(null);
    };

  async function handleSave() {
    setError("");
    try {
      const res = await fetch("/api/admin/copy", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patch: draft }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Save failed");
        return;
      }
      setOriginal(data.session);
      setDraft(sessionToDraft(data.session));
      setSavedAt(Date.now());
      startTransition(() => {
        router.refresh();
      });
    } catch {
      setError("Network error");
    }
  }

  function handleRevert() {
    setDraft(sessionToDraft(original));
    setError("");
    setSavedAt(null);
  }

  return (
    <div className={styles.editor}>
      <div className={styles.fields}>
        {EDITABLE_FIELDS.map((f) => (
          <label key={f.key} className={styles.field}>
            <span className="label">{f.label}</span>
            {f.multiline ? (
              <textarea
                value={draft[f.key]}
                onChange={onChange(f.key)}
                className={styles.textarea}
                maxLength={f.maxLength}
                rows={2}
              />
            ) : (
              <input
                type="text"
                value={draft[f.key]}
                onChange={onChange(f.key)}
                className={styles.input}
                maxLength={f.maxLength}
              />
            )}
            {f.hint && <span className={styles.hint}>{f.hint}</span>}
          </label>
        ))}
      </div>

      {error && (
        <div role="alert" className={styles.error}>
          {error}
        </div>
      )}

      {savedAt && !dirty && !error && (
        <div className={styles.saved}>Saved</div>
      )}

      <div className={styles.actions}>
        <button
          type="button"
          onClick={handleRevert}
          disabled={!dirty || isPending}
          className="btn btn-ghost"
        >
          Revert
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={!dirty || isPending}
          className="btn"
        >
          {isPending ? "Saving…" : "Save changes"}
        </button>
      </div>
    </div>
  );
}
