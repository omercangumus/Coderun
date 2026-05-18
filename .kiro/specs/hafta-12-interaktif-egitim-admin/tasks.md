# Implementation Plan: Interactive Education Admin - Wiring & UI Integration

## Overview

This implementation focuses on **wiring the existing interactive education system into the running app** to make features VISIBLE and accessible. The primary goal is UI integration and visibility, not rewriting existing backend logic.

**Key Phases**:
1. Web: Admin Visibility - Make /admin discoverable in navigation for superusers
2. Web: Lesson Page 3-Column Layout - Refactor LessonPage to use interactive components with Ghostie
3. Mobile: LessonScreen Wiring - Route question types to correct widgets, add Ghostie reactions
4. Seed/Demo Visibility - Ensure at least one lesson shows new interactive types
5. Backend Verify Only - Don't rewrite, just verify models support new fields
6. Acceptance Checks - Run linting, builds, and verify UI visibility

**Branch Strategy**:
- Start from `develop` branch
- Create `feature/hafta-12-wire-interactive-lessons-admin` branch
- Do NOT work directly on develop

## Tasks

- [x] 1. Setup and Branch Management
  - Create feature branch `feature/hafta-12-wire-interactive-lessons-admin` from `develop`
  - Verify all three platforms (backend, web, mobile) are on the correct branch
  - _Requirements: All requirements (setup prerequisite)_

- [x] 2. Backend Verification - Check Existing Models
  - [x] 2.1 Verify Question model has new fields
    - Read `backend/app/models/question.py` and verify fields exist: `word_bank`, `code_block`, `buggy_line_index`, `explanation`, `is_reinforcement`, `reinforcement_question_id`
    - Read `backend/app/models/user.py` and verify `is_superuser` field exists
    - Read `backend/app/models/user_progress.py` and verify `reinforcement_triggered`, `reinforcement_passed` fields exist
    - If fields are missing, add them with proper SQLAlchemy mappings
    - _Requirements: 1.2, 3.1, 2.5_
  
  - [x] 2.2 Verify API schemas expose new fields
    - Read `backend/app/schemas/question.py` and verify `QuestionResponse` includes new fields (but NOT `correct_answer`)
    - Read `backend/app/schemas/lesson.py` and verify `LessonResultResponse` includes `reinforcement_question` field
    - If schemas are missing fields, add them with proper Pydantic types
    - _Requirements: 1.3, 2.6_
  
  - [x] 2.3 Check if Alembic migrations exist for new fields
    - List files in `backend/alembic/versions/` and check for recent migrations
    - If migrations don't exist, create Alembic migration with `alembic revision --autogenerate -m "Add interactive question fields"`
    - Run `alembic upgrade head` to apply migrations
    - _Requirements: 1.8_

- [x] 3. Backend Admin Endpoints - Verify or Create
  - [x] 3.1 Check if admin router exists
    - Read `backend/app/api/v1/router.py` and check if admin router is included
    - Read `backend/app/api/v1/endpoints/` directory to see if `admin.py` exists
    - If admin endpoints don't exist, create minimal admin router with superuser dependency
    - _Requirements: 4.1, 4.8_
  
  - [x] 3.2 Verify superuser dependency exists
    - Read `backend/app/api/v1/dependencies.py` and check for `get_current_superuser` function
    - If missing, implement `get_current_superuser` that raises HTTP 403 for non-superusers
    - _Requirements: 3.4, 4.9_
  
  - [x] 3.3 Create minimal admin stats endpoint
    - Implement `GET /admin/stats` endpoint that returns total users, active users, completed lessons count
    - Use `get_current_superuser` dependency for protection
    - _Requirements: 4.2_

- [x] 4. Seed Data - Add Interactive Question Examples
  - [x] 4.1 Create or extend seed script with interactive questions
    - Check if seed script exists in `backend/app/` or `backend/scripts/`
    - Add at least 1 example for each new question type: `fill_in_blank`, `reorder`, `spot_the_bug`, `multi_select`
    - Add 1 reinforcement question example linked to a main question
    - Ensure seed data includes proper `word_bank`, `code_block`, `buggy_line_index` values
    - _Requirements: 5.1, 5.2_
  
  - [x] 4.2 Run seed script and verify data
    - Execute seed script to populate database
    - Query database to verify at least one lesson has new interactive question types
    - _Requirements: 5.3_

- [x] 5. Checkpoint - Backend Ready
  - Run `python -m compileall backend/app` to check for syntax errors
  - Run `alembic upgrade head` to ensure migrations work
  - Run `pytest backend/tests/ -v` to ensure existing tests pass
  - Verify at least one lesson in database has interactive questions
  - Ask user if questions arise before proceeding to frontend

- [x] 6. Web - Update Type Definitions
  - [x] 6.1 Update module types with new question fields
    - Read `web/coderun-web/src/lib/types/module.types.ts`
    - Add new fields to `QuestionResponse` interface: `explanation`, `codeBlock`, `wordBank`, `buggyLineIndex`, `isReinforcement`
    - Add `reinforcementQuestion` field to `LessonResultResponse` interface
    - Update `QuestionType` union to include all new types
    - _Requirements: 9.2_
  
  - [x] 6.2 Update API client to handle new fields
    - Read `web/coderun-web/src/lib/api/module-api.ts`
    - Ensure API client properly deserializes `reinforcement_question` in lesson result response
    - _Requirements: 9.1_

- [ ] 7. Web - Create Interactive Question Components
  - [x] 7.1 Create FillInBlankQuestion component
    - Create `web/coderun-web/src/components/lesson/questions/FillInBlankQuestion.tsx`
    - Render code block with blank slots
    - Render word bank as clickable chips
    - Handle word selection to fill blanks
    - Call `onAnswer` with joined words on submit
    - _Requirements: 7.1_
  
  - [x] 7.2 Create ReorderQuestion component
    - Create `web/coderun-web/src/components/lesson/questions/ReorderQuestion.tsx`
    - Use drag-and-drop library (@dnd-kit or react-beautiful-dnd)
    - Render code lines as draggable items
    - Call `onAnswer` with reordered lines on submit
    - _Requirements: 7.2_
  
  - [x] 7.3 Create SpotTheBugQuestion component
    - Create `web/coderun-web/src/components/lesson/questions/SpotTheBugQuestion.tsx`
    - Render code lines as clickable buttons
    - Highlight selected line
    - Call `onAnswer` with line index on submit
    - _Requirements: 7.4_
  
  - [x] 7.4 Create MultiSelectQuestion component
    - Create `web/coderun-web/src/components/lesson/questions/MultiSelectQuestion.tsx`
    - Render checkboxes for multiple options
    - Allow multiple selections
    - Call `onAnswer` with comma-separated selections on submit
    - _Requirements: 7.5_
  
  - [x] 7.5 Create TrueFalseReasonQuestion component
    - Create `web/coderun-web/src/components/lesson/questions/TrueFalseReasonQuestion.tsx`
    - Render true/false buttons
    - Render reason text input field
    - Call `onAnswer` with combined response on submit
    - _Requirements: 7.3_

- [x] 8. Web - Create Question Router
  - [x] 8.1 Create QuestionRouter component
    - Create `web/coderun-web/src/components/lesson/questions/QuestionRouter.tsx`
    - Implement switch statement to route `question_type` to correct component
    - Default to `MultipleChoiceQuestion` for unknown types
    - _Requirements: 7.7_

- [x] 9. Web - Refactor Lesson Page to 3-Column Layout
  - [x] 9.1 Create LessonLayout component with 3-column grid
    - Create `web/coderun-web/src/components/lesson/LessonLayout.tsx`
    - Implement 3-column layout: left (progress), center (question), right (Ghostie/reinforcement)
    - Use Tailwind grid classes for responsive layout
    - _Requirements: 7.7_
  
  - [x] 9.2 Create ReinforcementQuestion component
    - Create `web/coderun-web/src/components/lesson/ReinforcementQuestion.tsx`
    - Render in right panel with Ghostie mascot
    - Use QuestionRouter for question rendering
    - Show encouraging message
    - _Requirements: 7.6, 7.8_
  
  - [x] 9.3 Wire LessonLayout into lesson page
    - Read existing lesson page (likely `web/coderun-web/src/app/lessons/[id]/page.tsx` or similar)
    - Replace existing layout with new `LessonLayout` component
    - Pass current question and reinforcement question to layout
    - Handle answer submission and reinforcement flow
    - _Requirements: 7.7, 7.8_

- [x] 10. Web - Admin Panel Visibility
  - [x] 10.1 Create admin layout
    - Create `web/coderun-web/src/app/admin/layout.tsx`
    - Implement left sidebar navigation with links to Dashboard, Paths, Lessons, Questions, Users
    - Add top header with user info
    - _Requirements: 8.1, 8.8_
  
  - [x] 10.2 Create admin dashboard page
    - Create `web/coderun-web/src/app/admin/page.tsx`
    - Fetch stats from `GET /admin/stats` endpoint
    - Display total users, active users, completed lessons
    - _Requirements: 8.3, 8.4_
  
  - [x] 10.3 Add admin navigation link for superusers
    - Read main navigation component (likely in `web/coderun-web/src/components/layout/` or similar)
    - Add conditional "Admin" link that only shows when `user.is_superuser === true`
    - Link should navigate to `/admin`
    - _Requirements: 8.1_
  
  - [x] 10.4 Create admin middleware for route protection
    - Create or update middleware in `web/coderun-web/src/middleware.ts`
    - Check `is_superuser` flag for `/admin` routes
    - Redirect non-superusers to `/login` with error message
    - _Requirements: 8.2_

- [x] 11. Checkpoint - Web UI Visible
  - Run `npm run lint` in web directory to check for errors
  - Run `npm run build` in web directory to ensure build succeeds
  - Manually test in browser:
    - Navigate to a lesson and verify 3-column layout appears
    - Verify at least one interactive question type renders correctly
    - Verify admin link appears for superuser
    - Verify admin dashboard loads and shows stats
  - Ask user if questions arise before proceeding to mobile

- [x] 12. Mobile - Update Data Models
  - [x] 12.1 Update QuestionModel with new fields
    - Read `mobile/coderun_mobile/lib/data/models/question_model.dart`
    - Add new fields: `explanation`, `codeBlock`, `wordBank`, `buggyLineIndex`, `isReinforcement`
    - Add proper JSON serialization annotations
    - _Requirements: 9.3_
  
  - [x] 12.2 Update LessonResultModel with reinforcement field
    - Read `mobile/coderun_mobile/lib/data/models/lesson_result_model.dart`
    - Add `reinforcementQuestion` field of type `QuestionModel?`
    - Add proper JSON serialization
    - _Requirements: 9.4_

- [x] 13. Mobile - Create Interactive Question Widgets
  - [x] 13.1 Create FillInBlankWidget
    - Create `mobile/coderun_mobile/lib/presentation/screens/lesson/widgets/fill_in_blank_widget.dart`
    - Render code block with blank slots
    - Render word bank as chips
    - Handle tap to fill blank
    - Call `onAnswerChanged` with joined words
    - _Requirements: 6.1_
  
  - [x] 13.2 Create ReorderWidget
    - Create `mobile/coderun_mobile/lib/presentation/screens/lesson/widgets/reorder_widget.dart`
    - Use `ReorderableListView` for drag-and-drop
    - Render code lines as draggable items
    - Call `onAnswerChanged` with reordered lines
    - _Requirements: 6.2_
  
  - [x] 13.3 Create SpotTheBugWidget
    - Create `mobile/coderun_mobile/lib/presentation/screens/lesson/widgets/spot_the_bug_widget.dart`
    - Render code lines as tappable containers
    - Highlight selected line
    - Call `onAnswerChanged` with line index
    - _Requirements: 6.4_
  
  - [x] 13.4 Create MultiSelectWidget
    - Create `mobile/coderun_mobile/lib/presentation/screens/lesson/widgets/multi_select_widget.dart`
    - Render checkboxes for options
    - Allow multiple selections
    - Call `onAnswerChanged` with comma-separated selections
    - _Requirements: 6.5_
  
  - [x] 13.5 Create TrueFalseReasonWidget
    - Create `mobile/coderun_mobile/lib/presentation/screens/lesson/widgets/true_false_reason_widget.dart`
    - Render true/false buttons
    - Render reason text field
    - Call `onAnswerChanged` with combined response
    - _Requirements: 6.3_

- [x] 14. Mobile - Create Reinforcement and Ghostie Widgets
  - [x] 14.1 Create ReinforcementCardWidget
    - Create `mobile/coderun_mobile/lib/presentation/screens/lesson/widgets/reinforcement_card_widget.dart`
    - Show Ghostie mascot with encouraging message
    - Render question using widget router
    - Use purple accent styling
    - _Requirements: 6.6_
  
  - [x] 14.2 Create GhostieReaction widget
    - Create `mobile/coderun_mobile/lib/presentation/screens/lesson/widgets/ghostie_reaction.dart`
    - Show different Ghostie expressions for correct/wrong/reinforcement states
    - Add animated transitions
    - _Requirements: 6.7, 6.10_

- [x] 15. Mobile - Wire Widgets into LessonScreen
  - [x] 15.1 Update LessonScreen question routing
    - Read `mobile/coderun_mobile/lib/presentation/screens/lesson/lesson_screen.dart`
    - Find `_buildQuestionWidget` method (or equivalent)
    - Add cases for new question types: `fill_in_blank`, `reorder`, `spot_the_bug`, `multi_select`, `true_false_reason`
    - Default to `MultipleChoiceWidget` for unknown types
    - _Requirements: 6.8_
  
  - [x] 15.2 Add reinforcement card display logic
    - In LessonScreen, check if `lessonState.reinforcementQuestion != null`
    - If true, show `ReinforcementCardWidget` instead of next question
    - Handle reinforcement answer submission
    - _Requirements: 6.9_
  
  - [x] 15.3 Add GhostieReaction after each answer
    - Show `GhostieReaction` widget after answer submission
    - Pass `isCorrect` and `isReinforcement` flags
    - Display for 2-3 seconds before continuing
    - _Requirements: 6.10_

- [x] 16. Final Acceptance Checks
  - [x] 16.1 Backend verification
    - Run `python -m compileall backend/app` - must pass
    - Run `alembic upgrade head` - must pass
    - Run `pytest backend/tests/ -v` - must pass
    - _Requirements: 10.1, 10.2, 10.3_
  
  - [x] 16.2 Web verification
    - Run `npm run lint` in web directory - must pass
    - Run `npm run build` in web directory - must pass
    - _Requirements: 10.4, 10.5_
  
  - [x] 16.3 Mobile verification
    - Run `flutter analyze` in mobile directory - must pass
    - Run `flutter test` in mobile directory - must pass (or skip if no tests exist)
    - _Requirements: 10.6, 10.7_
  
  - [x] 16.4 Manual UI visibility verification
    - **Web**: Open browser, login as superuser, verify admin link visible in navigation
    - **Web**: Navigate to admin dashboard, verify stats display
    - **Web**: Open a lesson, verify 3-column layout with interactive questions
    - **Mobile**: Run app, open a lesson, verify interactive widgets render
    - **Mobile**: Verify Ghostie reactions appear after answers
    - Document any issues found
    - _Requirements: All requirements (integration verification)_

- [x] 17. Final Checkpoint - Ready for Review
  - Ensure all linting and build checks pass
  - Ensure at least one lesson demonstrates new interactive question types
  - Ensure admin panel is visible and accessible for superusers
  - Ensure mobile app shows interactive widgets
  - Create summary of what was wired and what is now visible
  - Ask user if ready to merge or if additional changes needed

## Notes

- **Focus**: This implementation is about WIRING and VISIBILITY, not rewriting existing logic
- **Branch**: All work must be done on `feature/hafta-12-wire-interactive-lessons-admin` branch
- **Verification**: Each checkpoint ensures incremental progress and catches issues early
- **Fallback**: Unknown question types fall back to `MultipleChoiceWidget`/`MultipleChoiceQuestion`
- **Testing**: Optional test tasks are NOT included; focus is on making features visible
- **Requirements Traceability**: Each task references specific requirements for accountability
