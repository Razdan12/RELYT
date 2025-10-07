import type { ApiResponse } from "@/types/ResponApi";
import apiClient from "./index";
import { normalizeResponse } from "@/lib/utils";

export const getWebhooks = async (idProject: string): Promise<any> => {
  const response = await apiClient.get<ApiResponse<any>>(`/v1/webhook/show-all`, {
    headers: { "x-project-id": idProject },
  });
  return normalizeResponse(response.data.data);
};

export const createWebhook = async (idProject: string, data: any): Promise<any> => {
  // include projectId in the body as some backends validate it in payload
  const payload = { projectId: idProject, ...data };
  const response = await apiClient.post<ApiResponse<any>>(`/v1/webhook/create`, payload, {
    headers: { "x-project-id": idProject },
  });
  return normalizeResponse(response.data.data);
};

export const updateWebhook = async (idProject: string, id: string, data: any): Promise<any> => {
  // include projectId with update payload to satisfy backend validation
  const payload = { projectId: idProject, ...data };
  const response = await apiClient.put<ApiResponse<any>>(`/v1/webhook/update/${id}`, payload, {
    headers: { "x-project-id": idProject },
  });
  return normalizeResponse(response.data.data);
};

export const deleteWebhook = async (idProject: string, id: string): Promise<any> => {
  // some backends expect projectId in body for delete; axios.delete supports data in config
  const response = await apiClient.delete<ApiResponse<any>>(`/v1/webhook/delete/${id}`, {
    headers: { "x-project-id": idProject },
    data: { projectId: idProject },
  });
  return normalizeResponse(response.data.data);
};
