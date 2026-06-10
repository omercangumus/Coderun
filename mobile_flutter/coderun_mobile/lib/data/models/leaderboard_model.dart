import 'package:freezed_annotation/freezed_annotation.dart';

part 'leaderboard_model.freezed.dart';
part 'leaderboard_model.g.dart';

@freezed
class LeaderboardEntryModel with _$LeaderboardEntryModel {
  const factory LeaderboardEntryModel({
    required int rank,
    @JsonKey(name: 'user_id') required String userId,
    required String username,
    @JsonKey(name: 'weekly_xp') required int weeklyXp,
    required int level,
    required int streak,
  }) = _LeaderboardEntryModel;

  factory LeaderboardEntryModel.fromJson(Map<String, dynamic> json) =>
      _$LeaderboardEntryModelFromJson(json);
}

@freezed
class LeaderboardModel with _$LeaderboardModel {
  const factory LeaderboardModel({
    required List<LeaderboardEntryModel> entries,
    @JsonKey(name: 'total_count') required int totalCount,
    @JsonKey(name: 'user_rank') int? userRank,
    @JsonKey(name: 'week_start') required String weekStart,
    @JsonKey(name: 'week_end') required String weekEnd,
  }) = _LeaderboardModel;

  factory LeaderboardModel.fromJson(Map<String, dynamic> json) =>
      _$LeaderboardModelFromJson(json);
}
