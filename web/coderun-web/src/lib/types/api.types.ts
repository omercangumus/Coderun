export interface ApiError {
  message: string;
  statusCode: number;
  detail?: string;
}

export type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: ApiError };
