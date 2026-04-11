import 'package:freezed_annotation/freezed_annotation.dart';

part 'answer_model.freezed.dart';
part 'answer_model.g.dart';

@freezed
class AnswerSubmitModel with _$AnswerSubmitModel {
  const factory AnswerSubmitModel({
    @JsonKey(name: 'question_id') required String questionId,
    required String answer,
  }) = _AnswerSubmitModel;

  factory AnswerSubmitModel.fromJson(Map<String, dynamic> json) =>
      _$AnswerSubmitModelFromJson(json);
}
