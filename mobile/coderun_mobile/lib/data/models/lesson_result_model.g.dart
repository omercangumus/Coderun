// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'lesson_result_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

LessonResultModel _$LessonResultModelFromJson(Map<String, dynamic> json) =>
    LessonResultModel(
      lessonId: json['lesson_id'] as String,
      score: (json['score'] as num).toInt(),
      correctCount: (json['correct_count'] as num).toInt(),
      wrongCount: (json['wrong_count'] as num).toInt(),
      xpEarned: (json['xp_earned'] as num).toInt(),
      isCompleted: json['is_completed'] as bool,
      message: json['message'] as String,
      levelUp: json['level_up'] as bool? ?? false,
      newLevel: (json['new_level'] as num?)?.toInt() ?? 1,
      newStreak: (json['new_streak'] as num?)?.toInt() ?? 0,
      badgesEarned: (json['badges_earned'] as List<dynamic>?)
              ?.map((e) => BadgeModel.fromJson(e as Map<String, dynamic>))
              .toList() ??
          [],
    );

Map<String, dynamic> _$LessonResultModelToJson(LessonResultModel instance) =>
    <String, dynamic>{
      'lesson_id': instance.lessonId,
      'score': instance.score,
      'correct_count': instance.correctCount,
      'wrong_count': instance.wrongCount,
      'xp_earned': instance.xpEarned,
      'is_completed': instance.isCompleted,
      'message': instance.message,
      'level_up': instance.levelUp,
      'new_level': instance.newLevel,
      'new_streak': instance.newStreak,
      'badges_earned':
          instance.badgesEarned.map((e) => e.toJson()).toList(),
    };
