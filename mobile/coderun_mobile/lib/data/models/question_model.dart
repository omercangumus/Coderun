import 'package:freezed_annotation/freezed_annotation.dart';

part 'question_model.freezed.dart';
part 'question_model.g.dart';

// DIKKAT: correct_answer bu modelde YOK — backend doğru cevabı client'a göndermez.
@freezed
class QuestionModel with _$QuestionModel {
  const factory QuestionModel({
    required String id,
    @JsonKey(name: 'lesson_id') required String lessonId,
    @JsonKey(name: 'question_type') required String questionType,
    @JsonKey(name: 'question_text') required String questionText,
    Map<String, dynamic>? options,
    required int order,
  }) = _QuestionModel;

  factory QuestionModel.fromJson(Map<String, dynamic> json) =>
      _$QuestionModelFromJson(json);
}
