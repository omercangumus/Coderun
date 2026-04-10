import 'package:freezed_annotation/freezed_annotation.dart';

part 'lesson_model.freezed.dart';
part 'lesson_model.g.dart';

@freezed
class LessonModel with _$LessonModel {
  const factory LessonModel({
    required String id,
    @JsonKey(name: 'module_id') required String moduleId,
    required String title,
    @JsonKey(name: 'lesson_type') required String lessonType,
    required int order,
    @JsonKey(name: 'xp_reward') required int xpReward,
    @JsonKey(name: 'is_active') required bool isActive,
    @JsonKey(name: 'is_completed') @Default(false) bool isCompleted,
    @JsonKey(name: 'is_locked') @Default(false) bool isLocked,
    int? score,
    @JsonKey(name: 'attempt_count') @Default(0) int attemptCount,
  }) = _LessonModel;

  factory LessonModel.fromJson(Map<String, dynamic> json) =>
      _$LessonModelFromJson(json);
}
