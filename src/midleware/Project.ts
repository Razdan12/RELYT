import type { ApiResponse } from "@/types/ResponApi";
import apiClient from "./index";
import { normalizeResponse } from "@/lib/utils";
import type { Project, ProjectDetail } from "@/types/Project";

export const createProject = async (data: { name: string }): Promise<ProjectDetail> => {
  const response = await apiClient.post<ApiResponse<ProjectDetail>>(`/v1/project/create`, data);
  // Normalize either response.data.data or response.data (some backends return the created object in data or directly)
  return normalizeResponse(response.data.data ?? response.data) as ProjectDetail;
};

export const updateProject = async (projectId: string, data: Partial<ProjectDetail>): Promise<ProjectDetail> => {
  // Try PUT (common for updates). If the backend expects POST, fall back to POST.
  try {
    const response = await apiClient.put<ApiResponse<ProjectDetail>>(`/v1/project/update/${projectId}`, data, {
      headers: { "x-project-id": projectId },
    });
    return normalizeResponse(response.data.data) as ProjectDetail;
  } catch (err) {
    // If PUT fails (405/404 or other), try POST as a fallback to maximize compatibility
    try {
      const response = await apiClient.post<ApiResponse<ProjectDetail>>(`/v1/project/update/${projectId}`, data, {
        headers: { "x-project-id": projectId },
      });
      return normalizeResponse(response.data.data) as ProjectDetail;
    } catch (err2) {
      // Rethrow the fallback error (caller can inspect both if needed via logs)
      throw err2;
    }
  }
};

export const getAllProject = async (payload?: string): Promise<Project[]> => {
  const response = await apiClient.get<ApiResponse<Project[]>>(`/v1/project/show-all${payload ? `?${payload}` : ""}`);
  return normalizeResponse(response.data.data ?? response.data) as Project[];
};
