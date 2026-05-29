// Coderun mobile — code runner API yanıt modelleri.
// POST /api/v1/code/run ve POST /api/v1/code/submit için.

import 'package:json_annotation/json_annotation.dart';

part 'code_run_result_model.g.dart';

/// Kod çalıştırma sonucu (POST /api/v1/code/run)
@JsonSerializable()
class CodeRunResultModel {
  final String stdout;
  final String stderr;
  @JsonKey(name: 'exit_code')
  final int exitCode;
  @JsonKey(name: 'duration_ms')
  final int durationMs;
  @JsonKey(name: 'timed_out')
  final bool timedOut;

  const CodeRunResultModel({
    required this.stdout,
    required this.stderr,
    required this.exitCode,
    required this.durationMs,
    required this.timedOut,
  });

  factory CodeRunResultModel.fromJson(Map<String, dynamic> json) =>
      _$CodeRunResultModelFromJson(json);

  Map<String, dynamic> toJson() => _$CodeRunResultModelToJson(this);
}

/// Tek bir test senaryosunun sonucu
@JsonSerializable()
class TestCaseResultModel {
  final String name;
  final bool passed;
  final String stdout;
  final String stderr;
  @JsonKey(name: 'duration_ms')
  final int durationMs;
  final bool hidden;
  @JsonKey(name: 'expected_stdout')
  final String? expectedStdout;

  const TestCaseResultModel({
    required this.name,
    required this.passed,
    required this.stdout,
    required this.stderr,
    required this.durationMs,
    required this.hidden,
    this.expectedStdout,
  });

  factory TestCaseResultModel.fromJson(Map<String, dynamic> json) =>
      _$TestCaseResultModelFromJson(json);

  Map<String, dynamic> toJson() => _$TestCaseResultModelToJson(this);
}

/// Ödev gönderme sonucu (POST /api/v1/code/submit)
@JsonSerializable()
class CodeSubmitResultModel {
  final bool passed;
  final int score;
  final String stdout;
  final String stderr;
  @JsonKey(name: 'test_results')
  final List<TestCaseResultModel> testResults;
  final String feedback;

  const CodeSubmitResultModel({
    required this.passed,
    required this.score,
    required this.stdout,
    required this.stderr,
    required this.testResults,
    required this.feedback,
  });

  factory CodeSubmitResultModel.fromJson(Map<String, dynamic> json) =>
      _$CodeSubmitResultModelFromJson(json);

  Map<String, dynamic> toJson() => _$CodeSubmitResultModelToJson(this);
}
