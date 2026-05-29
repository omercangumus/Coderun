// Coderun — code runner API istemcisi.
// POST /api/v1/code/run ve POST /api/v1/code/submit endpoint'leri için.

import axiosClient from './axios-client';
import type {
  CodeRunRequest,
  CodeRunResponse,
  CodeSubmitRequest,
  CodeSubmitResponse,
} from '@/lib/types/code-runner.types';

export const codeApi = {
  /**
   * Kodu Docker sandbox içinde çalıştırır.
   * Docker yoksa backend 503 döner.
   */
  async runCode(request: CodeRunRequest): Promise<CodeRunResponse> {
    const payload = {
      language: request.language,
      code: request.code,
      stdin: request.stdin ?? '',
      assignment_id: request.assignmentId ?? null,
      timeout_ms: request.timeoutMs ?? 5000,
      memory_limit_mb: request.memoryLimitMb ?? 128,
    };
    const response = await axiosClient.post('/code/run', payload);
    const raw = response.data;
    return {
      stdout: raw.stdout ?? '',
      stderr: raw.stderr ?? '',
      exitCode: raw.exit_code ?? 0,
      durationMs: raw.duration_ms ?? 0,
      timedOut: raw.timed_out ?? false,
    };
  },

  /**
   * Kodu ödev test senaryolarına karşı değerlendirir.
   * Gizli testlerin expectedStdout değeri null olarak döner.
   */
  async submitCode(request: CodeSubmitRequest): Promise<CodeSubmitResponse> {
    const payload = {
      question_id: request.questionId,
      code: request.code,
      language: request.language,
    };
    const response = await axiosClient.post('/code/submit', payload);
    const raw = response.data;
    return {
      passed: raw.passed ?? false,
      score: raw.score ?? 0,
      stdout: raw.stdout ?? '',
      stderr: raw.stderr ?? '',
      testResults: (raw.test_results ?? []).map((r: Record<string, unknown>) => ({
        name: r.name as string,
        passed: r.passed as boolean,
        stdout: (r.stdout as string) ?? '',
        stderr: (r.stderr as string) ?? '',
        durationMs: (r.duration_ms as number) ?? 0,
        hidden: r.hidden as boolean,
        expectedStdout: (r.expected_stdout as string | null) ?? null,
      })),
      feedback: raw.feedback ?? '',
    };
  },
};
