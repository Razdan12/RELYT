export const getHMSUTC = (iso: string | number) => {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  const h24 = d.getUTCHours();
  const h12 = h24 % 12 || 12;        // 0 -> 12, 13 -> 1, dst.
  const ampm = h24 < 12 ? "AM" : "PM";
  return `${pad(h12)}:${pad(d.getUTCMinutes())} ${ampm}`;
};


export function formatStartTime(timestamp: string) {
  const date = new Date(timestamp);
  const s = date.toLocaleString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC",
  });
  return `${s} UTC`;
}

