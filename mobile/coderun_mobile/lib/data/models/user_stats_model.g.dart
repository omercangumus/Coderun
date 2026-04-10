// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'user_stats_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$UserStatsModelImpl _$$UserStatsModelImplFromJson(Map<String, dynamic> json) =>
    _$UserStatsModelImpl(
      totalXp: (json['total_xp'] as num).toInt(),
      level: (json['level'] as num).toInt(),
      streak: (json['streak'] as num).toInt(),
      totalLessonsCompleted: (json['total_lessons_completed'] as num).toInt(),
      totalModulesCompleted: (json['total_modules_completed'] as num).toInt(),
      badges: (json['badges'] as List<dynamic>)
          .map((e) => BadgeModel.fromJson(e as Map<String, dynamic>))
          .toList(),
      levelProgress: LevelProgressModel.fromJson(
          json['level_progress'] as Map<String, dynamic>),
      streakInfo:
          StreakModel.fromJson(json['streak_info'] as Map<String, dynamic>),
    );

Map<String, dynamic> _$$UserStatsModelImplToJson(
        _$UserStatsModelImpl instance) =>
    <String, dynamic>{
      'total_xp': instance.totalXp,
      'level': instance.level,
      'streak': instance.streak,
      'total_lessons_completed': instance.totalLessonsCompleted,
      'total_modules_completed': instance.totalModulesCompleted,
      'badges': instance.badges,
      'level_progress': instance.levelProgress,
      'streak_info': instance.streakInfo,
    };
