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
  final String? explanation;
  @JsonKey(name: 'code_block')
  final String? codeBlock;
  @JsonKey(name: 'word_bank')
  final Map<String, dynamic>? wordBank;
  @JsonKey(name: 'correct_line_index')
  final int? correctLineIndex;
  @JsonKey(name: 'is_reinforcement', defaultValue: false)
  final bool isReinforcement;
  final int order;
  @JsonKey(name: 'reinforcement_question')
  final QuestionModel? reinforcementQuestion;
  // Code assignment fields (code_editor type)
  final String? language;
  @JsonKey(name: 'starter_code')
  final String? starterCode;
  @JsonKey(name: 'test_cases')
  final List<Map<String, dynamic>>? testCases;
  @JsonKey(name: 'assignment_instructions')
  final String? assignmentInstructions;
  @JsonKey(name: 'max_runtime_ms')
  final int? maxRuntimeMs;
  @JsonKey(name: 'memory_limit_mb')
  final int? memoryLimitMb;

  const QuestionModel({
    required this.id,
    required this.lessonId,
    required this.questionType,
    required this.questionText,
    this.options,
    this.hint,
    this.explanation,
    this.codeBlock,
    this.wordBank,
    this.correctLineIndex,
    this.isReinforcement = false,
    required this.order,
    this.reinforcementQuestion,
    this.language,
    this.starterCode,
    this.testCases,
    this.assignmentInstructions,
    this.maxRuntimeMs,
    this.memoryLimitMb,
  });

  factory QuestionModel.fromJson(Map<String, dynamic> json) =>
      _$QuestionModelFromJson(json);

  Map<String, dynamic> toJson() => _$QuestionModelToJson(this);
}

