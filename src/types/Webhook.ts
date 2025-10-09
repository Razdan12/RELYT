export interface Webhook {
  id?: string;
  name?: string;
  url?: string;
  signingSecret?: string;
  createdAt?: string;
  isEnabled?: boolean;
}

export interface WebhookCreatePayload {
  name: string;
  url: string;
  signingSecret?: string;
}
