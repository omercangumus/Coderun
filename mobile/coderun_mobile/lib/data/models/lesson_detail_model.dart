import 'package:freezed_annotation/freezed_annotation.dart';
import 'question_model.dart';

part 'lesson_detail_model.freezed.dart';
part 'lesson_detail_model.g.dart';

@freezed
class LessonDetailModel with _$LessonDetailModel {
  const factory LessonDetailModel({
    required String id,
    @JsonKey(name: 'module_id') required String moduleId,
    required String title,
    @JsonKey(name: 'lesson_type') required String lessonType,
    required int order,
    @JsonKey(name: 'xp_reward') required int xpReward,
    @JsonKey(name: 'is_active') required bool isActive,
    @Default([]) List<QuestionModel> questions,
  }) = _LessonDetailModel;

  factory LessonDetailModel.fromJson(Map<String, dynamic> json) =>
      _$LessonDetailModelFromJson(json);
}
