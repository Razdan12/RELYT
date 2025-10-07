import type { ApiResponse } from "@/types/ResponApi";
import apiClient from "./index";
import { normalizeResponse } from "@/lib/utils";

export const addProjectMember = async (projectId: string, data: { userId: string; role: string }): Promise<any> => {
  const response = await apiClient.post<ApiResponse<any>>(`/v1/project/member/add`, data, {
    headers: { "x-project-id": projectId },
  });
  return normalizeResponse(response.data.data);
};

export const changeProjectMemberRole = async (projectId: string, data: { userId: string; role: string }): Promise<any> => {
  const response = await apiClient.post<ApiResponse<any>>(`/v1/project/member/change-role`, data, {
    headers: { "x-project-id": projectId },
  });
  return normalizeResponse(response.data.data);
};

export const removeProjectMember = async (projectId: string, data: { userId: string }): Promise<any> => {
  const response = await apiClient.post<ApiResponse<any>>(`/v1/project/member/remove`, data, {
    headers: { "x-project-id": projectId },
  });
  return normalizeResponse(response.data.data);
};

export const getProjectDetail = async (projectId: string): Promise<any> => {
  const response = await apiClient.get<ApiResponse<any>>(`/v1/project/show-one/${projectId}`, {
    headers: { "x-project-id": projectId },
  });
  return normalizeResponse(response.data.data);
};
