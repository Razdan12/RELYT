import type { ApiResponse, PageMeta } from "@/types/ResponApi";
import apiClient from "./index";

export const getAllCheck = async (
  idProject: string,
  payload?: string
): Promise<any> => {
  const response = await apiClient.get<ApiResponse<PageMeta>>(
    `/v1/check/show-all?${payload}`,
    {
      headers: { "x-project-id": idProject },
    }
  );
  return response.data.data;
};

export const createCheck = async (
  idProject: string,
  data: any
): Promise<any> => {
  const response = await apiClient.post<any>(`/v1/check/create`, data, {
    headers: { "x-project-id": idProject },
  });
  return response.data.data;
};

export const DeleteCheck = async (
  idProject: string,
  id: string
): Promise<any> => {
  const response = await apiClient.delete<any>(`/v1/check/delete/${id}`, {
    headers: { "x-project-id": idProject },
  });
  return response.data.data;
};
