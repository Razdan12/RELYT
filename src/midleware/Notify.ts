import type { ApiResponse } from "@/types/ResponApi";
import apiClient from "./index";
import { normalizeResponse } from "@/lib/utils";
import type { EscalationPolicy, NotifySettings } from "@/types/Notify";

// GET /v1/notify/settings
export async function getNotifySettings(projectId: string): Promise<NotifySettings> {
  const res = await apiClient.get<ApiResponse<NotifySettings>>(`/v1/notify/settings`, {
    headers: { "x-project-id": projectId },
  });
  // Support both { data: {...} } and direct shape
  return normalizeResponse(res.data.data ?? (res.data as unknown)) as NotifySettings;
}

// POST /v1/notify/settings/notification
export async function saveQuietHours(
  projectId: string,
  payload: { timezone?: string; quietFrom?: string; quietTo?: string }
): Promise<{ success: boolean }> {
  const res = await apiClient.post<ApiResponse<{ success: boolean }>>(
    `/v1/notify/settings/notification`,
    payload,
    { headers: { "x-project-id": projectId } }
  );
  return normalizeResponse(res.data.data ?? res.data) as { success: boolean };
}

// POST /v1/notify/settings/escalation
export async function saveEscalation(
  projectId: string,
  policy: EscalationPolicy
): Promise<{ success: boolean }> {
  const res = await apiClient.post<ApiResponse<{ success: boolean }>>(
    `/v1/notify/settings/escalation`,
    policy,
    { headers: { "x-project-id": projectId } }
  );
  return normalizeResponse(res.data.data ?? res.data) as { success: boolean };
}
