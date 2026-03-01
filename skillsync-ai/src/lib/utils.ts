import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { type Currency } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatSalary(amount: number, currency: Currency = "RWF"): string {
  const locale = currency === "RWF" ? "en-RW" : "en-US";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCompactRwf(amount: number): string {
  return `${Math.round(amount / 1000)}k`;
}

export function formatTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diffMs = now - timestamp;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

export function getRwandaTimeZone(): string {
  return "Africa/Kigali";
}

export function getClientLocale(): string {
  if (typeof window === "undefined") {
    return "en-RW";
  }
  return navigator.language || "en-RW";
}

export function safeJsonParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}
