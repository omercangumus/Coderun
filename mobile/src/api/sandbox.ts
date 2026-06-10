// Kod sandbox API fonksiyonları

import apiClient from './client';
import { CODE_RUN, CODE_SUBMIT } from '../constants/api';

export interface CodeRunRequest {
  language: string;
  code: string;
  stdin?: string;
  timeout_ms?: number;
  memory_limit_mb?: number;
}

export interface CodeRunResult {
  stdout: string;
  stderr: string;
  exit_code: number;
  duration_ms: number;
  timed_out: boolean;
}

export interface CodeSubmitRequest {
  question_id: string;
  code: string;
  language: string;
}

export interface TestCaseResult {
  name: string;
  passed: boolean;
  stdout: string;
  stderr: string;
  duration_ms: number;
  hidden: boolean;
  expected_stdout?: string | null;
}

export interface CodeSubmitResponse {
  passed: boolean;
  score: number;
  stdout: string;
  stderr: string;
  test_results: TestCaseResult[];
  feedback: string;
}

export const runCode = async (data: CodeRunRequest): Promise<CodeRunResult> => {
  const response = await apiClient.post<CodeRunResult>(CODE_RUN, data);
  return response.data;
};

export const submitCode = async (
  data: CodeSubmitRequest,
): Promise<CodeSubmitResponse> => {
  const response = await apiClient.post<CodeSubmitResponse>(CODE_SUBMIT, data);
  return response.data;
};

