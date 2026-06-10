import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../../data/models/question_model.dart';
import '../../../providers/lesson_provider.dart';
import '../../../providers/mentor_provider.dart';
import '../../widgets/loading_widget.dart';
import '../../widgets/app_error_widget.dart';
import '../../widgets/app_brand_icon.dart';
import 'widgets/multiple_choice_widget.dart';
import 'widgets/code_completion_widget.dart';
import 'widgets/mini_project_widget.dart';
import 'widgets/code_assignment_widget.dart';
import 'widgets/fill_in_blank_widget.dart';
import 'widgets/reorder_widget.dart';
import 'widgets/spot_the_bug_widget.dart';
import 'widgets/multi_select_widget.dart';
import 'widgets/true_false_reason_widget.dart';
import 'widgets/reinforcement_card_widget.dart';
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
  bool _navigatedToResult = false;

  @override
  Widget build(BuildContext context) {
    ref.listen(lessonNotifierProvider(widget.lessonId), (previous, next) {
      if (next.result == null || _navigatedToResult) return;
      _navigatedToResult = true;
      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (!mounted) return;
        context.push(
          '/home/learn/${widget.moduleSlug}/lesson/${widget.lessonId}/result',
          extra: next.result,
        );
      });
    });

    ref.listen<PendingMentorSuggestion?>(pendingMentorSuggestionProvider,
        (previous, next) {
      if (next == null || next.lessonId != widget.lessonId || !mounted) return;

      ref.read(lessonNotifierProvider(widget.lessonId).notifier).answerQuestion(
            next.questionId,
            next.suggestion,
          );
      ref.read(pendingMentorSuggestionProvider.notifier).state = null;

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Ghostie önerisi cevap kutusuna yazıldı')),
      );
    });
    final lessonAsync = ref.watch(lessonDetailProvider(widget.lessonId));
    final lessonState = ref.watch(lessonNotifierProvider(widget.lessonId));
    final notifier =
        ref.read(lessonNotifierProvider(widget.lessonId).notifier);

    return lessonAsync.when(
      data: (lesson) {
        final questions = lesson.questions;
        final currentIndex = lessonState.currentQuestionIndex;
        final currentQuestion =
            questions.isNotEmpty && currentIndex < questions.length
                ? questions[currentIndex]
                : null;
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

        // Pekiştirme sorusu varsa göster
        if (lessonState.reinforcementQuestion != null) {
          return Scaffold(
            appBar: AppBar(
              leading: IconButton(
                icon: const Icon(Icons.close),
                onPressed: () => _showExitDialog(),
              ),
              title: const Text('Pekiştirme Sorusu'),
            ),
            body: SingleChildScrollView(
              padding: const EdgeInsets.all(20),
              child: Column(
                children: [
                  ReinforcementCardWidget(
                    questionText: lessonState.reinforcementQuestion!.questionText,
                    questionType: lessonState.reinforcementQuestion!.questionType,
                    options: lessonState.reinforcementQuestion!.options,
                    hint: lessonState.reinforcementQuestion!.hint,
                    onAnswer: (answer) {
                      notifier.dismissReinforcement();
                      // Sonraki soruya geç veya dersi tamamla
                      if (isLastQuestion) {
                        notifier.submitLesson();
                      } else {
                        notifier.nextQuestion();
                      }
                    },
                  ),
                ],
              ),
            ),
          );
        }

        return Scaffold(
          appBar: AppBar(
            leading: IconButton(
              icon: const Icon(Icons.close),
              onPressed: () => _showExitDialog(),
            ),
            title: Text(
              'Soru ${currentIndex + 1} / ${questions.length}',
              style: const TextStyle(fontSize: 16),
            ),
            actions: [
              // Ghostie AI Mentor butonu
              IconButton(
                icon: const AppBrandIcon(size: 24, borderRadius: 12),
                tooltip: 'Ghostie AI Mentor',
                onPressed: () => context.push('/mentor', extra: {
                  'moduleSlug': widget.moduleSlug,
                  'lessonTitle': lesson.title,
                  'lessonId': widget.lessonId,
                  if (currentQuestion != null) ...{
                    'questionText': currentQuestion.questionText,
                    'questionType': currentQuestion.questionType,
                    'questionId': currentQuestion.id,
                    if (currentQuestion.codeBlock != null)
                      'codeBlock': currentQuestion.codeBlock,
                  },
                  'context': 'lesson',
                }),
              ),
            ],
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
                        child: currentQuestion.questionType == 'code_editor'
                            ? _buildQuestionWidget(
                                currentQuestion.questionType,
                                currentQuestion,
                                currentAnswer,
                                notifier,
                              )
                            : SingleChildScrollView(
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
    void onAnswer(String answer) => notifier.answerQuestion(question.id, answer);

    switch (type) {
      case 'multiple_choice':
        return MultipleChoiceWidget(
          question: question,
          selectedAnswer: currentAnswer,
          onAnswerSelected: onAnswer,
        );

      case 'code_completion':
        return CodeCompletionWidget(
          question: question,
          currentAnswer: currentAnswer,
          onAnswerChanged: onAnswer,
        );

      case 'code_editor':
        return CodeAssignmentWidget(
          question: question,
          currentAnswer: currentAnswer,
          onAnswerChanged: onAnswer,
        );

      case 'mini_project':
        return MiniProjectWidget(
          question: question,
          currentAnswer: currentAnswer,
          onAnswerChanged: onAnswer,
        );

      case 'fill_in_blank': {
        final codeBlock = question.codeBlock ?? '';
        final wordBankList = question.wordBank != null
            ? List<String>.from(question.wordBank!['words'] ?? [])
            : <String>[];
        return FillInBlankWidget(
          questionText: question.questionText,
          codeBlock: codeBlock,
          wordBank: wordBankList,
          hint: question.hint,
          onAnswer: onAnswer,
        );
      }

      case 'reorder': {
        final items = question.options != null
            ? List<String>.from(question.options!['items'] ?? [])
            : <String>[];
        return ReorderWidget(
          questionText: question.questionText,
          items: items,
          hint: question.hint,
          onAnswer: onAnswer,
        );
      }

      case 'spot_the_bug': {
        final codeBlock = question.codeBlock ?? '';
        final fixOptions = question.options != null
            ? List<String>.from(question.options!['fix_options'] ?? [])
            : <String>[];
        return SpotTheBugWidget(
          questionText: question.questionText,
          codeBlock: codeBlock,
          fixOptions: fixOptions,
          hint: question.hint,
          onAnswer: onAnswer,
        );
      }

      case 'multi_select': {
        final choices = question.options != null
            ? List<String>.from(question.options!['choices'] ?? [])
            : <String>[];
        return MultiSelectWidget(
          questionText: question.questionText,
          choices: choices,
          hint: question.hint,
          onAnswer: onAnswer,
        );
      }

      case 'true_false_reason': {
        final reasons = question.options != null
            ? List<String>.from(question.options!['reasons'] ?? [])
            : <String>[];
        return TrueFalseReasonWidget(
          questionText: question.questionText,
          reasons: reasons,
          hint: question.hint,
          onAnswer: onAnswer,
        );
      }

      default:
        // Bilinmeyen tip için multiple_choice fallback
        return MultipleChoiceWidget(
          question: question,
          selectedAnswer: currentAnswer,
          onAnswerSelected: onAnswer,
        );
    }
  }

  Future<void> _showExitDialog() async {
    final navigator = Navigator.of(context);
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
      navigator.pop();
    }
  }
}
