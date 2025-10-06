export interface KPICardProps {
  title: string;
  value: string;
  trend?: {
    direction: "up" | "down";
    percentage: number;
  };
  sparklineData?: number[];
  icon: string;
  color: "cyan" | "purple" | "green" | "red" | "yellow";
  onClick?: () => void;
}

export interface Uptime {
  ts: string;
  uptime: number;
}

export interface Latency {
  ts: string;
  p50: number | null;
  p95: number | null;
  p99: number | null;
}

export interface IncidentDay {
  date: string;
  count: number;
}

export interface RecentRun {
  id: string;
  checkId: string;
  checkName: string;
  type: string;
  ok: boolean;
  code: number;
  latencyMs: number;
  errorMsg: string | null;
  ts: string;
}

export interface Incident {
  id: string
  checkName: string
  startedAt: string
  durationSec: number
  lastError: string
  severity: "low" | "medium" | "high"
}

export interface StatusCheck {
  id: string
  name : string
  type: string
  intervalSec: number
  status: "up" | "down" | "degraded"
  lastRun: {
    ts: string
    code: number
    latencyMs: number
    errorMsg: string
  }
}