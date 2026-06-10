// Auth API fonksiyonları

import apiClient, { saveTokens, clearTokens } from './client';
import { API_BASE_URL, AUTH_LOGIN, AUTH_LOGOUT, AUTH_ME, AUTH_REGISTER } from '../constants/api';
import type { LoginRequest, RegisterRequest, TokenResponse, User } from '../types/auth';
import axios from 'axios';

export const login = async (data: LoginRequest): Promise<TokenResponse> => {
  // Backend form-data beklediği için URLSearchParams kullan
  const formData = new URLSearchParams();
  formData.append('username', data.email);
  formData.append('password', data.password);

  const response = await axios.post<TokenResponse>(
    `${API_BASE_URL}${AUTH_LOGIN}`,
    formData.toString(),
    {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    },
  );

  await saveTokens(response.data.access_token, response.data.refresh_token);
  return response.data;
};

export const register = async (data: RegisterRequest): Promise<User> => {
  const response = await apiClient.post<User>(AUTH_REGISTER, data);
  return response.data;
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await apiClient.get<User>(AUTH_ME);
  return response.data;
};

export const logout = async (): Promise<void> => {
  try {
    await apiClient.post(AUTH_LOGOUT);
  } finally {
    await clearTokens();
  }
};
