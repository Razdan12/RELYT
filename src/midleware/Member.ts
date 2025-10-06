import type { ApiResponse } from "@/types/ResponApi";
import apiClient from "./index";

export const inviteMember = async (projectId: string, data: { email: string; role: string }): Promise<any> => {
  const response = await apiClient.post<ApiResponse<any>>(`/v1/members/invite`, data, {
    headers: { "x-project-id": projectId },
  });
  return response.data.data;
};

export const getMembers = async (projectId: string): Promise<any> => {
  const response = await apiClient.get<ApiResponse<any>>(`/v1/members`, {
    headers: { "x-project-id": projectId },
  });
  return response.data.data;
};
