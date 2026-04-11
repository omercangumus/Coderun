import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../core/network/api_exception.dart';
import '../data/models/answer_model.dart';
import '../data/models/lesson_detail_model.dart';
import '../data/models/lesson_result_model.dart';
import '../data/repositories/module_repository.dart';
import 'providers.dart';

/// Ders detayı provider (lessonId ile).
final lessonDetailProvider =
    FutureProvider.family<LessonDetailModel, String>((ref, lessonId) async {
  final repository = ref.watch(moduleRepositoryProvider);
  final response = await repository.getLessonDetail(lessonId);
  return response.when(
    success: (data) => data,
    error: (message, _) => throw ApiException(message: message),
    loading: () =>
        throw const ApiException(message: 'Beklenmedik yükleme durumu'),
  );
});

/// Ders ekranı state — immutable, manuel copyWith.
class LessonState {
  final int currentQuestionIndex;
  final Map<String, String> answers;
  final bool isSubmitting;
  final LessonResultModel? result;
  final String? errorMessage;

  const LessonState({
    this.currentQuestionIndex = 0,
    this.answers = const {},
    this.isSubmitting = false,
    this.result,
    this.errorMessage,
  });

  LessonState copyWith({
    int? currentQuestionIndex,
    Map<String, String>? answers,
    bool? isSubmitting,
    LessonResultModel? result,
    String? errorMessage,
    bool clearResult = false,
    bool clearError = false,
  }) {
    return LessonState(
      currentQuestionIndex:
          currentQuestionIndex ?? this.currentQuestionIndex,
      answers: answers ?? this.answers,
      isSubmitting: isSubmitting ?? this.isSubmitting,
      result: clearResult ? null : (result ?? this.result),
      errorMessage:
          clearError ? null : (errorMessage ?? this.errorMessage),
    );
  }
}

/// Ders ekranı state notifier.
class LessonNotifier extends StateNotifier<LessonState> {
  final ModuleRepository _repository;
  final String lessonId;

  LessonNotifier(this._repository, this.lessonId)
      : super(const LessonState());

  void answerQuestion(String questionId, String answer) {
    state = state.copyWith(
      answers: {...state.answers, questionId: answer},
      clearError: true,
    );
  }

  void nextQuestion() {
    state = state.copyWith(
      currentQuestionIndex: state.currentQuestionIndex + 1,
    );
  }

  void previousQuestion() {
    if (state.currentQuestionIndex > 0) {
      state = state.copyWith(
        currentQuestionIndex: state.currentQuestionIndex - 1,
      );
    }
  }

  Future<void> submitLesson() async {
    state = state.copyWith(isSubmitting: true, clearError: true);

    final answers = state.answers.entries
        .map((e) => AnswerSubmitModel(questionId: e.key, answer: e.value))
        .toList();

    final response = await _repository.submitLesson(lessonId, answers);

    response.when(
      success: (result) {
        state = state.copyWith(isSubmitting: false, result: result);
      },
      error: (message, _) {
        state = state.copyWith(
            isSubmitting: false, errorMessage: message);
      },
      loading: () {
        state = state.copyWith(isSubmitting: false);
      },
    );
  }

  void reset() {
    state = const LessonState();
  }
}

final lessonNotifierProvider = StateNotifierProvider.family<LessonNotifier,
    LessonState, String>((ref, lessonId) {
  final repository = ref.watch(moduleRepositoryProvider);
  return LessonNotifier(repository, lessonId);
});
