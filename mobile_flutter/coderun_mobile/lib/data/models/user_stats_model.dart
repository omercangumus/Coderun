import 'package:freezed_annotation/freezed_annotation.dart';
import 'badge_model.dart';
import 'level_progress_model.dart';
import 'streak_model.dart';

part 'user_stats_model.freezed.dart';
part 'user_stats_model.g.dart';

@freezed
class UserStatsModel with _$UserStatsModel {
  const factory UserStatsModel({
    @JsonKey(name: 'total_xp') required int totalXp,
    required int level,
    required int streak,
    @JsonKey(name: 'total_lessons_completed') required int totalLessonsCompleted,
    @JsonKey(name: 'total_modules_completed') required int totalModulesCompleted,
    required List<BadgeModel> badges,
    @JsonKey(name: 'level_progress') required LevelProgressModel levelProgress,
    @JsonKey(name: 'streak_info') required StreakModel streakInfo,
  }) = _UserStatsModel;

  factory UserStatsModel.fromJson(Map<String, dynamic> json) =>
      _$UserStatsModelFromJson(json);
}
