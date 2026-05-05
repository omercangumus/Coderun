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
