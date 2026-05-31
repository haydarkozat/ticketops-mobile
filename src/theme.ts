// Tasarım belirteçleri (design tokens) — ops-console temalı koyu palet.
import { Priority, Status } from "./types";

export const colors = {
  bg: "#020617",
  surface: "rgba(255,255,255,0.03)",
  surfaceBorder: "rgba(255,255,255,0.06)",
  topbar: "rgba(2,6,23,0.85)",
  text: "#f8fafc",
  textDim: "#94a3b8",
  textFaint: "#64748b",
  accent: "#0ea5e9",
  accentGrad: ["#38bdf8", "#2563eb"] as const,
};

export const priorityMeta: Record<
  Priority,
  { dot: string; bg: string; fg: string }
> = {
  critical: { dot: "#ef4444", bg: "rgba(239,68,68,0.15)", fg: "#fca5a5" },
  high: { dot: "#f59e0b", bg: "rgba(245,158,11,0.15)", fg: "#fcd34d" },
  medium: { dot: "#3b82f6", bg: "rgba(59,130,246,0.15)", fg: "#93c5fd" },
  low: { dot: "#64748b", bg: "rgba(100,116,139,0.15)", fg: "#cbd5e1" },
};

export const statusMeta: Record<
  Status,
  { bg: string; fg: string; bar: string }
> = {
  open: { bg: "rgba(14,165,233,0.15)", fg: "#7dd3fc", bar: "#38bdf8" },
  in_progress: { bg: "rgba(245,158,11,0.15)", fg: "#fcd34d", bar: "#fbbf24" },
  resolved: { bg: "rgba(16,185,129,0.15)", fg: "#6ee7b7", bar: "#34d399" },
  closed: { bg: "rgba(100,116,139,0.2)", fg: "#94a3b8", bar: "#64748b" },
};

export const AGENTS = ["Atanmadı", "E. Yılmaz", "S. Demir", "M. Kaya"];

// Tipografi: monospace kimlik/teknik metinler için "Courier" platform varsayılanı.
export const mono = { fontFamily: "Courier" as const };
