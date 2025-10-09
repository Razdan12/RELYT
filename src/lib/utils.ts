import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// convert snake_case keys to camelCase recursively for objects/arrays
export function snakeToCamel(s: string) {
  return s.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

export function normalizeKeys<T = any>(obj: any): T {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) return obj.map((v) => normalizeKeys(v)) as any;
  if (typeof obj !== 'object') return obj;

  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [snakeToCamel(k), normalizeKeys(v)])
  ) as any;
}

export function normalizeResponse(resp: any) {
  // if response is object with data/items, normalize inner
  if (resp && typeof resp === 'object') {
    if (Array.isArray(resp)) return normalizeKeys(resp);
    if (resp.data) return normalizeKeys(resp.data);
    if (resp.items) return normalizeKeys(resp.items);
    return normalizeKeys(resp);
  }
  return resp;
}
