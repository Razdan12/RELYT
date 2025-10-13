import apiClient from './index';

import type { User } from "@/types/auth";

export interface AuthData {
  user: User;
  token: {
    access_token: string;
    refresh_token: string;
  };
  effectiveRole: string,
  activeProjectId: string
}

export interface AuthResponse {
  status: boolean;
  message: string;
  data: AuthData;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials extends AuthCredentials {
  name: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  password: string;
  confirm_password: string;
  token: string;
}

export interface ForgotPasswordResponse {
  status: boolean;
  message: string;
}

export const loginAPI = async (
  credentials: AuthCredentials
): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>(
    '/v1/auth/login',
    credentials
  );
  return response.data;
};

export const signupAPI = async (
  credentials: SignupCredentials
): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>(
    '/v1/auth/register',
    credentials
  );
  return response.data;
};

export const refreshTokenAPI = async (
  data: { refresh_token: string }
): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/v1/auth/refresh-token', data);
  return response.data;
};

export const forgotPasswordAPI = async (
  data: ForgotPasswordRequest
): Promise<ForgotPasswordResponse> => {
  const response = await apiClient.post<ForgotPasswordResponse>(
    '/v1/auth/forget-password',
    data
  );
  return response.data;
};

export const resetPasswordAPI = async (
  data: ResetPasswordRequest
): Promise<ForgotPasswordResponse> => {
  const response = await apiClient.put<ForgotPasswordResponse>(
    '/v1/auth/reset-password',
    data
  );
  return response.data;
};
