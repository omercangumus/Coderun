import axiosClient, { COOKIE_ACCESS_TOKEN, COOKIE_REFRESH_TOKEN } from './axios-client';
import Cookies from 'js-cookie';
import { AUTH_ENDPOINTS } from '@/lib/constants/api.constants';
import type { LoginRequest, RegisterRequest, TokenResponse, UserResponse } from '@/lib/types/auth.types';

const COOKIE_OPTIONS = {
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  expires: 7,
};

export const authApi = {
  async login(data: LoginRequest): Promise<TokenResponse> {
    // Backend OAuth2 beklediği için FormData gönder
    const formData = new FormData();
    formData.append('username', data.email);
    formData.append('password', data.password);

    const response = await axiosClient.post(AUTH_ENDPOINTS.login, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    // Backend snake_case döndürüyor, camelCase'e çevir
    const raw = response.data;
    return {
      accessToken: raw.access_token,
      refreshToken: raw.refresh_token,
      tokenType: raw.token_type,
      expiresIn: raw.expires_in,
    };
  },

  async register(data: RegisterRequest): Promise<UserResponse> {
    const response = await axiosClient.post(AUTH_ENDPOINTS.register, data);
    return mapUserResponse(response.data);
  },

  async refreshToken(refreshToken: string): Promise<TokenResponse> {
    const response = await axiosClient.post(AUTH_ENDPOINTS.refresh, {
      refresh_token: refreshToken,
    });
    const raw = response.data;
    return {
      accessToken: raw.access_token,
      refreshToken: raw.refresh_token,
      tokenType: raw.token_type,
      expiresIn: raw.expires_in,
    };
  },

  async getMe(): Promise<UserResponse> {
    const response = await axiosClient.get(AUTH_ENDPOINTS.me);
    return mapUserResponse(response.data);
  },

  async logout(): Promise<void> {
    await axiosClient.post(AUTH_ENDPOINTS.logout);
  },

  saveTokens(tokens: TokenResponse): void {
    Cookies.set(COOKIE_ACCESS_TOKEN, tokens.accessToken, COOKIE_OPTIONS);
    Cookies.set(COOKIE_REFRESH_TOKEN, tokens.refreshToken, COOKIE_OPTIONS);
  },

  clearTokens(): void {
    Cookies.remove(COOKIE_ACCESS_TOKEN);
    Cookies.remove(COOKIE_REFRESH_TOKEN);
  },

  isLoggedIn(): boolean {
    return !!Cookies.get(COOKIE_ACCESS_TOKEN);
  },
};

// Backend snake_case → frontend camelCase
function mapUserResponse(raw: Record<string, unknown>): UserResponse {
  return {
    id: raw.id as string,
    email: raw.email as string,
    username: raw.username as string,
    xp: raw.xp as number,
    level: raw.level as number,
    streak: raw.streak as number,
    lastActiveDate: (raw.last_active_date ?? null) as string | null,
    createdAt: raw.created_at as string,
  };
}
