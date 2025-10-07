import type { ApiResponse } from "@/types/ResponApi";
import apiClient from "./index";
import { normalizeResponse } from "@/lib/utils";
import type { Project } from "@/types/Project";

export const createProject = async (data: { name: string }): Promise<any> => {
  const response = await apiClient.post<ApiResponse<any>>(`/v1/project/create`, data);
  // Normalize either response.data.data or response.data (some backends return the created object in data or directly)
  return normalizeResponse(response.data.data ?? response.data);
};

export const updateProject = async (projectId: string, data: any): Promise<any> => {
  // Try PUT (common for updates). If the backend expects POST, fall back to POST.
  try {
    const response = await apiClient.put<ApiResponse<any>>(`/v1/project/update/${projectId}`, data, {
      headers: { "x-project-id": projectId },
    });
    return normalizeResponse(response.data.data);
  } catch (err) {
    // If PUT fails (405/404 or other), try POST as a fallback to maximize compatibility
    try {
      const response = await apiClient.post<ApiResponse<any>>(`/v1/project/update/${projectId}`, data, {
        headers: { "x-project-id": projectId },
      });
      return normalizeResponse(response.data.data);
    } catch (err2) {
      // rethrow original error if fallback also fails
      throw err2;
    }
  }
};

export const getAllProject = async (payload?: string): Promise<any> => {
  const response = await apiClient.get<ApiResponse<Project[]>>(`/v1/project/show-all${payload ? `?${payload}` : ""}`);
  return normalizeResponse(response.data.data ?? response.data);
};
