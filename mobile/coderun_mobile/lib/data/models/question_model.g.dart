// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'question_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

QuestionModel _$QuestionModelFromJson(Map<String, dynamic> json) =>
    QuestionModel(
      id: json['id'] as String,
      lessonId: json['lesson_id'] as String,
      questionType: json['question_type'] as String,
      questionText: json['question_text'] as String,
      options: (json['options'] as Map<String, dynamic>?)?.map(
        (k, e) => MapEntry(k, e),
      ),
      order: (json['order'] as num).toInt(),
    );

Map<String, dynamic> _$QuestionModelToJson(QuestionModel instance) =>
    <String, dynamic>{
      'id': instance.id,
      'lesson_id': instance.lessonId,
      'question_type': instance.questionType,
      'question_text': instance.questionText,
      'options': instance.options,
      'order': instance.order,
    };
