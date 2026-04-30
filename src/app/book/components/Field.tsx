"use client";
import { type ChangeEvent } from "react";
import styles from "../book.module.css";

type BaseProps = {
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  required?: boolean;
  placeholder?: string;
  fullWidth?: boolean;
};

type InputProps = BaseProps & {
  type?: "text" | "email" | "tel";
  textarea?: false;
  inputMode?: "text" | "numeric" | "tel" | "email";
};

type TextareaProps = BaseProps & { textarea: true };

type Props = InputProps | TextareaProps;

export default function Field(props: Props) {
  const { label, value, onChange, required, placeholder, fullWidth } = props;
  const className = `${styles.field} ${fullWidth ? styles.fieldFull : ""}`;
  return (
    <label className={className}>
      <span className={styles.fieldLabel}>
        {label}
        {required && <span className={styles.fieldRequiredMark}>*</span>}
      </span>
      {"textarea" in props && props.textarea ? (
        <textarea
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={3}
          className={styles.input}
        />
      ) : (
        <input
          type={(props as InputProps).type ?? "text"}
          inputMode={(props as InputProps).inputMode}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={styles.input}
        />
      )}
    </label>
  );
}
