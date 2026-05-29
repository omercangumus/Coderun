'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, Trash2, Eye, Send } from 'lucide-react';

const QUESTION_TYPES = [
  { value: 'multiple_choice', label: 'Multiple Choice' },
  { value: 'fill_in_blank', label: 'Fill in the Blank' },
  { value: 'reorder', label: 'Reorder' },
  { value: 'true_false_reason', label: 'True / False with Reason' },
  { value: 'spot_the_bug', label: 'Spot the Bug' },
  { value: 'multi_select', label: 'Multi Select' },
  { value: 'code_completion', label: 'Code Completion' },
  { value: 'code_editor', label: 'Code Editor' },
];

export default function QuestionEditorPage() {
  const [questionType, setQuestionType] = useState('spot_the_bug');
  const [questionText, setQuestionText] = useState(
    'Find the logical error in the discount calculation loop.'
  );
  const [codeBlock, setCodeBlock] = useState(
    'def calculate_total(prices):\n    total = 0\n    for price in prices:\n        total -= price  # Bug: should be +=\n    return total'
  );
  const [hint, setHint] = useState(
    "Check how the variable 'total' is being accumulated inside the loop."
  );
  const [explanation, setExplanation] = useState(
    'The loop subtracts the price instead of adding it. Changing `-=` to `+=` correctly accumulates the total sum.'
  );
  const [reinforcementEnabled, setReinforcementEnabled] = useState(true);
  const [reinforcementPrompt, setReinforcementPrompt] = useState(
    'Why does the `-=` operator cause an issue in a sum calculation?'
  );
  const [reinforcementAnswer, setReinforcementAnswer] = useState(
    'It subtracts the value instead of adding it to the total.'
  );

  // Code assignment fields (code_editor type)
  const [assignmentInstructions, setAssignmentInstructions] = useState('');
  const [starterCode, setStarterCode] = useState('# Write your solution here\n');
  const [maxRuntimeMs, setMaxRuntimeMs] = useState(5000);
  const [memoryLimitMb, setMemoryLimitMb] = useState(128);
  const [testCases, setTestCases] = useState<
    Array<{ name: string; stdin: string; expectedStdout: string; hidden: boolean }>
  >([{ name: 'Basic test', stdin: '', expectedStdout: '', hidden: false }]);
  const [testCaseError, setTestCaseError] = useState<string | null>(null);

  const addTestCase = () => {
    setTestCases((prev) => [
      ...prev,
      { name: `Test ${prev.length + 1}`, stdin: '', expectedStdout: '', hidden: false },
    ]);
    setTestCaseError(null);
  };

  const removeTestCase = (index: number) => {
    setTestCases((prev) => prev.filter((_, i) => i !== index));
  };

  const updateTestCase = (
    index: number,
    field: 'name' | 'stdin' | 'expectedStdout' | 'hidden',
    value: string | boolean
  ) => {
    setTestCases((prev) =>
      prev.map((tc, i) => (i === index ? { ...tc, [field]: value } : tc))
    );
  };

  const handleSave = () => {
    if (questionType === 'code_editor' && testCases.length === 0) {
      setTestCaseError('At least one test case is required for code assignments.');
      return;
    }
    setTestCaseError(null);
    // Save logic would go here
  };

  const typeLabel =
    QUESTION_TYPES.find((t) => t.value === questionType)?.label || questionType;

  return (
    <div className="animate-fade-in">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-outline-variant">
        <Link
          href="/admin/lessons"
          className="flex items-center gap-2 text-body-md text-on-surface-variant hover:text-primary transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Questions
        </Link>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 text-body-sm text-on-surface-variant hover:text-on-surface transition-colors">
            Discard
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-on font-semibold text-button-sm hover:shadow-primary transition-all">
            <Save size={16} />
            Save Draft
          </button>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-body-sm mb-4">
        <Link href="/admin" className="text-primary hover:underline">Admin</Link>
        <span className="text-on-surface-variant">›</span>
        <Link href="/admin/paths" className="text-primary hover:underline">Python Path</Link>
        <span className="text-on-surface-variant">›</span>
        <span className="text-on-surface-variant">Unit 3</span>
        <span className="text-on-surface-variant">›</span>
        <span className="text-on-surface-variant">Lesson 5</span>
        <span className="text-on-surface-variant">›</span>
        <span className="text-on-surface">Edit Question 4</span>
      </div>

      {/* Title + Type Badge */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-h2 font-heading text-on-surface">
          Edit {typeLabel} Question
        </h1>
        <span className="px-4 py-2 rounded-full bg-surface-container-highest text-on-surface-variant text-label-sm font-semibold">
          ⚙ Type: {typeLabel}
        </span>
      </div>

      {/* Question Content Card */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-8 space-y-6 mb-6">
        <h2 className="text-h4 font-heading text-on-surface border-b border-outline-variant pb-3">
          Question Content
        </h2>

        {/* Question Type */}
        <div>
          <label className="text-label-caps text-on-surface-variant uppercase tracking-wider block mb-2">
            Question Type
          </label>
          <select
            value={questionType}
            onChange={(e) => setQuestionType(e.target.value)}
            className="w-full p-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface focus:border-primary focus:outline-none transition-colors"
          >
            {QUESTION_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Question Prompt */}
        <div>
          <label className="text-label-caps text-on-surface-variant uppercase tracking-wider block mb-2">
            Question Prompt
          </label>
          <textarea
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            rows={3}
            className="w-full p-3 rounded-lg border border-outline-variant bg-surface-container text-on-surface focus:border-primary focus:outline-none transition-colors resize-y"
          />
        </div>

        {/* Code Block (conditional) */}
        {['spot_the_bug', 'code_completion', 'code_editor', 'fill_in_blank'].includes(
          questionType
        ) && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-label-caps text-on-surface-variant uppercase tracking-wider">
                Code Snippet ({typeLabel})
              </label>
              <button className="text-label-sm text-primary hover:underline">
                ▲ Format Python
              </button>
            </div>
            <div className="rounded-lg border border-outline-variant overflow-hidden">
              <div className="bg-inverse-surface px-4 py-2 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-error/60" />
                <div className="w-3 h-3 rounded-full bg-xp-gold/60" />
                <div className="w-3 h-3 rounded-full bg-secondary/60" />
              </div>
              <textarea
                value={codeBlock}
                onChange={(e) => setCodeBlock(e.target.value)}
                rows={6}
                className="w-full p-4 font-mono text-body-sm bg-surface-container-highest text-on-surface focus:outline-none resize-y"
              />
            </div>
            {questionType === 'spot_the_bug' && (
              <p className="text-body-sm text-on-surface-variant mt-2">
                Students will be able to click on line numbers to select the bug location.
              </p>
            )}
          </div>
        )}

        {/* Hint + Explanation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-label-caps text-on-surface-variant uppercase tracking-wider block mb-2">
              Hint Text (Optional)
            </label>
            <textarea
              value={hint}
              onChange={(e) => setHint(e.target.value)}
              rows={3}
              className="w-full p-3 rounded-lg border border-outline-variant bg-surface-container text-on-surface focus:border-primary focus:outline-none transition-colors resize-y"
            />
          </div>
          <div>
            <label className="text-label-caps text-on-surface-variant uppercase tracking-wider block mb-2">
              Explanation (After Completion)
            </label>
            <textarea
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              rows={3}
              className="w-full p-3 rounded-lg border border-outline-variant bg-surface-container text-on-surface focus:border-primary focus:outline-none transition-colors resize-y"
            />
          </div>
        </div>

        {/* Code Assignment Fields — only for code_editor */}
        {questionType === 'code_editor' && (
          <div className="space-y-6 pt-4 border-t border-outline-variant">
            <h3 className="text-h4 font-heading text-on-surface flex items-center gap-2">
              🐍 Code Assignment Settings
            </h3>

            {/* Language + Runtime + Memory */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-label-caps text-on-surface-variant uppercase tracking-wider block mb-2">
                  Language
                </label>
                <select
                  disabled
                  className="w-full p-3 rounded-lg border border-outline-variant bg-surface-container text-on-surface opacity-70 cursor-not-allowed"
                >
                  <option value="python">Python 3.11</option>
                </select>
                <p className="text-xs text-on-surface-variant mt-1">Only Python supported in MVP</p>
              </div>
              <div>
                <label className="text-label-caps text-on-surface-variant uppercase tracking-wider block mb-2">
                  Max Runtime (ms)
                </label>
                <input
                  type="number"
                  value={maxRuntimeMs}
                  onChange={(e) => setMaxRuntimeMs(Number(e.target.value))}
                  min={1000}
                  max={30000}
                  step={1000}
                  className="w-full p-3 rounded-lg border border-outline-variant bg-surface-container text-on-surface focus:border-primary focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="text-label-caps text-on-surface-variant uppercase tracking-wider block mb-2">
                  Memory Limit (MB)
                </label>
                <input
                  type="number"
                  value={memoryLimitMb}
                  onChange={(e) => setMemoryLimitMb(Number(e.target.value))}
                  min={64}
                  max={512}
                  step={64}
                  className="w-full p-3 rounded-lg border border-outline-variant bg-surface-container text-on-surface focus:border-primary focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Assignment Instructions */}
            <div>
              <label className="text-label-caps text-on-surface-variant uppercase tracking-wider block mb-2">
                Assignment Instructions
              </label>
              <textarea
                value={assignmentInstructions}
                onChange={(e) => setAssignmentInstructions(e.target.value)}
                rows={4}
                placeholder="Describe the task clearly. Include input/output format if needed."
                className="w-full p-3 rounded-lg border border-outline-variant bg-surface-container text-on-surface focus:border-primary focus:outline-none transition-colors resize-y"
              />
            </div>

            {/* Starter Code */}
            <div>
              <label className="text-label-caps text-on-surface-variant uppercase tracking-wider block mb-2">
                Starter Code
              </label>
              <div className="rounded-lg border border-outline-variant overflow-hidden">
                <div className="bg-inverse-surface px-4 py-2 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-error/60" />
                  <div className="w-3 h-3 rounded-full bg-xp-gold/60" />
                  <div className="w-3 h-3 rounded-full bg-secondary/60" />
                  <span className="text-xs text-inverse-on-surface/60 ml-2 font-mono">solution.py</span>
                </div>
                <textarea
                  value={starterCode}
                  onChange={(e) => setStarterCode(e.target.value)}
                  rows={6}
                  className="w-full p-4 font-mono text-body-sm bg-surface-container-highest text-on-surface focus:outline-none resize-y"
                />
              </div>
            </div>

            {/* Test Cases */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-label-caps text-on-surface-variant uppercase tracking-wider">
                  Test Cases
                </label>
                <button
                  type="button"
                  onClick={addTestCase}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors"
                >
                  + Add Test Case
                </button>
              </div>

              {testCaseError && (
                <div className="mb-3 p-3 rounded-lg bg-error/10 border border-error/30 text-sm text-error">
                  {testCaseError}
                </div>
              )}

              <div className="space-y-3">
                {testCases.map((tc, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-xl border ${
                      tc.hidden
                        ? 'border-outline-variant bg-surface-container'
                        : 'border-outline-variant bg-surface-container-lowest'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <input
                        type="text"
                        value={tc.name}
                        onChange={(e) => updateTestCase(index, 'name', e.target.value)}
                        placeholder="Test name"
                        className="flex-1 p-2 rounded-lg border border-outline-variant bg-surface-container text-on-surface text-sm focus:border-primary focus:outline-none"
                      />
                      <label className="flex items-center gap-2 text-sm text-on-surface-variant cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={tc.hidden}
                          onChange={(e) => updateTestCase(index, 'hidden', e.target.checked)}
                          className="w-4 h-4 accent-primary"
                        />
                        Hidden
                      </label>
                      <button
                        type="button"
                        onClick={() => removeTestCase(index)}
                        className="text-error hover:text-error/70 text-sm font-medium transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-on-surface-variant block mb-1">
                          Input (stdin)
                        </label>
                        <textarea
                          value={tc.stdin}
                          onChange={(e) => updateTestCase(index, 'stdin', e.target.value)}
                          rows={2}
                          placeholder="Leave empty if no input needed"
                          className="w-full p-2 rounded-lg border border-outline-variant bg-surface-container text-on-surface text-sm font-mono focus:border-primary focus:outline-none resize-y"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-on-surface-variant block mb-1">
                          Expected Output (stdout)
                        </label>
                        <textarea
                          value={tc.expectedStdout}
                          onChange={(e) => updateTestCase(index, 'expectedStdout', e.target.value)}
                          rows={2}
                          placeholder="Exact expected output"
                          className="w-full p-2 rounded-lg border border-outline-variant bg-surface-container text-on-surface text-sm font-mono focus:border-primary focus:outline-none resize-y"
                        />
                      </div>
                    </div>
                    {tc.hidden && (
                      <p className="mt-2 text-xs text-on-surface-variant">
                        🔒 Hidden — students will see pass/fail only, not the expected output.
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Pro Tip */}
      <div className="bg-inverse-surface rounded-xl p-5 flex items-start gap-4 mb-6">
        <div className="w-10 h-10 rounded-full bg-tertiary flex items-center justify-center flex-shrink-0">
          <span className="text-lg">👻</span>
        </div>
        <div>
          <p className="text-body-md text-inverse-on-surface font-semibold">
            Pro Tip from Byte!
          </p>
          <p className="text-body-sm text-inverse-on-surface/80 mt-1">
            If the bug is tricky, adding an{' '}
            <span className="text-secondary-container font-semibold">
              Extra Reinforcement Question
            </span>{' '}
            helps cement the concept after they solve the main puzzle.
          </p>
        </div>
      </div>

      {/* Extra Reinforcement */}
      <div
        className={`rounded-xl border-2 p-6 mb-8 transition-colors ${
          reinforcementEnabled
            ? 'border-secondary bg-secondary-container/10'
            : 'border-outline-variant bg-surface-container-lowest'
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-h4 font-heading text-on-surface flex items-center gap-2">
              🔄 Extra Reinforcement
            </h3>
            <p className="text-body-sm text-on-surface-variant mt-1">
              Show a simpler follow-up question immediately after they spot the bug.
            </p>
          </div>
          <button
            onClick={() => setReinforcementEnabled(!reinforcementEnabled)}
            className={`w-12 h-7 rounded-full transition-colors relative ${
              reinforcementEnabled ? 'bg-secondary' : 'bg-outline-variant'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-surface-container-lowest absolute top-1 transition-transform ${
                reinforcementEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {reinforcementEnabled && (
          <div className="space-y-4 mt-4 animate-fade-in">
            <div>
              <label className="text-label-caps text-on-surface-variant uppercase tracking-wider block mb-2">
                Follow-up Prompt ⓘ
              </label>
              <textarea
                value={reinforcementPrompt}
                onChange={(e) => setReinforcementPrompt(e.target.value)}
                rows={2}
                className="w-full p-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface focus:border-secondary focus:outline-none transition-colors resize-y"
              />
            </div>
            <div>
              <label className="text-label-caps text-on-surface-variant uppercase tracking-wider block mb-2">
                Correct Answer (Exact Match)
              </label>
              <input
                type="text"
                value={reinforcementAnswer}
                onChange={(e) => setReinforcementAnswer(e.target.value)}
                className="w-full p-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface focus:border-secondary focus:outline-none transition-colors"
              />
            </div>
          </div>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="flex items-center justify-between pt-6 border-t border-outline-variant">
        <button className="flex items-center gap-2 text-body-md text-on-surface-variant hover:text-error transition-colors">
          <Trash2 size={16} />
          Delete Question
        </button>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-6 py-3 rounded-xl border border-outline-variant text-on-surface font-semibold hover:bg-surface-container transition-colors">
            <Eye size={16} />
            Preview
          </button>
          <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-on font-semibold hover:shadow-primary transition-all">
            <Send size={16} />
            Publish Changes
          </button>
        </div>
      </div>
    </div>
  );
}
