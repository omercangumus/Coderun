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
      options: json['options'] as Map<String, dynamic>?,
      hint: json['hint'] as String?,
      explanation: json['explanation'] as String?,
      codeBlock: json['code_block'] as String?,
      wordBank: json['word_bank'] as Map<String, dynamic>?,
      correctLineIndex: (json['correct_line_index'] as num?)?.toInt(),
      isReinforcement: json['is_reinforcement'] as bool? ?? false,
      order: (json['order'] as num).toInt(),
      reinforcementQuestion: json['reinforcement_question'] == null
          ? null
          : QuestionModel.fromJson(
              json['reinforcement_question'] as Map<String, dynamic>),
    );

Map<String, dynamic> _$QuestionModelToJson(QuestionModel instance) =>
    <String, dynamic>{
      'id': instance.id,
      'lesson_id': instance.lessonId,
      'question_type': instance.questionType,
      'question_text': instance.questionText,
      'options': instance.options,
      'hint': instance.hint,
      'explanation': instance.explanation,
      'code_block': instance.codeBlock,
      'word_bank': instance.wordBank,
      'correct_line_index': instance.correctLineIndex,
      'is_reinforcement': instance.isReinforcement,
      'order': instance.order,
      'reinforcement_question': instance.reinforcementQuestion,
    };
