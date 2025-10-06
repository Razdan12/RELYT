import type { ApiResponse } from "@/types/ResponApi";
import apiClient from "./index";

export const getSummary = async (
  idProject: string,
): Promise<any> => {
  
  const response = await apiClient.get<ApiResponse<any>>(
    `/v1/metrics/summary`,
    {
      headers: { "x-project-id": idProject },
    }
  );
  return response.data.data;
};

export const getUptime = async (
  idProject: string,
  payload: string
): Promise<any> => {
  
  const response = await apiClient.get<ApiResponse<any>>(
    `/v1/metrics/uptime?${payload}`,
    {
      headers: { "x-project-id": idProject },
    }
  );
  return response.data.data;
};

export const getLatency = async (
  idProject: string,
  payload: string
): Promise<any> => {
  
  const response = await apiClient.get<ApiResponse<any>>(
    `/v1/metrics/latency?${payload}`,
    {
      headers: { "x-project-id": idProject },
    }
  );
  return response.data.data;
};

export const getIncidentPerDay = async (
  idProject: string,
  payload: string
): Promise<any> => {
  
  const response = await apiClient.get<ApiResponse<any>>(
    `/v1/metrics/incidents-per-day?${payload}`,
    {
      headers: { "x-project-id": idProject },
    }
  );
  return response.data.data;
};

export const getRecentRun = async (
  idProject: string,
  payload: string
): Promise<any> => {
  
  const response = await apiClient.get<ApiResponse<any>>(
    `/v1/metrics/runs/recent?${payload}`,
    {
      headers: { "x-project-id": idProject },
    }
  );
  return response.data.data;
};

export const getIncident = async (
  idProject: string,
  payload?: string
): Promise<any> => {
  
  const response = await apiClient.get<ApiResponse<any>>(
    `/v1/incident/open-brief?${payload}`,
    {
      headers: { "x-project-id": idProject },
    }
  );
  return response.data.data;
};

export const getStatus = async (
  idProject: string,
): Promise<any> => {
  
  const response = await apiClient.get<ApiResponse<any>>(
    `/v1/metrics/checks-status`,
    {
      headers: { "x-project-id": idProject },
    }
  );
  return response.data.data;
};
