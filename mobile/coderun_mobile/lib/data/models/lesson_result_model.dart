// Ders sonuç modeli — XP, rozet, seviye bilgisi.
import 'package:json_annotation/json_annotation.dart';
import 'badge_model.dart';

part 'lesson_result_model.g.dart';

@JsonSerializable()
class LessonResultModel {
  @JsonKey(name: 'lesson_id')
  final String lessonId;
  final int score;
  @JsonKey(name: 'correct_count')
  final int correctCount;
  @JsonKey(name: 'wrong_count')
  final int wrongCount;
  @JsonKey(name: 'xp_earned')
  final int xpEarned;
  @JsonKey(name: 'is_completed')
  final bool isCompleted;
  final String message;
  @JsonKey(name: 'level_up', defaultValue: false)
  final bool levelUp;
  @JsonKey(name: 'new_level', defaultValue: 1)
  final int newLevel;
  @JsonKey(name: 'new_streak', defaultValue: 0)
  final int newStreak;
  @JsonKey(name: 'badges_earned', defaultValue: [])
  final List<BadgeModel> badgesEarned;

  const LessonResultModel({
    required this.lessonId,
    required this.score,
    required this.correctCount,
    required this.wrongCount,
    required this.xpEarned,
    required this.isCompleted,
    required this.message,
    this.levelUp = false,
    this.newLevel = 1,
    this.newStreak = 0,
    this.badgesEarned = const [],
  });

  factory LessonResultModel.fromJson(Map<String, dynamic> json) =>
      _$LessonResultModelFromJson(json);

  Map<String, dynamic> toJson() => _$LessonResultModelToJson(this);
}
