// AI Mentor sohbet modelleri.

import 'package:freezed_annotation/freezed_annotation.dart';

part 'mentor_model.freezed.dart';
part 'mentor_model.g.dart';

/// Tek bir sohbet mesajı.
@freezed
class ChatMessageModel with _$ChatMessageModel {
  const factory ChatMessageModel({
    required String role,
    required String content,
  }) = _ChatMessageModel;

  factory ChatMessageModel.fromJson(Map<String, dynamic> json) =>
      _$ChatMessageModelFromJson(json);
}

/// AI Mentor API isteği.
@freezed
class MentorRequestModel with _$MentorRequestModel {
  const factory MentorRequestModel({
    required String message,
    @Default('general') String context,
    @Default([]) List<ChatMessageModel> history,
    String? lessonTitle,
    String? moduleSlug,
    String? questionText,
  }) = _MentorRequestModel;

  // fromJson gerekmez ama freezed için factory gerekli
  factory MentorRequestModel.fromJson(Map<String, dynamic> json) =>
      _$MentorRequestModelFromJson(json);
}

/// AI Mentor API yanıtı.
@freezed
class MentorResponseModel with _$MentorResponseModel {
  const factory MentorResponseModel({
    required String reply,
    required String context,
  }) = _MentorResponseModel;

  factory MentorResponseModel.fromJson(Map<String, dynamic> json) =>
      _$MentorResponseModelFromJson(json);
}

/// /mentor/ask isteği — attempt_count destekli LLM endpoint.
@freezed
class MentorAskRequestModel with _$MentorAskRequestModel {
  const factory MentorAskRequestModel({
    required String message,
    @Default('beginner') String userLevel,
    String? learningPath,
    @Default(1) int attemptCount,
  }) = _MentorAskRequestModel;

  factory MentorAskRequestModel.fromJson(Map<String, dynamic> json) =>
      _$MentorAskRequestModelFromJson(json);
}

/// /mentor/ask yanıtı.
@freezed
class MentorAskResponseModel with _$MentorAskResponseModel {
  const factory MentorAskResponseModel({
    required String answer,
    required String model,
  }) = _MentorAskResponseModel;

  factory MentorAskResponseModel.fromJson(Map<String, dynamic> json) =>
      _$MentorAskResponseModelFromJson(json);
}
