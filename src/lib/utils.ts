import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// convert snake_case keys to camelCase recursively for objects/arrays
export function snakeToCamel(s: string) {
  return s.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

export function normalizeKeys(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) return obj.map(normalizeKeys);
  if (typeof obj !== 'object') return obj;

  const out: any = {};
  Object.keys(obj).forEach((k) => {
    const camel = snakeToCamel(k);
    out[camel] = normalizeKeys(obj[k]);
  });
  return out;
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
