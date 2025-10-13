import type { ApiResponse, PageMeta } from "@/types/ResponApi";
import apiClient from "./index";
import { normalizeResponse } from "@/lib/utils";

export interface CheckItem {
  id: string;
  name?: string;
  url?: string;
  intervalSec?: number;
}

export const getAllCheck = async (
  idProject: string,
  payload?: string
): Promise<CheckItem[] | PageMeta> => {
  const response = await apiClient.get<ApiResponse<PageMeta | CheckItem[]>>(
    `/v1/check/show-all?${payload}`,
    {
      headers: { "x-project-id": idProject },
    }
  );
  return normalizeResponse(response.data.data);
};

export const createCheck = async (
  idProject: string,
  data: Partial<CheckItem>
): Promise<CheckItem> => {
  const response = await apiClient.post<ApiResponse<CheckItem>>(`/v1/check/create`, data, {
    headers: { "x-project-id": idProject },
  });
  return normalizeResponse(response.data.data) as CheckItem;
};

export const DeleteCheck = async (
  idProject: string,
  id: string
): Promise<{ success: boolean }> => {
  const response = await apiClient.delete<ApiResponse<{ success: boolean }>>(`/v1/check/delete/${id}`, {
    headers: { "x-project-id": idProject },
  });
  return normalizeResponse(response.data.data) as { success: boolean };
};
