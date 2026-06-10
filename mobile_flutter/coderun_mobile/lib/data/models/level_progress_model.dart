import 'package:freezed_annotation/freezed_annotation.dart';

part 'level_progress_model.freezed.dart';
part 'level_progress_model.g.dart';

@freezed
class LevelProgressModel with _$LevelProgressModel {
  const factory LevelProgressModel({
    @JsonKey(name: 'current_level') required int currentLevel,
    @JsonKey(name: 'current_xp') required int currentXp,
    @JsonKey(name: 'xp_needed_for_next') required int xpNeededForNext,
    @JsonKey(name: 'xp_remaining') required int xpRemaining,
    @JsonKey(name: 'progress_percentage') required double progressPercentage,
    @JsonKey(name: 'is_max_level') required bool isMaxLevel,
  }) = _LevelProgressModel;

  factory LevelProgressModel.fromJson(Map<String, dynamic> json) =>
      _$LevelProgressModelFromJson(json);
}
