# Requirements Document

## Introduction

This document specifies the requirements for a VS Code-like coding assignment and code runner experience for the Coderun educational platform. Students will be able to open coding assignments, write code in an integrated editor, run code to see output and errors, submit solutions, and receive automated feedback with test case results. The system must execute code in a secure, sandboxed environment and support both public (visible) and hidden test cases for comprehensive assessment.

## Glossary

- **Code_Runner_Service**: Backend service responsible for executing user-submitted code in sandboxed Docker containers
- **Assignment_Model**: Database model representing a coding assignment with test cases, starter code, and configuration
- **Test_Case**: A single input-output pair used to validate student code, can be public (visible) or hidden (not exposed to frontend)
- **Submission_Service**: Backend service that evaluates student code against test cases and generates feedback
- **Code_Editor_Component**: Frontend component providing VS Code-like editing experience with Monaco editor
- **Terminal_Component**: Frontend component displaying code execution output (stdout, stderr, exit codes)
- **Ghostie**: The platform's mascot that provides visual feedback based on student performance
- **Sandbox_Container**: Ephemeral Docker container with resource limits used for secure code execution
- **Admin_Question_Editor**: Admin interface for creating and managing code_editor type questions
- **Student**: A user with the student role who completes coding assignments
- **Admin**: A user with administrative privileges who creates and manages assignments

## Requirements

### Requirement 1: Secure Code Execution API

**User Story:** As a student, I want to run my code safely, so that I can test my solution without security risks to the platform.

#### Acceptance Criteria

1. THE Code_Runner_Service SHALL expose a POST /api/v1/code/run endpoint
2. WHEN a code execution request is received, THE Code_Runner_Service SHALL execute the code in a Sandbox_Container
3. THE Sandbox_Container SHALL enforce a timeout limit specified in the request (default 5000ms, maximum 30000ms)
4. THE Sandbox_Container SHALL enforce a memory limit specified in the request (default 128MB, maximum 512MB)
5. THE Sandbox_Container SHALL enforce an output size limit of 10KB for stdout and stderr combined
6. WHEN code execution completes, THE Code_Runner_Service SHALL return stdout, stderr, exit_code, duration_ms, and timed_out flag
7. THE Sandbox_Container SHALL be ephemeral and destroyed immediately after execution
8. THE Code_Runner_Service SHALL NOT execute code directly on the host machine
9. WHEN a timeout occurs, THE Code_Runner_Service SHALL terminate the container and set timed_out to true
10. THE Code_Runner_Service SHALL require authentication via JWT token

### Requirement 2: Python Language Support

**User Story:** As a student, I want to write and run Python code, so that I can complete Python programming assignments.

#### Acceptance Criteria

1. THE Code_Runner_Service SHALL support Python 3.11+ code execution
2. WHEN Python code is submitted, THE Code_Runner_Service SHALL use a Python 3.11+ Docker image
3. THE Sandbox_Container SHALL include standard Python libraries (no external packages initially)
4. WHEN Python code produces output, THE Code_Runner_Service SHALL capture stdout and stderr separately
5. WHEN Python code raises an exception, THE Code_Runner_Service SHALL include the full traceback in stderr

### Requirement 3: Assignment Data Model

**User Story:** As an admin, I want to create coding assignments with test cases, so that students can be automatically evaluated.

#### Acceptance Criteria

1. THE Assignment_Model SHALL extend the existing Question model to support code_editor type
2. THE Assignment_Model SHALL store language (initially "python")
3. THE Assignment_Model SHALL store starter_code as text
4. THE Assignment_Model SHALL store test_cases as JSON array
5. THE Assignment_Model SHALL store assignment_instructions as text
6. THE Assignment_Model SHALL store max_runtime_ms as integer (default 5000)
7. THE Assignment_Model SHALL store memory_limit_mb as integer (default 128)
8. WHEN a Test_Case is created, THE Assignment_Model SHALL store input, expected_output, and is_hidden flag
9. THE Assignment_Model SHALL support multiple Test_Case entries per assignment
10. THE Assignment_Model SHALL maintain backward compatibility with existing question types

### Requirement 4: Code Submission and Evaluation API

**User Story:** As a student, I want to submit my code for grading, so that I can receive automated feedback on my solution.

#### Acceptance Criteria

1. THE Submission_Service SHALL expose a POST /api/v1/code/submit endpoint
2. WHEN a submission is received, THE Submission_Service SHALL retrieve all Test_Case entries for the assignment
3. FOR EACH Test_Case, THE Submission_Service SHALL execute the student code with the test input
4. WHEN all tests complete, THE Submission_Service SHALL calculate a score as (passed_tests / total_tests) * 100
5. THE Submission_Service SHALL return passed (boolean), score (integer), test_results (array), and feedback (string)
6. WHEN a Test_Case has is_hidden set to true, THE Submission_Service SHALL NOT include expected_output in the response
7. THE Submission_Service SHALL include test_name, passed, actual_output, and is_hidden for each test result
8. WHERE a Test_Case is public, THE Submission_Service SHALL include expected_output in the test result
9. THE Submission_Service SHALL require authentication via JWT token
10. WHEN all tests pass, THE Submission_Service SHALL award XP to the student

### Requirement 5: Web Code Editor Interface

**User Story:** As a student, I want a VS Code-like editor in the web app, so that I can write code comfortably with syntax highlighting.

#### Acceptance Criteria

1. THE Code_Editor_Component SHALL render a Monaco editor for code_editor type questions
2. THE Code_Editor_Component SHALL display assignment instructions in a left panel
3. THE Code_Editor_Component SHALL display the code editor in a center panel
4. THE Code_Editor_Component SHALL display a Terminal_Component in a bottom or right panel
5. THE Code_Editor_Component SHALL display Ghostie feedback in a top-right area
6. THE Code_Editor_Component SHALL provide Run, Submit, and Reset buttons
7. WHEN the Run button is clicked, THE Code_Editor_Component SHALL call /api/v1/code/run and display output in Terminal_Component
8. WHEN the Submit button is clicked, THE Code_Editor_Component SHALL call /api/v1/code/submit and display test results
9. WHEN the Reset button is clicked, THE Code_Editor_Component SHALL restore starter_code
10. THE Code_Editor_Component SHALL display loading, success, and error states appropriately
11. THE Code_Editor_Component SHALL integrate with the existing QuestionRouter for code_editor type

### Requirement 6: Web Terminal Output Display

**User Story:** As a student, I want to see my code's output and errors, so that I can debug my solution.

#### Acceptance Criteria

1. THE Terminal_Component SHALL display stdout in white text
2. THE Terminal_Component SHALL display stderr in red text
3. THE Terminal_Component SHALL display exit_code when non-zero
4. THE Terminal_Component SHALL display execution duration in milliseconds
5. WHEN a timeout occurs, THE Terminal_Component SHALL display "Execution timed out" message
6. THE Terminal_Component SHALL use monospace font
7. THE Terminal_Component SHALL support scrolling for long output

### Requirement 7: Mobile Code Assignment Interface

**User Story:** As a student, I want to complete coding assignments on mobile, so that I can learn on the go.

#### Acceptance Criteria

1. THE Code_Assignment_Widget SHALL provide a monospace text editor for code input
2. THE Code_Assignment_Widget SHALL display Run and Submit buttons
3. THE Code_Assignment_Widget SHALL display terminal output below the editor
4. THE Code_Assignment_Widget SHALL display test results after submission
5. THE Code_Assignment_Widget SHALL display Ghostie reaction based on results
6. THE Code_Assignment_Widget SHALL handle keyboard visibility without layout overflow
7. THE Code_Assignment_Widget SHALL integrate with the existing lesson flow

### Requirement 8: Admin Assignment Creation Interface

**User Story:** As an admin, I want to create code_editor questions, so that I can add coding assignments to lessons.

#### Acceptance Criteria

1. THE Admin_Question_Editor SHALL support creating code_editor type questions
2. THE Admin_Question_Editor SHALL provide fields for language selection (initially Python only)
3. THE Admin_Question_Editor SHALL provide a text area for starter_code
4. THE Admin_Question_Editor SHALL provide a text area for assignment_instructions
5. THE Admin_Question_Editor SHALL provide a test case editor with input, expected_output, and is_hidden checkbox
6. THE Admin_Question_Editor SHALL allow adding multiple Test_Case entries
7. THE Admin_Question_Editor SHALL allow removing Test_Case entries
8. THE Admin_Question_Editor SHALL provide fields for max_runtime_ms and memory_limit_mb
9. THE Admin_Question_Editor SHALL validate that at least one Test_Case exists before saving
10. THE Admin_Question_Editor SHALL maintain the existing admin question creation workflow

### Requirement 9: Seed Coding Assignments

**User Story:** As a developer, I want sample coding assignments in the database, so that the feature can be demonstrated and tested.

#### Acceptance Criteria

1. THE Seed_Script SHALL create at least 5 Python coding assignments
2. THE Seed_Script SHALL create a "Hello Coderun" assignment with print statement validation
3. THE Seed_Script SHALL create a "Sum Two Numbers" assignment with function parameter testing
4. THE Seed_Script SHALL create a "Count Even Numbers" assignment with list processing
5. THE Seed_Script SHALL create a "Reverse String" assignment with string manipulation
6. THE Seed_Script SHALL create a "FizzBuzz Mini" assignment with conditional logic
7. FOR EACH assignment, THE Seed_Script SHALL include both public and hidden Test_Case entries
8. FOR EACH assignment, THE Seed_Script SHALL include appropriate starter_code
9. FOR EACH assignment, THE Seed_Script SHALL include Ghostie-compatible feedback messages
10. THE Seed_Script SHALL add assignments to the Python learning path

### Requirement 10: Ghostie Visual Feedback Integration

**User Story:** As a student, I want to see Ghostie react to my code results, so that I receive engaging visual feedback.

#### Acceptance Criteria

1. THE Code_Editor_Component SHALL display Ghostie in idle state while editing
2. WHEN code is running, THE Code_Editor_Component SHALL display Ghostie in thinking state
3. WHEN code execution fails with errors, THE Code_Editor_Component SHALL display Ghostie in sad_wrong or angry state
4. WHEN all tests pass, THE Code_Editor_Component SHALL display Ghostie in success or very_happy state
5. THE Code_Editor_Component SHALL use only existing Ghostie assets
6. THE Code_Assignment_Widget SHALL display Ghostie states using existing mobile assets
7. THE Ghostie state transitions SHALL be smooth and non-disruptive

### Requirement 11: Security and Resource Limits

**User Story:** As a platform administrator, I want code execution to be secure and resource-limited, so that the platform remains stable and protected.

#### Acceptance Criteria

1. THE Code_Runner_Service SHALL NOT execute code on the host machine
2. THE Sandbox_Container SHALL have no network access
3. THE Sandbox_Container SHALL have no access to host filesystem
4. THE Sandbox_Container SHALL enforce CPU limits (1 CPU core maximum)
5. THE Sandbox_Container SHALL enforce memory limits as specified in the request
6. THE Sandbox_Container SHALL enforce execution timeout as specified in the request
7. WHEN output exceeds 10KB, THE Code_Runner_Service SHALL truncate output and append "... (output truncated)"
8. THE Code_Runner_Service SHALL log all execution requests with user_id and timestamp
9. THE Submission_Service SHALL NOT expose expected_output for hidden Test_Case entries
10. THE Code_Runner_Service SHALL require valid JWT authentication for all endpoints

### Requirement 12: Backward Compatibility

**User Story:** As a developer, I want existing features to remain functional, so that the new feature does not break the platform.

#### Acceptance Criteria

1. THE Assignment_Model SHALL NOT modify existing question type behavior
2. THE Code_Editor_Component SHALL NOT interfere with existing question components
3. THE QuestionRouter SHALL route code_editor type to Code_Editor_Component
4. THE QuestionRouter SHALL continue routing existing types to their respective components
5. THE Admin_Question_Editor SHALL NOT break existing question type creation
6. THE Lesson_Service SHALL continue to function for all existing lesson types
7. THE Authentication_Flow SHALL remain unchanged
8. THE Registration_Flow SHALL remain unchanged
9. THE Gamification_System SHALL continue to award XP for all lesson types
10. THE Mobile_Lesson_Flow SHALL continue to function for all existing question types

### Requirement 13: Database Migration

**User Story:** As a developer, I want a database migration for the new fields, so that the Assignment_Model can be deployed safely.

#### Acceptance Criteria

1. THE Migration_Script SHALL add language column to questions table (nullable, default "python")
2. THE Migration_Script SHALL add starter_code column to questions table (nullable, text type)
3. THE Migration_Script SHALL add test_cases column to questions table (nullable, JSON type)
4. THE Migration_Script SHALL add assignment_instructions column to questions table (nullable, text type)
5. THE Migration_Script SHALL add max_runtime_ms column to questions table (nullable, integer, default 5000)
6. THE Migration_Script SHALL add memory_limit_mb column to questions table (nullable, integer, default 128)
7. THE Migration_Script SHALL be reversible (downgrade support)
8. THE Migration_Script SHALL NOT modify existing question data
9. THE Migration_Script SHALL pass alembic check command
10. THE Migration_Script SHALL be tested on a copy of production data structure

### Requirement 14: Quality Assurance and Testing

**User Story:** As a developer, I want comprehensive testing, so that the feature is reliable and maintainable.

#### Acceptance Criteria

1. THE Backend_Tests SHALL include unit tests for Code_Runner_Service
2. THE Backend_Tests SHALL include unit tests for Submission_Service
3. THE Backend_Tests SHALL include integration tests for /api/v1/code/run endpoint
4. THE Backend_Tests SHALL include integration tests for /api/v1/code/submit endpoint
5. THE Backend_Tests SHALL verify timeout enforcement
6. THE Backend_Tests SHALL verify memory limit enforcement
7. THE Backend_Tests SHALL verify output truncation
8. THE Backend_Tests SHALL verify hidden test case output protection
9. THE Web_Tests SHALL verify Code_Editor_Component rendering
10. THE Web_Tests SHALL verify Terminal_Component output display
11. THE Mobile_Tests SHALL verify Code_Assignment_Widget functionality
12. THE Backend_Code SHALL pass compileall validation
13. THE Backend_Code SHALL pass alembic heads validation
14. THE Web_Code SHALL pass lint and build checks
15. THE Mobile_Code SHALL pass flutter analyze and build_runner checks

### Requirement 15: Feature Branch Workflow

**User Story:** As a developer, I want to work on a feature branch, so that the develop branch remains stable during implementation.

#### Acceptance Criteria

1. THE Feature_Implementation SHALL be developed on a feature/code-runner-assignments branch
2. THE Feature_Branch SHALL be created from the develop branch
3. THE Feature_Branch SHALL NOT be merged to develop until all quality checks pass
4. THE Feature_Branch SHALL NOT be force-pushed or have history rewritten
5. THE Feature_Branch SHALL include multiple review passes before merge
6. THE Merge_Request SHALL include a description of all changes
7. THE Merge_Request SHALL reference this requirements document
8. THE Merge_Request SHALL include test results and validation evidence
9. THE Merge_Request SHALL be reviewed by at least one other developer
10. THE Merge_Request SHALL only merge to develop, never directly to main
