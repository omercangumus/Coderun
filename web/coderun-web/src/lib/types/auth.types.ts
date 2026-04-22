export interface UserResponse {
  id: string;
  email: string;
  username: string;
  xp: number;
  level: number;
  streak: number;
  lastActiveDate: string | null;
  createdAt: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
}
