import 'package:freezed_annotation/freezed_annotation.dart';
import 'badge_model.dart';

part 'lesson_result_model.freezed.dart';
part 'lesson_result_model.g.dart';

@freezed
class LessonResultModel with _$LessonResultModel {
  const factory LessonResultModel({
    @JsonKey(name: 'lesson_id') required String lessonId,
    required int score,
    @JsonKey(name: 'correct_count') required int correctCount,
    @JsonKey(name: 'wrong_count') required int wrongCount,
    @JsonKey(name: 'xp_earned') required int xpEarned,
    @JsonKey(name: 'is_completed') required bool isCompleted,
    required String message,
    @JsonKey(name: 'level_up') @Default(false) bool levelUp,
    @JsonKey(name: 'new_level') @Default(1) int newLevel,
    @JsonKey(name: 'new_streak') @Default(0) int newStreak,
    @JsonKey(name: 'badges_earned') @Default([]) List<BadgeModel> badgesEarned,
  }) = _LessonResultModel;

  factory LessonResultModel.fromJson(Map<String, dynamic> json) =>
      _$LessonResultModelFromJson(json);
}
