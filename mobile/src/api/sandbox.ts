// Kod sandbox API fonksiyonları

import apiClient from './client';
import { CODE_RUN, CODE_SUBMIT } from '../constants/api';

export interface CodeRunRequest {
  language: string;
  code: string;
  test_cases?: Array<Record<string, unknown>>;
}

export interface CodeRunResult {
  stdout: string;
  stderr: string;
  exit_code: number;
  execution_time_ms: number;
  passed: boolean;
  test_results?: Array<{
    passed: boolean;
    expected: string;
    actual: string;
  }>;
}

export const runCode = async (data: CodeRunRequest): Promise<CodeRunResult> => {
  const response = await apiClient.post<CodeRunResult>(CODE_RUN, data);
  return response.data;
};

export const submitCode = async (
  data: CodeRunRequest,
): Promise<CodeRunResult> => {
  const response = await apiClient.post<CodeRunResult>(CODE_SUBMIT, data);
  return response.data;
};
