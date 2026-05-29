# Implementation Plan: Code Runner Assignments

## Overview

This implementation adds a VS Code-like coding assignment experience to the Coderun platform. Students write Python code in a Monaco editor (web) or monospace text field (mobile), run it in a sandboxed Docker container, and submit for automated test-case evaluation with Ghostie visual feedback.

**Key Phases**:
1. Phase 0: Feature branch setup
2. Phase 1: Backend foundation — config, model, schemas, migration
3. Phase 2: Backend code runner service and endpoints
4. Phase 3: Backend seed data (5 Python assignments)
5. Phase 4: Web types and API client
6. Phase 5: Web CodeRunnerAssignment component and routing
7. Phase 6: Mobile models and repository
8. Phase 7: Mobile widget and lesson screen routing
9. Phase 8: Admin question editor for code_editor type
10. Phase 9: Verification checks (compile, lint, build, analyze)
11. Phase 10: Review passes (security, API contract, UI, regression)
12. Phase 11: Commit and merge to develop

**Branch Strategy**:
- Start from `develop` branch
- Create `feature/code-runner-assignments` branch
- Do NOT merge to develop until all checks and review passes complete

## Task Dependency Graph

```json
{
  "waves": [
    {
      "wave": 1,
      "tasks": ["0"]
    },
    {
      "wave": 2,
      "tasks": ["1.1", "1.2", "1.3", "1.4", "1.5"]
    },
    {
      "wave": 3,
      "tasks": ["2.1", "2.2", "2.3"]
    },
    {
      "wave": 4,
      "tasks": ["3.1", "4.1", "4.2", "4.3", "4.4", "6.1", "6.2", "6.3"]
    },
    {
      "wave": 5,
      "tasks": ["5.1", "5.2", "7.1", "7.2", "8.1"]
    },
    {
      "wave": 6,
      "tasks": ["9.1", "9.2", "9.3"]
    },
    {
      "wave": 7,
      "tasks": ["10.1", "10.2", "10.3", "10.4", "10.5", "10.6"]
    },
    {
      "wave": 8,
      "tasks": ["11.1", "11.2", "11.3", "11.4"]
    }
  ]
}
```

## Tasks

- [ ] 0. Branch Setup
  - Create feature branch `feature/code-runner-assignments` from `develop`
  - Verify all three platforms (backend, web, mobile) are on the correct branch
  - _Requirements: 15_

- [ ] 1. Backend Foundation
  - [ ] 1.1 Add code runner settings to config.py
    - Open `backend/app/core/config.py` and add 4 new settings to the `Settings` class
    - `CODE_RUNNER_TIMEOUT_MS: int = 5000`
    - `CODE_RUNNER_MEMORY_MB: int = 128`
    - `CODE_RUNNER_OUTPUT_LIMIT_KB: int = 10`
    - `CODE_RUNNER_DOCKER_IMAGE: str = "python:3.11-slim"`
    - _Requirements: 1, 11_

  - [ ] 1.2 Extend Question model with 6 new nullable columns
    - Open `backend/app/models/question.py`
    - Add after the existing `is_reinforcement` column: `language`, `starter_code`, `test_cases`, `assignment_instructions`, `max_runtime_ms`, `memory_limit_mb`
    - All columns must be nullable with appropriate server_defaults (`language` → `"python"`, `max_runtime_ms` → `5000`, `memory_limit_mb` → `128`)
    - Use `String`, `Text`, `JSON`, `Integer` SQLAlchemy types as per design
    - _Requirements: 3, 12, 13_

  - [ ] 1.3 Extend question schemas with 6 new fields
    - Open `backend/app/schemas/question.py`
    - Add all 6 new fields (all optional/nullable) to `QuestionSimpleResponse`, `QuestionCreateSchema`, and `QuestionUpdateSchema`
    - Fields: `language: str | None`, `starter_code: str | None`, `test_cases: list[dict] | None`, `assignment_instructions: str | None`, `max_runtime_ms: int | None`, `memory_limit_mb: int | None`
    - _Requirements: 3, 12_

  - [ ] 1.4 Create Alembic migration for the 6 new columns
    - Create `backend/alembic/versions/XXXX_add_code_assignment_fields.py`
    - `upgrade()`: add all 6 columns to `questions` table with correct types and server_defaults
    - `downgrade()`: drop all 6 columns in reverse order
    - Set `Revises` to `b57f111aeb2e` (current head)
    - Verify with `alembic heads` after creation
    - _Requirements: 13_

  - [ ] 1.5 Create code_runner.py Pydantic schemas
    - Create `backend/app/schemas/code_runner.py`
    - Implement: `CodeRunRequest`, `CodeRunResponse`, `TestCaseResult`, `CodeSubmitRequest`, `CodeSubmitResponse`
    - `CodeRunRequest`: `language`, `code` (max 50k), `stdin`, `assignment_id`, `timeout_ms` (1000–30000), `memory_limit_mb` (64–512)
    - `CodeRunResponse`: `stdout`, `stderr`, `exit_code`, `duration_ms`, `timed_out`
    - `TestCaseResult`: `name`, `passed`, `stdout`, `stderr`, `duration_ms`, `hidden`, `expected_stdout: str | None`
    - `CodeSubmitRequest`: `question_id`, `code` (max 50k), `language`
    - `CodeSubmitResponse`: `passed`, `score`, `stdout`, `stderr`, `test_results`, `feedback`
    - _Requirements: 1, 4_

- [ ] 2. Backend Code Runner Service
  - [ ] 2.1 Create code_runner_service.py with run_code() and evaluate_submission()
    - Create `backend/app/services/code_runner_service.py`
    - Implement `run_code(language, code, stdin, timeout_ms, memory_mb) -> CodeRunResponse`:
      - Check Docker availability → raise HTTP 503 if unavailable
      - Write code to temp file at `/tmp/coderun_{uuid}/solution.py`
      - Build `docker run` command with all security flags: `--rm --network=none --memory=Xm --memory-swap=Xm --cpus=1 --read-only --tmpfs /tmp:size=32m --user=nobody`
      - Use `asyncio.create_subprocess_exec()` with timeout; catch `asyncio.TimeoutError`
      - Truncate combined stdout+stderr at `OUTPUT_LIMIT_KB` (10KB); append `"... (output truncated)"`
      - Always delete temp directory in `finally` block
      - Return `CodeRunResponse`
    - Implement `evaluate_submission(question, code, language) -> CodeSubmitResponse`:
      - Parse `test_cases` JSON from question
      - For each test case: call `run_code()` with `stdin=test.stdin` and question's `max_runtime_ms`/`memory_limit_mb`
      - Compare `actual_stdout.strip() == expected_stdout.strip()`
      - Build `TestCaseResult` list; set `expected_stdout=None` for hidden test cases
      - Calculate `score = floor((passed / total) * 100)` and `passed = score == 100`
      - Generate feedback string based on score
      - Return `CodeSubmitResponse`
    - _Requirements: 1, 2, 4, 11_

  - [ ] 2.2 Create code_runner.py endpoint
    - Create `backend/app/api/v1/endpoints/code_runner.py`
    - `POST /code/run`: validate JWT, log `user_id`/timestamp/language/code-length, delegate to `service.run_code()`
    - `POST /code/submit`: validate JWT, fetch question by `question_id`, validate `question_type == 'code_editor'`, validate test_cases not empty (HTTP 422), delegate to `service.evaluate_submission()`
    - Use `Depends(get_current_user)` on both endpoints
    - Handle: question not found → 404, wrong type → 422, no test cases → 422, Docker unavailable → 503
    - _Requirements: 1, 4, 11_

  - [ ] 2.3 Register code_runner router in router.py
    - Open `backend/app/api/v1/router.py`
    - Import `code_runner` from endpoints
    - Add `api_router.include_router(code_runner.router)` alongside existing routers
    - _Requirements: 1, 4_

- [ ] 3. Backend Seed Data
  - [ ] 3.1 Add Python Coding Assignments lesson to seed_data.py
    - Open `backend/app/core/seed_data.py`
    - Add a new lesson entry with `"title": "Python Kodlama Ödevleri"`, `"lesson_type": "code_editor"`, `"order": 11`, `"xp_reward": 50`
    - Include all 5 assignments as questions with `question_type: "code_editor"`:
      1. **Hello Coderun** — print `"Hello, Coderun!"`, 1 public + 1 hidden test case
      2. **İki Sayının Toplamı** — sum two integers from stdin, 1 public + 2 hidden test cases
      3. **Çift Sayıları Say** — count even numbers 1..N, 1 public + 2 hidden test cases
      4. **String Tersine Çevir** — reverse a string from stdin, 1 public + 2 hidden test cases
      5. **FizzBuzz Mini** — FizzBuzz 1–15, 1 public + 1 hidden test case
    - Each assignment must include: `starter_code`, `assignment_instructions`, `correct_answer: "__code_editor__"`, `max_runtime_ms: 5000`, `memory_limit_mb: 128`
    - _Requirements: 9_

- [ ] 4. Web Types and API Client
  - [ ] 4.1 Extend QuestionResponse in module.types.ts
    - Open `web/coderun-web/src/lib/types/module.types.ts`
    - Add 6 new optional fields to `QuestionResponse` interface:
      - `language: string | null`
      - `starterCode: string | null`
      - `testCases: Array<{ name: string; stdin: string; expectedStdout: string; hidden: boolean }> | null`
      - `assignmentInstructions: string | null`
      - `maxRuntimeMs: number | null`
      - `memoryLimitMb: number | null`
    - _Requirements: 3, 5, 12_

  - [ ] 4.2 Create code-runner.types.ts
    - Create `web/coderun-web/src/lib/types/code-runner.types.ts`
    - Export interfaces: `CodeRunRequest`, `CodeRunResponse`, `TestCaseResult`, `CodeSubmitRequest`, `CodeSubmitResponse`
    - Match the backend Pydantic schema shapes (camelCase for TypeScript)
    - `CodeRunResponse`: `stdout`, `stderr`, `exitCode`, `durationMs`, `timedOut`
    - `TestCaseResult`: `name`, `passed`, `stdout`, `stderr`, `durationMs`, `hidden`, `expectedStdout: string | null`
    - `CodeSubmitResponse`: `passed`, `score`, `stdout`, `stderr`, `testResults`, `feedback`
    - _Requirements: 1, 4, 5, 6_

  - [ ] 4.3 Create code-api.ts
    - Create `web/coderun-web/src/lib/api/code-api.ts`
    - Import `axiosClient` and the new types from `code-runner.types.ts`
    - Export `codeApi` object with:
      - `runCode(request: CodeRunRequest): Promise<CodeRunResponse>` → POST `/code/run`
      - `submitCode(request: CodeSubmitRequest): Promise<CodeSubmitResponse>` → POST `/code/submit`
    - _Requirements: 1, 4_

  - [ ] 4.4 Extend mapQuestion() in module-api.ts
    - Open `web/coderun-web/src/lib/api/module-api.ts`
    - In `mapQuestion()`, add mapping for all 6 new fields using `raw.field_name ?? null` pattern:
      - `language: raw.language ?? null`
      - `starterCode: raw.starter_code ?? null`
      - `testCases: raw.test_cases ?? null`
      - `assignmentInstructions: raw.assignment_instructions ?? null`
      - `maxRuntimeMs: raw.max_runtime_ms ?? null`
      - `memoryLimitMb: raw.memory_limit_mb ?? null`
    - _Requirements: 3, 5, 12_

- [ ] 5. Web CodeRunnerAssignment Component
  - [ ] 5.1 Create code-runner-assignment.tsx
    - Create `web/coderun-web/src/components/lesson/code-runner-assignment.tsx`
    - Mark `'use client'`; dynamically import Monaco editor with `ssr: false` to avoid hydration errors
    - Layout: left panel (30%) for `assignmentInstructions`, center panel (70%) for Monaco editor, bottom panel (~200px) for terminal output, Ghostie panel below
    - Toolbar: language badge, Run ▶, Submit ✓, Reset ↺ buttons
    - State machine: `'idle' | 'running' | 'submitting'`
    - **Run**: call `codeApi.runCode()`, display `stdout`/`stderr`/`durationMs`/`timedOut` in terminal panel
    - **Submit**: call `codeApi.submitCode()`, display `TestResultsList` with pass/fail per test case
    - **Reset**: restore `question.starterCode` to editor
    - Ghostie state mapping: `idle` → idle, `running/submitting` → idle + spinner overlay, `stderr non-empty` → sad_wrong, `timed_out` → angry, `passed=true` → very_happy, `passed=false` → sad_wrong
    - Terminal: stdout in white monospace, stderr in red monospace, duration badge, "Execution timed out" banner when `timedOut=true`
    - Call `onChange(code)` on every editor change so lesson flow tracks answer state
    - _Requirements: 5, 6, 10_

  - [ ] 5.2 Update question-router.tsx to route code_editor
    - Open `web/coderun-web/src/components/lesson/question-router.tsx`
    - Replace the existing `code_editor` case (currently routes to `MiniProjectQuestion`) with `CodeRunnerAssignment`
    - Import `CodeRunnerAssignment` from `./code-runner-assignment`
    - All other cases remain unchanged
    - _Requirements: 5, 12_

- [ ] 6. Mobile Models and Repository
  - [ ] 6.1 Extend QuestionModel with 6 new fields and regenerate .g.dart
    - Open `mobile/coderun_mobile/lib/data/models/question_model.dart`
    - Add 6 new nullable fields with proper `@JsonKey` annotations:
      - `final String? language`
      - `@JsonKey(name: 'starter_code') final String? starterCode`
      - `@JsonKey(name: 'test_cases') final List<Map<String, dynamic>>? testCases`
      - `@JsonKey(name: 'assignment_instructions') final String? assignmentInstructions`
      - `@JsonKey(name: 'max_runtime_ms') final int? maxRuntimeMs`
      - `@JsonKey(name: 'memory_limit_mb') final int? memoryLimitMb`
    - Update constructor and `copyWith` if present
    - Run `dart run build_runner build --delete-conflicting-outputs` to regenerate `question_model.g.dart`
    - _Requirements: 3, 7, 12_

  - [ ] 6.2 Create code_run_result_model.dart
    - Create `mobile/coderun_mobile/lib/data/models/code_run_result_model.dart`
    - Implement three `@JsonSerializable()` classes:
      - `CodeRunResultModel`: `stdout`, `stderr`, `exitCode`, `durationMs`, `timedOut`
      - `TestCaseResultModel`: `name`, `passed`, `stdout`, `stderr`, `durationMs`, `hidden`, `expectedStdout`
      - `CodeSubmitResultModel`: `passed`, `score`, `stdout`, `stderr`, `testResults`, `feedback`
    - Include `fromJson` / `toJson` factory methods
    - Run `dart run build_runner build --delete-conflicting-outputs` after creation
    - _Requirements: 4, 7_

  - [ ] 6.3 Create code_runner_repository.dart
    - Create `mobile/coderun_mobile/lib/data/repositories/code_runner_repository.dart`
    - Inject `Dio` instance (follow existing repository pattern)
    - Implement `runCode({language, code, stdin, timeoutMs, memoryLimitMb}) → Future<CodeRunResultModel>` → POST `/api/v1/code/run`
    - Implement `submitCode({questionId, code, language}) → Future<CodeSubmitResultModel>` → POST `/api/v1/code/submit`
    - Handle Dio errors consistently with existing repositories
    - _Requirements: 1, 4, 7_

- [ ] 7. Mobile Widget
  - [ ] 7.1 Create code_assignment_widget.dart
    - Create `mobile/coderun_mobile/lib/presentation/screens/lesson/widgets/code_assignment_widget.dart`
    - Layout: `SingleChildScrollView` → `Column` with:
      1. `Card` displaying `assignmentInstructions` text
      2. `Container` with `TextField` (monospace font, multiline, `minLines: 10`) for code input
      3. `Row` with Run ▶, Submit ✓, Reset ↺ `ElevatedButton`s
      4. Terminal output `Card`: stdout in white, stderr in red, duration badge, "Timed out" banner
      5. Test results list (visible after submit): each row shows test name + pass/fail icon + hidden badge
      6. `GhostieReaction` widget at bottom
    - Ghostie state mapping: editing → idle, running/submitting → idle + `CircularProgressIndicator`, stderr non-empty → sad_wrong, timed_out → angry, passed=true → very_happy, passed=false → sad_wrong
    - Keyboard safety: use `resizeToAvoidBottomInset: true` on parent `Scaffold`; `SingleChildScrollView` prevents overflow
    - Accept `question`, `currentAnswer`, `onAnswerChanged` parameters
    - _Requirements: 7, 10_

  - [ ] 7.2 Update lesson_screen.dart to route code_editor
    - Open `mobile/coderun_mobile/lib/presentation/screens/lesson/lesson_screen.dart`
    - In `_buildQuestionWidget()` (or equivalent routing method), split the existing combined `code_editor`/`mini_project` case:
      - `case 'code_editor':` → return `CodeAssignmentWidget(...)`
      - `case 'mini_project':` → return `MiniProjectWidget(...)` (keep existing)
    - Import `CodeAssignmentWidget` from the new file
    - All other question type cases remain unchanged
    - _Requirements: 7, 12_

- [ ] 8. Admin Question Editor
  - [ ] 8.1 Update admin question editor for code_editor type
    - Locate the admin question form in `web/coderun-web/src/app/admin/questions/`
    - When `question_type === 'code_editor'`, render additional fields below the standard fields:
      - Language select (Python only for MVP)
      - Max Runtime (ms) number input (default 5000)
      - Memory Limit (MB) number input (default 128)
      - Starter Code textarea (monospace font)
      - Assignment Instructions textarea
      - Test Cases editor: dynamic list where each entry has Name, Input (stdin), Expected Output, Hidden checkbox, and a Remove button
      - "Add Test Case" button to append a new empty entry
    - Validate: at least one test case must exist before saving; show inline error if empty
    - Set `correct_answer` to `"__code_editor__"` automatically for `code_editor` type
    - Existing question types must not be affected
    - _Requirements: 8, 12_

- [ ] 9. Verification Checks
  - _Depends on tasks 1–8 being complete_

  - [ ] 9.1 Run backend checks
    - Run `python -m compileall app` from `backend/` — must produce no errors
    - Run `alembic heads` from `backend/` — must show exactly one head (the new migration)
    - Run `alembic upgrade head` — must apply cleanly
    - Fix any syntax or migration errors before proceeding
    - _Requirements: 13, 14_

  - [ ] 9.2 Run web checks
    - Run `npm run lint` from `web/coderun-web/` — must pass with no errors
    - Run `npm run build` from `web/coderun-web/` — must produce a successful build
    - Fix any TypeScript or lint errors before proceeding
    - _Requirements: 14_

  - [ ] 9.3 Run mobile checks
    - Run `flutter pub get` from `mobile/coderun_mobile/` — must resolve all dependencies
    - Run `dart run build_runner build --delete-conflicting-outputs` — must regenerate `.g.dart` files cleanly
    - Run `flutter analyze` from `mobile/coderun_mobile/` — must produce no errors
    - Fix any Dart analysis errors before proceeding
    - _Requirements: 14_

- [ ] 10. Review Passes
  - _Depends on task 9 (all checks passing)_

  - [ ] 10.1 Review pass 1 — Backend security
    - Verify `code_runner_service.py` uses `docker run` (not `subprocess` with raw shell) — no unsafe host execution
    - Verify all Docker security flags are present: `--network=none`, `--memory`, `--memory-swap`, `--cpus=1`, `--read-only`, `--tmpfs`, `--user=nobody`, `--rm`
    - Verify timeout is enforced via `asyncio.TimeoutError` and container is killed
    - Verify output is truncated at 10KB with `"... (output truncated)"` appended
    - Verify hidden test cases have `expected_stdout=None` in `TestCaseResult` before serialization
    - Verify both `/code/run` and `/code/submit` require valid JWT (`Depends(get_current_user)`)
    - _Requirements: 1, 4, 11_

  - [ ] 10.2 Review pass 2 — API contract
    - Verify backend `CodeRunResponse` field names match web `CodeRunResponse` interface (snake_case → camelCase)
    - Verify backend `CodeSubmitResponse` field names match web `CodeSubmitResponse` interface
    - Verify `mapQuestion()` maps all 6 new fields from snake_case to camelCase
    - Verify mobile `CodeRunResultModel` JSON keys match backend response field names
    - Verify mobile `QuestionModel` JSON keys match backend `QuestionSimpleResponse` field names
    - _Requirements: 3, 4, 5, 7_

  - [ ] 10.3 Review pass 3 — Web UI
    - Verify `code_editor` case in `question-router.tsx` routes to `CodeRunnerAssignment` (not `MiniProjectQuestion`)
    - Verify Monaco editor is imported with `dynamic(..., { ssr: false })` — no SSR/hydration issues
    - Verify Run/Submit/Reset buttons are present and wired to correct handlers
    - Verify terminal panel shows stdout (white), stderr (red), duration, and timed-out banner
    - Verify Ghostie state transitions: idle → running → result states
    - Verify `onChange(code)` is called on every editor change
    - _Requirements: 5, 6, 10, 12_

  - [ ] 10.4 Review pass 4 — Mobile UI
    - Verify `code_assignment_widget.dart` compiles without errors
    - Verify `TextField` uses monospace font and is multiline
    - Verify `SingleChildScrollView` wraps the full column (keyboard safe)
    - Verify terminal output card scrolls for long output
    - Verify Ghostie asset references use only existing assets (no new assets introduced)
    - Verify `lesson_screen.dart` routes `code_editor` to `CodeAssignmentWidget` and `mini_project` to `MiniProjectWidget`
    - _Requirements: 7, 10, 12_

  - [ ] 10.5 Review pass 5 — Seed data and admin
    - Verify seed data creates the "Python Kodlama Ödevleri" lesson at `order=11`
    - Verify all 5 assignments are present with both public and hidden test cases
    - Verify admin question editor shows code_editor-specific fields when `question_type === 'code_editor'`
    - Verify admin test case editor has hidden checkbox and remove button per entry
    - Verify hidden test cases are not exposed in the submit response
    - _Requirements: 8, 9_

  - [ ] 10.6 Review pass 6 — Regression
    - Verify existing question types (multiple_choice, fill_in_blank, reorder, spot_the_bug, etc.) still render correctly in web
    - Verify `mini_project` still routes to `MiniProjectWidget` in mobile
    - Verify login and registration flows are unaffected
    - Verify admin panel for non-code_editor question types still works
    - Verify gamification/XP system still awards XP for all lesson types
    - Verify reinforcement question flow is unaffected
    - _Requirements: 12_

- [ ] 11. Commit and Merge
  - _Depends on task 10 (all review passes complete)_

  - [ ] 11.1 Commit feature branch
    - Stage all changed and new files
    - Commit with message: `feat: add code runner assignments`
    - Verify no secrets, `.env` files, or unrelated changes are included
    - _Requirements: 15_

  - [ ] 11.2 Push feature branch to origin
    - Run `git push -u origin feature/code-runner-assignments`
    - Verify branch is visible on remote
    - _Requirements: 15_

  - [ ] 11.3 Merge to develop
    - Merge `feature/code-runner-assignments` into `develop` (non-destructive merge, no rebase or force-push)
    - Resolve any merge conflicts carefully, preserving both feature and existing code
    - Only proceed after all checks (task 9) and review passes (task 10) are confirmed complete
    - _Requirements: 15_

  - [ ] 11.4 Push develop to origin
    - Run `git push origin develop`
    - Verify develop branch on remote reflects the merged feature
    - _Requirements: 15_

## Notes

- **Docker requirement**: The code runner requires Docker to be running on the host. If Docker is unavailable, `/code/run` and `/code/submit` return HTTP 503. This is expected behavior in CI environments without Docker.
- **Monaco SSR**: Monaco editor must always be dynamically imported with `ssr: false`. Never import it at the top level in a Next.js component.
- **Hidden test cases**: `expected_stdout` must be `null` (not an empty string) in `TestCaseResult` when `hidden=true`. This is enforced in `evaluate_submission()`, not in the endpoint.
- **Backward compatibility**: The 6 new Question model columns are all nullable with server defaults. Existing questions will have `null` for all new fields, which is correct behavior.
- **Seed data idempotency**: Follow the existing seed script pattern to avoid duplicate data on re-runs.
- **Branch**: All work must be done on `feature/code-runner-assignments`. Never commit directly to `develop` or `main`.
- **Requirements traceability**: Each task references specific requirement IDs for accountability.
