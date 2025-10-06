import type { ApiResponse } from "@/types/ResponApi";
import apiClient from "./index";
import type { Project } from "@/types/Project";

export const getAllProject = async (payload?: string): Promise<any> => {
  const response = await apiClient.get<ApiResponse<Project[]>>(
    `/v1/project/show-all?${payload}`
  );
  return response.data;
};
