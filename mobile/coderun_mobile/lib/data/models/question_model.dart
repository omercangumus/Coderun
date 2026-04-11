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
  final int order;

  const QuestionModel({
    required this.id,
    required this.lessonId,
    required this.questionType,
    required this.questionText,
    this.options,
    required this.order,
  });

  factory QuestionModel.fromJson(Map<String, dynamic> json) =>
      _$QuestionModelFromJson(json);

  Map<String, dynamic> toJson() => _$QuestionModelToJson(this);
}
