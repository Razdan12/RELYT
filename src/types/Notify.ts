export interface QuietHoursSettings {
  timezone?: string; // e.g., "Asia/Jakarta"
  quietFrom?: string; // "22:00"
  quietTo?: string;   // "07:00"
}

export type Channel = "email" | "slack" | "telegram";

export interface EscalationStep {
  afterMin: number; // delay before notifying this step
  channels: Channel[]; // which channels to use at this step
}

export interface EscalationPolicy {
  name: string; // e.g., "Default"
  enabled: boolean;
  steps: EscalationStep[];
}

export interface NotifySettings {
  notification?: QuietHoursSettings;
  escalation?: EscalationPolicy;
}
