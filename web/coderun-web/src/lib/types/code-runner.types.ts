// Coderun — code runner API tip tanımları.
// POST /api/v1/code/run ve POST /api/v1/code/submit için istek/yanıt şemaları.

export interface CodeRunRequest {
  language: string;
  code: string;
  stdin?: string;
  assignmentId?: string;
  timeoutMs?: number;
  memoryLimitMb?: number;
}

export interface CodeRunResponse {
  stdout: string;
  stderr: string;
  exitCode: number;
  durationMs: number;
  timedOut: boolean;
}

export interface TestCaseResult {
  name: string;
  passed: boolean;
  stdout: string;
  stderr: string;
  durationMs: number;
  hidden: boolean;
  expectedStdout: string | null;
}

export interface CodeSubmitRequest {
  questionId: string;
  code: string;
  language: string;
}

export interface CodeSubmitResponse {
  passed: boolean;
  score: number;
  stdout: string;
  stderr: string;
  testResults: TestCaseResult[];
  feedback: string;
}
