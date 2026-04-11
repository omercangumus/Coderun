import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../../data/models/question_model.dart';
import '../../../providers/lesson_provider.dart';
import '../../widgets/loading_widget.dart';
import '../../widgets/app_error_widget.dart';
import 'widgets/multiple_choice_widget.dart';
import 'widgets/code_completion_widget.dart';
import 'widgets/mini_project_widget.dart';
import 'widgets/question_progress_indicator.dart';

class LessonScreen extends ConsumerStatefulWidget {
  final String lessonId;
  final String moduleSlug;

  const LessonScreen({
    super.key,
    required this.lessonId,
    required this.moduleSlug,
  });

  @override
  ConsumerState<LessonScreen> createState() => _LessonScreenState();
}

class _LessonScreenState extends ConsumerState<LessonScreen> {
  @override
  Widget build(BuildContext context) {
    final lessonAsync = ref.watch(lessonDetailProvider(widget.lessonId));
    final lessonState = ref.watch(lessonNotifierProvider(widget.lessonId));
    final notifier =
        ref.read(lessonNotifierProvider(widget.lessonId).notifier);

    // Result gelince sonuç ekranına geç
    if (lessonState.result != null) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (mounted) {
          context.push(
            '/home/learn/${widget.moduleSlug}/lesson/${widget.lessonId}/result',
            extra: lessonState.result,
          );
        }
      });
    }

    return lessonAsync.when(
      data: (lesson) {
        final questions = lesson.questions;
        final currentIndex = lessonState.currentQuestionIndex;
        final currentQuestion =
            questions.isNotEmpty ? questions[currentIndex] : null;
        final currentAnswer = currentQuestion != null
            ? lessonState.answers[currentQuestion.id]
            : null;
        final isLastQuestion = currentIndex == questions.length - 1;
        final hasAnswer =
            currentAnswer != null && currentAnswer.isNotEmpty;

        final answeredStatus = questions
            .map((q) =>
                lessonState.answers.containsKey(q.id) &&
                lessonState.answers[q.id]!.isNotEmpty)
            .toList();

        return Scaffold(
          appBar: AppBar(
            leading: IconButton(
              icon: const Icon(Icons.close),
              onPressed: () => _showExitDialog(context),
            ),
            title: Text(
              'Soru ${currentIndex + 1} / ${questions.length}',
              style: const TextStyle(fontSize: 16),
            ),
            bottom: PreferredSize(
              preferredSize: const Size.fromHeight(28),
              child: Padding(
                padding: const EdgeInsets.fromLTRB(16, 0, 16, 8),
                child: QuestionProgressIndicator(
                  current: currentIndex + 1,
                  total: questions.length,
                  answeredStatus: answeredStatus,
                ),
              ),
            ),
          ),
          body: currentQuestion == null
              ? const Center(child: Text('Bu derste soru bulunamadı.'))
              : Padding(
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    children: [
                      Expanded(
                        child: SingleChildScrollView(
                          child: _buildQuestionWidget(
                            currentQuestion.questionType,
                            currentQuestion,
                            currentAnswer,
                            notifier,
                          ),
                        ),
                      ),
                      const SizedBox(height: 16),
                      if (lessonState.errorMessage != null)
                        Padding(
                          padding: const EdgeInsets.only(bottom: 8),
                          child: Text(
                            lessonState.errorMessage!,
                            style:
                                const TextStyle(color: AppColors.error),
                            textAlign: TextAlign.center,
                          ),
                        ),
                      Row(
                        children: [
                          if (currentIndex > 0)
                            IconButton(
                              onPressed: notifier.previousQuestion,
                              icon:
                                  const Icon(Icons.arrow_back_ios),
                              color: AppColors.primary,
                            ),
                          const Spacer(),
                          if (isLastQuestion)
                            ElevatedButton(
                              onPressed: hasAnswer &&
                                      !lessonState.isSubmitting
                                  ? () => notifier.submitLesson()
                                  : null,
                              child: lessonState.isSubmitting
                                  ? const SizedBox(
                                      width: 20,
                                      height: 20,
                                      child: CircularProgressIndicator(
                                        strokeWidth: 2,
                                        color: Colors.white,
                                      ),
                                    )
                                  : const Text('Tamamla'),
                            )
                          else
                            ElevatedButton(
                              onPressed: hasAnswer
                                  ? notifier.nextQuestion
                                  : null,
                              child: const Text('Sonraki'),
                            ),
                        ],
                      ),
                    ],
                  ),
                ),
        );
      },
      loading: () => Scaffold(
        appBar: AppBar(title: const Text('Yükleniyor...')),
        body: const LoadingWidget(message: 'Ders yükleniyor...'),
      ),
      error: (e, _) => Scaffold(
        appBar: AppBar(title: const Text('Hata')),
        body: AppErrorWidget(
          message: e.toString(),
          onRetry: () =>
              ref.invalidate(lessonDetailProvider(widget.lessonId)),
        ),
      ),
    );
  }

  Widget _buildQuestionWidget(
    String type,
    QuestionModel question,
    String? currentAnswer,
    LessonNotifier notifier,
  ) {
    switch (type) {
      case 'multiple_choice':
        return MultipleChoiceWidget(
          question: question,
          selectedAnswer: currentAnswer,
          onAnswerSelected: (answer) =>
              notifier.answerQuestion(question.id, answer),
        );
      case 'code_completion':
        return CodeCompletionWidget(
          question: question,
          currentAnswer: currentAnswer,
          onAnswerChanged: (answer) =>
              notifier.answerQuestion(question.id, answer),
        );
      case 'mini_project':
        return MiniProjectWidget(
          question: question,
          currentAnswer: currentAnswer,
          onAnswerChanged: (answer) =>
              notifier.answerQuestion(question.id, answer),
        );
      default:
        return MultipleChoiceWidget(
          question: question,
          selectedAnswer: currentAnswer,
          onAnswerSelected: (answer) =>
              notifier.answerQuestion(question.id, answer),
        );
    }
  }

  Future<void> _showExitDialog(BuildContext context) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Dersten çık'),
        content: const Text(
          'Dersten çıkmak istediğinizden emin misiniz?\nİlerlemeniz kaydedilmeyecek.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(false),
            child: const Text('İptal'),
          ),
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(true),
            style:
                TextButton.styleFrom(foregroundColor: AppColors.error),
            child: const Text('Çıkış'),
          ),
        ],
      ),
    );
    if (confirmed == true && mounted) {
      context.pop();
    }
  }
}
