import type { ApiResponse } from "@/types/ResponApi";
import apiClient from "./index";
import { normalizeResponse } from "@/lib/utils";
import type { IncidentItem, IncidentList } from "../types/Incident";

// GET /v1/incident/show-all with optional filters
export async function listIncidents(
  projectId: string,
  params?: { where?: string; status?: string; paginate?: boolean | string }
): Promise<IncidentList> {
  const search = new URLSearchParams();
  if (params?.where) search.set("where", params.where);
  if (params?.status) search.set("status", String(params.status));
  if (params?.paginate !== undefined) search.set("paginate", String(params.paginate));

  const qs = search.toString();
  const url = `/v1/incident/show-all${qs ? `?${qs}` : ""}`;
  const res = await apiClient.get<ApiResponse<any>>(url, {
    headers: { "x-project-id": projectId },
  });
  const data = normalizeResponse(res.data.data ?? res.data);
  // Normalize to { items: IncidentItem[] }
  const items: IncidentItem[] = Array.isArray(data)
    ? data
    : Array.isArray(data?.items)
      ? data.items
      : [];
  return { items };
}

// GET /v1/incident/show-one/{incidentId}
export async function getIncidentDetail(projectId: string, incidentId: string): Promise<IncidentItem> {
  const res = await apiClient.get<ApiResponse<IncidentItem>>(`/v1/incident/show-one/${incidentId}`, {
    headers: { "x-project-id": projectId },
  });
  return normalizeResponse(res.data.data ?? res.data) as IncidentItem;
}

// POST /v1/incident/close/{incidentId}
export async function closeIncident(projectId: string, incidentId: string, summary: string): Promise<{ success: boolean }>{
  const res = await apiClient.post<ApiResponse<{ success: boolean }>>(
    `/v1/incident/close/${incidentId}`,
    { summary },
    { headers: { "x-project-id": projectId } }
  );
  return normalizeResponse(res.data.data ?? res.data) as { success: boolean };
}
