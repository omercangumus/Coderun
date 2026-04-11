// Ders detay modeli — sorularla birlikte.
import 'package:json_annotation/json_annotation.dart';
import 'question_model.dart';

part 'lesson_detail_model.g.dart';

@JsonSerializable()
class LessonDetailModel {
  final String id;
  @JsonKey(name: 'module_id')
  final String moduleId;
  final String title;
  @JsonKey(name: 'lesson_type')
  final String lessonType;
  final int order;
  @JsonKey(name: 'xp_reward')
  final int xpReward;
  @JsonKey(name: 'is_active')
  final bool isActive;
  @JsonKey(defaultValue: [])
  final List<QuestionModel> questions;

  const LessonDetailModel({
    required this.id,
    required this.moduleId,
    required this.title,
    required this.lessonType,
    required this.order,
    required this.xpReward,
    required this.isActive,
    this.questions = const [],
  });

  factory LessonDetailModel.fromJson(Map<String, dynamic> json) =>
      _$LessonDetailModelFromJson(json);

  Map<String, dynamic> toJson() => _$LessonDetailModelToJson(this);
}
