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

class _CodeAssignmentWidgetState extends ConsumerState<CodeAssignmentWidget>
    with SingleTickerProviderStateMixin {
  late final TextEditingController _controller;
  late final TabController _tabController;
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
    _tabController = TabController(length: 4, vsync: this);
    _tabController.addListener(() {
      if (mounted) setState(() {});
    });
    _controller = TextEditingController(
      text: (widget.currentAnswer != null && widget.currentAnswer!.isNotEmpty)
          ? widget.currentAnswer
          : _starterCode,
    );
  }

  @override
  void dispose() {
    _tabController.dispose();
    _controller.dispose();
    super.dispose();
  }

  void _goToOutputTab() {
    if (_tabController.index != 2) {
      _tabController.animateTo(2);
    }
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
          success: (data) {
            _runResult = data;
            _goToOutputTab();
          },
          error: (msg, _) {
            _errorMessage = msg;
            _goToOutputTab();
          },
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
          success: (data) {
            _submitResult = data;
            if (data.passed) {
              widget.onAnswerChanged('__code_editor__');
            }
            _goToOutputTab();
          },
          error: (msg, _) {
            _errorMessage = msg;
            _goToOutputTab();
          },
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
    if (_editorState == _EditorState.running) return 'Kodun çalıştırılıyor...';
    if (_editorState == _EditorState.submitting) {
      return 'Test senaryoları değerlendiriliyor...';
    }
    if (_submitResult != null) return _submitResult!.feedback;
    if (_runResult != null) {
      if (_runResult!.timedOut) return 'Zaman aşımı! Sonsuz döngü var mı?';
      if (_runResult!.stderr.isNotEmpty && _runResult!.exitCode != 0) {
        return 'Bir hata oluştu. Kodu kontrol et!';
      }
      if (_runResult!.exitCode == 0) return 'Kod başarıyla çalıştı!';
    }
    return 'Kodunu yaz ve Çalıştır\'a bas.';
  }

  // ---------------------------------------------------------------------------
  // Build
  // ---------------------------------------------------------------------------

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final bottomInset = MediaQuery.viewInsetsOf(context).bottom;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Material(
          color: theme.colorScheme.surfaceContainerHighest.withValues(alpha: 0.5),
          child: TabBar(
            controller: _tabController,
            labelStyle: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600),
            unselectedLabelStyle: const TextStyle(fontSize: 12),
            tabs: const [
              Tab(text: 'Soru'),
              Tab(text: 'Kod'),
              Tab(text: 'Çıktı'),
              Tab(text: 'Mentor'),
            ],
          ),
        ),
        Expanded(
          child: TabBarView(
            controller: _tabController,
            children: [
              _buildSoruTab(),
              _buildKodTab(bottomInset),
              _buildCiktiTab(),
              _buildMentorTab(),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildSoruTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
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
                    children: const [
                      Icon(Icons.assignment_outlined,
                          size: 16, color: AppColors.primary),
                      SizedBox(width: 6),
                      Text(
                        'Görev',
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
                    style: const TextStyle(fontSize: 14, height: 1.5),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 12),
          ],
          Row(
            children: [
              Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: Colors.blue.withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(6),
                  border: Border.all(color: Colors.blue.withValues(alpha: 0.3)),
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
            ],
          ),
          const SizedBox(height: 10),
          Text(
            widget.question.questionText,
            style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600, height: 1.4),
          ),
        ],
      ),
    );
  }

  Widget _buildKodTab(double bottomInset) {
    final isLoading = _editorState != _EditorState.idle;

    return Padding(
      padding: EdgeInsets.fromLTRB(12, 8, 12, 8 + bottomInset),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Expanded(
            child: Container(
              decoration: BoxDecoration(
                color: const Color(0xFF1E1E1E),
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: Colors.grey.shade800),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: const Color(0xFF252526),
                      borderRadius: const BorderRadius.only(
                        topLeft: Radius.circular(10),
                        topRight: Radius.circular(10),
                      ),
                      border: Border(bottom: BorderSide(color: Colors.grey.shade800)),
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
                  Expanded(
                    child: SingleChildScrollView(
                      padding: const EdgeInsets.all(4),
                      child: TextField(
                        controller: _controller,
                        onChanged: widget.onAnswerChanged,
                        maxLines: null,
                        keyboardType: TextInputType.multiline,
                        textInputAction: TextInputAction.newline,
                        style: const TextStyle(
                          fontFamily: 'monospace',
                          fontSize: 13,
                          color: Colors.white,
                          height: 1.5,
                        ),
                        decoration: const InputDecoration(
                          contentPadding: EdgeInsets.all(12),
                          border: InputBorder.none,
                          hintText: '# Kodunu buraya yaz...',
                          hintStyle: TextStyle(
                            color: Colors.grey,
                            fontFamily: 'monospace',
                          ),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 10),
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
                      : const Icon(Icons.play_arrow, size: 18),
                  label: const Text('Çalıştır'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.green.shade700,
                    foregroundColor: Colors.white,
                    minimumSize: const Size(0, 44),
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
                      : const Icon(Icons.check, size: 18),
                  label: const Text('Gönder'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    foregroundColor: Colors.white,
                    minimumSize: const Size(0, 44),
                  ),
                ),
              ),
              IconButton(
                onPressed: isLoading ? null : _handleReset,
                icon: const Icon(Icons.refresh),
                tooltip: 'Sıfırla',
                style: IconButton.styleFrom(
                  minimumSize: const Size(44, 44),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildCiktiTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          if (_errorMessage != null)
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: Colors.red.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: Colors.red.withValues(alpha: 0.3)),
              ),
              child: Text(
                '⚠ $_errorMessage',
                style: const TextStyle(color: Colors.red, fontSize: 13),
              ),
            ),
          if (_runResult != null) ...[
            if (_errorMessage != null) const SizedBox(height: 8),
            _TerminalCard(result: _runResult!),
          ],
          if (_submitResult != null) ...[
            const SizedBox(height: 8),
            _SubmitSummaryCard(result: _submitResult!),
            const SizedBox(height: 8),
            _TestResultsList(results: _submitResult!.testResults),
          ],
          if (_runResult == null &&
              _submitResult == null &&
              _errorMessage == null)
            Center(
              child: Padding(
                padding: const EdgeInsets.symmetric(vertical: 48),
                child: Text(
                  'Henüz çıktı yok.\nKod sekmesinden Çalıştır veya Gönder\'e bas.',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    color: Theme.of(context).colorScheme.onSurfaceVariant,
                    height: 1.4,
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildMentorTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        children: [
          const SizedBox(height: 16),
          GhostieReaction(
            state: _ghostieState,
            message: _ghostieMessage,
            size: 120,
            preferAnimation: _tabController.index == 3,
          ),
          const SizedBox(height: 20),
          Text(
            _ghostieMessage ?? 'Kodunu yaz ve Çalıştır\'a bas.',
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 15,
              height: 1.45,
              color: Theme.of(context).colorScheme.onSurface,
            ),
          ),
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
                '⏱ Zaman aşımı',
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
              '(çıktı yok)',
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
                  ? 'Tüm testler geçti!'
                  : 'Bazı testler başarısız',
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
