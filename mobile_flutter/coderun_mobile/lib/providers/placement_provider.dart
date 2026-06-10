import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:freezed_annotation/freezed_annotation.dart';
import '../data/datasources/placement_remote_datasource.dart';
import '../data/models/answer_model.dart';
import '../data/models/placement_model.dart';
import '../data/models/question_model.dart';
import 'providers.dart';

part 'placement_provider.freezed.dart';

@freezed
class PlacementState with _$PlacementState {
  const factory PlacementState({
    @Default(0) int currentQuestionIndex,
    @Default({}) Map<String, String> answers,
    @Default(false) bool isSubmitting,
    PlacementResultModel? result,
    String? errorMessage,
  }) = _PlacementState;
}

class PlacementNotifier extends StateNotifier<PlacementState> {
  final PlacementRemoteDataSource _dataSource;

  PlacementNotifier(this._dataSource, String moduleSlug)
      : super(const PlacementState());

  void answerQuestion(String questionId, String answer) {
    state = state.copyWith(
      answers: {...state.answers, questionId: answer},
    );
  }

  void skipQuestion(String questionId) {
    answerQuestion(questionId, '');
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

  Future<void> submitTest(
    String moduleSlug,
    List<QuestionModel> questions,
  ) async {
    state = state.copyWith(isSubmitting: true, errorMessage: null);
    try {
      final answerList = questions
          .map((q) => AnswerSubmitModel(
                questionId: q.id,
                answer: state.answers[q.id] ?? '',
              ))
          .toList();

      final result = await _dataSource.submitPlacementTest(
        moduleSlug,
        answerList,
      );
      state = state.copyWith(isSubmitting: false, result: result);
    } catch (e) {
      state = state.copyWith(
        isSubmitting: false,
        errorMessage: e.toString(),
      );
    }
  }

  void reset() {
    state = const PlacementState();
  }
}

final placementNotifierProvider = StateNotifierProvider.family<
    PlacementNotifier, PlacementState, String>(
  (ref, moduleSlug) => PlacementNotifier(
    ref.watch(placementDataSourceProvider),
    moduleSlug,
  ),
);

final placementQuestionsProvider =
    FutureProvider.family<PlacementTestModel, String>((ref, moduleSlug) async {
  final dataSource = ref.watch(placementDataSourceProvider);
  return dataSource.getPlacementQuestions(moduleSlug);
});
