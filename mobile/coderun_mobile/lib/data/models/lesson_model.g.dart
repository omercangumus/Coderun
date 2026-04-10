// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'lesson_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$LessonModelImpl _$$LessonModelImplFromJson(Map<String, dynamic> json) =>
    _$LessonModelImpl(
      id: json['id'] as String,
      moduleId: json['module_id'] as String,
      title: json['title'] as String,
      lessonType: json['lesson_type'] as String,
      order: (json['order'] as num).toInt(),
      xpReward: (json['xp_reward'] as num).toInt(),
      isActive: json['is_active'] as bool,
      isCompleted: json['is_completed'] as bool? ?? false,
      isLocked: json['is_locked'] as bool? ?? false,
      score: (json['score'] as num?)?.toInt(),
      attemptCount: (json['attempt_count'] as num?)?.toInt() ?? 0,
    );

Map<String, dynamic> _$$LessonModelImplToJson(_$LessonModelImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'module_id': instance.moduleId,
      'title': instance.title,
      'lesson_type': instance.lessonType,
      'order': instance.order,
      'xp_reward': instance.xpReward,
      'is_active': instance.isActive,
      'is_completed': instance.isCompleted,
      'is_locked': instance.isLocked,
      'score': instance.score,
      'attempt_count': instance.attemptCount,
    };
