// Coderun mobile — kod odevi widget'i.
// code_editor tipi sorular icin VS Code benzeri deneyim.

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/assets/ghostie_assets.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../data/models/code_run_result_model.dart';
import '../../../../data/models/question_model.dart';
import '../../../../providers/providers.dart';
import '../../../widgets/ghostie_reaction.dart';

// ---------------------------------------------------------------------------
// State enum
// ---------------------------------------------------------------------------

enum _EditorState { idle, running, submitting }

// ---------------------------------------------------------------------------
// Main widget
// ---------------------------------------------------------------------------

class CodeAssignmentWidget extends ConsumerStatefulWidget {
  final QuestionModel question;
  final String? currentAnswer;
  final void Function(String) onAnswerChanged;

  const CodeAssignmentWidget({
    super.key,
    required this.question,
    required this.currentAnswer,
    required this.onAnswerChanged,
  });

  @override
  ConsumerState<CodeAssignmentWidget> createState() =>
      _CodeAssignmentWidgetState();
}

class _CodeAssignmentWidgetState extends ConsumerState<CodeAssignmentWidget> {
  late final TextEditingController _controller;
  _EditorState _editorState = _EditorState.idle;
  CodeRunResultModel? _runResult;
  CodeSubmitResultModel? _submitResult;
  String? _errorMessage;

  String get _starterCode =>
      widget.question.starterCode ?? '# Buraya kodunuzu yazin\n';

  String get _language => widget.question.language ?? 'python';

  @override
  void initState() {
    super.initState();
    _controller = TextEditingController(
      text: (widget.currentAnswer != null && widget.currentAnswer!.isNotEmpty)
          ? widget.currentAnswer
          : _starterCode,
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  // ---------------------------------------------------------------------------
  // Actions
  // ---------------------------------------------------------------------------

  Future<void> _handleRun() async {
    if (_editorState != _EditorState.idle) return;
    setState(() {
      _editorState = _EditorState.running;
      _runResult = null;
      _submitResult = null;
      _errorMessage = null;
    });

    final repo = ref.read(codeRunnerRepositoryProvider);
    final response = await repo.runCode(
      language: _language,
      code: _controller.text,
      timeoutMs: widget.question.maxRuntimeMs ?? 5000,
      memoryLimitMb: widget.question.memoryLimitMb ?? 128,
    );

    if (mounted) {
      setState(() {
        _editorState = _EditorState.idle;
        response.when(
          success: (data) => _runResult = data,
          error: (msg, _) => _errorMessage = msg,
          loading: () {},
        );
      });
    }
  }

  Future<void> _handleSubmit() async {
    if (_editorState != _EditorState.idle) return;
    setState(() {
      _editorState = _EditorState.submitting;
      _runResult = null;
      _submitResult = null;
      _errorMessage = null;
    });

    final repo = ref.read(codeRunnerRepositoryProvider);
    final response = await repo.submitCode(
      questionId: widget.question.id,
      code: _controller.text,
      language: _language,
    );

    if (mounted) {
      setState(() {
        _editorState = _EditorState.idle;
        response.when(
          success: (data) => _submitResult = data,
          error: (msg, _) => _errorMessage = msg,
          loading: () {},
        );
      });
    }
  }

  void _handleReset() {
    setState(() {
      _controller.text = _starterCode;
      _runResult = null;
      _submitResult = null;
      _errorMessage = null;
    });
    widget.onAnswerChanged(_starterCode);
  }

  // ---------------------------------------------------------------------------
  // Ghostie state
  // ---------------------------------------------------------------------------

  GhostieState get _ghostieState {
    if (_editorState == _EditorState.running ||
        _editorState == _EditorState.submitting) {
      return GhostieState.thinking;
    }
    if (_submitResult != null) {
      return _submitResult!.passed ? GhostieState.veryHappy : GhostieState.wrong;
    }
    if (_runResult != null) {
      if (_runResult!.timedOut) return GhostieState.angry;
      if (_runResult!.stderr.isNotEmpty && _runResult!.exitCode != 0) {
        return GhostieState.wrong;
      }
    }
    return GhostieState.idle;
  }

  String? get _ghostieMessage {
    if (_editorState == _EditorState.running) return 'Kodun calistiriliyor...';
    if (_editorState == _EditorState.submitting) {
      return 'Test senaryolari degerlendirilyor...';
    }
    if (_submitResult != null) return _submitResult!.feedback;
    if (_runResult != null) {
      if (_runResult!.timedOut) return 'Zaman asimi! Sonsuz dongu var mi?';
      if (_runResult!.stderr.isNotEmpty && _runResult!.exitCode != 0) {
        return 'Bir hata olustu. Kodu kontrol et!';
      }
      if (_runResult!.exitCode == 0) return 'Kod basariyla calisti!';
    }
    return 'Kodunu yaz ve calistir!';
  }

  // ---------------------------------------------------------------------------
  // Build
  // ---------------------------------------------------------------------------

  @override
  Widget build(BuildContext context) {
    final isLoading = _editorState != _EditorState.idle;

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Instructions card
          if (widget.question.assignmentInstructions != null) ...[
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: AppColors.primary.withValues(alpha: 0.08),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: AppColors.primary.withValues(alpha: 0.2),
                ),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Icon(Icons.assignment_outlined,
                          size: 16, color: AppColors.primary),
                      const SizedBox(width: 6),
                      Text(
                        'Gorev',
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w700,
                          color: AppColors.primary,
                          letterSpacing: 0.5,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text(
                    widget.question.assignmentInstructions!,
                    style: const TextStyle(fontSize: 13, height: 1.5),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 12),
          ],

          // Language badge + title
          Row(
            children: [
              Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: Colors.blue.withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(6),
                  border: Border.all(
                      color: Colors.blue.withValues(alpha: 0.3)),
                ),
                child: Text(
                  '🐍 ${_language.toUpperCase()}',
                  style: const TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w700,
                    color: Colors.blue,
                    fontFamily: 'monospace',
                  ),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  widget.question.questionText,
                  style: const TextStyle(
                      fontSize: 15, fontWeight: FontWeight.w600),
                  overflow: TextOverflow.ellipsis,
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),

          // Code editor
          Container(
            decoration: BoxDecoration(
              color: const Color(0xFF1E1E1E),
              borderRadius: BorderRadius.circular(10),
              border: Border.all(color: Colors.grey.shade800),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Editor header bar
                Container(
                  padding: const EdgeInsets.symmetric(
                      horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: const Color(0xFF252526),
                    borderRadius: const BorderRadius.only(
                      topLeft: Radius.circular(10),
                      topRight: Radius.circular(10),
                    ),
                    border: Border(
                        bottom: BorderSide(color: Colors.grey.shade800)),
                  ),
                  child: Row(
                    children: [
                      _dot(Colors.red.shade400),
                      const SizedBox(width: 5),
                      _dot(Colors.yellow.shade400),
                      const SizedBox(width: 5),
                      _dot(Colors.green.shade400),
                      const SizedBox(width: 10),
                      const Text(
                        'solution.py',
                        style: TextStyle(
                          fontSize: 11,
                          color: Colors.grey,
                          fontFamily: 'monospace',
                        ),
                      ),
                    ],
                  ),
                ),
                // TextField
                TextField(
                  controller: _controller,
                  onChanged: widget.onAnswerChanged,
                  maxLines: null,
                  minLines: 10,
                  style: const TextStyle(
                    fontFamily: 'monospace',
                    fontSize: 13,
                    color: Colors.white,
                    height: 1.5,
                  ),
                  decoration: const InputDecoration(
                    contentPadding: EdgeInsets.all(12),
                    border: InputBorder.none,
                    hintText: '# Kodunuzu buraya yazin...',
                    hintStyle: TextStyle(
                      color: Colors.grey,
                      fontFamily: 'monospace',
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 10),

          // Action buttons
          Row(
            children: [
              Expanded(
                child: ElevatedButton.icon(
                  onPressed: isLoading ? null : _handleRun,
                  icon: isLoading && _editorState == _EditorState.running
                      ? const SizedBox(
                          width: 14,
                          height: 14,
                          child: CircularProgressIndicator(
                              strokeWidth: 2, color: Colors.white),
                        )
                      : const Icon(Icons.play_arrow, size: 16),
                  label: const Text('Calistir'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.green.shade700,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 10),
                  ),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: ElevatedButton.icon(
                  onPressed: isLoading ? null : _handleSubmit,
                  icon: isLoading && _editorState == _EditorState.submitting
                      ? const SizedBox(
                          width: 14,
                          height: 14,
                          child: CircularProgressIndicator(
                              strokeWidth: 2, color: Colors.white),
                        )
                      : const Icon(Icons.check, size: 16),
                  label: const Text('Gonder'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 10),
                  ),
                ),
              ),
              const SizedBox(width: 8),
              OutlinedButton.icon(
                onPressed: isLoading ? null : _handleReset,
                icon: const Icon(Icons.refresh, size: 16),
                label: const Text('Sifirla'),
                style: OutlinedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(
                      vertical: 10, horizontal: 12),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),

          // Error banner
          if (_errorMessage != null)
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: Colors.red.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(8),
                border: Border.all(
                    color: Colors.red.withValues(alpha: 0.3)),
              ),
              child: Text(
                '⚠ $_errorMessage',
                style: const TextStyle(color: Colors.red, fontSize: 13),
              ),
            ),

          // Terminal output
          if (_runResult != null) ...[
            const SizedBox(height: 4),
            _TerminalCard(result: _runResult!),
          ],

          // Submit result summary + test list
          if (_submitResult != null) ...[
            const SizedBox(height: 8),
            _SubmitSummaryCard(result: _submitResult!),
            const SizedBox(height: 8),
            _TestResultsList(results: _submitResult!.testResults),
          ],

          // Ghostie
          const SizedBox(height: 16),
          GhostieReaction(
            state: _ghostieState,
            message: _ghostieMessage,
            size: 72,
          ),
          const SizedBox(height: 16),
        ],
      ),
    );
  }

  Widget _dot(Color color) => Container(
        width: 10,
        height: 10,
        decoration: BoxDecoration(color: color, shape: BoxShape.circle),
      );
}

// ---------------------------------------------------------------------------
// Terminal card
// ---------------------------------------------------------------------------

class _TerminalCard extends StatelessWidget {
  final CodeRunResultModel result;
  const _TerminalCard({required this.result});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(
        color: const Color(0xFF0D1117),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: Colors.grey.shade800),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Text(
                'Terminal',
                style: TextStyle(
                  fontSize: 11,
                  color: Colors.grey,
                  fontFamily: 'monospace',
                ),
              ),
              const Spacer(),
              Text(
                'exit: ${result.exitCode} · ${result.durationMs}ms',
                style: TextStyle(
                  fontSize: 11,
                  color: result.exitCode == 0
                      ? Colors.green.shade400
                      : Colors.red.shade400,
                  fontFamily: 'monospace',
                ),
              ),
            ],
          ),
          if (result.timedOut) ...[
            const SizedBox(height: 6),
            Container(
              padding:
                  const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(
                color: Colors.orange.withValues(alpha: 0.15),
                borderRadius: BorderRadius.circular(4),
                border: Border.all(
                    color: Colors.orange.withValues(alpha: 0.4)),
              ),
              child: const Text(
                '⏱ Zaman asimi',
                style: TextStyle(color: Colors.orange, fontSize: 12),
              ),
            ),
          ],
          if (result.stdout.isNotEmpty) ...[
            const SizedBox(height: 6),
            Text(
              result.stdout,
              style: const TextStyle(
                fontFamily: 'monospace',
                fontSize: 12,
                color: Colors.white,
              ),
            ),
          ],
          if (result.stderr.isNotEmpty) ...[
            const SizedBox(height: 4),
            Text(
              result.stderr,
              style: TextStyle(
                fontFamily: 'monospace',
                fontSize: 12,
                color: Colors.red.shade400,
              ),
            ),
          ],
          if (result.stdout.isEmpty && result.stderr.isEmpty)
            const Text(
              '(cikti yok)',
              style: TextStyle(color: Colors.grey, fontSize: 12),
            ),
        ],
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// Submit summary card
// ---------------------------------------------------------------------------

class _SubmitSummaryCard extends StatelessWidget {
  final CodeSubmitResultModel result;
  const _SubmitSummaryCard({required this.result});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: result.passed
            ? Colors.green.withValues(alpha: 0.1)
            : Colors.red.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(10),
        border: Border.all(
          color: result.passed
              ? Colors.green.withValues(alpha: 0.3)
              : Colors.red.withValues(alpha: 0.3),
        ),
      ),
      child: Row(
        children: [
          Text(
            '${result.score}%',
            style: TextStyle(
              fontSize: 28,
              fontWeight: FontWeight.bold,
              color: result.passed ? Colors.green : Colors.red,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              result.passed
                  ? 'Tum testler gecti!'
                  : 'Bazi testler basarisiz',
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w600,
                color: result.passed ? Colors.green : Colors.red,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// Test results list
// ---------------------------------------------------------------------------

class _TestResultsList extends StatelessWidget {
  final List<TestCaseResultModel> results;
  const _TestResultsList({required this.results});

  @override
  Widget build(BuildContext context) {
    if (results.isEmpty) return const SizedBox.shrink();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'TEST SONUCLARI',
          style: TextStyle(
            fontSize: 11,
            fontWeight: FontWeight.w700,
            color: Colors.grey,
            letterSpacing: 0.8,
          ),
        ),
        const SizedBox(height: 6),
        ...results.map((r) => _TestResultRow(result: r)),
      ],
    );
  }
}

class _TestResultRow extends StatelessWidget {
  final TestCaseResultModel result;
  const _TestResultRow({required this.result});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 6),
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
      decoration: BoxDecoration(
        color: result.passed
            ? Colors.green.withValues(alpha: 0.08)
            : Colors.red.withValues(alpha: 0.08),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(
          color: result.passed
              ? Colors.green.withValues(alpha: 0.25)
              : Colors.red.withValues(alpha: 0.25),
        ),
      ),
      child: Row(
        children: [
          Icon(
            result.passed ? Icons.check_circle : Icons.cancel,
            size: 16,
            color: result.passed ? Colors.green : Colors.red,
          ),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              result.name,
              style: TextStyle(
                fontSize: 13,
                color: result.passed ? Colors.green : Colors.red,
              ),
            ),
          ),
          if (result.hidden)
            Container(
              padding:
                  const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
              decoration: BoxDecoration(
                color: Colors.grey.withValues(alpha: 0.2),
                borderRadius: BorderRadius.circular(4),
              ),
              child: const Text(
                'gizli',
                style: TextStyle(fontSize: 10, color: Colors.grey),
              ),
            ),
          const SizedBox(width: 6),
          Text(
            '${result.durationMs}ms',
            style: const TextStyle(fontSize: 11, color: Colors.grey),
          ),
        ],
      ),
    );
  }
}
