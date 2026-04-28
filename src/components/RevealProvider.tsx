"use client";
import { useReveal } from "@/lib/useReveal";

export default function RevealProvider({ children }: { children: React.ReactNode }) {
  useReveal();
  return <>{children}</>;
}
