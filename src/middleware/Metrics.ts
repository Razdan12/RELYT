import type { ApiResponse } from "@/types/ResponApi";
import apiClient from "./index";
import { normalizeResponse } from "@/lib/utils";
import type { Uptime, Latency, IncidentDay, RecentRun, Incident, StatusCheck } from "@/types/Metrics";

export const getSummary = async (idProject: string): Promise<any> => {
  const response = await apiClient.get<ApiResponse<any>>(`/v1/metrics/summary`, {
    headers: { "x-project-id": idProject },
  });
  return normalizeResponse(response.data.data);
};

export const getUptime = async (idProject: string, payload: string): Promise<Uptime[]> => {
  const response = await apiClient.get<ApiResponse<Uptime[]>>(`/v1/metrics/uptime?${payload}`, {
    headers: { "x-project-id": idProject },
  });
  return normalizeResponse(response.data.data) as Uptime[];
};

export const getLatency = async (idProject: string, payload: string): Promise<Latency[]> => {
  const response = await apiClient.get<ApiResponse<Latency[]>>(`/v1/metrics/latency?${payload}`, {
    headers: { "x-project-id": idProject },
  });
  return normalizeResponse(response.data.data) as Latency[];
};

export const getIncidentPerDay = async (idProject: string, payload: string): Promise<IncidentDay[]> => {
  const response = await apiClient.get<ApiResponse<IncidentDay[]>>(`/v1/metrics/incidents-per-day?${payload}`, {
    headers: { "x-project-id": idProject },
  });
  return normalizeResponse(response.data.data) as IncidentDay[];
};

export const getRecentRun = async (idProject: string, payload: string): Promise<RecentRun[]> => {
  const response = await apiClient.get<ApiResponse<RecentRun[]>>(`/v1/metrics/runs/recent?${payload}`, {
    headers: { "x-project-id": idProject },
  });
  return normalizeResponse(response.data.data) as RecentRun[];
};

export const getIncident = async (idProject: string, payload?: string): Promise<Incident[]> => {
  const response = await apiClient.get<ApiResponse<Incident[]>>(`/v1/incident/open-brief?${payload}`, {
    headers: { "x-project-id": idProject },
  });
  return normalizeResponse(response.data.data) as Incident[];
};

export const getStatus = async (idProject: string): Promise<StatusCheck[]> => {
  const response = await apiClient.get<ApiResponse<StatusCheck[]>>(`/v1/metrics/checks-status`, {
    headers: { "x-project-id": idProject },
  });
  return normalizeResponse(response.data.data) as StatusCheck[];
};
