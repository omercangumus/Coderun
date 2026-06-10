import 'package:freezed_annotation/freezed_annotation.dart';
import 'question_model.dart';

part 'placement_model.freezed.dart';
part 'placement_model.g.dart';

@freezed
class PlacementTestModel with _$PlacementTestModel {
  const factory PlacementTestModel({
    @JsonKey(name: 'module_id') required String moduleId,
    @JsonKey(name: 'module_title') required String moduleTitle,
    required List<QuestionModel> questions,
    @JsonKey(name: 'total_questions') required int totalQuestions,
  }) = _PlacementTestModel;

  factory PlacementTestModel.fromJson(Map<String, dynamic> json) =>
      _$PlacementTestModelFromJson(json);
}

@freezed
class PlacementResultModel with _$PlacementResultModel {
  const factory PlacementResultModel({
    @JsonKey(name: 'correct_count') required int correctCount,
    @JsonKey(name: 'total_count') required int totalCount,
    required double percentage,
    @JsonKey(name: 'starting_lesson_order') required int startingLessonOrder,
    @JsonKey(name: 'skipped_lessons') required int skippedLessons,
    required String message,
  }) = _PlacementResultModel;

  factory PlacementResultModel.fromJson(Map<String, dynamic> json) =>
      _$PlacementResultModelFromJson(json);
}
