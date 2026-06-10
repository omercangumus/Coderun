// Cevap gönderme modeli.
import 'package:json_annotation/json_annotation.dart';

part 'answer_model.g.dart';

@JsonSerializable()
class AnswerSubmitModel {
  @JsonKey(name: 'question_id')
  final String questionId;
  final String answer;

  const AnswerSubmitModel({
    required this.questionId,
    required this.answer,
  });

  factory AnswerSubmitModel.fromJson(Map<String, dynamic> json) =>
      _$AnswerSubmitModelFromJson(json);

  Map<String, dynamic> toJson() => _$AnswerSubmitModelToJson(this);
}
