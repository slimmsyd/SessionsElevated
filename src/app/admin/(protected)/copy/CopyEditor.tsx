"use client";
import { useRef, useState, useTransition, type ChangeEvent, type DragEvent } from "react";
import { useRouter } from "next/navigation";
import type { Session } from "@/lib/sessions";
import styles from "./copy.module.css";

type FieldDef = {
  key: keyof Omit<Session, "id" | "poster">;
  label: string;
  hint?: string;
  multiline?: boolean;
  maxLength: number;
};

const EDITABLE_FIELDS: FieldDef[] = [
  { key: "title", label: "Title", maxLength: 200 },
  { key: "subtitle", label: "Subtitle", maxLength: 300 },
  { key: "date", label: "Date", hint: "e.g. Sunday, May 24, 2026", maxLength: 100 },
  { key: "time", label: "Time", hint: "e.g. 10:00 AM – 2:00 PM", maxLength: 100 },
  { key: "doors", label: "Doors", hint: "e.g. Doors open at 9:00 AM", maxLength: 100 },
  { key: "location", label: "Location", multiline: true, maxLength: 300 },
];

type Draft = Omit<Session, "id">;

function sessionToDraft(s: Session): Draft {
  const { id: _id, ...rest } = s;
  void _id;
  return rest;
}

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const MAX_BYTES = 10 * 1024 * 1024;

export default function CopyEditor({ session }: { session: Session }) {
  const router = useRouter();
  const [original, setOriginal] = useState<Session>(session);
  const [draft, setDraft] = useState<Draft>(() => sessionToDraft(session));
  const [error, setError] = useState("");
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const dirty = JSON.stringify(draft) !== JSON.stringify(sessionToDraft(original));

  const onChange =
    (k: keyof Draft) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setDraft((d) => ({ ...d, [k]: e.target.value }));
      setError("");
      setSavedAt(null);
    };

  async function uploadFile(file: File) {
    setError("");
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError(`Unsupported file type. Use JPG, PNG, WebP, or AVIF.`);
      return;
    }
    if (file.size > MAX_BYTES) {
      setError(`File too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Max 10 MB.`);
      return;
    }
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("sessionId", original.id);
      const res = await fetch("/api/admin/copy/poster", {
        method: "POST",
        body: form,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Upload failed");
        return;
      }
      setDraft((d) => ({ ...d, poster: data.url }));
      setSavedAt(null);
    } catch {
      setError("Network error during upload");
    } finally {
      setUploading(false);
    }
  }

  function onPickFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    e.target.value = "";
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  }

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

        <div className={`${styles.field} ${styles.posterField}`}>
          <span className="label">Poster image</span>

          <div
            onDragEnter={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`${styles.dropzone} ${
              dragActive ? styles.dropzoneActive : ""
            }`}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                fileInputRef.current?.click();
              }
            }}
          >
            {draft.poster ? (
              <div className={styles.dropzonePreviewWrap}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={draft.poster}
                  alt="Current poster"
                  className={styles.dropzonePreview}
                />
                <div className={styles.dropzoneOverlay}>
                  <span>Drop a new image or click to replace</span>
                </div>
              </div>
            ) : (
              <div className={styles.dropzoneEmpty}>
                <div className={styles.dropzoneIcon} aria-hidden="true">↑</div>
                <div className={styles.dropzoneTitle}>
                  Drop an image here, or click to browse
                </div>
                <div className={styles.dropzoneHint}>
                  JPG, PNG, WebP, or AVIF · up to 10 MB
                </div>
              </div>
            )}
            {uploading && (
              <div className={styles.dropzoneUploading}>Uploading…</div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept={ALLOWED_TYPES.join(",")}
            onChange={onPickFile}
            style={{ display: "none" }}
          />
        </div>
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
          disabled={!dirty || isPending || uploading}
          className="btn btn-ghost"
        >
          Revert
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={!dirty || isPending || uploading}
          className="btn"
        >
          {isPending ? "Saving…" : "Save changes"}
        </button>
      </div>
    </div>
  );
}
