import 'package:freezed_annotation/freezed_annotation.dart';

part 'streak_model.freezed.dart';
part 'streak_model.g.dart';

@freezed
class StreakModel with _$StreakModel {
  const factory StreakModel({
    @JsonKey(name: 'current_streak') required int currentStreak,
    @JsonKey(name: 'last_active_date') String? lastActiveDate,
    @JsonKey(name: 'is_alive') required bool isAlive,
    @JsonKey(name: 'next_milestone') required int nextMilestone,
    @JsonKey(name: 'days_to_next_milestone') required int daysToNextMilestone,
  }) = _StreakModel;

  factory StreakModel.fromJson(Map<String, dynamic> json) =>
      _$StreakModelFromJson(json);
}
