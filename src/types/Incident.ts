export interface IncidentItem {
  id: string;
  checkId?: string;
  checkName?: string;
  status?: "open" | "closed";
  severity?: "low" | "medium" | "high";
  startedAt?: string;
  endedAt?: string | null;
  durationSec?: number;
  lastError?: string | null;
}

export interface IncidentList {
  items: IncidentItem[];
}
