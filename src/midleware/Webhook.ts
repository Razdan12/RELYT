import type { ApiResponse } from "@/types/ResponApi";
import apiClient from "./index";
import { normalizeResponse } from "@/lib/utils";
import type { Webhook, WebhookCreatePayload } from "@/types/Webhook";

export const getWebhooks = async (idProject: string): Promise<Webhook[]> => {
  const response = await apiClient.get<ApiResponse<Webhook[]>>(`/v1/webhook/show-all`, {
    headers: { "x-project-id": idProject },
  });
  return normalizeResponse(response.data.data) as Webhook[];
};

export const createWebhook = async (idProject: string, data: WebhookCreatePayload): Promise<Webhook> => {
  // include projectId in the body as some backends validate it in payload
  const payload = { projectId: idProject, ...data };
  const response = await apiClient.post<ApiResponse<Webhook>>(`/v1/webhook/create`, payload, {
    headers: { "x-project-id": idProject },
  });
  return normalizeResponse(response.data.data) as Webhook;
};

export const updateWebhook = async (idProject: string, id: string, data: Partial<Webhook>): Promise<Webhook> => {
  // include projectId with update payload to satisfy backend validation
  const payload = { projectId: idProject, ...data };
  const response = await apiClient.put<ApiResponse<Webhook>>(`/v1/webhook/update/${id}`, payload, {
    headers: { "x-project-id": idProject },
  });
  return normalizeResponse(response.data.data) as Webhook;
};

export const deleteWebhook = async (idProject: string, id: string): Promise<{ success: boolean }> => {
  // some backends expect projectId in body for delete; axios.delete supports data in config
  const response = await apiClient.delete<ApiResponse<{ success: boolean }>>(`/v1/webhook/delete/${id}`, {
    headers: { "x-project-id": idProject },
    data: { projectId: idProject },
  });
  return normalizeResponse(response.data.data) as { success: boolean };
};
