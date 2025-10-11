import type { ApiResponse } from "@/types/ResponApi";
import apiClient from "./index";
import { normalizeResponse } from "@/lib/utils";
import type { Member, MemberChangeRolePayload } from "@/types/Member";
import type { ProjectDetail } from "@/types/Project";

export const addProjectMember = async (projectId: string, data: { userId: string; role: string }): Promise<Member> => {
  const response = await apiClient.post<ApiResponse<Member>>(`/v1/project/member/add`, data, {
    headers: { "x-project-id": projectId },
  });
  return normalizeResponse(response.data.data) as Member;
};

export const changeProjectMemberRole = async (projectId: string, data: MemberChangeRolePayload): Promise<Member> => {
  const response = await apiClient.post<ApiResponse<Member>>(`/v1/project/member/change-role`, data, {
    headers: { "x-project-id": projectId },
  });
  return normalizeResponse(response.data.data) as Member;
};

export const removeProjectMember = async (projectId: string, data: { userId: string }): Promise<{ success: boolean }> => {
  const response = await apiClient.post<ApiResponse<{ success: boolean }>>(`/v1/project/member/remove`, data, {
    headers: { "x-project-id": projectId },
  });
  return normalizeResponse(response.data.data) as { success: boolean };
};

export const getProjectDetail = async (projectId: string): Promise<ProjectDetail> => {
  const response = await apiClient.get<ApiResponse<ProjectDetail>>(`/v1/project/show-one/${projectId}`, {
    headers: { "x-project-id": projectId },
  });
  return normalizeResponse(response.data.data) as ProjectDetail;
};
