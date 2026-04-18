import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../../data/models/question_model.dart';
import '../../../providers/placement_provider.dart';
import '../../widgets/app_error_widget.dart';
import '../../widgets/loading_widget.dart';

enum _PlacementPhase { intro, test, result }

class PlacementScreen extends ConsumerStatefulWidget {
  final String moduleSlug;

  const PlacementScreen({super.key, required this.moduleSlug});

  @override
  ConsumerState<PlacementScreen> createState() => _PlacementScreenState();
}

class _PlacementScreenState extends ConsumerState<PlacementScreen> {
  _PlacementPhase _phase = _PlacementPhase.intro;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Seviye Testi'),
        centerTitle: true,
      ),
      body: switch (_phase) {
        _PlacementPhase.intro => _IntroPhase(
            moduleSlug: widget.moduleSlug,
            onStartTest: () => setState(() => _phase = _PlacementPhase.test),
            onStartFromBeginning: () => context.go('/home/learn/${widget.moduleSlug}'),
          ),
        _PlacementPhase.test => _TestPhase(
            moduleSlug: widget.moduleSlug,
            onComplete: () => setState(() => _phase = _PlacementPhase.result),
          ),
        _PlacementPhase.result => _ResultPhase(
            moduleSlug: widget.moduleSlug,
          ),
      },
    );
  }
}

// ─── Intro ───────────────────────────────────────────────────────────────────

class _IntroPhase extends StatelessWidget {
  final String moduleSlug;
  final VoidCallback onStartTest;
  final VoidCallback onStartFromBeginning;

  const _IntroPhase({
    required this.moduleSlug,
    required this.onStartTest,
    required this.onStartFromBeginning,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(24),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Text('🎯', style: TextStyle(fontSize: 72)),
          const SizedBox(height: 24),
          Text(
            moduleSlug.replaceAll('-', ' ').toUpperCase(),
            style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 16),
          const Text(
            'Seviye testini geçerek zaten bildiğin konuları atlayabilirsin. '
            'Test 15 sorudan oluşur ve yaklaşık 10 dakika sürer.',
            style: TextStyle(fontSize: 15, color: AppColors.grey),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 40),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton.icon(
              style: ElevatedButton.styleFrom(
                padding: const EdgeInsets.symmetric(vertical: 16),
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12)),
              ),
              icon: const Icon(Icons.quiz),
              label: const Text('Seviye Testi Yap',
                  style: TextStyle(fontSize: 16)),
              onPressed: onStartTest,
            ),
          ),
          const SizedBox(height: 12),
          SizedBox(
            width: double.infinity,
            child: OutlinedButton.icon(
              style: OutlinedButton.styleFrom(
                padding: const EdgeInsets.symmetric(vertical: 16),
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12)),
              ),
              icon: const Icon(Icons.play_arrow),
              label: const Text('Baştan Başla', style: TextStyle(fontSize: 16)),
              onPressed: onStartFromBeginning,
            ),
          ),
        ],
      ),
    );
  }
}

// ─── Test ─────────────────────────────────────────────────────────────────────

class _TestPhase extends ConsumerWidget {
  final String moduleSlug;
  final VoidCallback onComplete;

  const _TestPhase({required this.moduleSlug, required this.onComplete});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final questionsAsync = ref.watch(placementQuestionsProvider(moduleSlug));
    final placementState = ref.watch(placementNotifierProvider(moduleSlug));
    final notifier = ref.read(placementNotifierProvider(moduleSlug).notifier);

    return questionsAsync.when(
      data: (test) {
        final questions = test.questions;
        final total = questions.length;
        final currentIndex = placementState.currentQuestionIndex;

        if (currentIndex >= total) {
          // Tüm sorular cevaplandı, submit et
          WidgetsBinding.instance.addPostFrameCallback((_) async {
            await notifier.submitTest(moduleSlug, questions);
            onComplete();
          });
          return const LoadingWidget(message: 'Sonuçlar hesaplanıyor...');
        }

        final question = questions[currentIndex];
        final isLast = currentIndex == total - 1;
        final selectedAnswer = placementState.answers[question.id];

        return Column(
          children: [
            // Progress
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Soru ${currentIndex + 1} / $total',
                        style: const TextStyle(
                            fontWeight: FontWeight.w600, fontSize: 14),
                      ),
                      Text(
                        '%${((currentIndex / total) * 100).round()}',
                        style: const TextStyle(
                            color: AppColors.primary, fontSize: 14),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  LinearProgressIndicator(
                    value: currentIndex / total,
                    backgroundColor: Colors.grey[200],
                    valueColor:
                        const AlwaysStoppedAnimation<Color>(AppColors.primary),
                    minHeight: 6,
                    borderRadius: BorderRadius.circular(3),
                  ),
                ],
              ),
            ),

            // Soru içeriği
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      question.questionText,
                      style: const TextStyle(
                          fontSize: 17, fontWeight: FontWeight.w600),
                    ),
                    const SizedBox(height: 20),
                    _buildOptions(question, selectedAnswer, notifier),
                  ],
                ),
              ),
            ),

            // Butonlar
            Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () {
                        notifier.skipQuestion(question.id);
                        notifier.nextQuestion();
                      },
                      child: const Text('Atla'),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    flex: 2,
                    child: ElevatedButton(
                      onPressed: selectedAnswer != null
                          ? () {
                              if (isLast) {
                                notifier.nextQuestion();
                              } else {
                                notifier.nextQuestion();
                              }
                            }
                          : null,
                      child: Text(isLast ? 'Testi Bitir' : 'İleri'),
                    ),
                  ),
                ],
              ),
            ),
          ],
        );
      },
      loading: () => const LoadingWidget(message: 'Sorular yükleniyor...'),
      error: (e, _) => AppErrorWidget(message: e.toString()),
    );
  }

  Widget _buildOptions(
    QuestionModel question,
    String? selectedAnswer,
    PlacementNotifier notifier,
  ) {
    final options = question.options;
    if (options == null || options.isEmpty) {
      return TextField(
        decoration: const InputDecoration(
          hintText: 'Cevabınızı yazın...',
          border: OutlineInputBorder(),
        ),
        onChanged: (val) => notifier.answerQuestion(question.id, val),
      );
    }

    return Column(
      children: options.entries.map((entry) {
        final isSelected = selectedAnswer == entry.key;
        return GestureDetector(
          onTap: () => notifier.answerQuestion(question.id, entry.key),
          child: Container(
            width: double.infinity,
            margin: const EdgeInsets.only(bottom: 10),
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
            decoration: BoxDecoration(
              color: isSelected
                  ? AppColors.primary.withValues(alpha: 0.1)
                  : Colors.white,
              borderRadius: BorderRadius.circular(10),
              border: Border.all(
                color: isSelected ? AppColors.primary : Colors.grey[300]!,
                width: isSelected ? 2 : 1,
              ),
            ),
            child: Text(
              entry.value.toString(),
              style: TextStyle(
                fontSize: 15,
                color: isSelected ? AppColors.primary : Colors.black87,
                fontWeight:
                    isSelected ? FontWeight.w600 : FontWeight.normal,
              ),
            ),
          ),
        );
      }).toList(),
    );
  }
}

// ─── Result ───────────────────────────────────────────────────────────────────

class _ResultPhase extends ConsumerWidget {
  final String moduleSlug;

  const _ResultPhase({required this.moduleSlug});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final placementState = ref.watch(placementNotifierProvider(moduleSlug));

    if (placementState.isSubmitting) {
      return const LoadingWidget(message: 'Sonuçlar hesaplanıyor...');
    }

    if (placementState.errorMessage != null) {
      return AppErrorWidget(
        message: placementState.errorMessage!,
        onRetry: () =>
            ref.read(placementNotifierProvider(moduleSlug).notifier).reset(),
      );
    }

    final result = placementState.result;
    if (result == null) {
      return const LoadingWidget(message: 'Yükleniyor...');
    }

    return Padding(
      padding: const EdgeInsets.all(24),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          AnimatedContainer(
            duration: const Duration(milliseconds: 600),
            width: 140,
            height: 140,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: _getScoreColor(result.percentage).withValues(alpha: 0.15),
              border: Border.all(
                color: _getScoreColor(result.percentage),
                width: 3,
              ),
            ),
            child: Center(
              child: Text(
                '%${result.percentage.round()}',
                style: TextStyle(
                  fontSize: 36,
                  fontWeight: FontWeight.bold,
                  color: _getScoreColor(result.percentage),
                ),
              ),
            ),
          ),
          const SizedBox(height: 24),
          Text(
            '${result.correctCount} / ${result.totalCount} Doğru',
            style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 16),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.grey[100],
              borderRadius: BorderRadius.circular(12),
            ),
            child: Text(
              result.message,
              style: const TextStyle(fontSize: 15, color: AppColors.greyDark),
              textAlign: TextAlign.center,
            ),
          ),
          if (result.skippedLessons > 0) ...[
            const SizedBox(height: 12),
            Text(
              '${result.skippedLessons} ders atlandı 🚀',
              style: const TextStyle(
                  fontSize: 14,
                  color: AppColors.success,
                  fontWeight: FontWeight.w600),
            ),
          ],
          const SizedBox(height: 40),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              style: ElevatedButton.styleFrom(
                padding: const EdgeInsets.symmetric(vertical: 16),
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12)),
              ),
              onPressed: () => context.go('/home/learn/$moduleSlug'),
              child: const Text('Öğrenmeye Başla',
                  style: TextStyle(fontSize: 16)),
            ),
          ),
        ],
      ),
    );
  }

  Color _getScoreColor(double percentage) {
    if (percentage >= 70) return AppColors.success;
    if (percentage >= 40) return AppColors.xpGold;
    return AppColors.error;
  }
}
