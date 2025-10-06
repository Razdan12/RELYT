import type { ApiResponse } from "@/types/ResponApi";
import apiClient from "./index";

export const getWebhooks = async (idProject: string): Promise<any> => {
  const response = await apiClient.get<ApiResponse<any>>(`/v1/webhook`, {
    headers: { "x-project-id": idProject },
  });
  return response.data.data;
};

export const createWebhook = async (idProject: string, data: any): Promise<any> => {
  const response = await apiClient.post<ApiResponse<any>>(`/v1/webhook`, data, {
    headers: { "x-project-id": idProject },
  });
  return response.data.data;
};

export const toggleWebhook = async (idProject: string, id: string): Promise<any> => {
  const response = await apiClient.patch<ApiResponse<any>>(`/v1/webhook/${id}/toggle`, null, {
    headers: { "x-project-id": idProject },
  });
  return response.data.data;
};

export const deleteWebhook = async (idProject: string, id: string): Promise<any> => {
  const response = await apiClient.delete<ApiResponse<any>>(`/v1/webhook/${id}`, {
    headers: { "x-project-id": idProject },
  });
  return response.data.data;
};
