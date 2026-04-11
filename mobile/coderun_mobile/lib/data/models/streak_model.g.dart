// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'streak_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$StreakModelImpl _$$StreakModelImplFromJson(Map<String, dynamic> json) =>
    _$StreakModelImpl(
      currentStreak: (json['current_streak'] as num).toInt(),
      lastActiveDate: json['last_active_date'] as String?,
      isAlive: json['is_alive'] as bool,
      nextMilestone: (json['next_milestone'] as num).toInt(),
      daysToNextMilestone: (json['days_to_next_milestone'] as num).toInt(),
    );

Map<String, dynamic> _$$StreakModelImplToJson(_$StreakModelImpl instance) =>
    <String, dynamic>{
      'current_streak': instance.currentStreak,
      'last_active_date': instance.lastActiveDate,
      'is_alive': instance.isAlive,
      'next_milestone': instance.nextMilestone,
      'days_to_next_milestone': instance.daysToNextMilestone,
    };
