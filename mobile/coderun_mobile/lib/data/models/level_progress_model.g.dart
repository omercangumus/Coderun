// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'level_progress_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$LevelProgressModelImpl _$$LevelProgressModelImplFromJson(
        Map<String, dynamic> json) =>
    _$LevelProgressModelImpl(
      currentLevel: (json['current_level'] as num).toInt(),
      currentXp: (json['current_xp'] as num).toInt(),
      xpNeededForNext: (json['xp_needed_for_next'] as num).toInt(),
      xpRemaining: (json['xp_remaining'] as num).toInt(),
      progressPercentage: (json['progress_percentage'] as num).toDouble(),
      isMaxLevel: json['is_max_level'] as bool,
    );

Map<String, dynamic> _$$LevelProgressModelImplToJson(
        _$LevelProgressModelImpl instance) =>
    <String, dynamic>{
      'current_level': instance.currentLevel,
      'current_xp': instance.currentXp,
      'xp_needed_for_next': instance.xpNeededForNext,
      'xp_remaining': instance.xpRemaining,
      'progress_percentage': instance.progressPercentage,
      'is_max_level': instance.isMaxLevel,
    };
