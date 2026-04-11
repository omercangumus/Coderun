// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'answer_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

AnswerSubmitModel _$AnswerSubmitModelFromJson(Map<String, dynamic> json) =>
    AnswerSubmitModel(
      questionId: json['question_id'] as String,
      answer: json['answer'] as String,
    );

Map<String, dynamic> _$AnswerSubmitModelToJson(AnswerSubmitModel instance) =>
    <String, dynamic>{
      'question_id': instance.questionId,
      'answer': instance.answer,
    };
