import 'package:freezed_annotation/freezed_annotation.dart';
import 'module_model.dart';

part 'module_progress_model.freezed.dart';
part 'module_progress_model.g.dart';

@freezed
class ModuleProgressModel with _$ModuleProgressModel {
  const factory ModuleProgressModel({
    required ModuleModel module,
    @JsonKey(name: 'completion_rate') required double completionRate,
    @JsonKey(name: 'completed_lessons') required int completedLessons,
    @JsonKey(name: 'total_lessons') required int totalLessons,
  }) = _ModuleProgressModel;

  factory ModuleProgressModel.fromJson(Map<String, dynamic> json) =>
      _$ModuleProgressModelFromJson(json);
}
