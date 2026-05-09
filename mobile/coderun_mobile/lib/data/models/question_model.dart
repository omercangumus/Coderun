// Soru modeli — correct_answer YOK, backend client'a göndermez.
import 'package:json_annotation/json_annotation.dart';

part 'question_model.g.dart';

@JsonSerializable()
class QuestionModel {
  final String id;
  @JsonKey(name: 'lesson_id')
  final String lessonId;
  @JsonKey(name: 'question_type')
  final String questionType;
  @JsonKey(name: 'question_text')
  final String questionText;
  final Map<String, dynamic>? options;
  final String? hint;
  @JsonKey(name: 'code_block')
  final String? codeBlock;
  @JsonKey(name: 'word_bank')
  final Map<String, dynamic>? wordBank;
  @JsonKey(name: 'correct_line_index')
  final int? correctLineIndex;
  final int order;
  @JsonKey(name: 'reinforcement_question')
  final QuestionModel? reinforcementQuestion;

  const QuestionModel({
    required this.id,
    required this.lessonId,
    required this.questionType,
    required this.questionText,
    this.options,
    this.hint,
    this.codeBlock,
    this.wordBank,
    this.correctLineIndex,
    required this.order,
    this.reinforcementQuestion,
  });

  factory QuestionModel.fromJson(Map<String, dynamic> json) =>
      _$QuestionModelFromJson(json);

  Map<String, dynamic> toJson() => _$QuestionModelToJson(this);
}

