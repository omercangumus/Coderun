// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'lesson_detail_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

LessonDetailModel _$LessonDetailModelFromJson(Map<String, dynamic> json) =>
    LessonDetailModel(
      id: json['id'] as String,
      moduleId: json['module_id'] as String,
      title: json['title'] as String,
      lessonType: json['lesson_type'] as String,
      order: (json['order'] as num).toInt(),
      xpReward: (json['xp_reward'] as num).toInt(),
      isActive: json['is_active'] as bool,
      questions: (json['questions'] as List<dynamic>?)
              ?.map((e) =>
                  QuestionModel.fromJson(e as Map<String, dynamic>))
              .toList() ??
          [],
    );

Map<String, dynamic> _$LessonDetailModelToJson(LessonDetailModel instance) =>
    <String, dynamic>{
      'id': instance.id,
      'module_id': instance.moduleId,
      'title': instance.title,
      'lesson_type': instance.lessonType,
      'order': instance.order,
      'xp_reward': instance.xpReward,
      'is_active': instance.isActive,
      'questions': instance.questions.map((e) => e.toJson()).toList(),
    };
